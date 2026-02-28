'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getAnalytics, exportAnalytics } from '@/lib/services';
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
import type { AnalyticsData } from '@/types';

export default function Analytics() {
  const { selectedChatbot, isInitialLoading } = useChatbot();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isExporting, setIsExporting] = useState(false);

  // Cache per chatbot + period
  const analyticsCache = useRef<Record<string, AnalyticsData>>({});
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedChatbot) return;
    const cacheKey = `${selectedChatbot.id}_${period}`;
    if (cacheKey === lastKey.current) return;

    lastKey.current = cacheKey;

    if (analyticsCache.current[cacheKey]) {
      setAnalytics(analyticsCache.current[cacheKey]);
      return;
    }

    loadAnalytics();
  }, [selectedChatbot?.id, period]);

  const loadAnalytics = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const response = await getAnalytics(selectedChatbot.id, period);
      if (response.success) {
        setAnalytics(response.data);
        const cacheKey = `${selectedChatbot.id}_${period}`;
        analyticsCache.current[cacheKey] = response.data;
      }
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatbot, period]);

  const handleExport = async () => {
    if (!selectedChatbot) return;
    setIsExporting(true);
    try {
      const response = await exportAnalytics(selectedChatbot.id);
      if (response.success) {
        toast.success('Export ready!');
      }
    } catch (error) {
      toast.error('Failed to export analytics');
    } finally {
      setIsExporting(false);
    }
  };

  const maxChats = analytics?.data.length
    ? Math.max(...analytics.data.map(d => d.chats))
    : 100;

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24" />
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
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </div>

      <Card className="p-4 mb-4 flex-shrink-0">
        <h3 className="text-gray-900 font-semibold mb-3 text-sm">Filters</h3>
        <div className="flex gap-3 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <Input type="text" placeholder="Select a Date Range" />
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-900 font-semibold text-sm">Activities</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-700 text-xs">Chats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-700 text-xs">Leads</span>
            </div>
            <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
              <SelectTrigger className="w-28 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && !analytics ? (
          <Skeleton className="h-48" />
        ) : analytics ? (
          <>
            <Card className="p-4 mb-4">
              <div className="flex items-end gap-2 h-40">
                {analytics.data.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5">
                      <div
                        className="flex-1 bg-green-500 rounded-t transition-all duration-300"
                        style={{ height: `${(item.chats / maxChats) * 120}px` }}
                      />
                      <div
                        className="flex-1 bg-blue-500 rounded-t transition-all duration-300"
                        style={{ height: `${(item.leads / maxChats) * 120}px` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 truncate w-full text-center">
                      {item.date.substring(5)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">Total Chats</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totals.totalChats.toLocaleString()}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totals.totalLeads.toLocaleString()}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">Avg Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totals.avgConfidence ? `${(analytics.totals.avgConfidence * 100).toFixed(0)}%` : '-'}
                </p>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
