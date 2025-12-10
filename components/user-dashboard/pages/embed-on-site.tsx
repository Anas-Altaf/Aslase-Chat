'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { generateEmbedCode } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function EmbedOnSite() {
  const { selectedChatbot } = useChatbot();
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const embedCode = selectedChatbot
    ? generateEmbedCode(selectedChatbot.id)
    : { iframe: '', script: '' };

  const handleCopyIframe = async () => {
    await navigator.clipboard.writeText(embedCode.iframe);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
  };

  const handleCopyScript = async () => {
    await navigator.clipboard.writeText(embedCode.script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to get embed codes</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 flex-shrink-0">Embed on Site</h1>

      <div className="flex-1 overflow-y-auto space-y-6">
        <Card className="p-4">
          <h3 className="text-gray-900 font-semibold mb-2 text-sm">iFrame Embed</h3>
          <p className="text-gray-600 text-sm mb-3">
            Add this iframe to your HTML to embed the chatbot anywhere on your website.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3">
            <code className="text-gray-900 text-xs flex-1 font-mono break-all whitespace-pre-wrap">
              {embedCode.iframe}
            </code>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyIframe}
              className="flex-shrink-0"
            >
              {copiedIframe ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-gray-900 font-semibold mb-2 text-sm">Chat Bubble Script</h3>
          <p className="text-gray-600 text-sm mb-3">
            Add this script to show a chat bubble in the bottom right corner of your website.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3">
            <code className="text-gray-900 text-xs flex-1 font-mono break-all whitespace-pre-wrap">
              {embedCode.script}
            </code>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyScript}
              className="flex-shrink-0"
            >
              {copiedScript ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
