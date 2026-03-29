'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Trash2, FileText, Globe, AlignLeft, Loader2, Plus, X } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import {
  getSources,
  uploadDocuments,
  addTextSource,
  scrapeUrls,
  deleteSource,
  computeSourceStats,
} from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
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
import type { Source, SourceStats } from '@/types';

type Tab = 'files' | 'text' | 'websites';

const TYPE_LABELS: Record<Source['type'], string> = {
  document: 'FILE',
  text: 'TEXT',
  url: 'URL',
};

const TYPE_COLORS: Record<Source['type'], string> = {
  document: 'bg-blue-100 text-blue-700',
  text: 'bg-purple-100 text-purple-700',
  url: 'bg-green-100 text-green-700',
};

const TYPE_ICONS: Record<Source['type'], React.ReactNode> = {
  document: <FileText className="w-4 h-4 text-blue-500" />,
  text: <AlignLeft className="w-4 h-4 text-purple-500" />,
  url: <Globe className="w-4 h-4 text-green-500" />,
};

export default function Sources() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const [activeTab, setActiveTab] = useState<Tab>('files');
  const [sources, setSources] = useState<Source[]>([]);
  const [stats, setStats] = useState<SourceStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Files tab state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text tab state
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isSavingText, setIsSavingText] = useState(false);

  // Websites tab state
  const [urlsInput, setUrlsInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  const loadSources = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const res = await getSources(selectedChatbot.id);
      if (res.success) {
        setSources(res.data);
        setStats(computeSourceStats(res.data));
      } else {
        toast.error(res.error ?? 'Failed to load sources');
      }
    } catch {
      toast.error('Failed to load sources');
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot]);

  useEffect(() => {
    if (!selectedChatbot) { setSources([]); setStats(null); return; }
    loadSources();
  }, [selectedChatbot?.id]);

  // ── Files upload ────────────────────────────────────────────────────────────

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !selectedChatbot) return;

    setIsUploading(true);
    try {
      const res = await uploadDocuments(selectedChatbot.id, files);
      if (res.success) {
        toast.success(`${res.data.length} file(s) uploaded`);
        await loadSources();
      } else {
        toast.error(res.error ?? 'Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Text source ─────────────────────────────────────────────────────────────

  const handleSaveText = async () => {
    if (!textTitle.trim() || !textContent.trim() || !selectedChatbot) return;
    setIsSavingText(true);
    try {
      const res = await addTextSource(selectedChatbot.id, textTitle.trim(), textContent.trim());
      if (res.success) {
        toast.success('Text source added');
        setTextTitle('');
        setTextContent('');
        await loadSources();
      } else {
        toast.error(res.error ?? 'Failed to add text source');
      }
    } catch {
      toast.error('Failed to add text source');
    } finally {
      setIsSavingText(false);
    }
  };

  // ── URL scraping ────────────────────────────────────────────────────────────

  const handleScrape = async () => {
    if (!urlsInput.trim() || !selectedChatbot) return;
    const urls = urlsInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter(Boolean);
    if (!urls.length) return;

    setIsScraping(true);
    try {
      const res = await scrapeUrls(selectedChatbot.id, urls);
      if (res.success) {
        toast.success(`${res.data.length} URL(s) scraped and saved`);
        setUrlsInput('');
        await loadSources();
      } else {
        toast.error(res.error ?? 'Scraping failed');
      }
    } catch {
      toast.error('Scraping failed');
    } finally {
      setIsScraping(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteSource(deleteId);
      if (res.success) {
        toast.success('Source deleted');
        setDeleteId(null);
        await loadSources();
      } else {
        toast.error(res.error ?? 'Failed to delete source');
      }
    } catch {
      toast.error('Failed to delete source');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Early returns ───────────────────────────────────────────────────────────

  if (isInitialLoading) {
    return (
      <div className="flex gap-4 h-full">
        <div className="flex-1">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-10 mb-4" />
          <Skeleton className="h-32 mb-4" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="w-56 h-48 shrink-0" />
      </div>
    );
  }

  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to manage sources</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* Left Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 shrink-0">Data Sources</h1>
        <p className="text-gray-600 text-sm mb-4 shrink-0">
          Add training data for your chatbot
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 shrink-0 border-b border-gray-200">
          {(['files', 'text', 'websites'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-colors',
                activeTab === tab
                  ? 'bg-white border border-b-white border-gray-200 text-green-600 -mb-px'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {tab === 'files' ? 'Files' : tab === 'text' ? 'Text' : 'Websites'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* ── FILES TAB ── */}
          {activeTab === 'files' && (
            <div>
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
                  Drag & drop files, or{' '}
                  <span className="text-green-500 font-medium">Browse</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  PDF, DOC, DOCX — up to 10 files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
              </div>
            </div>
          )}

          {/* ── TEXT TAB ── */}
          {activeTab === 'text' && (
            <Card className="p-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="text-title">Title</Label>
                <Input
                  id="text-title"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder="e.g. Company FAQ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-content">Content</Label>
                <Textarea
                  id="text-content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste or type your text content here..."
                  rows={6}
                />
                <p className="text-xs text-gray-500 text-right">
                  {textContent.length.toLocaleString()} chars
                </p>
              </div>
              <Button
                onClick={handleSaveText}
                disabled={isSavingText || !textTitle.trim() || !textContent.trim()}
                className="w-full"
              >
                {isSavingText ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Plus className="w-4 h-4 mr-2" /> Add Text Source</>
                )}
              </Button>
            </Card>
          )}

          {/* ── WEBSITES TAB ── */}
          {activeTab === 'websites' && (
            <Card className="p-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="urls-input">URLs to scrape</Label>
                <Textarea
                  id="urls-input"
                  value={urlsInput}
                  onChange={(e) => setUrlsInput(e.target.value)}
                  placeholder={'https://example.com/about\nhttps://example.com/faq'}
                  rows={5}
                />
                <p className="text-xs text-gray-500">
                  One URL per line or comma-separated — up to 10 URLs
                </p>
              </div>
              <Button
                onClick={handleScrape}
                disabled={isScraping || !urlsInput.trim()}
                className="w-full"
              >
                {isScraping ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scraping...</>
                ) : (
                  <><Globe className="w-4 h-4 mr-2" /> Scrape URLs</>
                )}
              </Button>
            </Card>
          )}

          {/* ── ALL SOURCES LIST ── */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-2 text-sm">
              All Sources ({sources.length})
            </h3>
            <div className="space-y-2">
              {isLoading && sources.length === 0 ? (
                <>
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </>
              ) : sources.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No sources added yet
                </p>
              ) : (
                sources.map((src) => (
                  <Card
                    key={src.id}
                    className="flex items-center gap-3 p-3"
                  >
                    <span className="shrink-0">{TYPE_ICONS[src.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide',
                            TYPE_COLORS[src.type],
                          )}
                        >
                          {TYPE_LABELS[src.type]}
                        </span>
                        <p className="text-gray-900 text-sm font-medium truncate">
                          {src.title}
                        </p>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {src.characterCount.toLocaleString()} chars ·{' '}
                        {new Date(src.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                      onClick={() => setDeleteId(src.id)}
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

      {/* Right Section — Stats */}
      <Card className="w-52 flex flex-col shrink-0 bg-green-50 p-4 overflow-hidden self-start">
        <h3 className="text-gray-900 font-semibold mb-3 text-sm">Sources</h3>
        {stats ? (
          <>
            <p className="text-gray-600 text-xs mb-1">Total characters:</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalCharacters.toLocaleString()}
            </p>
            <p className="text-gray-600 text-xs mb-4">
              / {(stats.characterLimit / 1_000_000).toFixed(1)}M limit
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>{stats.fileCount} Files ({stats.fileCharacters.toLocaleString()} chars)</p>
              <p>Text ({stats.textCharacters.toLocaleString()} chars)</p>
              <p>{stats.urlCount} URLs ({stats.urlCharacters.toLocaleString()} chars)</p>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-xs">No data yet</p>
        )}
      </Card>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Source</DialogTitle>
            <DialogDescription>
              This will permanently remove the source and affect your chatbot's
              training data.
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
