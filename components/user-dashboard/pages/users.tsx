'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, UserCircle, EyeOff, MessageCircle, Calendar, Mail } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { useSocket } from '@/contexts/SocketContext';
import { getChatSessions } from '@/lib/services';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ChatSession } from '@/types';

/**
 * "Users" for a business hub = the visitors who actually chatted with the
 * selected chatbot (identified + anonymous), NOT every platform-registered
 * account. Built from the chatbot's chat sessions.
 */
export default function Users() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const { socket } = useSocket();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const res = await getChatSessions(selectedChatbot.id, { page: 1, limit: 100 });
      if (res.success) {
        setSessions(res.data.items);
      } else {
        toast.error(res.error ?? 'Failed to load users');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot]);

  useEffect(() => {
    if (!selectedChatbot) { setSessions([]); return; }
    load();
  }, [selectedChatbot?.id]);

  // Live refresh as new visitors message the chatbot
  useEffect(() => {
    if (!socket || !selectedChatbot) return;
    const refresh = () => load();
    socket.on('new_message', refresh);
    return () => { socket.off('new_message', refresh); };
  }, [socket, selectedChatbot?.id, load]);

  const visitorName = (s: ChatSession) =>
    s.leadName ?? (s.isAnonymous ? 'Anonymous visitor' : 'Identified user');

  const filtered = sessions.filter((s) =>
    visitorName(s).toLowerCase().includes(search.toLowerCase()),
  );

  const identifiedCount = sessions.filter((s) => !s.isAnonymous).length;

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to view its users</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {sessions.length} visitor{sessions.length !== 1 ? 's' : ''} · {identifiedCount} identified
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search visitors by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      {/* Visitor list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && sessions.length === 0 ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <UserCircle className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">{search ? 'No visitors match your search' : 'No visitors yet'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <Card key={s.id} className="p-4">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={cn('rounded-full p-2 shrink-0', s.isAnonymous ? 'bg-gray-100' : 'bg-green-100')}>
                    {s.isAnonymous ? (
                      <EyeOff className="w-6 h-6 text-gray-500" />
                    ) : (
                      <UserCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{visitorName(s)}</span>
                      <span
                        className={cn(
                          'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                          s.isAnonymous ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700',
                        )}
                      >
                        {s.isAnonymous ? 'Anonymous' : 'Identified'}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{s.messageCount ?? s.messages.length} message{(s.messageCount ?? s.messages.length) !== 1 ? 's' : ''}</span>
                      </div>
                      {s.previewMessage && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{s.previewMessage}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>
                          First seen {new Date(s.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
