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
  ChevronDown,
  ChevronRight,
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
    if (!collapsed) {
      setChatbotsExpanded(!chatbotsExpanded);
    }
    router.push('/user-dashboard/chatbots');
  };

  const handleBusinessesTabClick = () => {
    if (!collapsed) {
      setBusinessesExpanded(!businessesExpanded);
    }
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
        <Card className="h-full rounded-none border-r border-l-0 border-t-0 border-b-0 flex flex-col bg-white w-16">
          {/* Logo */}
          <div className="p-2 flex items-center justify-center">
            <Link href="/" className="block">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-700 font-bold text-lg">A</span>
              </div>
            </Link>
          </div>

          <Separator />

          {/* Icons */}
          <div className="flex-1 flex flex-col items-center py-4 gap-2">
            {/* Expand button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={onToggleCollapse}
                >
                  <PanelLeft className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>

            <Separator className="w-8 my-2" />

            {/* Chatbots */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={pathname.includes('/chatbot') ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-10 w-10"
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
                  variant={pathname.includes('/businesses') ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleBusinessesTabClick}
                >
                  <Building2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Businesses ({businesses.length})</TooltipContent>
            </Tooltip>

            {/* Add buttons */}
            <Separator className="w-8 my-2" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-green-600"
                  onClick={() => setIsCreateChatbotOpen(true)}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Chatbot</TooltipContent>
            </Tooltip>
          </div>

          <Separator />

          {/* Profile */}
          <div className="p-2 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/profile">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/chatbot.png" alt={userName} />
                    <AvatarFallback className="bg-green-100 text-green-700 text-sm">{userInitials}</AvatarFallback>
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
    <Card className="h-full rounded-none border-r border-l-0 border-t-0 border-b-0 flex flex-col bg-white">
      {/* Logo - Centered */}
      <div className="p-3 xl:p-4 flex items-center justify-between">
        <Link href="/" className="block flex-1 flex justify-center">
          <Image
            src="/AslasChat.jpg"
            alt="AslasChat Logo"
            width={100}
            height={60}
            className="max-w-[100px]"
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
                  chatbots.map((chatbot, index) => (
                    <div
                      key={`chatbot-${chatbot.id}-${index}`}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg selection-transition group ${selectedChatbot?.id === chatbot.id
                          ? 'bg-green-50 border border-green-300'
                          : 'hover:bg-gray-50 border border-transparent'
                        }`}
                    >
                      <button
                        onClick={() => handleSelectChatbot(chatbot.id)}
                        className="flex-1 flex items-center gap-2 text-left min-w-0"
                      >
                        <Avatar className="w-6 h-6 rounded flex-shrink-0">
                          <AvatarImage src="/chatbot.png" alt={chatbot.name} />
                          <AvatarFallback className="rounded bg-green-100 text-green-700 text-[10px]">
                            {chatbot.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-gray-800 truncate">{chatbot.name}</span>
                      </button>
                      <Badge
                        variant={chatbot.status === 'trained' ? 'success' : 'warning'}
                        className="text-[9px] px-1.5 py-0 flex-shrink-0"
                      >
                        {chatbot.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSelectChatbot(chatbot.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => handleDeleteChatbot(chatbot.id, e)}
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
                  <DropdownMenuItem onClick={() => setIsCreateBusinessOpen(true)}>
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
                  businesses.map((business, index) => (
                    <div
                      key={`business-${business.id}-${index}`}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg selection-transition group ${selectedBusiness?.id === business.id
                          ? 'bg-green-50 border border-green-300'
                          : 'hover:bg-gray-50 border border-transparent'
                        }`}
                    >
                      <button
                        onClick={() => handleSelectBusiness(business.id)}
                        className="flex-1 flex items-center gap-2 text-left min-w-0"
                      >
                        <Avatar className="w-6 h-6 rounded flex-shrink-0">
                          {business.logo ? (
                            <AvatarImage src={business.logo} alt={business.name} />
                          ) : null}
                          <AvatarFallback className="rounded bg-purple-100 text-purple-700 text-[10px]">
                            {business.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-gray-800 truncate">{business.name}</span>
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSelectBusiness(business.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
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

      {renderDialogs()}
    </Card>
  );
}
