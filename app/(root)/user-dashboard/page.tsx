'use client';

import { useChatbot } from '@/contexts/ChatbotContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bot,
  MessageSquare,
  Users,
  TrendingUp,
  FileText,
  Clock
} from 'lucide-react';

export default function DashboardOverview() {
  const { chatbots, selectedChatbot, isInitialLoading } = useChatbot();

  // Calculate stats from chatbots
  const totalChatbots = chatbots.length;
  const trainedBots = chatbots.filter(c => c.status === 'trained').length;
  const totalChars = chatbots.reduce((acc, c) => acc + c.characterCount, 0);

  if (isInitialLoading) {
    return (
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your chatbot activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-interactive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Chatbots</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalChatbots}</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Trained Bots</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{trainedBots}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Characters</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalChars.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Chatbots */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            Recent Chatbots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chatbots.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No chatbots yet. Create one to get started!</p>
          ) : (
            <div className="space-y-3">
              {chatbots.slice(0, 5).map((chatbot) => (
                <div
                  key={chatbot.id}
                  className={`flex items-center justify-between p-3 rounded-lg border selection-transition ${selectedChatbot?.id === chatbot.id
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-100 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      <Bot className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{chatbot.name}</p>
                      <p className="text-xs text-gray-400">{chatbot.model.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={chatbot.status === 'trained' ? 'success' : chatbot.status === 'training' ? 'warning' : 'destructive'}
                      className="text-xs"
                    >
                      {chatbot.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {chatbot.characterCount.toLocaleString()} chars
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">john@example.com</span>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">sarah@company.io</span>
                <span className="text-xs text-gray-400">15 min ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">mike@startup.com</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">New chat started</span>
                <span className="text-xs text-gray-400">Just now</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">Lead captured</span>
                <span className="text-xs text-gray-400">5 min ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Chatbot retrained</span>
                <span className="text-xs text-gray-400">30 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
