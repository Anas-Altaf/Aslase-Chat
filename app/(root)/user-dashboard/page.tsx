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
  Clock,
  ArrowUpRight,
  Sparkles,
  Zap
} from 'lucide-react';

export default function DashboardOverview() {
  const { chatbots, selectedChatbot, isInitialLoading } = useChatbot();

  const totalChatbots = chatbots.length;
  const trainedBots = chatbots.filter(c => c.status === 'trained').length;
  const totalChars = chatbots.reduce((acc, c) => acc + c.characterCount, 0);

  const stats = [
    {
      label: 'Total Chatbots',
      value: totalChatbots,
      icon: Bot,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      label: 'Trained Bots',
      value: trainedBots,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      label: 'Total Characters',
      value: totalChars.toLocaleString(),
      icon: FileText,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      label: 'Active Sessions',
      value: '12',
      icon: MessageSquare,
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50',
    },
  ];

  if (isInitialLoading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
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
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-green-500 via-emerald-500 to-teal-500 p-8 text-white shadow-xl shadow-green-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-white/80 text-sm font-medium">Welcome back!</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-white/70 max-w-md">
              Manage your AI chatbots and track their performance in real-time.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-float">
              <Bot className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="group card-interactive hover:shadow-xl border-0 shadow-lg animate-fadeIn overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-br ${stat.gradient}`}></div>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                    <Icon className={`w-7 h-7 bg-gradient-to-br ${stat.gradient} bg-clip-text`} style={{ color: 'transparent', background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`, WebkitBackgroundClip: 'text' }} />
                    <Icon className={`w-7 h-7 text-gray-700 absolute opacity-100`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Chatbots */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              Recent Chatbots
            </CardTitle>
            <span className="text-sm text-gray-400">{chatbots.length} total</span>
          </div>
        </CardHeader>
        <CardContent>
          {chatbots.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <Zap className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-gray-500 font-medium mb-2">No chatbots yet</p>
              <p className="text-gray-400 text-sm">Create your first AI chatbot to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chatbots.slice(0, 5).map((chatbot, index) => (
                <div
                  key={chatbot.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-md hover:scale-[1.01] animate-fadeIn ${selectedChatbot?.id === chatbot.id
                      ? 'border-green-300 bg-linear-to-br from-green-50 to-emerald-50 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                    }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{chatbot.name}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{chatbot.model}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={chatbot.status === 'trained' ? 'success' : chatbot.status === 'training' ? 'warning' : 'destructive'}
                      className="font-medium"
                    >
                      {chatbot.status}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {chatbot.characterCount.toLocaleString()} chars
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { email: 'john@example.com', time: '2 min ago' },
                { email: 'sarah@company.io', time: '15 min ago' },
                { email: 'mike@startup.com', time: '1 hour ago' },
              ].map((lead, i) => (
                <div
                  key={lead.email}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 animate-fadeIn"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      {lead.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{lead.email}</span>
                  </div>
                  <span className="text-xs text-gray-400">{lead.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'New chat started', time: 'Just now', type: 'chat' },
                { action: 'Lead captured', time: '5 min ago', type: 'lead' },
                { action: 'Chatbot retrained', time: '30 min ago', type: 'train' },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 animate-fadeIn"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'chat' ? 'bg-green-500' :
                        activity.type === 'lead' ? 'bg-blue-500' :
                          'bg-purple-500'
                      }`}></div>
                    <span className="text-sm font-medium text-gray-700">{activity.action}</span>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
