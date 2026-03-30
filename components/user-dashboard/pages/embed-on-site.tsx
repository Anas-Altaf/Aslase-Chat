'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Link } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { generateEmbedCode } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

function CopyBlock({
  label,
  code,
  description,
}: {
  label: string;
  code: string;
  description: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-4">
      <h3 className="text-gray-900 font-semibold mb-1 text-sm">{label}</h3>
      <p className="text-gray-500 text-xs mb-3">{description}</p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3">
        <code className="text-gray-900 text-xs flex-1 font-mono whitespace-pre-wrap break-all leading-relaxed">
          {code}
        </code>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <><Check className="w-4 h-4 mr-1" />Copied</>
          ) : (
            <><Copy className="w-4 h-4 mr-1" />Copy</>
          )}
        </Button>
      </div>
    </Card>
  );
}

export default function EmbedOnSite() {
  const { selectedChatbot } = useChatbot();
  const [origin, setOrigin] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  // Resolve origin client-side (window not available during SSR)
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to get embed codes</p>
      </div>
    );
  }

  const embedCode = generateEmbedCode(selectedChatbot.id, origin);

  const handleCopyShare = async () => {
    await navigator.clipboard.writeText(embedCode.shareUrl);
    setCopiedShare(true);
    toast.success('Share link copied!');
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-2xl font-bold text-gray-900 mb-1 shrink-0">Embed on Site</h1>
      <p className="text-xs text-gray-500 mb-4 shrink-0">
        Share or embed your chatbot anywhere
      </p>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Share link */}
        <Card className="p-4">
          <h3 className="text-gray-900 font-semibold mb-1 text-sm flex items-center gap-2">
            <Link className="w-4 h-4 text-green-500" />
            Share Link
          </h3>
          <p className="text-gray-500 text-xs mb-3">
            Send this link to customers — they can chat directly in their browser.
          </p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={origin ? embedCode.shareUrl : 'Loading...'}
              className="text-sm font-mono flex-1"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyShare}
              disabled={!origin}
            >
              {copiedShare ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!origin}
              onClick={() => window.open(embedCode.shareUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        <CopyBlock
          label="iFrame Embed"
          description="Embed a full chat window in any page. Paste inside your <body>."
          code={origin ? embedCode.iframe : '<!-- loading... -->'}
        />

        <CopyBlock
          label="Chat Bubble Script"
          description="Adds a floating chat bubble to the bottom-right corner of your site."
          code={origin ? embedCode.script : '<!-- loading... -->'}
        />
      </div>
    </div>
  );
}
