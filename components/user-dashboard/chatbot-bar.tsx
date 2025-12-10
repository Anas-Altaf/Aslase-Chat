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
import { Plus } from 'lucide-react';
import type { Chatbot } from '@/types';

export default function ChatbotBar() {
  const { user } = useAuth();
  const { chatbots, selectedChatbot, isLoading, addChatbot, selectChatbot } = useChatbot();
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

  return (
    <Card className="w-64 rounded-none border-r border-l-0 border-t-0 border-b-0 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="block transition-transform duration-200 hover:scale-105">
          <Image
            src="/AslasChat.jpg"
            alt="AslasChat Logo"
            width={120}
            height={80}
            className="w-full"
          />
        </Link>
      </div>

      <Separator />

      {/* Chatbots Section */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-700 font-semibold text-sm">Chatbots</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chatbot</DialogTitle>
                <DialogDescription>
                  Add a new chatbot to your account. You can configure it after creation.
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
                  {isCreating ? 'Creating...' : 'Create Chatbot'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1 h-[calc(100%-2rem)]">
          <div className="space-y-2">
            {isLoading ? (
              // Loading skeletons
              <>
                <div className="flex items-center gap-3 p-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="h-4 flex-1" />
                </div>
                <div className="flex items-center gap-3 p-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              </>
            ) : chatbots.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No chatbots yet. Create one!
              </p>
            ) : (
              chatbots.map((chatbot) => (
                <button
                  key={chatbot.id}
                  onClick={() => selectChatbot(chatbot.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-150 text-left ${selectedChatbot?.id === chatbot.id
                      ? 'bg-green-100 border border-green-200'
                      : 'hover:bg-gray-50'
                    }`}
                >
                  <Avatar className="w-10 h-10 rounded-lg">
                    <AvatarImage src="/chatbot.png" alt={chatbot.name} />
                    <AvatarFallback className="rounded-lg bg-green-100 text-green-700">
                      {chatbot.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-800 text-sm font-medium truncate block">
                      {chatbot.name}
                    </span>
                    <Badge
                      variant={chatbot.status === 'trained' ? 'success' : chatbot.status === 'training' ? 'warning' : 'destructive'}
                      className="text-xs mt-1"
                    >
                      {chatbot.status}
                    </Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Profile Card */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/chatbot.png" alt={userName} />
            <AvatarFallback className="bg-green-100 text-green-700">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-sm font-medium truncate">
              {userName}
            </p>
            <Link
              href="/profile"
              className="text-green-600 text-xs hover:text-green-700 transition-colors"
            >
              View Profile →
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
