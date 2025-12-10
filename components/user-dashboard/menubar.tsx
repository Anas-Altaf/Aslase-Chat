'use client';

import { useState } from 'react';
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
  Palette
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  submenu?: { label: string; href: string; icon: React.ElementType }[];
}

export default function Menubar() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { selectedChatbot, removeChatbot } = useChatbot();

  const menuItems: MenuItem[] = [
    {
      label: 'Chatbot',
      icon: <Bot className="w-5 h-5" />,
      href: '/user-dashboard/chatbot',
    },
    {
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
      submenu: [
        { label: 'Chat Logs', href: '/user-dashboard/chat-logs', icon: MessageSquare },
        { label: 'Leads', href: '/user-dashboard/leads', icon: Users },
        { label: 'Analytics', href: '/user-dashboard/analytics', icon: BarChart },
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
        { label: 'General', href: '/user-dashboard/settings/general', icon: Settings },
        { label: 'Model', href: '/user-dashboard/settings/model', icon: Bot },
        { label: 'Chat Interface', href: '/user-dashboard/settings/chat-interface', icon: Palette },
        { label: 'Security', href: '/user-dashboard/settings/security', icon: Shield },
        { label: 'Notifications', href: '/user-dashboard/settings/notifications', icon: Bell },
      ],
    },
    {
      label: 'Embed on Site',
      icon: <Code className="w-5 h-5" />,
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
      toast.error('Failed to delete chatbot');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    if (selectedChatbot) {
      navigator.clipboard.writeText(`https://app.aslaschat.ai/chatbot/${selectedChatbot.id}`);
      toast.success('Share link copied to clipboard!');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-green-50/30 flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {item.submenu ? (
                <div className="space-y-1">
                  {/* Section header */}
                  <div className="px-3 py-2 flex items-center gap-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {/* Submenu items */}
                  <div className="ml-2 space-y-1 border-l-2 border-gray-100 pl-3">
                    {item.submenu.map((subitem) => {
                      const SubIcon = subitem.icon;
                      const isSubActive = pathname.startsWith(subitem.href);
                      return (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden",
                            isSubActive
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 font-semibold"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                          )}
                        >
                          <SubIcon className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            !isSubActive && "group-hover:scale-110"
                          )} />
                          <span>{subitem.label}</span>
                          {!isSubActive && (
                            <span className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  )}
                >
                  <span className={cn(
                    "transition-transform duration-300",
                    !isActive(item.href) && "group-hover:scale-110"
                  )}>
                    {item.icon}
                  </span>
                  <span className="font-semibold text-sm">{item.label}</span>
                  {!isActive(item.href) && (
                    <span className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator className="bg-gray-100" />

      {/* Action Buttons */}
      <div className="p-4 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-700 hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 group"
          size="default"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          Share Chatbot
        </Button>
        <Button
          variant="outline"
          className="w-full justify-center gap-2 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-600 hover:from-red-500 hover:to-rose-500 hover:text-white hover:border-transparent transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 group"
          size="default"
          onClick={() => setIsDeleteOpen(true)}
          disabled={!selectedChatbot}
        >
          <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          Delete Chatbot
        </Button>
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
    </div>
  );
}
