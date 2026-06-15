'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LogOut, ChevronRight, Home, Bell, MessageSquare, UserPlus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationStore } from '@/store/notification.store';
import { formatDistanceToNow } from 'date-fns';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    if (label === 'User Dashboard') {
      label = 'Dashboard';
    }
    breadcrumbs.push({ label, href: currentPath });
  }

  if (breadcrumbs.length > 0) {
    delete breadcrumbs[breadcrumbs.length - 1].href;
  }

  return breadcrumbs;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { notifications, unreadCount, markAllRead, markRead } = useNotificationStore();

  const breadcrumbs = generateBreadcrumbs(pathname);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-100/50 px-4 py-2 flex items-center justify-between shadow-sm">
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-br from-green-400 via-emerald-500 to-teal-500"></div>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2">
        <Link
          href="/user-dashboard"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Home className="w-4 h-4 text-gray-500" />
        </Link>

        {breadcrumbs.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 animate-fadeIn"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ChevronRight className="w-4 h-4 text-gray-300" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-all duration-300 hover:scale-105 relative group px-2 py-1 rounded-lg hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-bold px-3 py-1.5 rounded-lg bg-linear-to-br from-green-50 to-emerald-50 border border-green-100">
                <span className="bg-linear-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {item.label}
                </span>
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Right side: Notification Bell + Logout */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl text-gray-600 hover:bg-gray-100"
              onClick={markAllRead}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.slice(0, 10).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        markRead(n.id);
                        if (n.type === 'new_lead') {
                          router.push('/user-dashboard/leads');
                        } else {
                          router.push(`/user-dashboard/chat-logs${n.sessionId ? `?session=${n.sessionId}` : ''}`);
                        }
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex gap-3 items-start"
                    >
                      <div className={`mt-0.5 rounded-full p-1.5 shrink-0 ${
                        n.type === 'new_lead' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {n.type === 'new_lead' ? (
                          <UserPlus className="w-3 h-3" />
                        ) : (
                          <MessageSquare className="w-3 h-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {n.chatbotName}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {n.type === 'new_lead' ? `New lead: ${n.leadName}` : n.preview}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-gray-600 hover:text-white hover:bg-linear-to-br hover:from-red-500 hover:to-rose-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 group rounded-xl"
        >
          <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          Logout
        </Button>
      </div>
    </header>
  );
}
