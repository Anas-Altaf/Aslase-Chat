'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, FileText, Loader2 } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getSources, getSourceStats, uploadSource, deleteSource } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import type { Source, SourceStats } from '@/types';

export default function Sources() {
  const { selectedChatbot } = useChatbot();
  const [sources, setSources] = useState<Source[]>([]);
  const [stats, setStats] = useState<SourceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedChatbot) {
      loadData();
    }
  }, [selectedChatbot]);

  const loadData = async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const [sourcesRes, statsRes] = await Promise.all([
        getSources(selectedChatbot.id),
        getSourceStats(selectedChatbot.id),
      ]);
      if (sourcesRes.success) setSources(sourcesRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load sources');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChatbot) return;

    setIsUploading(true);
    try {
      const content = await file.text();
      const response = await uploadSource(selectedChatbot.id, {
        name: file.name,
        content,
      });
      if (response.success) {
        toast.success('File uploaded successfully');
        loadData();
      }
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteSource(deleteId);
      setSources(prev => prev.filter(s => s.id !== deleteId));
      toast.success('Source deleted');
      setDeleteId(null);
      loadData(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete source');
    } finally {
      setIsDeleting(false);
    }
  };

  const files = sources.filter(s => s.type === 'file');

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* Left Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 flex-shrink-0">Data Sources</h1>
        <p className="text-gray-600 text-sm mb-4 flex-shrink-0">Add your data sources to train your chatbot</p>

        <div className="flex-1 overflow-y-auto space-y-4">
          <div>
            <h3 className="text-gray-900 font-semibold mb-2 text-sm">Files</h3>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-green-500 mx-auto mb-2 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-green-500 mx-auto mb-2" />
              )}
              <p className="text-gray-700 text-sm">
                Drag & drop your files here, or{' '}
                <span className="text-green-500 font-medium">Browse</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">Supports .txt, .pdf, .doc files</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-2 text-sm">Uploaded Files</h3>
            <div className="space-y-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </>
              ) : files.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No files uploaded yet</p>
              ) : (
                files.map((file) => (
                  <Card key={file.id} className="flex items-center gap-3 p-3">
                    <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-sm font-medium truncate">{file.name}</p>
                      <p className="text-gray-500 text-xs">{file.characterCount.toLocaleString()} chars</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteId(file.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Sources Info */}
      <Card className="w-56 flex flex-col flex-shrink-0 bg-green-50 p-4 overflow-hidden">
        <h3 className="text-gray-900 font-semibold mb-3 text-sm">Sources</h3>
        {isLoading ? (
          <>
            <Skeleton className="h-10 mb-2" />
            <Skeleton className="h-4 mb-4" />
            <Skeleton className="h-20" />
          </>
        ) : stats && (
          <>
            <p className="text-gray-600 text-xs mb-1">Total detected characters:</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalCharacters.toLocaleString()}
            </p>
            <p className="text-gray-600 text-xs mb-4">
              / {stats.characterLimit.toLocaleString()} limit
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>{stats.fileCount} Files ({stats.fileCharacters.toLocaleString()} chars)</p>
              <p>{stats.qnaCount} Q&A ({stats.qnaCharacters.toLocaleString()} chars)</p>
              <p>Text ({stats.textCharacters.toLocaleString()} chars)</p>
            </div>
          </>
        )}
      </Card>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Source</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this source? This will affect your chatbot's training data.
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
