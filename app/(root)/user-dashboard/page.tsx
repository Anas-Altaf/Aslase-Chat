'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getAnalytics, getLeads, getChatSessions } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Bot,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,
  Zap,
  BarChart3,
  ChevronRight,
  UserCircle,
} from 'lucide-react';
import type { ChatbotAnalytics, Lead, ChatSession } from '@/types';

// ── Skeleton rows ─────────────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="pt-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const { chatbots, selectedChatbot, isInitialLoading } = useChatbot();

  const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!selectedChatbot) {
      setAnalytics(null);
      setRecentLeads([]);
      setRecentSessions([]);
      return;
    }

    let cancelled = false;
    setDataLoading(true);

    Promise.all([
      getAnalytics(selectedChatbot.id),
      getLeads(selectedChatbot.id, { limit: 5 }),
      getChatSessions(selectedChatbot.id, { limit: 5 }),
    ])
      .then(([analyticsRes, leadsRes, sessionsRes]) => {
        if (cancelled) return;
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
        if (leadsRes.success) setRecentLeads(leadsRes.data.items);
        if (sessionsRes.success) setRecentSessions(sessionsRes.data.items);
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });

    return () => { cancelled = true; };
  }, [selectedChatbot?.id]);

  const totalChatbots = chatbots.length;
  const trainedBots = chatbots.filter((c) => c.status === 'trained').length;

  const stats = [
    {
      label: 'Total Chatbots',
      value: totalChatbots,
      sub: `${trainedBots} trained`,
      icon: Bot,
      gradient: 'from-green-500 to-emerald-500',
      bg: 'from-green-50 to-emerald-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Conversations',
      value: dataLoading ? null : (analytics?.totalConversations ?? '—'),
      sub: selectedChatbot ? selectedChatbot.name : 'Select a chatbot',
      icon: MessageSquare,
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Total Leads',
      value: dataLoading ? null : (analytics?.totalLeads ?? '—'),
      sub: 'Captured contacts',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      bg: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-600',
    },
    {
      label: 'Total Messages',
      value: dataLoading ? null : (analytics?.totalMessages ?? '—'),
      sub: 'Across all sessions',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-amber-500',
      bg: 'from-orange-50 to-amber-50',
      textColor: 'text-orange-600',
    },
  ];

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <StatsSkeleton />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-6 text-white shadow-xl shadow-green-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-28 h-28 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-white/80 text-xs font-medium">Welcome back</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
            <p className="text-white/70 text-sm max-w-md">
              {selectedChatbot
                ? `Viewing stats for: ${selectedChatbot.name}`
                : 'Select a chatbot from the sidebar to see its analytics'}
            </p>
          </div>
          <div className="hidden lg:flex w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
                    {stat.value === null ? (
                      <Skeleton className="h-8 w-16 mb-1" />
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    )}
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[120px]">{stat.sub}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Chatbots */}
      <Card className="shadow-md border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              Your Chatbots
            </CardTitle>
            <Link href="/user-dashboard/chatbots">
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-green-600 gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {chatbots.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm font-medium">No chatbots yet</p>
              <p className="text-gray-400 text-xs">Create your first AI chatbot to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatbots.slice(0, 5).map((chatbot) => (
                <div
                  key={chatbot.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    selectedChatbot?.id === chatbot.id
                      ? 'border-green-200 bg-green-50/60'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                      <Bot className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{chatbot.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{chatbot.model}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={chatbot.status === 'trained' ? 'success' : chatbot.status === 'training' ? 'warning' : 'destructive'}
                      className="text-[10px]"
                    >
                      {chatbot.status}
                    </Badge>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Leads + Recent Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Leads */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Recent Leads
              </CardTitle>
              {selectedChatbot && (
                <Link href="/user-dashboard/leads">
                  <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-blue-600 gap-1">
                    View all <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedChatbot ? (
              <p className="text-sm text-gray-400 text-center py-6">Select a chatbot to see leads</p>
            ) : dataLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-6">
                <UserCircle className="w-7 h-7 text-gray-300 mx-auto mb-1" />
                <p className="text-sm text-gray-400">No leads captured yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(lead.name || lead.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{lead.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-400 truncate">{lead.email || lead.phone || '—'}</p>
                      </div>
                    </div>
                    <Badge
                      variant={lead.status === 'converted' ? 'success' : lead.status === 'new' ? 'warning' : 'secondary'}
                      className="text-[10px] shrink-0"
                    >
                      {lead.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Chat Sessions */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                Recent Sessions
              </CardTitle>
              {selectedChatbot && (
                <Link href="/user-dashboard/chat-logs">
                  <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-green-600 gap-1">
                    View all <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedChatbot ? (
              <p className="text-sm text-gray-400 text-center py-6">Select a chatbot to see sessions</p>
            ) : dataLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
              </div>
            ) : recentSessions.length === 0 ? (
              <div className="text-center py-6">
                <MessageSquare className="w-7 h-7 text-gray-300 mx-auto mb-1" />
                <p className="text-sm text-gray-400">No chat sessions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {session.previewMessage
                            ? session.previewMessage.substring(0, 40) + (session.previewMessage.length > 40 ? '…' : '')
                            : 'Chat session'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {session.messageCount ?? session.messages?.length ?? 0} messages ·{' '}
                          {session.isAnonymous ? 'Anonymous' : 'Identified'}
                        </p>
                      </div>
                    </div>
                    <BarChart3 className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics quick-link if chatbot selected */}
      {selectedChatbot && analytics && (
        <Card className="shadow-md border-0 bg-gradient-to-r from-gray-50 to-green-50/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Full Analytics</p>
                  <p className="text-xs text-gray-400">
                    Sentiment breakdown · Volume charts · Top queries
                  </p>
                </div>
              </div>
              <Link href="/user-dashboard/analytics">
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white gap-1.5 text-xs">
                  View Analytics <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
