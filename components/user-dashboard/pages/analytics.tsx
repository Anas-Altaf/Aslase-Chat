'use client';

import { useState, useEffect, useCallback } from 'react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { useSocket } from '@/contexts/SocketContext';
import { getChatbotAnalytics, exportAnalytics } from '@/lib/services';
import { downloadTextFile } from '@/lib/download';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ChatbotAnalytics } from '@/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';

// ── Constants ─────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'sentiment' | 'queries' | 'leads' | 'conversations' | 'trends';

const SENTIMENT_COLORS = {
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#9ca3af',
};

// ── Subcomponents ─────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </Card>
  );
}

function VolumeChart({ volume }: { volume: Array<{ date: string; count: number }> }) {
  if (volume.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-10">No volume data yet</p>;
  }

  const data = volume.map((d) => ({ ...d, date: d.date.slice(5) }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
        <RechartsTooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
          labelStyle={{ color: '#374151', fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#colorMsg)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: '#16a34a' }}
          isAnimationActive
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SentimentTab({ analytics }: { analytics: ChatbotAnalytics }) {
  const sb = analytics.sentimentBreakdown;
  const total = (sb.positive + sb.negative + sb.neutral) || 1;

  const pieData = [
    { name: 'Positive', value: sb.positive, color: SENTIMENT_COLORS.positive },
    { name: 'Negative', value: sb.negative, color: SENTIMENT_COLORS.negative },
    { name: 'Neutral', value: sb.neutral, color: SENTIMENT_COLORS.neutral },
  ].filter((d) => d.value > 0);

  const dominant =
    sb.positive >= sb.negative && sb.positive >= sb.neutral
      ? 'Positive'
      : sb.negative >= sb.neutral
      ? 'Negative'
      : 'Neutral';

  const pctOf = (n: number) => Math.round((n / total) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center bg-green-50">
          <p className="text-xs text-gray-500 mb-1">Dominant</p>
          <p className="text-lg font-bold text-green-700">{dominant}</p>
        </Card>
        <Card className="p-3 text-center bg-red-50">
          <p className="text-xs text-gray-500 mb-1">Concern Rate</p>
          <p className="text-lg font-bold text-red-600">{pctOf(sb.negative)}%</p>
          <p className="text-[10px] text-gray-400">Negative</p>
        </Card>
        <Card className="p-3 text-center bg-gray-50">
          <p className="text-xs text-gray-500 mb-1">Total Analyzed</p>
          <p className="text-lg font-bold text-gray-900">{total.toLocaleString()}</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sentiment Distribution</h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                isAnimationActive
                animationDuration={800}
                label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>} />
              <RechartsTooltip
                formatter={(value: any) => `${value} queries (${pctOf(value as number)}%)`}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-sm text-center py-8">No sentiment data yet</p>
        )}
      </Card>
    </div>
  );
}

function QueriesTab({ analytics }: { analytics: ChatbotAnalytics }) {
  const [search, setSearch] = useState('');
  const queries = analytics.topQueries;

  const filtered = queries.filter((q) =>
    q.query.toLowerCase().includes(search.toLowerCase()),
  );

  const chartData = filtered.slice(0, 10).map((q) => ({
    query: q.query.length > 30 ? q.query.slice(0, 30) + '…' : q.query,
    count: q.count,
  }));

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search queries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-sm"
      />

      {chartData.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Queries by Frequency</h3>
          <ResponsiveContainer width="100%" height={Math.max(chartData.length * 38, 120)}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
              <YAxis type="category" dataKey="query" tick={{ fontSize: 10, fill: '#6b7280' }} width={140} />
              <RechartsTooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar
                dataKey="count"
                fill="#22c55e"
                radius={[0, 4, 4, 0]}
                isAnimationActive
                animationDuration={700}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No queries found</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <span className="text-xs text-gray-400 font-mono w-5 shrink-0 text-right">{i + 1}</span>
                <p className="text-sm text-gray-900 flex-1 min-w-0 truncate">{item.query}</p>
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                  ×{item.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function LeadsTab({ analytics }: { analytics: ChatbotAnalytics }) {
  const timeline = analytics.leadTimeline ?? [];

  if (timeline.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-400 text-sm">No leads captured yet</p>
        <p className="text-xs text-gray-300 mt-1">Lead capture events will appear here once visitors share their contact info</p>
      </Card>
    );
  }

  const data = timeline.map((d) => ({ ...d, date: d.date.slice(5) }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs text-gray-500 mb-1">Total Leads (30d)</p>
          <p className="text-2xl font-bold text-gray-900">
            {timeline.reduce((s, d) => s + d.count, 0).toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 mb-1">Peak Day</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.max(...timeline.map((d) => d.count)).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">leads in one day</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Lead Capture Timeline (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
            <RechartsTooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              labelStyle={{ color: '#374151', fontWeight: 600 }}
              formatter={(value: any) => [`${value} lead${value !== 1 ? 's' : ''}`, 'Leads captured']}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorLeads)"
              dot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#16a34a' }}
              isAnimationActive
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function ConversationsTab({ analytics }: { analytics: ChatbotAnalytics }) {
  const avg = analytics.avgSessionLength ?? 0;
  const rate = analytics.resolutionRate ?? 0;
  const unresolved = analytics.unresolvedCount ?? 0;
  const peakHours = analytics.peakHours ?? [];

  const peakHourLabel = (h: number) => {
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}${suffix}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-gray-500 mb-1">Avg Session Length</p>
          <p className="text-2xl font-bold text-gray-900">{avg.toFixed(1)}</p>
          <p className="text-xs text-gray-400 mt-0.5">messages per session</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 mb-1">Resolution Rate</p>
          <p className="text-2xl font-bold text-green-600">{rate}%</p>
          <p className="text-xs text-gray-400 mt-0.5">queries resolved</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 mb-1">Unresolved Queries</p>
          <p className="text-2xl font-bold text-red-500">{unresolved.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">need attention</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity by Hour of Day</h3>
        {peakHours.some((h) => h.count > 0) ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={peakHours.map((h) => ({ hour: peakHourLabel(h.hour), count: h.count }))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#9ca3af' }} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
              <RechartsTooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v: any) => [`${v} queries`, 'Activity']}
              />
              <Bar dataKey="count" fill="#22c55e" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
        )}
      </Card>
    </div>
  );
}

function TrendsTab({ analytics }: { analytics: ChatbotAnalytics }) {
  const trend = analytics.sentimentTrend ?? [];

  if (trend.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-400 text-sm">No trend data yet</p>
        <p className="text-xs text-gray-300 mt-1">Sentiment trends will appear after 1+ weeks of conversations</p>
      </Card>
    );
  }

  const data = trend.map((t) => ({
    week: t.week.replace(/^\d{4}-/, ''), // strip year: "2025-W12" → "W12"
    positive: t.positive,
    negative: t.negative,
    neutral: t.neutral,
  }));

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Sentiment Trend (Weekly)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradNeu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
            <RechartsTooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              labelStyle={{ color: '#374151', fontWeight: 600 }}
            />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, textTransform: 'capitalize' }}>{v}</span>} />
            <Area type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} fill="url(#gradPos)" dot={false} />
            <Area type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} fill="url(#gradNeg)" dot={false} />
            <Area type="monotone" dataKey="neutral" stroke="#9ca3af" strokeWidth={2} fill="url(#gradNeu)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Analytics() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const { socket } = useSocket();
  const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isExporting, setIsExporting] = useState(false);

  const loadAnalytics = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const res = await getChatbotAnalytics(selectedChatbot.id);
      if (res.success) {
        setAnalytics(res.data);
      } else {
        toast.error(res.error ?? 'Failed to load analytics');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot]);

  useEffect(() => {
    if (!selectedChatbot) { setAnalytics(null); return; }
    loadAnalytics();
  }, [selectedChatbot?.id]);

  // Live refresh — analytics is aggregate + heavier, so debounce bursts of
  // activity into a single refetch (~3s after the last event).
  useEffect(() => {
    if (!socket || !selectedChatbot) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => loadAnalytics(), 3000);
    };
    socket.on('new_message', schedule);
    socket.on('new_lead', schedule);
    return () => {
      socket.off('new_message', schedule);
      socket.off('new_lead', schedule);
      if (timer) clearTimeout(timer);
    };
  }, [socket, selectedChatbot?.id, loadAnalytics]);

  const handleExport = async (format: 'csv' | 'json') => {
    if (!selectedChatbot) return;
    setIsExporting(true);
    try {
      const res = await exportAnalytics(selectedChatbot.id, format);
      if (!res.success) {
        toast.error(res.error ?? 'Failed to export analytics');
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      const ext = format === 'json' ? 'json' : 'csv';
      const mime = format === 'json' ? 'application/json;charset=utf-8' : 'text/csv;charset=utf-8';
      downloadTextFile(`analytics-${selectedChatbot.id}-${today}.${ext}`, res.data, mime);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export analytics');
    } finally {
      setIsExporting(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!selectedChatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chatbot to view analytics</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="secondary" onClick={() => handleExport('csv')} disabled={isExporting}>
            Export CSV
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleExport('json')} disabled={isExporting}>
            Export JSON
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 shrink-0 border-b border-gray-200 flex-wrap">
        {([
          ['overview', 'Overview'],
          ['sentiment', 'Sentiment'],
          ['queries', 'Top Queries'],
          ['leads', 'Leads'],
          ['conversations', 'Conversations'],
          ['trends', 'Trends'],
        ] as [Tab, string][]).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
              activeTab === tab
                ? 'bg-white border border-b-white border-gray-200 text-green-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && !analytics ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
            </div>
            <Skeleton className="h-48" />
            <Skeleton className="h-24" />
          </div>
        ) : !analytics ? (
          <p className="text-gray-500 text-sm text-center py-16">No analytics data available yet</p>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCard label="Conversations" value={analytics.totalConversations} />
                  <StatCard label="Messages" value={analytics.totalMessages} />
                  <StatCard label="Leads Captured" value={analytics.totalLeads} />
                  <StatCard label="Queries Logged" value={analytics.totalQueries} />
                </div>
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Message Volume</h3>
                  <VolumeChart volume={analytics.dailyMessageVolume} />
                </Card>
              </div>
            )}
            {activeTab === 'sentiment' && <SentimentTab analytics={analytics} />}
            {activeTab === 'queries' && <QueriesTab analytics={analytics} />}
            {activeTab === 'leads' && <LeadsTab analytics={analytics} />}
            {activeTab === 'conversations' && <ConversationsTab analytics={analytics} />}
            {activeTab === 'trends' && <TrendsTab analytics={analytics} />}
          </>
        )}
      </div>
    </div>
  );
}
