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

export default function Notifications() {
  const { selectedChatbot } = useChatbot();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

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
        setEmailNotifications(response.data.emailNotifications);
        setNotificationEmail(response.data.notificationEmail);
        setWebhookUrl(response.data.webhookUrl);
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
        emailNotifications,
        notificationEmail,
        webhookUrl,
      });
      toast.success('Notification settings saved');
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
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-xs text-gray-500">
                Receive email when a new lead is captured
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          {emailNotifications && (
            <div className="space-y-2">
              <Label htmlFor="notificationEmail">Notification Email</Label>
              <Input
                id="notificationEmail"
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          )}
        </Card>

        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-server.com/webhook"
            />
            <p className="text-xs text-gray-500">
              We'll send a POST request to this URL when events occur
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
