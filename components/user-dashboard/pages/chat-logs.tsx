'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Filter, Calendar, MessageCircle, User } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getChatSessions, exportChatSessions, sendChatMessage } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { ChatSession } from '@/types';

export default function ChatLogs() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hi! How can I help?' },
  ]);

  // Load sessions when chatbot changes
  useEffect(() => {
    if (!selectedChatbot) {
      setSessions([]);
      return;
    }
    
    loadSessions();
  }, [selectedChatbot?.id]);

  const loadSessions = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const response = await getChatSessions(selectedChatbot.id, {
        source: sourceFilter === 'all' ? undefined : sourceFilter,
      });
      if (response.success) {
        setSessions(response.data.items);
      }
    } catch (error) {
      toast.error('Failed to load chat sessions');
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot, sourceFilter]);

  const handleFilter = () => {
    loadSessions();
  };

  const handleExport = async () => {
    if (!selectedChatbot) return;
    setIsExporting(true);
    try {
      const response = await exportChatSessions(selectedChatbot.id);
      if (response.success) {
        toast.success('Export ready! Download link: ' + response.data);
      }
    } catch (error) {
      toast.error('Failed to export chat logs');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChatbot || isSending) return;
    
    const userMessage = message.trim();
    setMessage('');
    setIsSending(true);

    // Add user message to UI immediately
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage },
    ]);

    try {
      // Send message to backend
      const response = await sendChatMessage(
        selectedChatbot.id,
        userMessage,
        currentChatId
      );

      // Store chat ID for subsequent messages
      if (!currentChatId) {
        setCurrentChatId(response.chatId);
      }

      // Add AI response to UI
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.message },
      ]);

      // Refresh chat sessions to show new chat
      loadSessions();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      // Remove user message on error
      setChatMessages(prev => prev.slice(0, -1));
      setMessage(userMessage); // Restore message
    } finally {
      setIsSending(false);
    }
  };

  // Show skeleton only on initial app load
  if (isInitialLoading) {
    return (
      <div className="flex gap-6 h-full overflow-hidden">
        <div className="flex-1 flex flex-col">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-32 mb-4" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="w-80 h-full" />
      </div>
    );
  }

  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to view chat logs</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full overflow-hidden">
      {/* Left Section - Chat Logs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900">Chat Logs</h1>
          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-4 flex-shrink-0">
          <h3 className="text-gray-900 font-semibold mb-3 text-sm">Filters</h3>
          <div className="flex gap-3 items-end mb-3">
            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Select a Date Range"
                  className="flex-1"
                />
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <Button onClick={handleFilter} size="sm" disabled={isLoading}>
              <Filter className="w-4 h-4" />
              {isLoading ? 'Loading...' : 'Filter'}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="embed">Embedded</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="playground">Playground</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Confidence Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="high">High (80%+)</SelectItem>
                <SelectItem value="medium">Medium (50-80%)</SelectItem>
                <SelectItem value="low">Low (&lt;50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Sessions */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-gray-900 font-semibold mb-3 text-sm flex-shrink-0">Embedded Site Sessions</h3>
          <div className="space-y-3">
            {isLoading && sessions.length === 0 ? (
              <>
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </>
            ) : sessions.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No chat sessions found</p>
            ) : (
              sessions.map((session) => (
                <Card key={session.id} className="p-3">
                  <div className="flex items-start gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-900 font-medium text-sm">
                      {session.messages[0]?.role === 'user'
                        ? `Customer: ${session.messages[0].content}`
                        : 'Customer started chat'
                      }
                    </p>
                  </div>
                  <div className="flex items-start gap-2 mb-1 ml-6">
                    <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">
                      {session.messages[1]?.role === 'assistant'
                        ? `Bot: ${session.messages[1].content.substring(0, 60)}...`
                        : 'Bot responded'
                      }
                    </p>
                  </div>
                  <p className="text-gray-500 text-xs ml-6">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))
            )}
          </div>
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
                  className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                    msg.role === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-3 flex-shrink-0 border-t border-gray-100">
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
              disabled={isSending}
            />
            <Button size="icon" onClick={handleSendMessage} disabled={isSending}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
        <p className="text-right text-gray-500 text-xs mt-2 flex-shrink-0">Powered by AslasChat</p>
      </div>
    </div>
  );
}
