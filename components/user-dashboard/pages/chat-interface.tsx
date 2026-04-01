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

          <div className="space-y-3">
            <Label>Primary Color</Label>
            <div className="flex flex-wrap gap-2">
              {['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#64748b'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPrimaryColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: primaryColor === c ? '#111827' : 'transparent',
                    outline: primaryColor === c ? '2px solid #111827' : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32 font-mono text-sm"
                placeholder="#22c55e"
              />
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-4">
          <h3 className="text-gray-900 font-semibold mb-3 text-sm">Live Preview</h3>
          <div className="flex justify-center">
            <div className="w-72 rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3z" />
                  </svg>
                </div>
                <span className="text-white text-sm font-semibold">{selectedChatbot?.name ?? 'Assistant'}</span>
              </div>
              {/* Chat area */}
              <div className="bg-gray-50 p-3 space-y-2 min-h-30">
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl rounded-tl-sm text-white text-xs max-w-[80%]" style={{ backgroundColor: primaryColor }}>
                    {welcomeMessage || 'Hi! How can I help you today?'}
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="px-3 py-2 rounded-2xl rounded-tr-sm bg-white border border-gray-200 text-gray-800 text-xs max-w-[80%] shadow-sm">
                    Hello!
                  </div>
                </div>
              </div>
              {/* Input */}
              <div className="bg-white px-3 py-2 border-t border-gray-100 flex items-center gap-2">
                <span className="flex-1 text-xs text-gray-400 truncate">{placeholder || 'Type your message...'}</span>
                <button className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: primaryColor }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
