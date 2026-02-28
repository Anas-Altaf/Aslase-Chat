'use client';

import { useState, useEffect } from 'react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getChatbotSettings, updateChatbotSettings } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function Security() {
  const { selectedChatbot } = useChatbot();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(20);
  const [requireEmailCapture, setRequireEmailCapture] = useState(false);

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
        setRateLimitPerMinute(response.data.rateLimitPerMinute);
        setRequireEmailCapture(response.data.requireEmailCapture);
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
      await updateChatbotSettings(selectedChatbot.id, {
        rateLimitPerMinute,
        requireEmailCapture,
      });
      toast.success('Security settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Security</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
            <Input
              id="rateLimit"
              type="number"
              value={rateLimitPerMinute}
              onChange={(e) => setRateLimitPerMinute(parseInt(e.target.value))}
              min={1}
              max={100}
            />
            <p className="text-xs text-gray-500">
              Maximum number of messages a user can send per minute
            </p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Require Email Capture</Label>
              <p className="text-xs text-gray-500">
                Ask users for their email before they can chat
              </p>
            </div>
            <Switch
              checked={requireEmailCapture}
              onCheckedChange={setRequireEmailCapture}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
