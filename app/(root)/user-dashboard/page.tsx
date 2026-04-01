'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getAnalytics, getLeads, getChatSessions } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Bot, MessageSquare, Users, TrendingUp, ArrowUpRight,
  Sparkles, BarChart3, ChevronRight, UserCircle, ThumbsUp,
  ThumbsDown, Minus, Hash, Activity,
} from 'lucide-react';
import type { ChatbotAnalytics, Lead, ChatSession } from '@/types';

const SENTIMENT_COLORS = { positive: '#22c55e', negative: '#ef4444', neutral: '#94a3b8' };

function StatCard({
  label, value, sub, icon: Icon, gradient, bg, textColor, loading,
}: {
  label: string; value: number | string | null; sub: string;
  icon: any; gradient: string; bg: string; textColor: string; loading?: boolean;
}) {
  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
            {loading || value === null ? (
              <Skeleton className="h-7 w-14 mb-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            )}
            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{sub}</p>
          </div>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center shrink-0 ml-2`}>
            <Icon className={`w-5 h-5 ${textColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview() {
  const { chatbots, selectedChatbot, isInitialLoading } = useChatbot();

  const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!selectedChatbot) {
      setAnalytics(null); setRecentLeads([]); setRecentSessions([]);
      return;
    }
    let cancelled = false;
    setDataLoading(true);
    Promise.all([
      getAnalytics(selectedChatbot.id),
      getLeads(selectedChatbot.id, { limit: 5 }),
      getChatSessions(selectedChatbot.id, { limit: 5 }),
    ]).then(([a, l, s]) => {
      if (cancelled) return;
      if (a.success) setAnalytics(a.data);
      if (l.success) setRecentLeads(l.data.items);
      if (s.success) setRecentSessions(s.data.items);
    }).finally(() => { if (!cancelled) setDataLoading(false); });
    return () => { cancelled = true; };
  }, [selectedChatbot?.id]);

  const trainedBots = chatbots.filter((c) => c.status === 'trained').length;

  // Sentiment pie data
  const sentimentData = analytics ? [
    { name: 'Positive', value: analytics.sentimentBreakdown.positive, color: SENTIMENT_COLORS.positive },
    { name: 'Negative', value: analytics.sentimentBreakdown.negative, color: SENTIMENT_COLORS.negative },
    { name: 'Neutral', value: analytics.sentimentBreakdown.neutral, color: SENTIMENT_COLORS.neutral },
  ].filter(d => d.value > 0) : [];

  // Daily volume — show last 14 days
  const volumeData = analytics?.dailyMessageVolume?.slice(-14).map(d => ({
    date: d.date.slice(5), // MM-DD
    count: d.count,
  })) ?? [];

  if (isInitialLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-28 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-5 text-white shadow-lg shadow-green-500/20">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-28 h-28 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-white/80 text-xs">Welcome back</span>
            </div>
            <h1 className="text-xl font-bold mb-0.5">Dashboard Overview</h1>
            <p className="text-white/70 text-xs">
              {selectedChatbot ? `Viewing: ${selectedChatbot.name}` : 'Select a chatbot to see analytics'}
            </p>
          </div>
          <div className="hidden lg:flex w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Chatbots" value={chatbots.length} sub={`${trainedBots} trained`}
          icon={Bot} gradient="from-green-500 to-emerald-500" bg="from-green-50 to-emerald-50" textColor="text-green-600" />
        <StatCard label="Conversations" value={dataLoading ? null : (analytics?.totalConversations ?? '—')}
          sub={selectedChatbot?.name ?? 'Select chatbot'} loading={dataLoading}
          icon={MessageSquare} gradient="from-blue-500 to-cyan-500" bg="from-blue-50 to-cyan-50" textColor="text-blue-600" />
        <StatCard label="Total Leads" value={dataLoading ? null : (analytics?.totalLeads ?? '—')}
          sub="Captured contacts" loading={dataLoading}
          icon={Users} gradient="from-purple-500 to-pink-500" bg="from-purple-50 to-pink-50" textColor="text-purple-600" />
        <StatCard label="Messages" value={dataLoading ? null : (analytics?.totalMessages ?? '—')}
          sub="All time" loading={dataLoading}
          icon={TrendingUp} gradient="from-orange-500 to-amber-500" bg="from-orange-50 to-amber-50" textColor="text-orange-600" />
      </div>

      {/* Charts row */}
      {selectedChatbot && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Volume chart */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Message Volume (Last 14 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              {dataLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : volumeData.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={volumeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ fontSize: 11, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: 8 }}
                      cursor={{ fill: '#f0fdf4' }}
                    />
                    <Bar dataKey="count" name="Messages" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Sentiment pie */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              {dataLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : sentimentData.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                      paddingAngle={3} dataKey="value">
                      {sentimentData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend iconSize={10} iconType="circle"
                      formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>} />
                    <Tooltip contentStyle={{ fontSize: 11, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {analytics && !dataLoading && (
                <div className="flex justify-around text-center mt-1 px-2">
                  <div>
                    <ThumbsUp className="w-3 h-3 text-green-500 mx-auto mb-0.5" />
                    <p className="text-xs font-bold text-green-600">{analytics.sentimentBreakdown.positive}</p>
                  </div>
                  <div>
                    <Minus className="w-3 h-3 text-gray-400 mx-auto mb-0.5" />
                    <p className="text-xs font-bold text-gray-500">{analytics.sentimentBreakdown.neutral}</p>
                  </div>
                  <div>
                    <ThumbsDown className="w-3 h-3 text-red-500 mx-auto mb-0.5" />
                    <p className="text-xs font-bold text-red-600">{analytics.sentimentBreakdown.negative}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Queries + Recent Leads + Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Queries */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Hash className="w-4 h-4 text-orange-500" />
                Top Queries
              </CardTitle>
              {selectedChatbot && (
                <Link href="/user-dashboard/queries">
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-gray-400 hover:text-orange-600">
                    All <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            {!selectedChatbot ? (
              <p className="text-xs text-gray-400 text-center py-4">Select a chatbot</p>
            ) : dataLoading ? (
              <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-5" />)}</div>
            ) : !analytics?.topQueries?.length ? (
              <p className="text-xs text-gray-400 text-center py-4">No queries yet</p>
            ) : (
              <div className="space-y-2">
                {analytics.topQueries.slice(0, 6).map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-gray-300 w-4 shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-xs text-gray-700 flex-1 line-clamp-1">{q.query}</p>
                    <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 rounded font-semibold shrink-0">{q.count}×</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Recent Leads
              </CardTitle>
              {selectedChatbot && (
                <Link href="/user-dashboard/leads">
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-gray-400 hover:text-blue-600">
                    All <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            {!selectedChatbot ? (
              <p className="text-xs text-gray-400 text-center py-4">Select a chatbot</p>
            ) : dataLoading ? (
              <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-4">
                <UserCircle className="w-6 h-6 text-gray-200 mx-auto mb-1" />
                <p className="text-xs text-gray-400">No leads yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {(lead.name || lead.email || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-800 truncate">{lead.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-gray-400 truncate">{lead.email || lead.phone || '—'}</p>
                    </div>
                    <Badge
                      variant={lead.status === 'converted' ? 'success' : lead.status === 'new' ? 'warning' : 'secondary'}
                      className="text-[9px] px-1.5 py-0 shrink-0"
                    >
                      {lead.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                Recent Sessions
              </CardTitle>
              {selectedChatbot && (
                <Link href="/user-dashboard/chat-logs">
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-gray-400 hover:text-green-600">
                    All <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            {!selectedChatbot ? (
              <p className="text-xs text-gray-400 text-center py-4">Select a chatbot</p>
            ) : dataLoading ? (
              <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
            ) : recentSessions.length === 0 ? (
              <div className="text-center py-4">
                <MessageSquare className="w-6 h-6 text-gray-200 mx-auto mb-1" />
                <p className="text-xs text-gray-400">No sessions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentSessions.map((s) => (
                  <div key={s.id} className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-700 line-clamp-1">
                        {s.previewMessage?.substring(0, 45) || 'Chat session'}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {s.messageCount ?? 0} msgs · {s.isAnonymous ? 'Anon' : 'User'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chatbots list */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Bot className="w-4 h-4 text-gray-500" />
              Your Chatbots
            </CardTitle>
            <Link href="/user-dashboard/chatbots">
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-gray-400 hover:text-green-600">
                View all <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          {chatbots.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No chatbots yet</p>
          ) : (
            <div className="space-y-2">
              {chatbots.slice(0, 4).map((c) => (
                <div key={c.id} className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                  selectedChatbot?.id === c.id ? 'border-green-200 bg-green-50/60' : 'border-gray-100 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">{c.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{c.model.split('/').pop()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={c.status === 'trained' ? 'success' : 'warning'} className="text-[9px]">{c.status}</Badge>
                    <ArrowUpRight className="w-3 h-3 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
