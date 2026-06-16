'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  MessageSquare,
  Bot,
  Brain,
  Trash2,
  Send,
  CheckCheck,
} from 'lucide-react';
import { api } from '@/lib/api';

export interface QueryItem {
  _id: string;
  userMessage: string;
  botResponse: string;
  adminReply?: string | null;
  userSentiment: 'Positive' | 'Negative' | 'Neutral';
  replySentiment: 'Positive' | 'Negative' | 'Neutral';
  isUnresolved: boolean;
  savedToContext: boolean;
  leadCaptured: boolean;
  isAnonymous: boolean;
  createdAt: string;
  resolvedAt?: string | null;
}

interface QueryDetailDrawerProps {
  query: QueryItem | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (updated: QueryItem) => void;
  onDeleted: (id: string) => void;
}

const sentimentColors = {
  Positive: 'bg-green-100 text-green-700',
  Negative: 'bg-red-100 text-red-700',
  Neutral: 'bg-gray-100 text-gray-600',
};

export default function QueryDetailDrawer({
  query,
  open,
  onClose,
  onUpdated,
  onDeleted,
}: QueryDetailDrawerProps) {
  const [reply, setReply] = useState('');
  const [saving, setSaving] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [savingContext, setSavingContext] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sync reply textarea when a new query opens
  const handleOpenChange = (open: boolean) => {
    if (open && query) setReply(query.adminReply ?? '');
    if (!open) onClose();
  };

  if (!query) return null;

  const isResolved = !query.isUnresolved;

  const handleSaveReply = async () => {
    if (!reply.trim()) { toast.error('Reply cannot be empty'); return; }
    setSaving(true);
    try {
      const res = await api.patch<{ query: QueryItem; delivered: boolean; channel: 'social' | 'widget' | 'none' }>(
        `/queries/${query._id}/reply`,
        { reply },
      );
      onUpdated(res.query);
      if (res.channel === 'social') {
        toast.success(res.delivered ? 'Reply sent to the customer' : 'Saved — social delivery failed, try again');
      } else if (res.channel === 'widget') {
        toast.success('Reply delivered to the live chat');
      } else {
        toast.success('Reply saved (no live session to deliver to)');
      }
    } catch {
      toast.error('Failed to save reply');
    } finally {
      setSaving(false);
    }
  };

  const handleResolve = async () => {
    setResolving(true);
    try {
      const updated = await api.patch<QueryItem>(`/queries/${query._id}/resolve`, {});
      onUpdated(updated);
      toast.success('Marked as resolved');
    } catch {
      toast.error('Failed to resolve');
    } finally {
      setResolving(false);
    }
  };

  const handleSaveToContext = async () => {
    setSavingContext(true);
    try {
      // Send the typed answer so the admin's wording (not the bot's) is what's
      // saved as training data; falls back to the existing answer if left blank.
      const trimmed = reply.trim();
      await api.post(`/queries/${query._id}/save-to-context`, trimmed ? { reply: trimmed } : {});
      onUpdated({ ...query, savedToContext: true, adminReply: trimmed || query.adminReply });
      toast.success('Saved to chatbot training — find it in the Training tab');
    } catch {
      toast.error('Failed to save to context');
    } finally {
      setSavingContext(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/queries/${query._id}`);
      onDeleted(query._id);
      onClose();
      toast.success('Query deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Query Detail
          </SheetTitle>
          <SheetDescription>
            {new Date(query.createdAt).toLocaleString()} ·{' '}
            {query.isAnonymous ? 'Anonymous' : 'Authenticated'} user
          </SheetDescription>
        </SheetHeader>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Badge className={sentimentColors[query.userSentiment]}>
            User: {query.userSentiment}
          </Badge>
          <Badge className={sentimentColors[query.replySentiment]}>
            Bot: {query.replySentiment}
          </Badge>
          {isResolved ? (
            <Badge className="bg-green-100 text-green-700">Resolved</Badge>
          ) : (
            <Badge className="bg-red-100 text-red-700">Unresolved</Badge>
          )}
          {query.adminReply && (
            <Badge className="bg-blue-100 text-blue-700">Replied</Badge>
          )}
          {query.savedToContext && (
            <Badge className="bg-purple-100 text-purple-700">In Context</Badge>
          )}
        </div>

        {/* User message */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <MessageSquare className="w-3 h-3" />
            User Message
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-800 leading-relaxed border border-gray-100">
            {query.userMessage}
          </div>
        </div>

        {/* Bot response */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <Bot className="w-3 h-3" />
            Bot Response
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-sm text-gray-800 leading-relaxed border border-green-100">
            {query.botResponse}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Admin reply */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <CheckCheck className="w-3 h-3" />
            Your Reply (Admin Answer)
          </div>
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your answer — 'Reply Now' sends it to the customer on their channel; 'Save to Chatbot Context' adds this Q&A to the chatbot's training."
            rows={4}
            className="text-sm resize-none"
          />
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              onClick={handleSaveReply}
              disabled={saving || !reply.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              {saving ? 'Sending…' : 'Reply Now'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveToContext}
              disabled={savingContext || query.savedToContext}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Brain className="w-3.5 h-3.5 mr-1" />
              {savingContext ? 'Saving…' : query.savedToContext ? 'In Context ✓' : 'Save to Chatbot Context'}
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResolve}
            disabled={resolving || isResolved}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            {resolving ? 'Resolving…' : isResolved ? 'Already Resolved' : 'Mark Resolved'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
