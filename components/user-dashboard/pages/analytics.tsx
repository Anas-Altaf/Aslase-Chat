'use client';

import { useState, useEffect, useCallback } from 'react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getChatbotAnalytics } from '@/lib/services';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { ChatbotAnalytics } from '@/types';

const SENTIMENT_CONFIG = {
  positive: { label: 'Positive', color: 'bg-green-500', text: 'text-green-700' },
  negative: { label: 'Negative', color: 'bg-red-500', text: 'text-red-700' },
  neutral: { label: 'Neutral', color: 'bg-gray-400', text: 'text-gray-700' },
} as const;

export default function Analytics() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        <Skeleton className="h-24" />
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

  const volume = analytics?.dailyMessageVolume ?? [];
  const maxCount = volume.length ? Math.max(...volume.map((d) => d.count), 1) : 1;
  const totalSentiment =
    (analytics?.sentimentBreakdown.positive ?? 0) +
    (analytics?.sentimentBreakdown.negative ?? 0) +
    (analytics?.sentimentBreakdown.neutral ?? 0) || 1;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 shrink-0">Analytics</h1>

      <div className="flex-1 overflow-y-auto space-y-4">
        {isLoading && !analytics ? (
          <>
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
            </div>
            <Skeleton className="h-48" />
          </>
        ) : analytics ? (
          <>
            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Conversations', value: analytics.totalConversations },
                { label: 'Messages', value: analytics.totalMessages },
                { label: 'Leads', value: analytics.totalLeads },
                { label: 'Queries', value: analytics.totalQueries },
              ].map(({ label, value }) => (
                <Card key={label} className="p-4 text-center">
                  <p className="text-gray-500 text-xs mb-1">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {value.toLocaleString()}
                  </p>
                </Card>
              ))}
            </div>

            {/* ── Daily Volume Chart ── */}
            <Card className="p-4">
              <h3 className="text-gray-900 font-semibold text-sm mb-3">
                Daily Message Volume (last 30 days)
              </h3>
              {volume.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">No data yet</p>
              ) : (
                <div className="flex items-end gap-1 h-36">
                  {volume.map((item, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-0.5 group"
                      title={`${item.date}: ${item.count}`}
                    >
                      <div
                        className="w-full bg-green-500 rounded-t transition-all duration-300 group-hover:bg-green-600 min-h-[2px]"
                        style={{ height: `${(item.count / maxCount) * 120}px` }}
                      />
                      {volume.length <= 15 && (
                        <span className="text-[9px] text-gray-400 truncate w-full text-center">
                          {item.date.slice(5)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* ── Sentiment Breakdown ── */}
            <Card className="p-4">
              <h3 className="text-gray-900 font-semibold text-sm mb-3">
                User Sentiment
              </h3>
              <div className="space-y-2">
                {(Object.keys(SENTIMENT_CONFIG) as Array<keyof typeof SENTIMENT_CONFIG>).map((key) => {
                  const count = analytics.sentimentBreakdown[key];
                  const pct = Math.round((count / totalSentiment) * 100);
                  const cfg = SENTIMENT_CONFIG[key];
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className={`w-16 text-xs font-medium ${cfg.text}`}>
                        {cfg.label}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className={`${cfg.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* ── Top Queries ── */}
            {analytics.topQueries.length > 0 && (
              <Card className="p-4">
                <h3 className="text-gray-900 font-semibold text-sm mb-3">
                  Top Queries
                </h3>
                <div className="space-y-2">
                  {analytics.topQueries.slice(0, 10).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-1 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-xs text-gray-400 w-5 shrink-0">{i + 1}.</span>
                      <p className="flex-1 text-sm text-gray-700 truncate">
                        {item.query}
                      </p>
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full shrink-0">
                        ×{item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm text-center py-16">
            No analytics data available yet
          </p>
        )}
      </div>
    </div>
  );
}
