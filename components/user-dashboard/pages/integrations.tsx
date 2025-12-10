'use client';

import { useState, useEffect } from 'react';
import { Zap, MessageCircle, Globe, ShoppingCart, MessageSquare } from 'lucide-react';
import { getIntegrations } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { Integration } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  slack: Zap,
  whatsapp: MessageCircle,
  wordpress: Globe,
  messenger: MessageSquare,
  shopify: ShoppingCart,
  instagram: MessageCircle,
};

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning'> = {
  available: 'success',
  coming_soon: 'warning',
  subscription_required: 'secondary',
  connected: 'default',
};

const statusLabel: Record<string, string> = {
  available: 'Integrate',
  coming_soon: 'Coming Soon',
  subscription_required: 'Subscription Required',
  connected: 'Connected',
};

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      const response = await getIntegrations();
      if (response.success) {
        setIntegrations(response.data);
      }
    } catch (error) {
      toast.error('Failed to load integrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (integration: Integration) => {
    if (integration.status === 'coming_soon') {
      toast.info(`${integration.name.replace('Add to ', '')} integration is coming soon!`);
    } else if (integration.status === 'subscription_required') {
      toast.info('This integration requires a subscription. Please upgrade your plan.');
    } else if (integration.status === 'available') {
      toast.success(`Opening ${integration.name.replace('Add to ', '')} configuration...`);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 flex-shrink-0">Integrations</h1>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </>
          ) : (
            integrations.map((integration) => {
              const Icon = iconMap[integration.platform] || Zap;
              return (
                <Card
                  key={integration.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-gray-900 font-medium">{integration.name}</span>
                  </div>
                  <Button
                    variant={integration.status === 'available' ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => handleConnect(integration)}
                    disabled={integration.status === 'coming_soon'}
                  >
                    {statusLabel[integration.status]}
                  </Button>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
