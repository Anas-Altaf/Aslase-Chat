'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MessageCircle, Instagram, Send as SendIcon, Facebook, Globe, Mail,
  Plug, Check, Copy, Loader2, Trash2, AlertCircle,
} from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import {
  getChatwootConfig, connectChatwoot, disconnectChatwoot, chatwootWebhookUrl,
  type ChatwootConfig,
} from '@/lib/services/integrations.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Channels that flow through the single Chatwoot connection.
const CHANNELS = [
  { label: 'WhatsApp', icon: MessageCircle },
  { label: 'Messenger', icon: Facebook },
  { label: 'Instagram', icon: Instagram },
  { label: 'Telegram', icon: SendIcon },
  { label: 'Web & SMS', icon: Globe },
  { label: 'Email', icon: Mail },
];

export default function Integrations() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const [config, setConfig] = useState<ChatwootConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ baseUrl: '', accountId: '', apiAccessToken: '' });

  const load = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const res = await getChatwootConfig(selectedChatbot.id);
      if (res.success) setConfig(res.data);
      else toast.error(res.error ?? 'Failed to load integration');
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot]);

  useEffect(() => {
    if (!selectedChatbot) { setConfig(null); return; }
    load();
  }, [selectedChatbot?.id]);

  const openConfigure = () => {
    // Never prefill the secret — blank means "keep the saved token" on reconfigure.
    setForm({
      baseUrl: config?.baseUrl ?? 'https://app.chatwoot.com',
      accountId: config?.accountId ?? '',
      apiAccessToken: '',
    });
    setDialogOpen(true);
  };

  const handleConnect = async () => {
    if (!selectedChatbot) return;
    const needsToken = !config?.hasToken;
    if (!form.baseUrl.trim() || !form.accountId.trim() || (needsToken && !form.apiAccessToken.trim())) {
      toast.error(needsToken ? 'Please fill in all fields' : 'Chatwoot URL and Account ID are required');
      return;
    }
    setIsSaving(true);
    try {
      const res = await connectChatwoot({
        chatbotId: selectedChatbot.id,
        baseUrl: form.baseUrl,
        accountId: form.accountId,
        ...(form.apiAccessToken.trim() ? { apiAccessToken: form.apiAccessToken.trim() } : {}),
      });
      if (res.success) {
        setConfig(res.data);
        setDialogOpen(false);
        toast.success('Chatwoot connected — copy the webhook URL into your Agent Bot');
      } else {
        toast.error(res.error ?? 'Failed to connect');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!selectedChatbot) return;
    setIsDisconnecting(true);
    try {
      const res = await disconnectChatwoot(selectedChatbot.id);
      if (res.success) {
        setConfig({ connected: false, chatbotId: selectedChatbot.id });
        toast.success('Chatwoot disconnected');
      } else {
        toast.error(res.error ?? 'Failed to disconnect');
      }
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Prefer the backend's absolute public URL (set via PUBLIC_BASE_URL); otherwise
  // compose from the browser API base (fine when they're the same public host).
  const webhookUrl = config?.webhookUrl || (config?.webhookToken ? chatwootWebhookUrl(config.webhookToken) : '');

  const copyWebhook = () => {
    if (!webhookUrl) return;
    navigator.clipboard?.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to manage integrations</p>
      </div>
    );
  }

  const connected = config?.connected && config?.isActive;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-1 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
      </div>
      <p className="text-gray-600 text-sm mb-4 shrink-0">
        Connect <span className="font-medium">{selectedChatbot.name}</span> to social channels through one omnichannel gateway.
      </p>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Chatwoot omnichannel card */}
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-green-100">
                <Plug className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Chatwoot Omnichannel
                  {connected ? (
                    <Badge className="bg-green-100 text-green-700 gap-1"><Check className="w-3 h-3" /> Connected</Badge>
                  ) : (
                    <Badge variant="secondary">Not connected</Badge>
                  )}
                </h2>
                <p className="text-sm text-gray-500">
                  One connection routes WhatsApp, Messenger, Instagram, Telegram & more into this chatbot.
                </p>
              </div>
            </div>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : connected ? (
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={openConfigure}>Reconfigure</Button>
                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDisconnect} disabled={isDisconnecting}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={openConfigure} className="shrink-0">
                <Plug className="w-4 h-4 mr-1.5" /> Connect
              </Button>
            )}
          </div>

          {/* Covered channels */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CHANNELS.map((c) => {
              const Icon = c.icon;
              return (
                <span key={c.label} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  <Icon className="w-3.5 h-3.5" /> {c.label}
                </span>
              );
            })}
          </div>

          {/* Webhook URL — shown once connected */}
          {connected && webhookUrl && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-gray-700">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Add this in Chatwoot → Settings → Integrations → Webhooks (subscribe to <code className="font-mono">message_created</code>)
              </div>
              <div className="flex gap-2">
                <code className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1.5 font-mono truncate text-gray-700">
                  {webhookUrl}
                </code>
                <Button size="sm" variant="outline" onClick={copyWebhook} className="shrink-0">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Setup steps */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">How it works</h3>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>In Chatwoot, connect your social inboxes (WhatsApp, Instagram, Messenger, Telegram…).</li>
            <li>Enter your Chatwoot URL, Account ID and a Profile access token here, then <span className="font-medium">Connect</span>.</li>
            <li>In Chatwoot → <span className="font-medium">Settings → Integrations → Webhooks</span>, add the webhook URL above and subscribe to <code className="font-mono">message_created</code>.</li>
            <li>Incoming messages on any channel are answered by this chatbot automatically — replies, leads and queries flow into your dashboard.</li>
          </ol>
        </Card>
      </div>

      {/* Connect / configure dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Chatwoot</DialogTitle>
            <DialogDescription>
              From Chatwoot: Profile → Access Token, and your Account ID is in the dashboard URL (/accounts/<b>ID</b>).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cw-url">Chatwoot URL</Label>
              <Input id="cw-url" value={form.baseUrl} onChange={(e) => setForm({ ...form, baseUrl: e.target.value })} placeholder="https://app.chatwoot.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cw-account">Account ID</Label>
              <Input id="cw-account" value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })} placeholder="e.g. 1" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cw-token">
                Access Token{config?.hasToken && <span className="text-xs text-gray-400 font-normal"> (saved)</span>}
              </Label>
              <Input id="cw-token" type="password" value={form.apiAccessToken} onChange={(e) => setForm({ ...form, apiAccessToken: e.target.value })} placeholder={config?.hasToken ? 'Leave blank to keep current token' : 'Chatwoot access token'} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConnect} disabled={isSaving}>
              {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</> : 'Connect'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
