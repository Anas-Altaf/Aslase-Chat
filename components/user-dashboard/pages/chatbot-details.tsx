'use client';

import { useState } from 'react';
import { Send, Copy, RotateCcw, RefreshCw, Check } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { trainChatbot } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ChatbotDetails() {
  const { selectedChatbot, isInitialLoading, editChatbot } = useChatbot();
  const [copied, setCopied] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hi! How can I help?' },
  ]);

  const handleCopyId = async () => {
    if (selectedChatbot) {
      await navigator.clipboard.writeText(selectedChatbot.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRetrain = async () => {
    if (!selectedChatbot) return;
    setIsTraining(true);
    try {
      const response = await trainChatbot(selectedChatbot.id);
      if (response.success) {
        await editChatbot(selectedChatbot.id, {
          status: 'trained',
          lastTrainedAt: new Date().toISOString(),
        });
        toast.success('Chatbot retrained successfully!');
      }
    } catch (error) {
      toast.error('Failed to retrain chatbot');
    } finally {
      setIsTraining(false);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: 'This is a sample response. In production, this would call your AI model.' },
    ]);
    setMessage('');
  };

  // Only show skeleton on initial app load, not on chatbot switch
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to view details</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full overflow-hidden">
      {/* Left Section - Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Section - Title and Details */}
        <div className="flex justify-between items-start mb-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900">{selectedChatbot.name}</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRetrain}
              disabled={isTraining}
            >
              <RotateCcw className={`w-5 h-5 text-gray-600 ${isTraining ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
          {/* Left Column - Chatbot Details */}
          <Card className="p-4 space-y-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Chatbot ID</p>
              <div className="flex items-center gap-2">
                <code className="text-gray-900 font-mono text-sm font-semibold">{selectedChatbot.id}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyId}>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">No. of Characters</p>
              <p className="text-gray-900 font-semibold">{selectedChatbot.characterCount.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">Visibility</p>
              <p className="text-gray-900 font-semibold capitalize">{selectedChatbot.visibility}</p>
            </div>
          </Card>

          {/* Right Column - Model Info */}
          <Card className="p-4 space-y-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Model</p>
              <p className="text-gray-900 font-semibold">{selectedChatbot.model.toUpperCase()}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">Status</p>
              <Badge
                variant={selectedChatbot.status === 'trained' ? 'success' : selectedChatbot.status === 'training' ? 'warning' : 'destructive'}
              >
                {selectedChatbot.status.charAt(0).toUpperCase() + selectedChatbot.status.slice(1)}
              </Badge>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">Last Trained At</p>
              <p className="text-gray-900 text-sm">
                {selectedChatbot.lastTrainedAt
                  ? new Date(selectedChatbot.lastTrainedAt).toLocaleString()
                  : 'Never'
                }
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Section - Chat Interface */}
      <div className="w-80 flex flex-col flex-shrink-0 overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex-shrink-0">Chatbot</h2>
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 space-y-3 mb-3 overflow-y-auto p-3">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs text-sm ${msg.role === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-3 flex-shrink-0 border-t">
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
        <p className="text-right text-gray-500 text-xs mt-2 flex-shrink-0">Powered by AslasChat</p>
      </div>
    </div>
  );
}
