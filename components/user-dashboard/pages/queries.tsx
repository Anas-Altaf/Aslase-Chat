'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MessageCircle, Bot, Trash2, Search, LinkIcon, ChevronLeft, ChevronRight, HelpCircle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getQueries, deleteQuery, deleteAllQueries, exportQueries } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ChatQuery, SentimentType } from '@/types';

const SENTIMENT_BADGE: Record<SentimentType, string> = {
  Positive: 'bg-green-100 text-green-700',
  Negative: 'bg-red-100 text-red-700',
  Neutral: 'bg-gray-100 text-gray-600',
};

const PAGE_SIZE = 20;

export default function Queries() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const router = useRouter();
  const [queries, setQueries] = useState<ChatQuery[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filters
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [anonFilter, setAnonFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [appliedFrom, setAppliedFrom] = useState('');
  const [appliedTo, setAppliedTo] = useState('');
  // Client-side "questions only" toggle — filters to messages containing "?"
  const [questionsOnly, setQuestionsOnly] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Client-side filter applied on top of server-filtered data
  const displayedQueries = useMemo(
    () => questionsOnly ? queries.filter((q) => q.userMessage.includes('?')) : queries,
    [queries, questionsOnly],
  );

  const downloadTextFile = (filename: string, text: string, mime: string) => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (!selectedChatbot) return;
    setIsExporting(true);
    try {
      const res = await exportQueries(
        selectedChatbot.id,
        {
          sentiment: sentimentFilter !== 'all' ? (sentimentFilter as SentimentType) : undefined,
          isAnonymous: anonFilter !== 'all' ? anonFilter === 'true' : undefined,
          search: search || undefined,
          from: appliedFrom || undefined,
          to: appliedTo || undefined,
          limit: 10000,
        },
        format,
      );

      if (!res.success) {
        toast.error(res.error ?? 'Failed to export queries');
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const ext = format === 'json' ? 'json' : 'csv';
      const mime =
        format === 'json'
          ? 'application/json;charset=utf-8'
          : 'text/csv;charset=utf-8';
      const filename = `queries-${selectedChatbot.id}-${today}.${ext}`;
      downloadTextFile(filename, res.data, mime);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export queries');
    } finally {
      setIsExporting(false);
    }
  };

  const loadQueries = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const res = await getQueries(selectedChatbot.id, {
        sentiment: sentimentFilter !== 'all' ? (sentimentFilter as SentimentType) : undefined,
        isAnonymous: anonFilter !== 'all' ? anonFilter === 'true' : undefined,
        search: search || undefined,
        from: appliedFrom || undefined,
        to: appliedTo || undefined,
        page,
        limit: PAGE_SIZE,
      });
      if (res.success) {
        setQueries(res.data.items);
        setTotal(res.data.total);
      } else {
        toast.error(res.error ?? 'Failed to load queries');
      }
    } catch {
      toast.error('Failed to load queries');
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot, sentimentFilter, anonFilter, search, page]);

  useEffect(() => {
    if (!selectedChatbot) { setQueries([]); setTotal(0); return; }
    loadQueries();
  }, [selectedChatbot?.id, sentimentFilter, anonFilter, search, appliedFrom, appliedTo, page]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleApplyDates = () => {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    setPage(1);
  };

  const handleClearDates = () => {
    setFromDate('');
    setToDate('');
    setAppliedFrom('');
    setAppliedTo('');
    setPage(1);
  };

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteQuery(deleteId);
      if (res.success) {
        toast.success('Query deleted');
        setDeleteId(null);
        await loadQueries();
      } else {
        toast.error(res.error ?? 'Failed to delete query');
      }
    } catch {
      toast.error('Failed to delete query');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!selectedChatbot) return;
    setIsDeletingAll(true);
    try {
      const res = await deleteAllQueries(selectedChatbot.id);
      if (res.success) {
        toast.success(`${res.data.deleted} queries deleted`);
        setDeleteAllOpen(false);
        setPage(1);
        await loadQueries();
      } else {
        toast.error(res.error ?? 'Failed to delete queries');
      }
    } catch {
      toast.error('Failed to delete queries');
    } finally {
      setIsDeletingAll(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to view queries</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-1 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Messages</h1>
          <p className="text-xs text-gray-500 mt-0.5">All messages sent to your chatbot — {total} total</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExport('csv')}
            disabled={isExporting || total === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExport('json')}
            disabled={isExporting || total === 0}
          >
            Export JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => setDeleteAllOpen(true)}
            disabled={total === 0}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete All
          </Button>
        </div>
      </div>

      {/* Questions-only toggle */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <button
          onClick={() => setQuestionsOnly(!questionsOnly)}
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors',
            questionsOnly
              ? 'bg-green-500 text-white border-green-500'
              : 'bg-white text-gray-600 border-gray-300 hover:border-green-400',
          )}
        >
          <HelpCircle className="w-3 h-3" />
          Questions only
        </button>
        {questionsOnly && (
          <span className="text-xs text-gray-400">
            Showing {displayedQueries.length} of {queries.length} messages that contain "?"
          </span>
        )}
      </div>

      {/* Filters */}
      <Card className="p-3 mb-4 shrink-0 space-y-2">
        <div className="flex gap-2 flex-wrap items-center">
          <Select
            value={sentimentFilter}
            onValueChange={handleFilterChange(setSentimentFilter)}
          >
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiment</SelectItem>
              <SelectItem value="Positive">Positive</SelectItem>
              <SelectItem value="Negative">Negative</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={anonFilter}
            onValueChange={handleFilterChange(setAnonFilter)}
          >
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="false">Authenticated</SelectItem>
              <SelectItem value="true">Anonymous</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-1 flex-1 min-w-36">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search messages..."
              className="h-8 text-sm"
            />
            <Button size="sm" className="h-8 px-2" onClick={handleSearch}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs font-medium text-gray-500 shrink-0">From:</span>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-8 text-sm w-36"
          />
          <span className="text-xs font-medium text-gray-500 shrink-0">To:</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-8 text-sm w-36"
          />
          <Button size="sm" className="h-8" onClick={handleApplyDates}>
            Apply
          </Button>
          {(appliedFrom || appliedTo) && (
            <Button size="sm" variant="ghost" className="h-8 text-gray-400" onClick={handleClearDates}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Query list */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {isLoading && queries.length === 0 ? (
            <>
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </>
          ) : displayedQueries.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              {questionsOnly ? 'No questions (messages with "?") found on this page' : 'No messages found'}
            </p>
          ) : (
            displayedQueries.map((q) => (
              <Card key={q.id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <MessageCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-gray-900 text-sm font-medium line-clamp-2">
                      {q.userMessage}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                    onClick={() => setDeleteId(q.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Bot response preview */}
                <div className="flex items-start gap-2 mb-3 ml-1">
                  <Bot className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {q.botResponse}
                  </p>
                </div>

                {/* Footer: sentiments + lead badge + date */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', SENTIMENT_BADGE[q.userSentiment])}>
                    User: {q.userSentiment}
                  </span>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', SENTIMENT_BADGE[q.replySentiment])}>
                    Bot: {q.replySentiment}
                  </span>
                  {q.leadCaptured && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      <LinkIcon className="w-2.5 h-2.5" />
                      Lead
                    </span>
                  )}
                  {q.isAnonymous && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                      Anonymous
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(q.createdAt).toLocaleString()}
                  </span>
                  {q.sessionId && (
                    <button
                      onClick={() => router.push('/user-dashboard/chat-logs')}
                      className="ml-auto flex items-center gap-1 text-[10px] text-green-600 hover:text-green-700 font-medium shrink-0"
                      title="View chat session"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Session
                    </button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4 py-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete single query */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Query</DialogTitle>
            <DialogDescription>
              Remove this query record permanently?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete all queries */}
      <Dialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete All Queries</DialogTitle>
            <DialogDescription>
              This will permanently delete all {total} queries for this chatbot. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAllOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAll} disabled={isDeletingAll}>
              {isDeletingAll ? 'Deleting...' : 'Delete All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
