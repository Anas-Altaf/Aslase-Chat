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
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PRESET_COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#64748b'];

const AVATAR_EMOJIS = ['🤖', '🧠', '💬', '⚡', '🌟', '🎯', '🦾', '🤝', '💡', '🚀', '🛎️', '🧑‍💼', '👾', '🐉', '🦉', '🐬', '🌈', '🔮', '🎪', '🏆'];

export default function ChatInterface() {
  const { selectedChatbot } = useChatbot();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Basic
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#22c55e');

  // Appearance
  const [avatarEmoji, setAvatarEmoji] = useState('🤖');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('sm');

  // Behavior
  const [showTypingIndicator, setShowTypingIndicator] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(true);

  // Visual style
  const [bubbleStyle, setBubbleStyle] = useState<'rounded' | 'squared'>('rounded');
  const [chatBgColor, setChatBgColor] = useState('#f9fafb');

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
        setWelcomeMessage(s.welcomeMessage ?? '');
        setPlaceholder(s.placeholder ?? '');
        setPrimaryColor(s.primaryColor ?? '#22c55e');
        setAvatarEmoji(s.avatarEmoji ?? '🤖');
        setAvatarUrl(s.avatarUrl ?? '');
        setFontSize(s.fontSize ?? 'sm');
        setShowTypingIndicator(s.showTypingIndicator ?? true);
        setShowTimestamps(s.showTimestamps ?? true);
        setBubbleStyle(s.bubbleStyle ?? 'rounded');
        setChatBgColor(s.chatBgColor ?? '#f9fafb');
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
      await updateChatbotSettings(selectedChatbot.id, {
        welcomeMessage,
        placeholder,
        primaryColor,
        avatarEmoji,
        avatarUrl,
        fontSize,
        showTypingIndicator,
        showTimestamps,
        bubbleStyle,
        chatBgColor,
      });
      toast.success('Chat interface settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    // Keep logos small — they're stored inline as a data URL in settings.
    if (file.size > 300 * 1024) {
      toast.error('Logo must be under 300 KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => toast.error('Failed to read image');
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  const bubbleRadius = bubbleStyle === 'rounded' ? 'rounded-2xl' : 'rounded-lg';
  const fontClass = fontSize === 'base' ? 'text-base' : fontSize === 'lg' ? 'text-lg' : 'text-sm';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Chat Interface</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* ── Messaging ── */}
        <Card className="p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Messaging</h3>
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Hi! How can I help you today?"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeholder">Input Placeholder</Label>
            <Input
              id="placeholder"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Type your message..."
            />
          </div>
        </Card>

        {/* ── Colors ── */}
        <Card className="p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Colors</h3>
          <div className="space-y-3">
            <Label>Primary Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
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
          <div className="space-y-3">
            <Label>Chat Background Color</Label>
            <div className="flex flex-wrap gap-2">
              {['#f9fafb', '#f0fdf4', '#eff6ff', '#fdf4ff', '#fff7ed', '#fefce8', '#ffffff'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChatBgColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: chatBgColor === c ? '#111827' : '#e5e7eb',
                    outline: chatBgColor === c ? '2px solid #111827' : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
              <input
                type="color"
                value={chatBgColor}
                onChange={(e) => setChatBgColor(e.target.value)}
                className="w-7 h-7 rounded-full border border-gray-200 cursor-pointer p-0"
                title="Custom background color"
              />
            </div>
          </div>
        </Card>

        {/* ── Bot Appearance ── */}
        <Card className="p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Bot Appearance</h3>

          {/* Logo upload — overrides the emoji avatar when set */}
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{avatarEmoji}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  {avatarUrl ? 'Change logo' : 'Upload logo'}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {avatarUrl && (
                  <Button type="button" size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => setAvatarUrl('')}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">PNG/JPG/SVG up to 300 KB. Overrides the emoji avatar.</p>
          </div>

          <div className="space-y-2">
            <Label>Avatar Emoji</Label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setAvatarEmoji(e)}
                  className={cn(
                    'w-9 h-9 rounded-lg text-lg flex items-center justify-center border-2 transition-all',
                    avatarEmoji === e
                      ? 'border-green-500 bg-green-50 shadow-sm'
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50',
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Font Size</Label>
            <div className="flex gap-2">
              {(['sm', 'base', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFontSize(s)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg border text-sm font-medium transition-all',
                    fontSize === s
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300',
                  )}
                >
                  {s === 'sm' ? 'Small' : s === 'base' ? 'Medium' : 'Large'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bubble Style</Label>
            <div className="flex gap-2">
              {(['rounded', 'squared'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setBubbleStyle(s)}
                  className={cn(
                    'px-4 py-1.5 border text-sm font-medium transition-all',
                    s === 'rounded' ? 'rounded-2xl' : 'rounded-lg',
                    bubbleStyle === s
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300',
                  )}
                >
                  {s === 'rounded' ? 'Rounded' : 'Squared'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ── Behavior ── */}
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Behavior</h3>
          <div className="flex items-center justify-between py-1">
            <div>
              <Label>Show Typing Indicator</Label>
              <p className="text-xs text-gray-500 mt-0.5">Display animated dots while bot is processing</p>
            </div>
            <Switch checked={showTypingIndicator} onCheckedChange={setShowTypingIndicator} />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <Label>Show Timestamps</Label>
              <p className="text-xs text-gray-500 mt-0.5">Display time below each message</p>
            </div>
            <Switch checked={showTimestamps} onCheckedChange={setShowTimestamps} />
          </div>
        </Card>

        {/* ── Preview ── */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Live Preview</h3>
          <div className="flex justify-center">
            <div className="w-72 rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-lg overflow-hidden">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    avatarEmoji
                  )}
                </div>
                <span className="text-white text-sm font-semibold">{selectedChatbot?.name ?? 'Assistant'}</span>
              </div>
              <div className="p-3 space-y-2 min-h-28" style={{ backgroundColor: chatBgColor }}>
                <div className="flex justify-start">
                  <div
                    className={cn('px-3 py-2 text-white max-w-[80%]', fontClass, bubbleRadius, 'rounded-tl-sm')}
                    style={{ backgroundColor: primaryColor }}
                  >
                    {welcomeMessage || 'Hi! How can I help you today?'}
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className={cn('px-3 py-2 bg-white border border-gray-200 text-gray-800 max-w-[80%] shadow-sm', fontClass, bubbleRadius, 'rounded-tr-sm')}>
                    Hello!
                  </div>
                </div>
                {showTypingIndicator && (
                  <div className="flex gap-1 items-center py-1 pl-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
              <div className="bg-white px-3 py-2 border-t border-gray-100 flex items-center gap-2">
                <span className={cn('flex-1 text-gray-400 truncate', fontClass)}>{placeholder || 'Type your message...'}</span>
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
