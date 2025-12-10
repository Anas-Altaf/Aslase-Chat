'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useChatbot } from '@/contexts/ChatbotContext';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Bot, Calendar, PanelLeftClose } from 'lucide-react';
import type { Chatbot } from '@/types';

interface ChatbotBarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ChatbotBar({ collapsed = false, onToggleCollapse }: ChatbotBarProps) {
  const { user } = useAuth();
  const { chatbots, selectedChatbot, isInitialLoading, addChatbot, selectChatbot } = useChatbot();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newChatbot, setNewChatbot] = useState({
    name: '',
    model: 'gpt-4o-mini' as Chatbot['model'],
    visibility: 'public' as Chatbot['visibility'],
  });

  const userName = user?.displayName || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleCreate = async () => {
    if (!newChatbot.name.trim()) return;
    setIsCreating(true);
    try {
      await addChatbot(newChatbot);
      setIsCreateOpen(false);
      setNewChatbot({ name: '', model: 'gpt-4o-mini', visibility: 'public' });
    } catch (error) {
      console.error('Failed to create chatbot:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelect = (id: string) => {
    selectChatbot(id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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

      {/* Chatbots Section */}
      <div className="flex-1 overflow-hidden p-2 xl:p-3">
        <div className="flex items-center justify-between mb-2 xl:mb-3 px-1">
          <h2 className="text-gray-700 font-semibold text-xs xl:text-sm">Chatbots</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Chatbot</DialogTitle>
                <DialogDescription>
                  Add a new chatbot to your account.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="My Chatbot"
                    value={newChatbot.name}
                    onChange={(e) => setNewChatbot({ ...newChatbot, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select
                    value={newChatbot.model}
                    onValueChange={(value) => setNewChatbot({ ...newChatbot, model: value as Chatbot['model'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={newChatbot.visibility}
                    onValueChange={(value) => setNewChatbot({ ...newChatbot, visibility: value as Chatbot['visibility'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={isCreating || !newChatbot.name.trim()}>
                  {isCreating ? 'Creating...' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1 h-[calc(100%-2rem)]">
          <div className="space-y-1.5">
            {isInitialLoading ? (
              <>
                <ChatbotCardSkeleton />
                <ChatbotCardSkeleton />
              </>
            ) : chatbots.length === 0 ? (
              <div className="text-center py-6">
                <Bot className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs">No chatbots</p>
                <Button
                  variant="link"
                  className="text-green-600 text-xs p-0 h-auto mt-1"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create one
                </Button>
              </div>
            ) : (
              chatbots.map((chatbot) => (
                <ChatbotCard
                  key={chatbot.id}
                  chatbot={chatbot}
                  isSelected={selectedChatbot?.id === chatbot.id}
                  onSelect={() => handleSelect(chatbot.id)}
                  formatDate={formatDate}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

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
    </Card>
  );
}

function ChatbotCard({
  chatbot,
  isSelected,
  onSelect,
  formatDate
}: {
  chatbot: Chatbot;
  isSelected: boolean;
  onSelect: () => void;
  formatDate: (date: string) => string;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-2.5 rounded-lg selection-transition ${isSelected
        ? 'bg-green-50 border border-green-400 ring-2 ring-green-200/60 shadow-sm'
        : 'bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 hover:shadow-sm'
        }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Avatar className="w-8 h-8 rounded-md flex-shrink-0">
          <AvatarImage src="/chatbot.png" alt={chatbot.name} />
          <AvatarFallback className="rounded-md bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 text-xs font-semibold">
            {chatbot.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-xs font-semibold truncate">
            {chatbot.name}
          </p>
          <p className="text-gray-400 text-[10px]">
            {chatbot.model.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1">
        <Badge
          variant={chatbot.status === 'trained' ? 'success' : chatbot.status === 'training' ? 'warning' : 'destructive'}
          className="text-[10px] px-1.5 py-0"
        >
          {chatbot.status}
        </Badge>
        <div className="flex items-center gap-0.5 text-gray-400">
          <Calendar className="w-2.5 h-2.5" />
          <span className="text-[10px]">{formatDate(chatbot.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}

function ChatbotCardSkeleton() {
  return (
    <div className="p-2.5 rounded-lg border border-gray-100 bg-white">
      <div className="flex items-center gap-2 mb-1.5">
        <Skeleton className="w-8 h-8 rounded-md" />
        <div className="flex-1">
          <Skeleton className="h-3 w-20 mb-1" />
          <Skeleton className="h-2 w-12" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-2 w-14" />
      </div>
    </div>
  );
}
