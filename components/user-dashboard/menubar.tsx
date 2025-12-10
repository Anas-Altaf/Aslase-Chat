'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  Share2,
  Trash2,
  LayoutDashboard,
  Database,
  Settings,
  Code,
  Zap,
  Menu,
  X
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
  submenu?: { label: string; href: string }[];
}

const activeClass = "bg-green-500 text-white shadow-sm hover:bg-green-600";

export default function Menubar() {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { selectedChatbot, removeChatbot } = useChatbot();

  const menuItems: MenuItem[] = [
    {
      label: 'Chatbot',
      icon: <Code className="w-4 h-4 lg:w-5 lg:h-5" />,
      href: '/user-dashboard/chatbot',
    },
    {
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4 lg:w-5 lg:h-5" />,
      submenu: [
        { label: 'Chat Logs', href: '/user-dashboard/chat-logs' },
        { label: 'Leads', href: '/user-dashboard/leads' },
        { label: 'Analytics', href: '/user-dashboard/analytics' },
      ],
    },
    {
      label: 'Sources',
      icon: <Database className="w-4 h-4 lg:w-5 lg:h-5" />,
      href: '/user-dashboard/sources',
    },
    {
      label: 'Integrations',
      icon: <Zap className="w-4 h-4 lg:w-5 lg:h-5" />,
      href: '/user-dashboard/integrations',
    },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4 lg:w-5 lg:h-5" />,
      submenu: [
        { label: 'General', href: '/user-dashboard/settings/general' },
        { label: 'Model', href: '/user-dashboard/settings/model' },
        { label: 'Chat Interface', href: '/user-dashboard/settings/chat-interface' },
        { label: 'Security', href: '/user-dashboard/settings/security' },
        { label: 'Notifications', href: '/user-dashboard/settings/notifications' },
      ],
    },
    {
      label: 'Embed on Site',
      icon: <Code className="w-4 h-4 lg:w-5 lg:h-5" />,
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
    <div className="bg-gradient-to-b from-green-50/50 to-white flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 p-3 lg:p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-lg transition-all duration-150",
                    isParentActive(item)
                      ? activeClass
                      : "text-gray-600 hover:bg-gray-100/80"
                  )}
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      expandedMenu === item.label ? "rotate-180" : ""
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-lg transition-all duration-150",
                    isActive(item.href)
                      ? activeClass
                      : "text-gray-600 hover:bg-gray-100/80"
                  )}
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                </Link>
              )}

              {/* Submenu */}
              {item.submenu && expandedMenu === item.label && (
                <div className="ml-3 lg:ml-4 mt-1 space-y-0.5 border-l-2 border-green-200 pl-3 lg:pl-4 animate-slideDown">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 lg:px-3 lg:py-2 text-sm rounded-lg transition-all duration-150 block",
                        pathname.startsWith(subitem.href)
                          ? activeClass
                          : "text-gray-600 hover:text-green-700 hover:bg-green-50/50"
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

      <div className="p-3 lg:p-4 space-y-2">
        <Button variant="outline" className="w-full text-sm" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Share</span>
        </Button>
        <Button
          variant="destructive"
          className="w-full text-sm"
          size="sm"
          onClick={() => setIsDeleteOpen(true)}
          disabled={!selectedChatbot}
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Delete</span>
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chatbot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedChatbot?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
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
