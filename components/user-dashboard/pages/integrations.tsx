'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  MessageCircle, Instagram, Send as SendIcon, Facebook, Linkedin,
  Check, Loader2, Trash2, ExternalLink, RefreshCw,
} from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import {
  getUnipileAccounts, connectUnipile, disconnectUnipile,
  type UnipileAccount, type UnipileProvider,
} from '@/lib/services/integrations.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const CHANNELS: { key: UnipileProvider; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: 'WHATSAPP', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-600 bg-green-100' },
  { key: 'INSTAGRAM', label: 'Instagram', icon: Instagram, color: 'text-pink-600 bg-pink-100' },
  { key: 'MESSENGER', label: 'Messenger', icon: Facebook, color: 'text-blue-600 bg-blue-100' },
  { key: 'TELEGRAM', label: 'Telegram', icon: SendIcon, color: 'text-sky-600 bg-sky-100' },
  { key: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin, color: 'text-indigo-600 bg-indigo-100' },
];

export default function Integrations() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [accounts, setAccounts] = useState<UnipileAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const res = await getUnipileAccounts(selectedChatbot.id);
      if (res.success) setAccounts(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot]);

  useEffect(() => {
    if (!selectedChatbot) { setAccounts([]); return; }
    load();
  }, [selectedChatbot?.id]);

  // Returning from the Unipile hosted wizard (?connected=1|0). The notify_url
  // callback can lag many seconds, so poll until the connection lands.
  useEffect(() => {
    const c = searchParams.get('connected');
    if (c === null || !selectedChatbot) return;
    if (c === '1') toast.success('Finishing connection…');
    else toast.error('Connection cancelled or failed');
    router.replace('/user-dashboard/integrations');
    if (c !== '1') { load(); return; }

    const chatbotId = selectedChatbot.id;
    let tries = 0;
    const poll = setInterval(async () => {
      tries += 1;
      const res = await getUnipileAccounts(chatbotId);
      if (res.success) {
        setAccounts(res.data);
        if (res.data.some((a) => a.connected)) { clearInterval(poll); toast.success('Channel connected!'); }
      }
      if (tries >= 12) clearInterval(poll); // ~36s
    }, 3000);
    return () => clearInterval(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, selectedChatbot?.id]);

  // Re-check when the tab regains focus (e.g. after connecting in another tab).
  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [load]);

  const connectedFor = (key: UnipileProvider) =>
    accounts.find((a) => a.connected && (a.provider === key || (a.accountType ?? '').toUpperCase().includes(key)));

  const handleConnect = async (provider: UnipileProvider) => {
    if (!selectedChatbot) return;
    setConnecting(provider);
    try {
      const res = await connectUnipile(selectedChatbot.id, provider);
      if (res.success && res.data.url) {
        window.location.href = res.data.url; // hand off to Unipile's hosted wizard
      } else {
        toast.error(res.error ?? 'Could not start connection');
        setConnecting(null);
      }
    } catch {
      toast.error('Could not start connection');
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!selectedChatbot) return;
    setDisconnecting(accountId);
    try {
      const res = await disconnectUnipile(selectedChatbot.id, accountId);
      if (res.success) {
        setAccounts((prev) => prev.filter((a) => a.id !== accountId));
        toast.success('Disconnected');
      } else {
        toast.error(res.error ?? 'Failed to disconnect');
      }
    } finally {
      setDisconnecting(null);
    }
  };

  if (isInitialLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-48" /></div>;
  }
  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to manage integrations</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-1 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <Button size="sm" variant="outline" onClick={load} disabled={isLoading} className="gap-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>
      <p className="text-gray-600 text-sm mb-4 shrink-0">
        Connect <span className="font-medium">{selectedChatbot.name}</span> to your social channels — pick a channel below; messages are answered automatically.
      </p>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 max-w-2xl">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            const acc = connectedFor(ch.key);
            const isConnecting = connecting === ch.key;
            const isDisc = acc ? disconnecting === acc.id : false;
            return (
              <Card key={ch.key} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${ch.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ch.label}</p>
                    {acc ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Not connected</span>
                    )}
                  </div>
                </div>

                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : acc ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 hidden sm:inline-flex">Active</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDisconnect(acc.id)}
                      disabled={isDisc}
                    >
                      {isDisc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => handleConnect(ch.key)} disabled={isConnecting}>
                    {isConnecting
                      ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Opening…</>
                      : <><ExternalLink className="w-4 h-4 mr-1.5" /> Connect</>}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 mt-4 max-w-2xl">
          Clicking Connect takes you to a secure wizard to link your own account. You can connect several channels — each one&rsquo;s messages are handled by this chatbot, and leads/queries appear in your dashboard tagged with the channel.
        </p>
      </div>
    </div>
  );
}
