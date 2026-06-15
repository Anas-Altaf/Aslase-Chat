'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, Loader2, Plus, Menu, X, Trash2, Copy, Check, MessageCircle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatbotInfo {
  name: string;
  description?: string;
  welcomeMessage?: string;
  primaryColor?: string;
  placeholder?: string;
  avatarEmoji?: string;
  avatarUrl?: string;
  showTypingIndicator?: boolean;
  showTimestamps?: boolean;
  bubbleStyle?: 'rounded' | 'squared';
  chatBgColor?: string;
  fontSize?: 'sm' | 'base' | 'lg';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

/** Lightweight per-conversation metadata persisted on the device. */
interface ConvMeta {
  id: string;        // == server sessionId
  title: string;
  preview: string;
  updatedAt: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function newSessionId(): string {
  return (typeof crypto !== 'undefined' && crypto.randomUUID?.()) || generateId();
}

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n).trimEnd() + '…' : s);

function timeAgo(ts: number): string {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return 'just now';
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

/** If the backend accidentally sends raw JSON as the message, extract just the reply. */
function extractReply(raw: string | undefined): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{')) return trimmed;
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed?.reply === 'string' && parsed.reply.trim()) return parsed.reply.trim();
  } catch { /* not JSON */ }
  return trimmed;
}

// ── Device storage (per chatbot) ──────────────────────────────────────────────

const CONVOS_KEY = (cid: string) => `acw_convos_${cid}`;   // ConvMeta[]
const ACTIVE_KEY = (cid: string) => `acw_active_${cid}`;   // active sessionId
const MSGS_KEY = (sid: string) => `acw_msgs_${sid}`;       // cached Message[]
const LEGACY_KEY = (cid: string) => `chat_session_${cid}`; // old single-session id

function readJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota / disabled */ }
}

function serializeMsgs(msgs: Message[]) {
  return msgs
    .filter((m) => m.content && m.id !== 'welcome')
    .slice(-100)
    .map((m) => ({ role: m.role, content: m.content, ts: m.timestamp.getTime() }));
}
function reviveMsgs(raw: Array<{ role: 'user' | 'assistant'; content: string; ts: number }>): Message[] {
  return (raw ?? []).map((r) => ({
    id: generateId(),
    role: r.role,
    content: r.content,
    timestamp: new Date(r.ts ?? Date.now()),
  }));
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
  const [conversations, setConversations] = useState<ConvMeta[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [showConvos, setShowConvos] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const currentBotMsgIdRef = useRef<string | null>(null);
  const infoRef = useRef<ChatbotInfo | null>(null);
  useEffect(() => { infoRef.current = info; }, [info]);

  const buildWelcome = useCallback((): Message => ({
    id: 'welcome',
    role: 'assistant',
    content:
      infoRef.current?.welcomeMessage ||
      `Hi! I'm ${infoRef.current?.name ?? 'here'}. How can I help you today?`,
    timestamp: new Date(),
  }), []);

  // ── WebSocket connection (lives for the widget's lifetime) ──────────────────

  useEffect(() => {
    const socket = io(`${API_BASE}/events`, { transports: ['websocket', 'polling'], reconnection: true });

    socket.on('chat:token', ({ token }: { token: string }) => {
      const msgId = currentBotMsgIdRef.current;
      if (!msgId) return;
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, content: m.content + token, streaming: true } : m)),
      );
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    socket.on('chat:done', ({ reply }: { reply?: string }) => {
      const msgId = currentBotMsgIdRef.current;
      if (msgId) {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== msgId) return m;
            const cleanContent = reply ?? extractReply(m.content) ?? m.content;
            return { ...m, content: cleanContent, streaming: false };
          }),
        );
      }
      currentBotMsgIdRef.current = null;
      setIsStreaming(false);
      setIsSending(false);
    });

    socketRef.current = socket;
    return () => { socket.disconnect(); };
  }, []);

  // ── Load chatbot info + theming (once per chatbot) ──────────────────────────

  useEffect(() => {
    setIsLoading(true);
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
          avatarEmoji: data.settings?.avatarEmoji ?? '🤖',
          avatarUrl: data.settings?.avatarUrl ?? undefined,
          showTypingIndicator: data.settings?.showTypingIndicator ?? true,
          showTimestamps: data.settings?.showTimestamps ?? true,
          bubbleStyle: data.settings?.bubbleStyle ?? 'rounded',
          chatBgColor: data.settings?.chatBgColor ?? '#f9fafb',
          fontSize: data.settings?.fontSize ?? 'sm',
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [chatbotId]);

  // ── Initialize the conversation index for this device (once per chatbot) ────

  useEffect(() => {
    let convos = readJSON<ConvMeta[]>(CONVOS_KEY(chatbotId), []);

    // Migrate the old single-session storage into a first conversation.
    const legacy = (() => { try { return localStorage.getItem(LEGACY_KEY(chatbotId)); } catch { return null; } })();
    if (convos.length === 0 && legacy) {
      convos = [{ id: legacy, title: 'Conversation', preview: '', updatedAt: Date.now() }];
      writeJSON(CONVOS_KEY(chatbotId), convos);
    }

    let active = (() => { try { return localStorage.getItem(ACTIVE_KEY(chatbotId)) ?? ''; } catch { return ''; } })();
    if (!active || !convos.some((c) => c.id === active)) {
      if (convos.length > 0) {
        active = convos[0].id;
      } else {
        active = newSessionId();
        convos = [{ id: active, title: 'New conversation', preview: '', updatedAt: Date.now() }];
        writeJSON(CONVOS_KEY(chatbotId), convos);
      }
    }
    setConversations(convos);
    setActiveId(active);
  }, [chatbotId]);

  // ── Load the active conversation: instant cache paint, then server reconcile ─

  useEffect(() => {
    if (!activeId) return;
    try { localStorage.setItem(ACTIVE_KEY(chatbotId), activeId); } catch { /* ignore */ }

    // 1. Instant paint from the on-device cache (offline-friendly).
    const cached = reviveMsgs(readJSON(MSGS_KEY(activeId), []));
    setMessages(cached.length ? cached : [buildWelcome()]);

    // 2. Join the realtime session room for streaming.
    const join = () => socketRef.current?.emit('join:session', { sessionId: activeId });
    if (socketRef.current?.connected) join();
    else socketRef.current?.once('connect', join);

    // 3. Reconcile with the server (source of truth).
    let cancelled = false;
    fetch(`${API_BASE}/public/chatbot/${chatbotId}/history/${activeId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((hist) => {
        if (cancelled || !hist) return;
        const serverMsgs: Message[] = (hist.messages ?? []).map((m: any) => ({
          id: generateId(),
          role: m.role,
          content: m.role === 'assistant' ? extractReply(m.content) : (m.content ?? ''),
          timestamp: new Date(m.timestamp ?? Date.now()),
        }));
        if (serverMsgs.length > 0) {
          setMessages(serverMsgs);
          writeJSON(MSGS_KEY(activeId), serializeMsgs(serverMsgs));
        } else if (cached.length === 0) {
          setMessages([buildWelcome()]);
        }
      })
      .catch(() => { /* keep cache */ });

    return () => {
      cancelled = true;
      // Remove the deferred join so fast conversation switches don't leak handlers.
      socketRef.current?.off('connect', join);
    };
  }, [activeId, chatbotId, buildWelcome]);

  // When the chatbot info loads, refresh a placeholder welcome with the real text.
  useEffect(() => {
    if (!info) return;
    setMessages((prev) =>
      prev.length === 1 && prev[0].id === 'welcome' ? [buildWelcome()] : prev,
    );
  }, [info, buildWelcome]);

  // ── Persist messages to device cache + keep conversation meta fresh ─────────

  useEffect(() => {
    if (!activeId || isStreaming) return;
    writeJSON(MSGS_KEY(activeId), serializeMsgs(messages));

    const real = messages.filter((m) => m.content && m.id !== 'welcome');
    if (real.length === 0) return;
    const firstUser = real.find((m) => m.role === 'user');
    const last = real[real.length - 1];
    setConversations((prev) => {
      const meta: ConvMeta = {
        id: activeId,
        title: firstUser ? truncate(firstUser.content, 40) : 'New conversation',
        preview: truncate(last.content, 60),
        updatedAt: Date.now(),
      };
      const exists = prev.some((c) => c.id === activeId);
      const merged = exists ? prev.map((c) => (c.id === activeId ? meta : c)) : [meta, ...prev];
      const next = [...merged].sort((a, b) => b.updatedAt - a.updatedAt);
      writeJSON(CONVOS_KEY(chatbotId), next);
      return next;
    });
  }, [messages, activeId, chatbotId, isStreaming]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // ── Conversation actions ────────────────────────────────────────────────────

  const handleNewChat = useCallback(() => {
    const id = newSessionId();
    const meta: ConvMeta = { id, title: 'New conversation', preview: '', updatedAt: Date.now() };
    setConversations((prev) => {
      const next = [meta, ...prev];
      writeJSON(CONVOS_KEY(chatbotId), next);
      return next;
    });
    setActiveId(id);
    setShowConvos(false);
  }, [chatbotId]);

  const handleSwitch = useCallback((id: string) => {
    if (id !== activeId) setActiveId(id);
    setShowConvos(false);
  }, [activeId]);

  const handleDeleteConv = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { localStorage.removeItem(MSGS_KEY(id)); } catch { /* ignore */ }
    let next = conversations.filter((c) => c.id !== id);
    let nextActive = activeId;
    if (id === activeId) {
      if (next.length === 0) {
        const nid = newSessionId();
        next = [{ id: nid, title: 'New conversation', preview: '', updatedAt: Date.now() }];
        nextActive = nid;
      } else {
        nextActive = next[0].id;
      }
    }
    setConversations(next);
    writeJSON(CONVOS_KEY(chatbotId), next);
    if (nextActive !== activeId) setActiveId(nextActive);
  }, [conversations, activeId, chatbotId]);

  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
    });
  }, []);

  // ── Send ────────────────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!input.trim() || isSending || isStreaming || !activeId) return;

    const userText = input.trim();
    setInput('');
    const userMsgId = generateId();
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: userText, timestamp: new Date() }]);
    setIsSending(true);

    const botMsgId = generateId();
    currentBotMsgIdRef.current = botMsgId;
    setMessages((prev) => [...prev, { id: botMsgId, role: 'assistant', content: '', timestamp: new Date(), streaming: true }]);
    setIsStreaming(true);

    try {
      const res = await fetch(`${API_BASE}/public/chatbot/${chatbotId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, sessionId: activeId }),
      });
      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();
      const replyText = extractReply(data.message ?? data.response ?? data.reply);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId ? { ...m, content: replyText || 'Sorry, could not process that.', streaming: false } : m,
        ),
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId ? { ...m, content: 'Sorry, something went wrong. Please try again.', streaming: false } : m,
        ),
      );
    } finally {
      currentBotMsgIdRef.current = null;
      setIsSending(false);
      setIsStreaming(false);
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
  const avatarEmoji = info?.avatarEmoji ?? '🤖';
  const avatarUrl = info?.avatarUrl;
  const showTypingIndicator = info?.showTypingIndicator ?? true;
  const showTimestamps = info?.showTimestamps ?? true;
  const bubbleStyle = info?.bubbleStyle ?? 'rounded';
  const chatBgColor = info?.chatBgColor ?? '#f9fafb';
  const fontClass = info?.fontSize === 'lg' ? 'text-lg' : info?.fontSize === 'base' ? 'text-base' : 'text-sm';
  const bubbleRound = bubbleStyle === 'rounded' ? 'rounded-2xl' : 'rounded-lg';

  const renderAvatar = (sizeClass: string) =>
    avatarUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatarUrl} alt={info?.name ?? 'Logo'} className={cn(sizeClass, 'object-cover')} />
    ) : (
      avatarEmoji
    );

  return (
    <div
      className={cn(
        'relative flex flex-col bg-white',
        iframe ? 'h-screen' : 'h-full min-h-[500px] max-h-[750px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden',
      )}
    >
      {/* Header */}
      <div className="px-3 py-3 shrink-0" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setShowConvos(true)}
              title="Conversations"
              className="rounded-full bg-white/20 p-1.5 hover:bg-white/30 transition-colors shrink-0"
            >
              <Menu className="w-3.5 h-3.5 text-white" />
            </button>
            <div className="rounded-full bg-white/20 p-1.5 text-lg leading-none overflow-hidden flex items-center justify-center shrink-0">
              {renderAvatar('w-6 h-6 rounded-full')}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{info?.name ?? 'AI Assistant'}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                <span className="text-white/80 text-[11px]">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            title="New chat"
            className="rounded-full bg-white/20 p-1.5 hover:bg-white/30 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: chatBgColor }}>
        {messages.map((msg) => (
          <div key={msg.id} className={cn('flex items-end gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <div className="rounded-full p-1 shrink-0 text-base leading-none overflow-hidden flex items-center justify-center" style={{ backgroundColor: `${primaryColor}22` }}>
                {renderAvatar('w-5 h-5 rounded-full')}
              </div>
            )}
            <div
              className={cn(
                'px-3 py-2 max-w-[80%] leading-relaxed',
                fontClass,
                msg.role === 'user'
                  ? `${bubbleRound} rounded-br-sm text-white`
                  : `${bubbleRound} rounded-bl-sm bg-white text-gray-900 shadow-sm border border-gray-100`,
              )}
              style={msg.role === 'user' ? { backgroundColor: primaryColor } : undefined}
            >
              {msg.content ? (
                msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none text-inherit [&>*:last-child]:mb-0 [&>p]:mb-1 [&>ul]:mb-1 [&>ol]:mb-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )
              ) : (
                showTypingIndicator ? (
                  <div className="flex gap-1 items-center py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : null
              )}
              {msg.streaming && msg.content && (
                <span className="inline-block w-0.5 h-3 bg-gray-400 animate-pulse ml-0.5 align-middle" />
              )}
              {!msg.streaming && (showTimestamps || msg.role === 'assistant') && (
                <div className={cn('flex items-center gap-2 mt-1', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {showTimestamps && (
                    <span className={cn('text-[10px]', msg.role === 'user' ? 'text-white/70' : 'text-gray-400')}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  {msg.role === 'assistant' && msg.content && msg.id !== 'welcome' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      title="Copy"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
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
            className="flex-1 text-sm text-gray-900 bg-white rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-1 disabled:bg-gray-50 transition"
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

      {/* Conversations drawer */}
      {showConvos && (
        <div className="absolute inset-0 z-20 flex">
          <div className="w-72 max-w-[85%] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            {/* Drawer header */}
            <div className="px-3 py-3 flex items-center justify-between shrink-0" style={{ backgroundColor: primaryColor }}>
              <span className="text-white font-semibold text-sm">Conversations</span>
              <button onClick={() => setShowConvos(false)} className="rounded-full bg-white/20 p-1.5 hover:bg-white/30 transition-colors" title="Close">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* New chat */}
            <div className="p-2 shrink-0 border-b border-gray-100">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="w-4 h-4" /> New chat
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {conversations.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No conversations yet</p>
              ) : (
                conversations.map((c) => (
                  // Sibling buttons (not nested) so both are valid, keyboard-accessible controls.
                  <div key={c.id} className="group relative">
                    <button
                      onClick={() => handleSwitch(c.id)}
                      className={cn(
                        'w-full text-left pl-2.5 pr-8 py-2 rounded-lg flex items-start gap-2 transition-colors',
                        c.id === activeId ? 'bg-gray-100' : 'hover:bg-gray-50',
                      )}
                    >
                      <MessageCircle
                        className="w-4 h-4 mt-0.5 shrink-0 text-gray-400"
                        style={c.id === activeId ? { color: primaryColor } : undefined}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.title || 'New conversation'}</p>
                        {c.preview && <p className="text-xs text-gray-400 truncate">{c.preview}</p>}
                        <p className="text-[10px] text-gray-300 mt-0.5">{timeAgo(c.updatedAt)}</p>
                      </div>
                    </button>
                    <button
                      onClick={(e) => handleDeleteConv(c.id, e)}
                      className="absolute right-1.5 top-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1"
                      title="Delete conversation"
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Backdrop */}
          <div className="flex-1 bg-black/30 backdrop-blur-[1px]" onClick={() => setShowConvos(false)} />
        </div>
      )}
    </div>
  );
}
