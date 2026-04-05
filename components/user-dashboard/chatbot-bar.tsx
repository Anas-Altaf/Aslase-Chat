'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChatbot } from '@/contexts/ChatbotContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Plus, Bot, Building2, MoreVertical, Trash2, Eye, Edit, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Chatbot } from '@/types';

interface ChatbotBarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onDropdownOpenChange?: (open: boolean) => void;
}

export default function ChatbotBar({ collapsed = false, onToggleCollapse, onDropdownOpenChange }: ChatbotBarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
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
  const [businessDocuments, setBusinessDocuments] = useState<File[]>([]);

  const userName = user?.displayName || 'User';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  const handleCreateChatbot = async () => {
    if (!newChatbot.name.trim() || !newChatbot.businessId) return;
    setIsCreatingChatbot(true);
    try {
      await addChatbot(newChatbot);
      toast.success('Chatbot created successfully');
      setIsCreateChatbotOpen(false);
      setNewChatbot({ name: '', businessId: '', model: 'gpt-4o-mini', visibility: 'public' });
      router.push('/user-dashboard/chatbot');
    } catch {
      toast.error('Failed to create chatbot');
    } finally {
      setIsCreatingChatbot(false);
    }
  };

  const handleCreateBusiness = async () => {
    if (!newBusiness.name.trim()) return;
    setIsCreatingBusiness(true);
    try {
      await addBusiness({ ...newBusiness, urls: newBusiness.urls.filter((u) => u.trim()) }, businessDocuments);
      toast.success('Business created successfully');
      setIsCreateBusinessOpen(false);
      setNewBusiness({ name: '', description: '', contactEmail: '', contactPhone: '', urls: [''] });
      setBusinessDocuments([]);
    } catch {
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
    } catch {
      toast.error('Failed to delete chatbot');
    }
  };

  const handleDeleteBusiness = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeBusiness(id);
      toast.success('Business deleted');
    } catch {
      toast.error('Failed to delete business');
    }
  };

  const handleSelectChatbot = (id: string) => {
    selectChatbot(id);
    router.push('/user-dashboard/chatbot');
  };

  const handleSelectBusiness = (id: string) => {
    selectBusiness(id);
    router.push(`/user-dashboard/businesses/${id}`);
  };

  const isLoading = chatbotsLoading || businessesLoading;

  return (
    <TooltipProvider delayDuration={150} disableHoverableContent>
      <aside
        className={cn(
          'h-full flex flex-col bg-white border-r border-gray-200/70 shadow-2xl overflow-hidden',
          'transition-[width] duration-200 ease-out',
          collapsed ? 'w-14' : 'w-60',
        )}
      >
        {/* Accent line */}
        <div className="h-0.5 bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-500 shrink-0" />

        {/* Logo */}
        <div className="flex items-center justify-center px-2 py-2 shrink-0 overflow-hidden">
          <Link href="/user-dashboard" className="block shrink-0">
            {collapsed ? (
              <Image src="/AslasChat.jpg" alt="Aslas" width={32} height={32} className="rounded-lg" />
            ) : (
              <Image src="/AslasChat.jpg" alt="AslasChat Logo" width={90} height={50} className="rounded-lg max-w-22.5" />
            )}
          </Link>
        </div>

        <div className="h-px bg-gray-100 shrink-0" />

        {/* Scrollable content */}
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="py-2 px-1.5 space-y-0.5">

            {/* ── Chatbots section ── */}
            <div className="mb-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => router.push('/user-dashboard/chatbots')}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors overflow-hidden"
                  >
                    <Bot className="w-4 h-4 text-gray-600 shrink-0" />
                    <span className={cn('text-xs font-semibold text-gray-600 uppercase tracking-wider truncate', collapsed && 'hidden')}>
                      Chatbots
                    </span>
                    {!collapsed && (
                      <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5 font-medium shrink-0">
                        {chatbots.length}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Chatbots ({chatbots.length})</TooltipContent>}
              </Tooltip>

              {/* Chatbot items */}
              <div className="space-y-0.5 mt-0.5">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 rounded-lg mx-1" />
                    <Skeleton className="h-8 rounded-lg mx-1" />
                  </>
                ) : (
                  chatbots.map((chatbot, index) => (
                    <Tooltip key={`chatbot-${chatbot.id}-${index}`}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer group transition-colors overflow-hidden',
                            selectedChatbot?.id === chatbot.id
                              ? 'bg-emerald-50 border border-emerald-200'
                              : 'hover:bg-gray-50',
                          )}
                          onClick={() => handleSelectChatbot(chatbot.id)}
                        >
                          <Avatar className="w-7 h-7 shrink-0 rounded-lg">
                            <AvatarImage src="/chatbot.png" alt={chatbot.name} />
                            <AvatarFallback
                              className={cn(
                                'rounded-lg text-[10px] font-bold',
                                selectedChatbot?.id === chatbot.id
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-emerald-100 text-emerald-700',
                              )}
                            >
                              {chatbot.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className={cn('text-xs text-gray-700 font-medium truncate flex-1 min-w-0', collapsed && 'hidden')}>
                            {chatbot.name}
                          </span>
                          {!collapsed && (
                            <DropdownMenu onOpenChange={(open) => onDropdownOpenChange?.(open)}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-emerald-600 shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSelectChatbot(chatbot.id)}>
                                  <Eye className="w-3.5 h-3.5 mr-2" /> View
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={(e) => handleDeleteChatbot(chatbot.id, e)}
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right">{chatbot.name}</TooltipContent>}
                    </Tooltip>
                  ))
                )}
              </div>

              {/* Add chatbot */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsCreateChatbotOpen(true)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 mt-0.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors overflow-hidden"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span className={cn('text-xs font-medium truncate', collapsed && 'hidden')}>Add Chatbot</span>
                  </button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Add Chatbot</TooltipContent>}
              </Tooltip>
            </div>

            <div className="h-px bg-gray-100 my-1" />

            {/* ── Businesses section ── */}
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => router.push('/user-dashboard/businesses')}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors overflow-hidden"
                  >
                    <Building2 className="w-4 h-4 text-gray-600 shrink-0" />
                    <span className={cn('text-xs font-semibold text-gray-600 uppercase tracking-wider truncate', collapsed && 'hidden')}>
                      Businesses
                    </span>
                    {!collapsed && (
                      <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5 font-medium shrink-0">
                        {businesses.length}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Businesses ({businesses.length})</TooltipContent>}
              </Tooltip>

              {/* Business items */}
              <div className="space-y-0.5 mt-0.5">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 rounded-lg mx-1" />
                  </>
                ) : (
                  businesses.map((business, index) => (
                    <Tooltip key={`business-${business.id}-${index}`}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer group transition-colors overflow-hidden',
                            selectedBusiness?.id === business.id
                              ? 'bg-violet-50 border border-violet-200'
                              : 'hover:bg-gray-50',
                          )}
                          onClick={() => handleSelectBusiness(business.id)}
                        >
                          <Avatar className="w-7 h-7 shrink-0 rounded-lg">
                            {business.logo && <AvatarImage src={business.logo} alt={business.name} />}
                            <AvatarFallback
                              className={cn(
                                'rounded-lg text-[10px] font-bold',
                                selectedBusiness?.id === business.id
                                  ? 'bg-violet-500 text-white'
                                  : 'bg-violet-100 text-violet-700',
                              )}
                            >
                              {business.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className={cn('text-xs text-gray-700 font-medium truncate flex-1 min-w-0', collapsed && 'hidden')}>
                            {business.name}
                          </span>
                          {!collapsed && (
                            <DropdownMenu onOpenChange={(open) => onDropdownOpenChange?.(open)}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-violet-600 shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSelectBusiness(business.id)}>
                                  <Edit className="w-3.5 h-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={(e) => handleDeleteBusiness(business.id, e)}
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right">{business.name}</TooltipContent>}
                    </Tooltip>
                  ))
                )}
              </div>

              {/* Add business */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsCreateBusinessOpen(true)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 mt-0.5 rounded-lg text-violet-600 hover:bg-violet-50 transition-colors overflow-hidden"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span className={cn('text-xs font-medium truncate', collapsed && 'hidden')}>Add Business</span>
                  </button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Add Business</TooltipContent>}
              </Tooltip>
            </div>

          </div>
        </ScrollArea>

        <div className="h-px bg-gray-100 shrink-0" />

        {/* Profile */}
        <div className="p-1.5 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/user-dashboard/profile"
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors overflow-hidden"
              >
                <Avatar className="w-7 h-7 shrink-0 ring-2 ring-emerald-200 hover:ring-emerald-400 transition-all">
                  <AvatarImage src={user?.photoURL || ''} alt={userName} />
                  <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-500 text-white text-[10px] font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className={cn('text-xs text-gray-700 font-medium truncate flex-1', collapsed && 'hidden')}>
                  {userName}
                </span>
              </Link>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">{userName}</TooltipContent>}
          </Tooltip>
          {!collapsed && (
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-1.5 px-2 py-1 mt-0.5 rounded-lg text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              Sign out
            </button>
          )}
        </div>

        {/* Dialogs */}
        <Dialog open={isCreateChatbotOpen} onOpenChange={setIsCreateChatbotOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Chatbot</DialogTitle>
              <DialogDescription>Add a new chatbot to your account.</DialogDescription>
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
                      <SelectItem key={`sel-biz-${business.id}-${index}`} value={business.id}>
                        {business.name}
                      </SelectItem>
                    ))}
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
              <Button variant="outline" onClick={() => setIsCreateChatbotOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateChatbot} disabled={isCreatingChatbot || !newChatbot.name.trim() || !newChatbot.businessId}>
                {isCreatingChatbot ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateBusinessOpen} onOpenChange={setIsCreateBusinessOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Business</DialogTitle>
              <DialogDescription>Add a new business to organize your chatbots.</DialogDescription>
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
              <div className="space-y-2">
                <Label htmlFor="biz-documents">Business Documents (PDF, DOCX)</Label>
                <Input
                  id="biz-documents"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  multiple
                  onChange={(e) => setBusinessDocuments(Array.from(e.target.files || []))}
                  className="cursor-pointer"
                />
                {businessDocuments.length > 0 && (
                  <p className="text-xs text-gray-500">{businessDocuments.length} file(s) selected</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateBusinessOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateBusiness} disabled={isCreatingBusiness || !newBusiness.name.trim()}>
                {isCreatingBusiness ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </aside>
    </TooltipProvider>
  );
}
