'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getChatbotSettings, updateChatbotSettings } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { ChatbotSettings } from '@/types';

export default function General() {
  const { selectedChatbot, editChatbot } = useChatbot();
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (selectedChatbot) {
      loadSettings();
    }
  }, [selectedChatbot]);

  const loadSettings = async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const response = await getChatbotSettings(selectedChatbot.id);
      if (response.success && response.data) {
        setSettings(response.data);
        setName(response.data.name);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedChatbot) return;
    setIsSaving(true);
    try {
      await updateChatbotSettings(selectedChatbot.id, { name });
      await editChatbot(selectedChatbot.id, { name });
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyId = async () => {
    if (selectedChatbot) {
      await navigator.clipboard.writeText(selectedChatbot.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24" />
        <Skeleton className="h-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">General</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Chatbot ID</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={selectedChatbot?.id || ''}
                  readOnly
                  className="bg-gray-50 font-mono text-sm"
                />
                <Button variant="ghost" size="icon" onClick={handleCopyId}>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>No. of Characters</Label>
              <Input
                value={selectedChatbot?.characterCount.toLocaleString() || '0'}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter chatbot name"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
