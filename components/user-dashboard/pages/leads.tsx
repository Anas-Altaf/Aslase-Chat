'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, User, Trash2, Tag, Info, Filter } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { useSocket } from '@/contexts/SocketContext';
import { exportLeads, getLeads, deleteLead, updateLead } from '@/lib/services';
import { downloadTextFile } from '@/lib/download';
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
import type { Lead, LeadStatus } from '@/types';

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-green-100 text-green-700',
  contacted: 'bg-blue-100 text-blue-700',
  converted: 'bg-purple-100 text-purple-700',
  rejected: 'bg-red-100 text-red-700',
};

const SOURCE_LABELS: Record<string, string> = {
  website: 'Website',
  public_widget: 'Widget',
  api: 'API',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  slack: 'Slack',
};

export default function Leads() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const { socket } = useSocket();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [appliedFrom, setAppliedFrom] = useState('');
  const [appliedTo, setAppliedTo] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await getLeads(selectedChatbot.id, {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        from: appliedFrom || undefined,
        to: appliedTo || undefined,
      });
      if (res.success) {
        setLeads(res.data.items);
      } else {
        setLoadError(res.error ?? 'Failed to load leads');
        toast.error(res.error ?? 'Failed to load leads');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load leads';
      setLoadError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot, statusFilter, appliedFrom, appliedTo]);

  useEffect(() => {
    if (!selectedChatbot) { setLeads([]); return; }
    loadLeads();
  }, [selectedChatbot?.id, statusFilter, appliedFrom, appliedTo]);

  // Live refresh — a new lead is captured server-side and pushed over the socket.
  useEffect(() => {
    if (!socket || !selectedChatbot) return;
    const refresh = () => loadLeads();
    socket.on('new_lead', refresh);
    return () => { socket.off('new_lead', refresh); };
  }, [socket, selectedChatbot?.id, loadLeads]);

  const handleExport = async (format: 'csv' | 'json') => {
    if (!selectedChatbot) return;
    setIsExporting(true);
    try {
      const res = await exportLeads(selectedChatbot.id, format);
      if (!res.success) {
        toast.error(res.error ?? 'Failed to export leads');
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const ext = format === 'json' ? 'json' : 'csv';
      const mime = format === 'json' ? 'application/json;charset=utf-8' : 'text/csv;charset=utf-8';
      const filename = `leads-${selectedChatbot.id}-${today}.${ext}`;
      downloadTextFile(filename, res.data, mime);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  const handleApplyDateFilter = () => {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
  };

  const handleClearDates = () => {
    setFromDate('');
    setToDate('');
    setAppliedFrom('');
    setAppliedTo('');
  };

  const handleStatusChange = async (lead: Lead, newStatus: LeadStatus) => {
    setUpdatingId(lead.id);
    try {
      const res = await updateLead(lead.id, { status: newStatus });
      if (res.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l)),
        );
        toast.success('Status updated');
      } else {
        toast.error(res.error ?? 'Failed to update status');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteLead(deleteId);
      if (res.success) {
        setLeads((prev) => prev.filter((l) => l.id !== deleteId));
        toast.success('Lead deleted');
        setDeleteId(null);
      } else {
        toast.error(res.error ?? 'Failed to delete lead');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete lead');
    } finally {
      setIsDeleting(false);
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
        <p className="text-gray-500">Select a chatbot to view leads</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <span className="text-sm text-gray-500">{leads.length} total</span>
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

      {/* Filters */}
      <Card className="p-3 mb-4 shrink-0 space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-500 shrink-0">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
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
          <Button size="sm" className="h-8" onClick={handleApplyDateFilter}>
            <Filter className="w-3 h-3 mr-1" />
            Apply
          </Button>
          {(appliedFrom || appliedTo) && (
            <Button size="sm" variant="ghost" className="h-8 text-gray-400" onClick={handleClearDates}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Leads list */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {isLoading && leads.length === 0 ? (
            <>
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </>
          ) : loadError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-600 text-sm font-semibold mb-1">Failed to load leads</p>
              <p className="text-red-500 text-xs mb-3">{loadError}</p>
              <button onClick={loadLeads} className="text-xs text-red-600 underline">Retry</button>
            </div>
          ) : leads.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No leads captured yet
            </p>
          ) : (
            leads.map((lead) => (
              <Card
                key={lead.id}
                className="p-4 border-green-200 bg-green-50/40"
              >
                {/* Top row — name + badges + delete */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-semibold text-gray-900 text-sm">
                        {lead.name || 'Unknown'}
                      </span>
                    </div>
                    {/* Status badge + selector */}
                    <Select
                      value={lead.status}
                      onValueChange={(v) => handleStatusChange(lead, v as LeadStatus)}
                      disabled={updatingId === lead.id}
                    >
                      <SelectTrigger
                        className={cn(
                          'h-5 text-[11px] font-semibold px-2 py-0 rounded-full border-0 w-auto gap-1',
                          STATUS_STYLES[lead.status],
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Source badge */}
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium shrink-0">
                      {SOURCE_LABELS[lead.source] ?? lead.source}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                    onClick={() => setDeleteId(lead.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Contact info */}
                <div className="space-y-1 ml-1">
                  {lead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="text-gray-700 text-sm truncate">{lead.email}</span>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="text-gray-700 text-sm">{lead.phone}</span>
                    </div>
                  )}
                  {/* Additional info: intent / interest */}
                  {(lead.additionalInfo?.intent || lead.additionalInfo?.interest) && (
                    <div className="flex items-start gap-2 mt-1.5 pt-1.5 border-t border-green-100">
                      <Info className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        {lead.additionalInfo.intent && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Intent:</span>{' '}
                            {lead.additionalInfo.intent}
                          </p>
                        )}
                        {lead.additionalInfo.interest && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Interest:</span>{' '}
                            {lead.additionalInfo.interest}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Notes */}
                  {lead.notes && (
                    <div className="flex items-start gap-2 mt-1">
                      <Tag className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-500 italic">{lead.notes}</p>
                    </div>
                  )}
                </div>

                {/* Captured date */}
                <p className="text-gray-400 text-xs mt-2 ml-1">
                  {new Date(lead.capturedAt).toLocaleString()}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
