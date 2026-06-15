'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Share2,
  Trash2,
  LayoutDashboard,
  Database,
  Settings,
  Code,
  Zap,
  Bot,
  MessageSquare,
  Users,
  BarChart,
  Bell,
  Shield,
  Palette,
  Search,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
} from 'lucide-react';
import { useState as useTestState } from 'react';
import TestChatbotPanel from '@/components/user-dashboard/test-chatbot-panel';
import { useChatbot } from '@/contexts/ChatbotContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  submenu?: { label: string; href: string; icon: React.ElementType }[];
}

export default function Menubar() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('menubar_collapsed') === 'true';
    }
    return false;
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTestOpen, setIsTestOpen] = useTestState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { selectedChatbot, removeChatbot } = useChatbot();

  useEffect(() => {
    localStorage.setItem('menubar_collapsed', String(collapsed));
  }, [collapsed]);

  const menuItems: MenuItem[] = [
    {
      label: 'Chatbot',
      icon: <Bot className="w-5 h-5 shrink-0" />,
      href: '/user-dashboard/chatbot',
    },
    {
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      submenu: [
        { label: 'Chat Logs', href: '/user-dashboard/chat-logs', icon: MessageSquare },
        { label: 'Leads', href: '/user-dashboard/leads', icon: Users },
        { label: 'Queries', href: '/user-dashboard/queries', icon: Search },
        { label: 'Analytics', href: '/user-dashboard/analytics', icon: BarChart },
        { label: 'Users', href: '/user-dashboard/users', icon: UserIcon },
      ],
    },
    {
      label: 'Training',
      icon: <Database className="w-5 h-5 shrink-0" />,
      href: '/user-dashboard/sources',
    },
    {
      label: 'Integrations',
      icon: <Zap className="w-5 h-5 shrink-0" />,
      href: '/user-dashboard/integrations',
    },
    {
      label: 'Settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
      submenu: [
        { label: 'General', href: '/user-dashboard/settings/general', icon: Settings },
        { label: 'Model', href: '/user-dashboard/settings/model', icon: Bot },
        { label: 'Chat Interface', href: '/user-dashboard/settings/chat-interface', icon: Palette },
        { label: 'Tuning', href: '/user-dashboard/settings/security', icon: Shield },
        { label: 'Notifications', href: '/user-dashboard/settings/notifications', icon: Bell },
      ],
    },
    {
      label: 'Embed on Site',
      icon: <Code className="w-5 h-5 shrink-0" />,
      href: '/user-dashboard/embed',
    },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname.startsWith(href);
  };

  const handleDelete = async () => {
    if (!selectedChatbot) return;
    setIsDeleting(true);
    try {
      await removeChatbot(selectedChatbot.id);
      toast.success('Chatbot deleted successfully');
      setIsDeleteOpen(false);
      router.push('/user-dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete chatbot');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    if (selectedChatbot) {
      const url = `${window.location.origin}/chatbot/${selectedChatbot.id}`;
      navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard!');
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="bg-linear-to-br from-gray-50 via-white to-green-50/30 flex flex-col h-full overflow-hidden">
        {/* Collapse toggle */}
        <div className={cn('flex shrink-0 pt-2 pb-1', collapsed ? 'justify-center px-1' : 'justify-end px-3')}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <ScrollArea className="flex-1 px-2 pb-2">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <div key={item.label} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                {item.submenu ? (
                  collapsed ? (
                    // Collapsed: show each submenu item as standalone icon
                    <div className="space-y-1 py-1">
                      {item.submenu.map((subitem) => {
                        const SubIcon = subitem.icon;
                        const isSubActive = pathname.startsWith(subitem.href);
                        return (
                          <Tooltip key={subitem.href}>
                            <TooltipTrigger asChild>
                              <Link
                                href={subitem.href}
                                className={cn(
                                  'flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200',
                                  isSubActive
                                    ? 'bg-linear-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/80',
                                )}
                              >
                                <SubIcon className="w-4 h-4" />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs">
                              {subitem.label}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ) : (
                    // Expanded: section header + indented submenu
                    <div className="space-y-1">
                      <div className="px-3 py-1.5 flex items-center gap-2 text-gray-400 text-[10px] font-semibold uppercase tracking-wider">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <div className="ml-2 space-y-0.5 border-l-2 border-gray-100 pl-3">
                        {item.submenu.map((subitem) => {
                          const SubIcon = subitem.icon;
                          const isSubActive = pathname.startsWith(subitem.href);
                          return (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              className={cn(
                                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden',
                                isSubActive
                                  ? 'bg-linear-to-br from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/20 font-semibold'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80',
                              )}
                            >
                              <SubIcon className={cn('w-4 h-4 shrink-0 transition-transform duration-200', !isSubActive && 'group-hover:scale-110')} />
                              <span>{subitem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )
                ) : collapsed ? (
                  // Collapsed: icon-only with tooltip
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href!}
                        className={cn(
                          'flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200',
                          isActive(item.href)
                            ? 'bg-linear-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/80',
                        )}
                      >
                        {item.icon}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  // Expanded: icon + label
                  <Link
                    href={item.href!}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden',
                      isActive(item.href)
                        ? 'bg-linear-to-br from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/20'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80',
                    )}
                  >
                    <span className={cn('transition-transform duration-200', !isActive(item.href) && 'group-hover:scale-110')}>
                      {item.icon}
                    </span>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator className="bg-gray-100" />

        {/* Action Buttons */}
        <div className={cn('p-2 space-y-1.5', collapsed && 'flex flex-col items-center')}>
          {collapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsTestOpen(true)}
                    disabled={!selectedChatbot}
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 transition-colors"
                  >
                    <FlaskConical className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Test Chatbot</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Share Chatbot</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    disabled={!selectedChatbot}
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Delete Chatbot</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full justify-center gap-2 bg-linear-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700 hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent transition-all duration-300 group"
                size="sm"
                onClick={() => setIsTestOpen(true)}
                disabled={!selectedChatbot}
              >
                <FlaskConical className="w-4 h-4" />
                Test Chatbot
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center gap-2 bg-linear-to-br from-blue-50 to-cyan-50 border-blue-200 text-blue-700 hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all duration-300 group"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Share Chatbot
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center gap-2 bg-linear-to-br from-red-50 to-rose-50 border-red-200 text-red-600 hover:from-red-500 hover:to-rose-500 hover:text-white hover:border-transparent transition-all duration-300 group"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
                disabled={!selectedChatbot}
              >
                <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Delete Chatbot
              </Button>
            </>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Delete Chatbot</DialogTitle>
              <DialogDescription className="text-gray-500">
                Are you sure you want to delete "{selectedChatbot?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Test Chatbot Panel */}
        {selectedChatbot && (
          <TestChatbotPanel
            open={isTestOpen}
            onClose={() => setIsTestOpen(false)}
            chatbotId={selectedChatbot.id}
            chatbotName={selectedChatbot.name}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
