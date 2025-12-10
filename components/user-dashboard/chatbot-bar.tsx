'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChatbot } from '@/contexts/ChatbotContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Bot,
  Building2,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  PanelLeftClose
} from 'lucide-react';
import type { Chatbot, Business } from '@/types';

interface ChatbotBarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ChatbotBar({ collapsed = false, onToggleCollapse }: ChatbotBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { chatbots, selectedChatbot, isInitialLoading: chatbotsLoading, addChatbot, selectChatbot } = useChatbot();
  const { businesses, selectedBusiness, isInitialLoading: businessesLoading, selectBusiness } = useBusiness();

  // Expand states
  const [chatbotsExpanded, setChatbotsExpanded] = useState(true);
  const [businessesExpanded, setBusinessesExpanded] = useState(true);

  // Create chatbot dialog
  const [isCreateChatbotOpen, setIsCreateChatbotOpen] = useState(false);
  const [isCreatingChatbot, setIsCreatingChatbot] = useState(false);
  const [newChatbot, setNewChatbot] = useState({
    name: '',
    businessId: '',
    model: 'gpt-4o-mini' as Chatbot['model'],
    visibility: 'public' as Chatbot['visibility'],
  });

  const userName = user?.displayName || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleCreateChatbot = async () => {
    if (!newChatbot.name.trim() || !newChatbot.businessId) return;
    setIsCreatingChatbot(true);
    try {
      await addChatbot(newChatbot);
      setIsCreateChatbotOpen(false);
      setNewChatbot({ name: '', businessId: '', model: 'gpt-4o-mini', visibility: 'public' });
      router.push('/user-dashboard/chatbot');
    } catch (error) {
      console.error('Failed to create chatbot:', error);
    } finally {
      setIsCreatingChatbot(false);
    }
  };

  const handleSelectChatbot = (id: string) => {
    selectChatbot(id);
    router.push('/user-dashboard/chatbot');
  };

  const handleChatbotsTabClick = () => {
    setChatbotsExpanded(!chatbotsExpanded);
    // Navigate to chatbots management when clicking the tab header
    router.push('/user-dashboard/chatbots');
  };

  const handleBusinessesTabClick = () => {
    setBusinessesExpanded(!businessesExpanded);
    // Navigate to businesses management when clicking the tab header
    router.push('/user-dashboard/businesses');
  };

  const handleSelectBusiness = (id: string) => {
    selectBusiness(id);
    router.push(`/user-dashboard/businesses/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isLoading = chatbotsLoading || businessesLoading;

  return (
    <Card className="h-full rounded-none border-r border-l-0 border-t-0 border-b-0 flex flex-col bg-white">
      {/* Logo */}
      <div className="p-3 xl:p-4 flex items-center justify-between">
        <Link href="/" className="block transition-transform duration-200 hover:scale-105 flex-1">
          <Image
            src="/AslasChat.jpg"
            alt="AslasChat Logo"
            width={100}
            height={60}
            className="max-w-[120px]"
          />
        </Link>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={onToggleCollapse}
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Expandable Sections */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-2 xl:p-3 space-y-1">

          {/* Chatbots Section */}
          <div>
            <div className="flex items-center justify-between">
              <button
                onClick={handleChatbotsTabClick}
                className={`flex-1 flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all duration-150 ${pathname.includes('/chatbot') ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
              >
                {chatbotsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Bot className="w-4 h-4" />
                <span className="font-medium text-sm">Chatbots</span>
                <Badge variant="secondary" className="ml-auto text-xs">{chatbots.length}</Badge>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsCreateChatbotOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chatbot
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Chatbots List */}
            {chatbotsExpanded && (
              <div className="ml-4 mt-1 space-y-1 animate-slideDown">
                {isLoading ? (
                  <>
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                  </>
                ) : chatbots.length === 0 ? (
                  <p className="text-gray-400 text-xs px-2 py-2">No chatbots yet</p>
                ) : (
                  chatbots.map((chatbot) => (
                    <button
                      key={chatbot.id}
                      onClick={() => handleSelectChatbot(chatbot.id)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left selection-transition ${selectedChatbot?.id === chatbot.id
                          ? 'bg-green-50 border border-green-300'
                          : 'hover:bg-gray-50 border border-transparent'
                        }`}
                    >
                      <Avatar className="w-6 h-6 rounded">
                        <AvatarImage src="/chatbot.png" alt={chatbot.name} />
                        <AvatarFallback className="rounded bg-green-100 text-green-700 text-[10px]">
                          {chatbot.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-gray-800 truncate flex-1">{chatbot.name}</span>
                      <Badge
                        variant={chatbot.status === 'trained' ? 'success' : 'warning'}
                        className="text-[9px] px-1.5 py-0"
                      >
                        {chatbot.status}
                      </Badge>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Businesses Section */}
          <div>
            <div className="flex items-center justify-between">
              <button
                onClick={handleBusinessesTabClick}
                className={`flex-1 flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all duration-150 ${pathname.includes('/businesses') ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
              >
                {businessesExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Building2 className="w-4 h-4" />
                <span className="font-medium text-sm">Businesses</span>
                <Badge variant="secondary" className="ml-auto text-xs">{businesses.length}</Badge>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/user-dashboard/businesses/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Business
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Businesses List */}
            {businessesExpanded && (
              <div className="ml-4 mt-1 space-y-1 animate-slideDown">
                {isLoading ? (
                  <>
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                  </>
                ) : businesses.length === 0 ? (
                  <p className="text-gray-400 text-xs px-2 py-2">No businesses yet</p>
                ) : (
                  businesses.map((business) => (
                    <button
                      key={business.id}
                      onClick={() => handleSelectBusiness(business.id)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left selection-transition ${selectedBusiness?.id === business.id
                          ? 'bg-green-50 border border-green-300'
                          : 'hover:bg-gray-50 border border-transparent'
                        }`}
                    >
                      <Avatar className="w-6 h-6 rounded">
                        {business.logo ? (
                          <AvatarImage src={business.logo} alt={business.name} />
                        ) : null}
                        <AvatarFallback className="rounded bg-purple-100 text-purple-700 text-[10px]">
                          {business.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-gray-800 truncate flex-1">{business.name}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      </ScrollArea>

      <Separator />

      {/* Profile Card */}
      <div className="p-2 xl:p-3">
        <Link href="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/chatbot.png" alt={userName} />
            <AvatarFallback className="bg-green-100 text-green-700 text-xs">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-xs font-medium truncate">{userName}</p>
            <p className="text-green-600 text-[10px]">Profile →</p>
          </div>
        </Link>
      </div>

      {/* Create Chatbot Dialog */}
      <Dialog open={isCreateChatbotOpen} onOpenChange={setIsCreateChatbotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Chatbot</DialogTitle>
            <DialogDescription>
              Add a new chatbot to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chatbot-name">Name</Label>
              <Input
                id="chatbot-name"
                placeholder="My Chatbot"
                value={newChatbot.name}
                onChange={(e) => setNewChatbot({ ...newChatbot, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatbot-business">Business</Label>
              <Select
                value={newChatbot.businessId}
                onValueChange={(value) => setNewChatbot({ ...newChatbot, businessId: value })}
              >
                <SelectTrigger id="chatbot-business">
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatbot-model">Model</Label>
              <Select
                value={newChatbot.model}
                onValueChange={(value) => setNewChatbot({ ...newChatbot, model: value as Chatbot['model'] })}
              >
                <SelectTrigger id="chatbot-model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatbot-visibility">Visibility</Label>
              <Select
                value={newChatbot.visibility}
                onValueChange={(value) => setNewChatbot({ ...newChatbot, visibility: value as Chatbot['visibility'] })}
              >
                <SelectTrigger id="chatbot-visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateChatbotOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateChatbot} disabled={isCreatingChatbot || !newChatbot.name.trim() || !newChatbot.businessId}>
              {isCreatingChatbot ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
