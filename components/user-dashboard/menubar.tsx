'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Share2, Trash2, LayoutDashboard, Database, Settings, Code, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  submenu?: { label: string; href: string }[];
}

export default function Menubar() {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      label: 'Chatbot',
      icon: <Code className="w-5 h-5" />,
      href: '/user-dashboard/chatbot',
    },
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      submenu: [
        { label: 'Chat Logs', href: '/user-dashboard/chat-logs' },
        { label: 'Leads', href: '/user-dashboard/leads' },
        { label: 'Analytics', href: '/user-dashboard/analytics' },
      ],
    },
    {
      label: 'Sources',
      icon: <Database className="w-5 h-5" />,
      href: '/user-dashboard/sources',
    },
    {
      label: 'Integrations',
      icon: <Zap className="w-5 h-5" />,
      href: '/user-dashboard/integrations',
    },
    {
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      submenu: [
        { label: 'General', href: '/user-dashboard/settings/general' },
        { label: 'Model', href: '/user-dashboard/settings/model' },
        { label: 'Chat Interface', href: '/user-dashboard/settings/chat-interface' },
        { label: 'Security', href: '/user-dashboard/settings/security' },
        { label: 'Notifications', href: '/user-dashboard/settings/notifications' },
        { label: 'Domains', href: '/user-dashboard/settings/domains' },
      ],
    },
    {
      label: 'Embed on Site',
      icon: <Code className="w-5 h-5" />,
      href: '/user-dashboard/embed',
    },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname.startsWith(href);
  };

  const isParentActive = (item: MenuItem) => {
    if (item.href && isActive(item.href)) return true;
    if (item.submenu) {
      return item.submenu.some(sub => pathname.startsWith(sub.href));
    }
    return false;
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white flex flex-col h-full overflow-hidden">
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.submenu ? (
              <button
                onClick={() => toggleMenu(item.label)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                  isParentActive(item)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    expandedMenu === item.label ? 'rotate-180' : ''
                  )}
                />
              </button>
            ) : (
              <Link
                href={item.href!}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                  item.label === 'Embed on Site'
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : isActive(item.href)
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            )}

            {/* Submenu */}
            {item.submenu && expandedMenu === item.label && (
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-green-300 pl-4 max-h-40 overflow-y-auto">
                {item.submenu.map((subitem) => (
                  <Link
                    key={subitem.href}
                    href={subitem.href}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm rounded transition-colors block",
                      pathname === subitem.href
                        ? 'text-green-700 bg-green-50 font-medium'
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                    )}
                  >
                    {subitem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Share and Delete Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-3 flex-shrink-0">
        <Button variant="ghost" className="w-full border border-gray-300">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button variant="destructive" className="w-full">
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
