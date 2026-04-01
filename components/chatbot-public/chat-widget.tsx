'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatbotInfo {
  name: string;
  description?: string;
  welcomeMessage?: string;
  primaryColor?: string;
  placeholder?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChatWidget({
  chatbotId,
  iframe = false,
}: {
  chatbotId: string;
  iframe?: boolean;
}) {
  const [info, setInfo] = useState<ChatbotInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Load chatbot info ─────────────────────────────────────────────────────

  useEffect(() => {
    fetch(`${API_BASE}/public/chatbot/${chatbotId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Chatbot not found (${r.status})`);
        return r.json();
      })
      .then((data) => {
        setInfo({
          name: data.name,
          description: data.description,
          welcomeMessage: data.welcomeMessage ?? data.settings?.welcomeMessage,
          primaryColor: data.primaryColor ?? data.settings?.primaryColor ?? '#22c55e',
          placeholder: data.placeholder ?? data.settings?.placeholder,
        });
        const welcome = data.welcomeMessage || data.settings?.welcomeMessage || `Hi! I'm ${data.name}. How can I help you today?`;
        setMessages([{ role: 'assistant', content: welcome, timestamp: new Date() }]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [chatbotId]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isSending]);

  // ── Send message ──────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userText, timestamp: new Date() },
    ]);
    setIsSending(true);

    try {
      const body: Record<string, string> = { message: userText };
      if (sessionId) body.sessionId = sessionId;

      const res = await fetch(`${API_BASE}/public/chatbot/${chatbotId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();

      if (data.sessionId && !sessionId) setSessionId(data.sessionId);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message ?? data.response ?? data.reply ?? 'Sorry, I could not process that.',
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-64 text-center p-6">
        <div>
          <Bot className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col bg-white',
        iframe ? 'h-screen' : 'h-full min-h-[500px] max-h-[750px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden',
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 shrink-0" style={{ backgroundColor: info?.primaryColor ?? '#22c55e' }}>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/20 p-1.5">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{info?.name ?? 'AI Assistant'}</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
              <span className="text-white/80 text-[11px]">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn('flex items-end gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'assistant' && (
              <div className="rounded-full p-1 shrink-0" style={{ backgroundColor: `${info?.primaryColor ?? '#22c55e'}22` }}>
                <Bot className="w-3 h-3" style={{ color: info?.primaryColor ?? '#22c55e' }} />
              </div>
            )}
            <div
              className={cn(
                'px-3 py-2 rounded-2xl text-sm max-w-[80%] leading-relaxed',
                msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-sm',
              )}
              style={msg.role === 'user' ? { backgroundColor: info?.primaryColor ?? '#22c55e' } : undefined}
            >
              {msg.content}
              <p className={cn('text-[10px] mt-1', msg.role === 'user' ? 'text-green-100' : 'text-gray-400')}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="rounded-full bg-gray-200 p-1 shrink-0">
                <User className="w-3 h-3 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isSending && (
          <div className="flex items-end gap-2 justify-start">
            <div className="rounded-full p-1 shrink-0" style={{ backgroundColor: `${info?.primaryColor ?? '#22c55e'}22` }}>
              <Bot className="w-3 h-3" style={{ color: info?.primaryColor ?? '#22c55e' }} />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-2.5 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3 bg-white shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && !isSending && handleSend()}
            placeholder={info?.placeholder ?? 'Type a message...'}
            disabled={isSending}
            className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-1 disabled:bg-gray-50 transition"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="rounded-xl disabled:bg-gray-200 disabled:cursor-not-allowed text-white px-3 py-2 transition shrink-0"
            style={{ backgroundColor: isSending || !input.trim() ? undefined : (info?.primaryColor ?? '#22c55e') }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">
          Powered by AslasChat
        </p>
      </div>
    </div>
  );
}
