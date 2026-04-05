'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RotateCcw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { sendChatMessage } from '@/lib/services/chat.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TestChatbotPanelProps {
  open: boolean;
  onClose: () => void;
  chatbotId: string;
  chatbotName: string;
}

export default function TestChatbotPanel({
  open,
  onClose,
  chatbotId,
  chatbotName,
}: TestChatbotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hi! I'm ${chatbotName}. How can I help you today?` },
  ]);
  const [chatId, setChatId] = useState<string | undefined>();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
      const res = await sendChatMessage(chatbotId, text, chatId);
      setChatId(res.chatId);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.message }]);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to get response');
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setMessages([{ role: 'assistant', content: `Hi! I'm ${chatbotName}. How can I help you today?` }]);
    setChatId(undefined);
    setInput('');
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-base flex items-center gap-2">
                <Bot className="w-4 h-4 text-green-600" />
                Test: {chatbotName}
              </SheetTitle>
              <SheetDescription className="text-xs mt-0.5">
                This uses your real chatbot configuration.
              </SheetDescription>
            </div>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600 h-7 px-2" onClick={handleReset} title="Reset chat">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-3">
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
                    <ReactMarkdown className="prose prose-sm max-w-none text-inherit [&>*:last-child]:mb-0 [&>p]:mb-1 [&>ul]:mb-1 [&>ol]:mb-1">
                      {msg.content}
                    </ReactMarkdown>
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
        </ScrollArea>

        {/* Input */}
        <div className="border-t px-4 py-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type a message to test..."
            disabled={isSending}
            className="text-sm"
            autoFocus
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="bg-green-600 hover:bg-green-700 text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
