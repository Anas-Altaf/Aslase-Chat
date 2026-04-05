'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getChatHistory, sendChatMessage } from '@/lib/services/chat.service';
import type { ChatSession } from '@/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ChatSessionModalProps {
  chatId: string | null;
  chatbotId: string;
  chatbotName: string;
  open: boolean;
  onClose: () => void;
}

export default function ChatSessionModal({
  chatId,
  chatbotId,
  chatbotName,
  open,
  onClose,
}: ChatSessionModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(chatId);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !chatId) return;
    setIsLoading(true);
    setMessages([]);
    setActiveChatId(chatId);
    getChatHistory(chatId).then((res) => {
      if (res.success && res.data) {
        setMessages(
          res.data.messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: m.timestamp,
          })),
        );
      }
    }).finally(() => setIsLoading(false));
  }, [open, chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsSending(true);
    try {
      const res = await sendChatMessage(chatbotId, text, activeChatId ?? undefined);
      setActiveChatId(res.chatId);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.message }]);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-lg flex flex-col h-[75vh] p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Bot className="w-4 h-4 text-green-600" />
            {chatbotName}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {chatId ? 'Resuming existing session' : 'New test session'}
          </DialogDescription>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No messages yet. Start the conversation!</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-green-600" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'rounded-2xl px-3 py-2 text-sm max-w-[80%] leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-green-600 text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm',
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none text-inherit [&>*:last-child]:mb-0 [&>p]:mb-1 [&>ul]:mb-1 [&>ol]:mb-1">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {isSending && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t px-4 py-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type a message..."
            disabled={isSending}
            className="text-sm"
          />
          <Button size="icon" onClick={handleSend} disabled={isSending || !input.trim()} className="bg-green-600 hover:bg-green-700 text-white shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
