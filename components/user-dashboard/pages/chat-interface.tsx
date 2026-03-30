'use client';

import { useState, useEffect } from 'react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getChatbotSettings, updateChatbotSettings } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { ChatbotSettings } from '@/types';

export default function ChatInterface() {
  const { selectedChatbot } = useChatbot();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#22c55e');

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
        setWelcomeMessage(response.data.welcomeMessage ?? '');
        setPlaceholder(response.data.placeholder ?? '');
        setPrimaryColor(response.data.primaryColor ?? '#22c55e');
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
        welcomeMessage,
        placeholder,
        primaryColor,
      });
      toast.success('Chat interface settings saved');
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
        <h1 className="text-2xl font-bold text-gray-900">Chat Interface</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Enter the first message your chatbot will show"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">Input Placeholder</Label>
            <Input
              id="placeholder"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="e.g., Type your message..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-200/50 cursor-pointer"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32 font-mono"
              />
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-4">
          <h3 className="text-gray-900 font-semibold mb-3 text-sm">Preview</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="mb-3">
              <div
                className="inline-block px-3 py-2 rounded-lg text-white text-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {welcomeMessage || 'Hi! How can I help you today?'}
              </div>
            </div>
            <div className="border rounded-lg p-2 bg-white text-gray-400 text-sm">
              {placeholder || 'Type your message...'}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
