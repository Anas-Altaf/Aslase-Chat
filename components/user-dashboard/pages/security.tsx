'use client';

import { useState, useEffect } from 'react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getChatbotSettings, updateChatbotSettings } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function Security() {
  const { selectedChatbot } = useChatbot();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Existing
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(20);
  const [requireEmailCapture, setRequireEmailCapture] = useState(false);

  // New — Content Control
  const [maxMessageLength, setMaxMessageLength] = useState(500);
  const [blockedKeywordsRaw, setBlockedKeywordsRaw] = useState('');
  const [profanityFilter, setProfanityFilter] = useState(false);

  // New — Bot Behavior
  const [topicRestrictions, setTopicRestrictions] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState('');
  const [contextWindowMessages, setContextWindowMessages] = useState(10);

  useEffect(() => {
    if (selectedChatbot) loadSettings();
  }, [selectedChatbot]);

  const loadSettings = async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const res = await getChatbotSettings(selectedChatbot.id);
      if (res.success && res.data) {
        const s = res.data;
        setRateLimitPerMinute(s.rateLimitPerMinute ?? 20);
        setRequireEmailCapture(s.requireEmailCapture ?? false);
        setMaxMessageLength(s.maxMessageLength ?? 500);
        setBlockedKeywordsRaw((s.blockedKeywords ?? []).join(', '));
        setProfanityFilter(s.profanityFilter ?? false);
        setTopicRestrictions(s.topicRestrictions ?? '');
        setFallbackMessage(s.fallbackMessage ?? '');
        setContextWindowMessages(s.contextWindowMessages ?? 10);
      }
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedChatbot) return;
    setIsSaving(true);
    try {
      const blockedKeywords = blockedKeywordsRaw
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      await updateChatbotSettings(selectedChatbot.id, {
        rateLimitPerMinute,
        requireEmailCapture,
        maxMessageLength,
        blockedKeywords,
        profanityFilter,
        topicRestrictions,
        fallbackMessage,
        contextWindowMessages,
      });
      toast.success('Tuning settings saved');
    } catch {
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
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Tuning</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* ── Rate Limiting ── */}
        <Card className="p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Rate Limiting</h3>
          <div className="space-y-2">
            <Label htmlFor="rateLimit">Messages per minute</Label>
            <Input
              id="rateLimit"
              type="number"
              value={rateLimitPerMinute}
              onChange={(e) => setRateLimitPerMinute(parseInt(e.target.value) || 1)}
              min={1}
              max={100}
              className="w-32"
            />
            <p className="text-xs text-gray-500">Max messages a user can send per minute (1–100)</p>
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <Label>Require Email Before Chat</Label>
              <p className="text-xs text-gray-500 mt-0.5">Ask visitors for their email before they can start chatting</p>
            </div>
            <Switch checked={requireEmailCapture} onCheckedChange={setRequireEmailCapture} />
          </div>
        </Card>

        {/* ── Content Control ── */}
        <Card className="p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Content Control</h3>
          <div className="space-y-2">
            <Label htmlFor="maxMsgLen">Max Message Length (characters)</Label>
            <Input
              id="maxMsgLen"
              type="number"
              value={maxMessageLength}
              onChange={(e) => setMaxMessageLength(parseInt(e.target.value) || 50)}
              min={50}
              max={2000}
              className="w-40"
            />
            <p className="text-xs text-gray-500">Messages longer than this will be rejected (50–2000)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="blockedKeywords">Blocked Keywords</Label>
            <Textarea
              id="blockedKeywords"
              value={blockedKeywordsRaw}
              onChange={(e) => setBlockedKeywordsRaw(e.target.value)}
              placeholder="spam, competitor, refund (comma-separated)"
              rows={2}
            />
            <p className="text-xs text-gray-500">
              Comma-separated words. If a message contains any of these, the bot returns the fallback message instead.
            </p>
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <Label>Profanity Filter</Label>
              <p className="text-xs text-gray-500 mt-0.5">Automatically block messages with profanity</p>
            </div>
            <Switch checked={profanityFilter} onCheckedChange={setProfanityFilter} />
          </div>
        </Card>

        {/* ── Bot Behavior ── */}
        <Card className="p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Bot Behavior</h3>
          <div className="space-y-2">
            <Label htmlFor="topicRestrictions">Topic Restrictions</Label>
            <Textarea
              id="topicRestrictions"
              value={topicRestrictions}
              onChange={(e) => setTopicRestrictions(e.target.value)}
              placeholder="Only answer questions about our products and services. Do not discuss competitors or pricing of other companies."
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Describe what the bot should and shouldn't discuss. This is added to the system prompt.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fallbackMessage">Custom Fallback Message</Label>
            <Textarea
              id="fallbackMessage"
              value={fallbackMessage}
              onChange={(e) => setFallbackMessage(e.target.value)}
              placeholder="I'm sorry, I don't have information about that. Please contact our support team."
              rows={2}
            />
            <p className="text-xs text-gray-500">
              Shown when a blocked keyword is detected or the bot can't answer
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Context Window ({contextWindowMessages} messages)</Label>
            </div>
            <Slider
              value={[contextWindowMessages]}
              onValueChange={([v]) => setContextWindowMessages(v)}
              min={5}
              max={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>5 (faster)</span>
              <span>50 (more context)</span>
            </div>
            <p className="text-xs text-gray-500">
              How many previous messages the bot remembers. More context = better replies but higher cost.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
