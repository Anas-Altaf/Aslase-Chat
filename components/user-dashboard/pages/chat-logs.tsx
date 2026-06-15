'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Send,
  MessageCircle,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Bot,
  UserCircle,
  EyeOff,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChatbot } from '@/contexts/ChatbotContext';
import { useSocket } from '@/contexts/SocketContext';
import { exportChatSessions, getChatHistory, getChatSessions, sendChatMessage } from '@/lib/services';
import { downloadTextFile } from '@/lib/download';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ChatSession, ChatMessage } from '@/types';

// ── Types ────────────────────────────────────────────────────────────────────

type RightPanelMode = 'playground' | 'history';
type UserTypeFilter = 'all' | 'anonymous' | 'identified';

// ── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({
  session,
  isSelected,
  onClick,
}: {
  session: ChatSession;
  isSelected: boolean;
  onClick: () => void;
}) {
  const firstUserMsg = session.messages.find((m) => m.role === 'user');
  const msgCount = session.messageCount ?? session.messages.length;
  const preview = session.previewMessage ?? firstUserMsg?.content ?? 'Session started';

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-3 cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected ? 'border-green-500 bg-green-50 shadow-md' : 'hover:border-gray-300',
      )}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            'rounded-full p-1.5 shrink-0 mt-0.5',
            session.isAnonymous ? 'bg-gray-100' : 'bg-green-100',
          )}
        >
          {session.isAnonymous ? (
            <EyeOff className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <UserCircle className="w-3.5 h-3.5 text-green-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-gray-900 truncate">
              {session.leadName ?? (session.isAnonymous ? 'Anonymous visitor' : 'Identified user')}
            </span>
            {session.isAnonymous && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                Anon
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate mb-1">{preview}</p>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <MessageCircle className="w-3 h-3" />
            <span>{msgCount} msg{msgCount !== 1 ? 's' : ''}</span>
            <span>·</span>
            <span>{new Date(session.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className="flex items-end gap-2 max-w-[80%]">
        {!isUser && (
          <div className="rounded-full bg-green-100 p-1 shrink-0">
            <Bot className="w-3 h-3 text-green-600" />
          </div>
        )}
        <div
          className={cn(
            'px-3 py-2 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-green-500 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm',
          )}
        >
          {!isUser ? (
            <div className="prose prose-sm max-w-none text-inherit [&>*:last-child]:mb-0 [&>p]:mb-1 [&>ul]:mb-1 [&>ol]:mb-1">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ) : (
            msg.content
          )}
          {msg.timestamp && (
            <p
              className={cn(
                'text-[10px] mt-1',
                isUser ? 'text-green-100' : 'text-gray-400',
              )}
            >
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
        {isUser && (
          <div className="rounded-full bg-gray-200 p-1 shrink-0">
            <User className="w-3 h-3 text-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ChatLogs() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const { socket } = useSocket();
  const searchParams = useSearchParams();

  // Session list state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;
  const [userTypeFilter, setUserTypeFilter] = useState<UserTypeFilter>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Right panel state
  const [mode, setMode] = useState<RightPanelMode>('playground');
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Playground state
  const [playMessage, setPlayMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([{ role: 'assistant', content: 'Hi! How can I help?' }]);

  const historyBottomRef = useRef<HTMLDivElement>(null);
  const playBottomRef = useRef<HTMLDivElement>(null);

  // ── Load sessions ────────────────────────────────────────────────────────

  const handleExport = async (format: 'csv' | 'json') => {
    if (!selectedChatbot) return;
    setIsExporting(true);
    try {
      const isAnonymous =
        userTypeFilter === 'all' ? undefined : userTypeFilter === 'anonymous';

      const res = await exportChatSessions(
        selectedChatbot.id,
        format,
        isAnonymous !== undefined ? isAnonymous : undefined,
      );

      if (!res.success) {
        toast.error(res.error ?? 'Failed to export chat sessions');
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const ext = format === 'json' ? 'json' : 'csv';
      const mime = format === 'json' ? 'application/json;charset=utf-8' : 'text/csv;charset=utf-8';
      const filename = `chat-sessions-${selectedChatbot.id}-${today}.${ext}`;
      downloadTextFile(filename, res.data, mime);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export chat sessions');
    } finally {
      setIsExporting(false);
    }
  };

  const loadSessions = useCallback(
    async (p = page) => {
      if (!selectedChatbot) return;
      setIsLoading(true);
      try {
        const isAnonymous =
          userTypeFilter === 'all' ? undefined : userTypeFilter === 'anonymous';
        const res = await getChatSessions(selectedChatbot.id, {
          page: p,
          limit: LIMIT,
          isAnonymous,
        });
        if (res.success) {
          setSessions(res.data.items);
          setTotal(res.data.total);
          setTotalPages(Math.ceil(res.data.total / LIMIT) || 1);
        } else {
          toast.error(res.error ?? 'Failed to load chat sessions');
        }
      } catch {
        toast.error('Failed to load chat sessions');
      } finally {
        setIsLoading(false);
      }
    },
    [selectedChatbot, page, userTypeFilter],
  );

  useEffect(() => {
    if (!selectedChatbot) {
      setSessions([]);
      setTotal(0);
      setTotalPages(1);
      setPage(1);
      setMode('playground');
      setSelectedSession(null);
      return;
    }
    setMode('playground');
    setSelectedSession(null);
    setPage(1);
    loadSessions(1);
  }, [selectedChatbot?.id, userTypeFilter]);

  // Live refresh — new visitor messages arrive over the socket. Only refresh the
  // first page (newest sessions sort to the top) to avoid disrupting pagination.
  useEffect(() => {
    if (!socket || !selectedChatbot) return;
    const refresh = () => { if (page === 1) loadSessions(1); };
    socket.on('new_message', refresh);
    return () => { socket.off('new_message', refresh); };
  }, [socket, selectedChatbot?.id, page, loadSessions]);

  // Live refresh of the OPEN conversation thread — when a new message arrives,
  // re-fetch the session the owner is currently viewing so it appends live.
  useEffect(() => {
    if (!socket || mode !== 'history' || !selectedSession) return;
    const sessionId = selectedSession.id;
    const refreshThread = async () => {
      const res = await getChatHistory(sessionId);
      if (res.success && res.data) {
        // Guard against a stale close: only apply if still viewing this session.
        setSelectedSession((cur) => (cur && cur.id === sessionId ? res.data : cur));
      }
    };
    socket.on('new_message', refreshThread);
    return () => { socket.off('new_message', refreshThread); };
  }, [socket, mode, selectedSession?.id]);

  // ── Pagination ────────────────────────────────────────────────────────────

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadSessions(newPage);
  };

  // ── Auto-select session from URL param ───────────────────────────────────

  useEffect(() => {
    const targetSession = searchParams.get('session');
    if (!targetSession || sessions.length === 0) return;
    const match = sessions.find(
      (s) => s.id === targetSession || (s as any).sessionId === targetSession,
    );
    if (match) handleSelectSession(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, searchParams]);

  // ── History viewer ────────────────────────────────────────────────────────

  const handleSelectSession = async (session: ChatSession) => {
    setSelectedSession(session);
    setMode('history');

    // If messages are already loaded (list endpoint includes them), use them
    if (session.messages.length > 0) return;

    setIsLoadingHistory(true);
    try {
      const res = await getChatHistory(session.id);
      if (res.success && res.data) {
        setSelectedSession(res.data);
      } else {
        toast.error(res.error ?? 'Failed to load chat history');
      }
    } catch {
      toast.error('Failed to load chat history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (mode === 'history') {
      historyBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedSession?.messages.length, mode]);

  // ── Playground ────────────────────────────────────────────────────────────

  const handleSendMessage = async () => {
    if (!playMessage.trim() || !selectedChatbot || isSending) return;

    const userMsg = playMessage.trim();
    setPlayMessage('');
    setIsSending(true);
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);

    try {
      const res = await sendChatMessage(selectedChatbot.id, userMsg, currentChatId);
      if (!currentChatId) setCurrentChatId(res.chatId);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: res.message }]);
      loadSessions(page);
    } catch {
      toast.error('Failed to send message');
      setChatMessages((prev) => prev.slice(0, -1));
      setPlayMessage(userMsg);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (mode === 'playground') {
      playBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages.length, mode]);

  // ── Early returns ─────────────────────────────────────────────────────────

  if (isInitialLoading) {
    return (
      <div className="flex gap-4 h-full overflow-hidden">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
        <Skeleton className="w-80 h-full" />
      </div>
    );
  }

  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to view chat logs</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* ── Left: Session List ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat Logs</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {total} conversation{total !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              Export CSV
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleExport('json')}
              disabled={isExporting}
            >
              Export JSON
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 shrink-0">
          <span className="text-xs text-gray-500">Show:</span>
          <Button
            size="sm"
            variant={userTypeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setUserTypeFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={userTypeFilter === 'anonymous' ? 'default' : 'outline'}
            onClick={() => setUserTypeFilter('anonymous')}
          >
            Anonymous
          </Button>
          <Button
            size="sm"
            variant={userTypeFilter === 'identified' ? 'default' : 'outline'}
            onClick={() => setUserTypeFilter('identified')}
          >
            Identified
          </Button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {isLoading && sessions.length === 0 ? (
            <>
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isSelected={selectedSession?.id === session.id}
                onClick={() => handleSelectSession(session)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 shrink-0 border-t border-gray-100 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <span className="text-sm text-gray-500">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* ── Right: Playground or History ── */}
      <div className="w-80 flex flex-col shrink-0 overflow-hidden">
        {mode === 'history' && selectedSession ? (
          <>
            {/* History header */}
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setMode('playground'); setSelectedSession(null); }}
                className="text-gray-500 hover:text-gray-900 -ml-1"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Conversation</p>
                <p className="text-[11px] text-gray-400">
                  {new Date(selectedSession.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {' · '}
                  {selectedSession.messageCount ?? selectedSession.messages.length} messages
                </p>
              </div>
            </div>

            {/* History thread */}
            <Card className="flex-1 overflow-y-auto p-3 space-y-3">
              {isLoadingHistory ? (
                <>
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-10 w-2/3 ml-auto" />
                  <Skeleton className="h-10 w-3/4" />
                </>
              ) : selectedSession.messages.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No messages recorded</p>
              ) : (
                <>
                  {selectedSession.messages.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} />
                  ))}
                  <div ref={historyBottomRef} />
                </>
              )}
            </Card>
          </>
        ) : (
          <>
            {/* Playground header */}
            <div className="mb-3 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">Chat Playground</h2>
              <p className="text-xs text-gray-500">Test your chatbot live</p>
            </div>

            {/* Playground chat */}
            <Card className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'px-3 py-2 rounded-2xl text-sm max-w-[85%] leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-green-500 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm',
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
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="px-3 py-2 rounded-2xl bg-gray-100 text-gray-500 text-sm rounded-bl-sm">
                      <span className="animate-pulse">...</span>
                    </div>
                  </div>
                )}
                <div ref={playBottomRef} />
              </div>
              <div className="flex gap-2 p-3 shrink-0 border-t border-gray-100">
                <Input
                  placeholder="Type a message..."
                  value={playMessage}
                  onChange={(e) => setPlayMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                  disabled={isSending}
                  className="text-sm"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={isSending || !playMessage.trim()}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
