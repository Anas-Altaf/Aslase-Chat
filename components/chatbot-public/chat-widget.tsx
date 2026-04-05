'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, Loader2, RotateCcw } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
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
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getOrCreateSessionId(chatbotId: string): string {
  const key = `chat_session_${chatbotId}`;
  const stored = localStorage.getItem(key);
  if (stored) return stored;
  const newId = crypto.randomUUID?.() ?? generateId();
  localStorage.setItem(key, newId);
  return newId;
}

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
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const currentBotMsgIdRef = useRef<string | null>(null);

  // ── WebSocket connection ──────────────────────────────────────────────────

  useEffect(() => {
    const socket = io(`${API_BASE}/events`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socket.on('chat:token', ({ token }: { token: string }) => {
      const msgId = currentBotMsgIdRef.current;
      if (!msgId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, content: m.content + token, streaming: true } : m,
        ),
      );
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    socket.on('chat:done', () => {
      const msgId = currentBotMsgIdRef.current;
      if (msgId) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, streaming: false } : m)),
        );
      }
      currentBotMsgIdRef.current = null;
      setIsStreaming(false);
      setIsSending(false);
    });

    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, []);

  // ── Load chatbot info + session history ───────────────────────────────────

  useEffect(() => {
    const sid = getOrCreateSessionId(chatbotId);
    setSessionId(sid);

    // Join WebSocket session room
    const joinSession = () => {
      socketRef.current?.emit('join:session', { sessionId: sid });
    };
    if (socketRef.current?.connected) {
      joinSession();
    } else {
      socketRef.current?.on('connect', joinSession);
    }

    // Load chatbot info
    fetch(`${API_BASE}/public/chatbot/${chatbotId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Chatbot not found (${r.status})`);
        return r.json();
      })
      .then(async (data) => {
        setInfo({
          name: data.name,
          description: data.description,
          welcomeMessage: data.welcomeMessage ?? data.settings?.welcomeMessage,
          primaryColor: data.primaryColor ?? data.settings?.primaryColor ?? '#22c55e',
          placeholder: data.placeholder ?? data.settings?.placeholder,
        });

        const welcome = data.welcomeMessage || data.settings?.welcomeMessage || `Hi! I'm ${data.name}. How can I help you today?`;
        const welcomeMsg: Message = { id: 'welcome', role: 'assistant', content: welcome, timestamp: new Date() };

        // Try loading existing session history
        try {
          const histRes = await fetch(`${API_BASE}/public/chatbot/${chatbotId}/history/${sid}`);
          if (histRes.ok) {
            const hist = await histRes.json();
            const historicalMsgs: Message[] = (hist.messages ?? []).map((m: any) => ({
              id: generateId(),
              role: m.role,
              content: m.content,
              timestamp: new Date(m.timestamp ?? Date.now()),
            }));
            if (historicalMsgs.length > 0) {
              setMessages(historicalMsgs);
            } else {
              setMessages([welcomeMsg]);
            }
          } else {
            setMessages([welcomeMsg]);
          }
        } catch {
          setMessages([welcomeMsg]);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [chatbotId]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // ── Start new chat ────────────────────────────────────────────────────────

  const handleNewChat = useCallback(() => {
    const newId = crypto.randomUUID?.() ?? generateId();
    localStorage.setItem(`chat_session_${chatbotId}`, newId);
    setSessionId(newId);
    socketRef.current?.emit('join:session', { sessionId: newId });
    const welcome = info?.welcomeMessage ?? `Hi! I'm ${info?.name}. How can I help you today?`;
    setMessages([{ id: 'welcome', role: 'assistant', content: welcome, timestamp: new Date() }]);
  }, [chatbotId, info]);

  // ── Send message ──────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!input.trim() || isSending || isStreaming) return;

    const userText = input.trim();
    setInput('');
    const userMsgId = generateId();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: userText, timestamp: new Date() },
    ]);
    setIsSending(true);

    // Add empty bot message that will be streamed into
    const botMsgId = generateId();
    currentBotMsgIdRef.current = botMsgId;
    setMessages((prev) => [
      ...prev,
      { id: botMsgId, role: 'assistant', content: '', timestamp: new Date(), streaming: true },
    ]);
    setIsStreaming(true);

    try {
      const res = await fetch(`${API_BASE}/public/chatbot/${chatbotId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, sessionId }),
      });

      if (!res.ok) throw new Error('Failed to get response');

      const data = await res.json();
      // If WS streaming didn't fill the message (non-streaming fallback), use REST response
      setMessages((prev) => {
        const botMsg = prev.find((m) => m.id === botMsgId);
        if (botMsg && botMsg.content === '') {
          // Streaming didn't arrive — use REST response content
          return prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  content: data.message ?? data.response ?? data.reply ?? 'Sorry, could not process that.',
                  streaming: false,
                }
              : m,
          );
        }
        return prev;
      });
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? { ...m, content: 'Sorry, something went wrong. Please try again.', streaming: false }
            : m,
        ),
      );
    } finally {
      // isSending is cleared by 'chat:done' WS event; fallback clear here
      setTimeout(() => {
        setIsSending(false);
        setIsStreaming(false);
        currentBotMsgIdRef.current = null;
      }, 8000); // max 8s before giving up on stream
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

  const primaryColor = info?.primaryColor ?? '#22c55e';

  return (
    <div
      className={cn(
        'flex flex-col bg-white',
        iframe ? 'h-screen' : 'h-full min-h-[500px] max-h-[750px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden',
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 shrink-0" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center justify-between">
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
          <button
            onClick={handleNewChat}
            title="Start new chat"
            className="rounded-full bg-white/20 p-1.5 hover:bg-white/30 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex items-end gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'assistant' && (
              <div className="rounded-full p-1 shrink-0" style={{ backgroundColor: `${primaryColor}22` }}>
                <Bot className="w-3 h-3" style={{ color: primaryColor }} />
              </div>
            )}
            <div
              className={cn(
                'px-3 py-2 rounded-2xl text-sm max-w-[80%] leading-relaxed',
                msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-sm',
              )}
              style={msg.role === 'user' ? { backgroundColor: primaryColor } : undefined}
            >
              {msg.content || (
                // Streaming placeholder — dots
                <div className="flex gap-1 items-center py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              {msg.streaming && msg.content && (
                <span className="inline-block w-0.5 h-3 bg-gray-400 animate-pulse ml-0.5 align-middle" />
              )}
              {!msg.streaming && (
                <p className={cn('text-[10px] mt-1', msg.role === 'user' ? 'text-white/70' : 'text-gray-400')}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="rounded-full bg-gray-200 p-1 shrink-0">
                <User className="w-3 h-3 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3 bg-white shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && !isSending && !isStreaming && handleSend()}
            placeholder={info?.placeholder ?? 'Type a message...'}
            disabled={isSending || isStreaming}
            className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-1 disabled:bg-gray-50 transition"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          />
          <button
            onClick={handleSend}
            disabled={isSending || isStreaming || !input.trim()}
            className="rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-2 transition shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">Powered by AslasChat</p>
      </div>
    </div>
  );
}
