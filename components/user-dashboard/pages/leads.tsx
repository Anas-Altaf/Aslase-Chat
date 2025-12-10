'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, Mail, Phone, User, LinkIcon, Trash2 } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getLeads, deleteLead, exportLeads } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Lead } from '@/types';

export default function Leads() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cache leads per chatbot
  const leadsCache = useRef<Record<string, Lead[]>>({});
  const lastChatbotId = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedChatbot) return;
    if (selectedChatbot.id === lastChatbotId.current) return;

    lastChatbotId.current = selectedChatbot.id;

    if (leadsCache.current[selectedChatbot.id]) {
      setLeads(leadsCache.current[selectedChatbot.id]);
      return;
    }

    loadLeads();
  }, [selectedChatbot?.id]);

  const loadLeads = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const response = await getLeads(selectedChatbot.id);
      if (response.success) {
        setLeads(response.data.items);
        leadsCache.current[selectedChatbot.id] = response.data.items;
      }
    } catch (error) {
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot]);

  const handleDelete = async () => {
    if (!deleteId || !selectedChatbot) return;
    setIsDeleting(true);
    try {
      await deleteLead(deleteId);
      const updatedLeads = leads.filter(l => l.id !== deleteId);
      setLeads(updatedLeads);
      leadsCache.current[selectedChatbot.id] = updatedLeads;
      toast.success('Lead deleted');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete lead');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    if (!selectedChatbot) return;
    try {
      const response = await exportLeads(selectedChatbot.id);
      if (response.success) {
        toast.success('Export ready!');
      }
    } catch (error) {
      toast.error('Failed to export leads');
    }
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
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
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <Button variant="secondary" size="sm" onClick={handleExport}>
          Export
        </Button>
      </div>

      <Card className="p-4 mb-4 flex-shrink-0">
        <h3 className="text-gray-900 font-semibold mb-2 text-sm">Filters</h3>
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <Input type="text" placeholder="Select a Date Range" />
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <Button size="sm">Filter</Button>
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-gray-900 font-semibold mb-3 text-sm flex-shrink-0">Previous Leads</h3>
        <div className="space-y-3">
          {isLoading && leads.length === 0 ? (
            <>
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </>
          ) : leads.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No leads captured yet</p>
          ) : (
            leads.map((lead) => (
              <Card key={lead.id} className="p-4 border-green-200 bg-green-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium text-sm">{lead.message}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(lead.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setDeleteId(lead.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1 ml-6">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <p className="text-gray-900 font-medium text-sm">{lead.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{lead.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <p className="text-gray-700 text-sm truncate">{lead.email}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
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
    </div>
  );
}
