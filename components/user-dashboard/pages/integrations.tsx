'use client';

import { Zap, MessageCircle, Globe, ShoppingCart, Instagram } from 'lucide-react';

export default function Integrations() {
  const integrations = [
    { id: 1, name: 'Add to Slack', icon: Zap, status: 'Coming Soon', statusColor: 'bg-yellow-100 text-yellow-700' },
    { id: 2, name: 'Add to WhatsApp', icon: MessageCircle, status: 'Subscription Required', statusColor: 'bg-green-100 text-green-700' },
    { id: 3, name: 'Add to Wordpress', icon: Globe, status: 'Integrate', statusColor: 'bg-green-100 text-green-700' },
    { id: 4, name: 'Add to Messenger', icon: MessageCircle, status: 'Coming Soon', statusColor: 'bg-yellow-100 text-yellow-700' },
    { id: 5, name: 'Add to Shopify', icon: ShoppingCart, status: 'Subscription Required', statusColor: 'bg-green-100 text-green-700' },
    { id: 6, name: 'Add to Instagram', icon: Instagram, status: 'Coming Soon', statusColor: 'bg-yellow-100 text-yellow-700' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-2xl font-bold text-gray-900 mb-3 flex-shrink-0">Integrations</h1>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div key={integration.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium text-sm">{integration.name}</span>
                </div>
                <button className={`px-3 py-1 rounded text-xs font-medium ${integration.statusColor}`}>
                  {integration.status}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
