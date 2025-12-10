'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Share2, Trash2, LayoutDashboard, Database, Settings, Code, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    <div className="bg-gradient-to-b from-green-50/50 to-white flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-150",
                    isParentActive(item)
                      ? 'bg-green-100/80 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100/80'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      expandedMenu === item.label ? 'rotate-180' : ''
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-150",
                    item.label === 'Embed on Site'
                      ? 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
                      : isActive(item.href)
                        ? 'bg-green-100/80 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100/80'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                </Link>
              )}

              {/* Submenu */}
              {item.submenu && expandedMenu === item.label && (
                <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-green-200 pl-4">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-150 block",
                        pathname === subitem.href
                          ? 'text-green-700 bg-green-50 font-medium'
                          : 'text-gray-600 hover:text-green-700 hover:bg-green-50/50'
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
      </ScrollArea>

      <Separator />

      {/* Share and Delete Buttons */}
      <div className="p-4 space-y-2">
        <Button variant="outline" className="w-full">
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
