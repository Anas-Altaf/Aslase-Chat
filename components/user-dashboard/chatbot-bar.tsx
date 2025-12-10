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
import { Textarea } from '@/components/ui/textarea';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Plus,
  Bot,
  Building2,
  MoreVertical,
  PanelLeftClose,
  PanelLeft,
  Edit,
  Trash2,
  Eye,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Chatbot } from '@/types';

interface ChatbotBarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ChatbotBar({ collapsed = false, onToggleCollapse }: ChatbotBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { chatbots, selectedChatbot, isInitialLoading: chatbotsLoading, addChatbot, selectChatbot, removeChatbot } = useChatbot();
  const { businesses, selectedBusiness, isInitialLoading: businessesLoading, selectBusiness, addBusiness, removeBusiness } = useBusiness();



  // Create chatbot dialog
  const [isCreateChatbotOpen, setIsCreateChatbotOpen] = useState(false);
  const [isCreatingChatbot, setIsCreatingChatbot] = useState(false);
  const [newChatbot, setNewChatbot] = useState({
    name: '',
    businessId: '',
    model: 'gpt-4o-mini' as Chatbot['model'],
    visibility: 'public' as Chatbot['visibility'],
  });

  // Create business dialog
  const [isCreateBusinessOpen, setIsCreateBusinessOpen] = useState(false);
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    urls: [''],
  });

  const userName = user?.displayName || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleCreateChatbot = async () => {
    if (!newChatbot.name.trim() || !newChatbot.businessId) return;
    setIsCreatingChatbot(true);
    try {
      await addChatbot(newChatbot);
      toast.success('Chatbot created successfully');
      setIsCreateChatbotOpen(false);
      setNewChatbot({ name: '', businessId: '', model: 'gpt-4o-mini', visibility: 'public' });
      router.push('/user-dashboard/chatbot');
    } catch (error) {
      toast.error('Failed to create chatbot');
    } finally {
      setIsCreatingChatbot(false);
    }
  };

  const handleCreateBusiness = async () => {
    if (!newBusiness.name.trim()) return;
    setIsCreatingBusiness(true);
    try {
      await addBusiness({
        ...newBusiness,
        urls: newBusiness.urls.filter(u => u.trim()),
      });
      toast.success('Business created successfully');
      setIsCreateBusinessOpen(false);
      setNewBusiness({ name: '', description: '', contactEmail: '', contactPhone: '', urls: [''] });
    } catch (error) {
      toast.error('Failed to create business');
    } finally {
      setIsCreatingBusiness(false);
    }
  };

  const handleDeleteChatbot = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeChatbot(id);
      toast.success('Chatbot deleted');
    } catch (error) {
      toast.error('Failed to delete chatbot');
    }
  };

  const handleDeleteBusiness = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeBusiness(id);
      toast.success('Business deleted');
    } catch (error) {
      toast.error('Failed to delete business');
    }
  };

  const handleSelectChatbot = (id: string) => {
    selectChatbot(id);
    router.push('/user-dashboard/chatbot');
  };

  const handleChatbotsTabClick = () => {
    router.push('/user-dashboard/chatbots');
  };

  const handleBusinessesTabClick = () => {
    router.push('/user-dashboard/businesses');
  };

  const handleSelectBusiness = (id: string) => {
    selectBusiness(id);
    router.push(`/user-dashboard/businesses/${id}`);
  };

  const isLoading = chatbotsLoading || businessesLoading;

  // COLLAPSED VIEW - Icon only
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Card className="h-full rounded-none border-r-0 border-l-0 border-t-0 border-b-0 flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 w-16 shadow-2xl">
          {/* Logo */}
          <div className="p-2 flex items-center justify-center">
            <Link href="/user-dashboard" className="block">
              <Image
                src="/AslasChat.jpg"
                alt="AslasChat Logo"
                width={40}
                height={40}
                className="max-w-[100px] rounded-lg"
              />
            </Link>
          </div>

          <Separator className="bg-white/10" />

          {/* Icons */}
          <div className="flex-1 flex flex-col items-center py-4 gap-3">
            {/* Expand button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={onToggleCollapse}
                >
                  <PanelLeft className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>

            <Separator className="w-8 my-2 bg-white/10" />

            {/* Chatbots */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-11 w-11 rounded-xl transition-all duration-300 ${pathname.includes('/chatbot')
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  onClick={handleChatbotsTabClick}
                >
                  <Bot className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Chatbots ({chatbots.length})</TooltipContent>
            </Tooltip>

            {/* Businesses */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-11 w-11 rounded-xl transition-all duration-300 ${pathname.includes('/businesses')
                    ? 'bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  onClick={handleBusinessesTabClick}
                >
                  <Building2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Businesses ({businesses.length})</TooltipContent>
            </Tooltip>

            {/* Add buttons */}
            <Separator className="w-8 my-2 bg-white/10" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 hover:from-emerald-500 hover:to-teal-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
                  onClick={() => setIsCreateChatbotOpen(true)}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Chatbot</TooltipContent>
            </Tooltip>
          </div>

          <Separator className="bg-white/10" />

          {/* Profile */}
          <div className="p-2 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/profile">
                  <Avatar className="w-10 h-10 ring-2 ring-emerald-500/50 hover:ring-emerald-500 transition-all duration-300">
                    <AvatarImage src="/chatbot.png" alt={userName} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-sm font-bold">{userInitials}</AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{userName}</TooltipContent>
            </Tooltip>
          </div>

          {/* Dialogs still need to render */}
          {renderDialogs()}
        </Card>
      </TooltipProvider>
    );
  }

  // Helper function to render dialogs (shared between collapsed and expanded views)
  function renderDialogs() {
    return (
      <>
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
                    {businesses.map((business, index) => (
                      <SelectItem key={`select-biz-${business.id}-${index}`} value={business.id}>
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

        {/* Create Business Dialog */}
        <Dialog open={isCreateBusinessOpen} onOpenChange={setIsCreateBusinessOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Business</DialogTitle>
              <DialogDescription>
                Add a new business to organize your chatbots.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="biz-name">Business Name *</Label>
                <Input
                  id="biz-name"
                  placeholder="My Company"
                  value={newBusiness.name}
                  onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-desc">Description</Label>
                <Textarea
                  id="biz-desc"
                  placeholder="Brief description of your business..."
                  value={newBusiness.description}
                  onChange={(e) => setNewBusiness({ ...newBusiness, description: e.target.value })}
                  className="text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="biz-email">Contact Email</Label>
                  <Input
                    id="biz-email"
                    type="email"
                    placeholder="contact@company.com"
                    value={newBusiness.contactEmail}
                    onChange={(e) => setNewBusiness({ ...newBusiness, contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-phone">Contact Phone</Label>
                  <Input
                    id="biz-phone"
                    placeholder="+1 (555) 123-4567"
                    value={newBusiness.contactPhone}
                    onChange={(e) => setNewBusiness({ ...newBusiness, contactPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateBusinessOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBusiness} disabled={isCreatingBusiness || !newBusiness.name.trim()}>
                {isCreatingBusiness ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // EXPANDED VIEW - Full sidebar
  return (
    <Card className="h-full rounded-none border-0 flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
      {/* Glowing top accent line */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

      {/* Logo - Centered */}
      <div className="p-4 flex items-center justify-between">
        <Link href="/user-dashboard" className="block flex-1 flex justify-center group">
          <div className="relative">
            <Image
              src="/AslasChat.jpg"
              alt="AslasChat Logo"
              width={100}
              height={60}
              className="max-w-[100px] rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
            onClick={onToggleCollapse}
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Separator className="bg-white/10" />

      {/* Expandable Sections */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-2 xl:p-3 space-y-1">

          {/* Chatbots Section */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm text-white">Chatbots</span>
                <Badge className="ml-auto text-xs bg-emerald-500/30 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/40">{chatbots.length}</Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem onClick={() => setIsCreateChatbotOpen(true)} className="text-white hover:bg-white/10">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chatbot
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Chatbots List */}
            <div className="ml-2 mt-2 space-y-2 pr-1">
              {isLoading ? (
                <>
                  <Skeleton className="h-12 rounded-xl bg-white/5" />
                  <Skeleton className="h-12 rounded-xl bg-white/5" />
                </>
              ) : chatbots.length === 0 ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-white/40 text-xs">No chatbots yet</p>
                </div>
              ) : (
                chatbots.map((chatbot, index) => (
                  <div
                    key={`chatbot-${chatbot.id}-${index}`}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl group transition-all duration-300 cursor-pointer ${selectedChatbot?.id === chatbot.id
                      ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                      : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/20'
                      }`}
                    onClick={() => handleSelectChatbot(chatbot.id)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${selectedChatbot?.id === chatbot.id
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/40'
                      : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 group-hover:from-emerald-500/40 group-hover:to-teal-500/40'
                      }`}>
                      <Avatar className="w-6 h-6 rounded">
                        <AvatarImage src="/chatbot.png" alt={chatbot.name} />
                        <AvatarFallback className="rounded bg-transparent text-white text-[10px] font-bold">
                          {chatbot.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-white truncate block">{chatbot.name.substring(0,14)}</span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wide">{chatbot.model}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        className={`text-[10px] px-2 py-0.5 border ${chatbot.status === 'trained'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                      >
                        {chatbot.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                          <DropdownMenuItem onClick={() => handleSelectChatbot(chatbot.id)} className="text-white hover:bg-white/10">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                            onClick={(e) => handleDeleteChatbot(chatbot.id, e)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Businesses Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm text-white">Businesses</span>
                <Badge className="ml-auto text-xs bg-violet-500/30 text-violet-300 border-violet-500/40 hover:bg-violet-500/40">{businesses.length}</Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem onClick={() => setIsCreateBusinessOpen(true)} className="text-white hover:bg-white/10">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Business
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Businesses List */}
            <div className="ml-2 mt-2 space-y-2 pr-1">
              {isLoading ? (
                <>
                  <Skeleton className="h-12 rounded-xl bg-white/5" />
                  <Skeleton className="h-12 rounded-xl bg-white/5" />
                </>
              ) : businesses.length === 0 ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-violet-400" />
                  </div>
                  <p className="text-white/40 text-xs">No businesses yet</p>
                </div>
              ) : (
                businesses.map((business, index) => (
                  <div
                    key={`business-${business.id}-${index}`}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl group transition-all duration-300 cursor-pointer ${selectedBusiness?.id === business.id
                        ? 'bg-gradient-to-r from-violet-500/30 to-purple-500/30 border border-violet-500/50 shadow-lg shadow-violet-500/20'
                        : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/20'
                      }`}
                    onClick={() => handleSelectBusiness(business.id)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${selectedBusiness?.id === business.id
                        ? 'bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/40'
                        : 'bg-gradient-to-br from-violet-500/20 to-purple-500/20 group-hover:from-violet-500/40 group-hover:to-purple-500/40'
                      }`}>
                      <Avatar className="w-6 h-6 rounded">
                        {business.logo ? (
                          <AvatarImage src={business.logo} alt={business.name} />
                        ) : null}
                        <AvatarFallback className="rounded bg-transparent text-white text-[10px] font-bold">
                          {business.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-white truncate block">{business.name}</span>
                      <span className="text-[10px] text-white/50">Business</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white hover:bg-white/10 rounded-lg shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem onClick={() => handleSelectBusiness(business.id)} className="text-white hover:bg-white/10">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                          onClick={(e) => handleDeleteBusiness(business.id, e)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </ScrollArea>

      <Separator className="bg-white/10" />

      {/* Profile Card */}
      <div className="p-3">
        <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all duration-300 group">
          <Avatar className="w-10 h-10 ring-2 ring-emerald-500/50 group-hover:ring-emerald-500 transition-all duration-300">
            <AvatarImage src="/chatbot.png" alt={userName} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-bold">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{userName}</p>
            <p className="text-emerald-400 text-[10px] font-medium">View Profile →</p>
          </div>
        </Link>
      </div>

      {renderDialogs()}
    </Card>
  );
}
