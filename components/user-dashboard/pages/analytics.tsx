'use client';

import { useState, useEffect, useCallback } from 'react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getChatbotAnalytics } from '@/lib/services';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ChatbotAnalytics } from '@/types';

// ── Constants ─────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'sentiment' | 'queries';

const SENTIMENT_CONFIG = {
  positive: { label: 'Positive', bar: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
  negative: { label: 'Negative', bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  neutral: { label: 'Neutral', bar: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' },
} as const;

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
  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);
  const maxCount = volume.length ? Math.max(...volume.map((d) => d.count), 1) : 1;
  const CHART_HEIGHT = 160;

  if (volume.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-10">No volume data yet</p>
    );
  }

  return (
    <div className="relative">
      {/* Y-axis labels */}
      <div className="flex">
        <div className="flex flex-col justify-between text-right pr-2 text-[10px] text-gray-400 shrink-0" style={{ height: CHART_HEIGHT }}>
          <span>{maxCount}</span>
          <span>{Math.round(maxCount / 2)}</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div
          className="flex-1 flex items-end gap-0.5 relative"
          style={{ height: CHART_HEIGHT }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-full border-t border-gray-100" />
            ))}
          </div>

          {volume.map((item, i) => {
            const barH = Math.max((item.count / maxCount) * (CHART_HEIGHT - 4), item.count > 0 ? 2 : 0);
            const showLabel = volume.length <= 10 || i % Math.ceil(volume.length / 10) === 0;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end group cursor-pointer"
                style={{ height: CHART_HEIGHT }}
                onMouseEnter={(e) => setTooltip({ index: i, x: e.currentTarget.getBoundingClientRect().left, y: 0 })}
                onMouseLeave={() => setTooltip(null)}
              >
                <div
                  className="w-full rounded-t bg-green-500 group-hover:bg-green-600 transition-colors"
                  style={{ height: barH }}
                />
                {showLabel && (
                  <span className="text-[8px] text-gray-400 mt-0.5 truncate w-full text-center">
                    {item.date.slice(5)}
                  </span>
                )}
              </div>
            );
          })}

          {/* Tooltip */}
          {tooltip !== null && (
            <div
              className="absolute -top-8 pointer-events-none bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-10 transform -translate-x-1/2"
              style={{ left: `${((tooltip.index + 0.5) / volume.length) * 100}%` }}
            >
              {volume[tooltip.index].date}: {volume[tooltip.index].count}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SentimentTab({ analytics }: { analytics: ChatbotAnalytics }) {
  const sb = analytics.sentimentBreakdown;
  const total = (sb.positive + sb.negative + sb.neutral) || 1;
  const pctOf = (n: number) => Math.round((n / total) * 100);

  const dominant = sb.positive >= sb.negative && sb.positive >= sb.neutral
    ? 'Positive'
    : sb.negative >= sb.neutral
    ? 'Negative'
    : 'Neutral';

  return (
    <div className="space-y-4">
      {/* Bars */}
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Overall Sentiment Breakdown</h3>
        {(Object.keys(SENTIMENT_CONFIG) as Array<keyof typeof SENTIMENT_CONFIG>).map((key) => {
          const count = sb[key];
          const pct = pctOf(count);
          const cfg = SENTIMENT_CONFIG[key];
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={cn('font-medium', cfg.text)}>{cfg.label}</span>
                <span className="text-gray-500">{count.toLocaleString()} queries ({pct}%)</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', cfg.bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center bg-green-50">
          <p className="text-xs text-gray-500 mb-1">Most Common</p>
          <p className="text-lg font-bold text-green-700">{dominant}</p>
        </Card>
        <Card className="p-3 text-center bg-red-50">
          <p className="text-xs text-gray-500 mb-1">Concern Rate</p>
          <p className="text-lg font-bold text-red-600">{pctOf(sb.negative)}%</p>
          <p className="text-[10px] text-gray-400">Negative</p>
        </Card>
        <Card className="p-3 text-center bg-gray-50">
          <p className="text-xs text-gray-500 mb-1">Total Analyzed</p>
          <p className="text-lg font-bold text-gray-900">{(sb.positive + sb.negative + sb.neutral).toLocaleString()}</p>
        </Card>
      </div>
    </div>
  );
}

function QueriesTab({ analytics }: { analytics: ChatbotAnalytics }) {
  const [search, setSearch] = useState('');
  const queries = analytics.topQueries;
  const maxCount = queries.length ? Math.max(...queries.map((q) => q.count), 1) : 1;

  const filtered = queries.filter((q) =>
    q.query.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search queries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-sm"
      />
      <Card className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No queries found</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((item, i) => {
              const barW = Math.round((item.count / maxCount) * 100);
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xs text-gray-400 font-mono w-5 shrink-0 text-right">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 mb-1">{item.query}</p>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400 rounded-full"
                        style={{ width: `${barW}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                    ×{item.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Analytics() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

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
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot]);

  useEffect(() => {
    if (!selectedChatbot) { setAnalytics(null); return; }
    loadAnalytics();
  }, [selectedChatbot?.id]);

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
      <h1 className="text-2xl font-bold text-gray-900 mb-4 shrink-0">Analytics</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 shrink-0 border-b border-gray-200">
        {(['overview', 'sentiment', 'queries'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-colors',
              activeTab === tab
                ? 'bg-white border border-b-white border-gray-200 text-green-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {tab === 'overview' ? 'Overview' : tab === 'sentiment' ? 'Sentiment' : 'Top Queries'}
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
            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCard label="Conversations" value={analytics.totalConversations} />
                  <StatCard label="Messages" value={analytics.totalMessages} />
                  <StatCard label="Leads Captured" value={analytics.totalLeads} />
                  <StatCard label="Queries Logged" value={analytics.totalQueries} />
                </div>

                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Daily Message Volume
                  </h3>
                  <VolumeChart volume={analytics.dailyMessageVolume} />
                </Card>
              </div>
            )}

            {/* ── SENTIMENT TAB ── */}
            {activeTab === 'sentiment' && <SentimentTab analytics={analytics} />}

            {/* ── QUERIES TAB ── */}
            {activeTab === 'queries' && <QueriesTab analytics={analytics} />}
          </>
        )}
      </div>
    </div>
  );
}
