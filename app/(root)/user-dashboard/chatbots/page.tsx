'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatbot } from '@/contexts/ChatbotContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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
import { Bot, Plus, Trash2, Building2, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Chatbot } from '@/types';

export default function ChatbotsListPage() {
    const router = useRouter();
    const { chatbots, isInitialLoading, addChatbot, removeChatbot, isMutating, selectChatbot } = useChatbot();
    const { businesses } = useBusiness();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [chatbotToDelete, setChatbotToDelete] = useState<string | null>(null);
    const [newChatbot, setNewChatbot] = useState({
        name: '',
        businessId: '',
        model: 'gpt-4o-mini' as Chatbot['model'], // Fixed to gpt-4o-mini
        visibility: 'public' as Chatbot['visibility'],
    });
    const [errors, setErrors] = useState({
        name: '',
        businessId: '',
    });
    const [touched, setTouched] = useState({
        name: false,
        businessId: false,
    });

    const validateName = (value: string): string => {
        if (!value.trim()) {
            return 'Chatbot name is required';
        }
        if (value.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (value.trim().length > 50) {
            return 'Name must be less than 50 characters';
        }
        return '';
    };

    const validateBusinessId = (value: string): string => {
        if (!value) {
            return 'Business selection is required';
        }
        return '';
    };

    const handleNameChange = (value: string) => {
        setNewChatbot({ ...newChatbot, name: value });
        if (touched.name) {
            setErrors({ ...errors, name: validateName(value) });
        }
    };

    const handleNameBlur = () => {
        setTouched({ ...touched, name: true });
        setErrors({ ...errors, name: validateName(newChatbot.name) });
    };

    const handleBusinessChange = (value: string) => {
        setNewChatbot({ ...newChatbot, businessId: value });
        if (touched.businessId) {
            setErrors({ ...errors, businessId: validateBusinessId(value) });
        }
    };

    const handleBusinessBlur = () => {
        setTouched({ ...touched, businessId: true });
        setErrors({ ...errors, businessId: validateBusinessId(newChatbot.businessId) });
    };

    const handleCreate = async () => {
        // Validate all fields
        const nameError = validateName(newChatbot.name);
        const businessError = validateBusinessId(newChatbot.businessId);
        
        setErrors({
            name: nameError,
            businessId: businessError,
        });
        
        setTouched({
            name: true,
            businessId: true,
        });

        // Check for errors
        if (nameError || businessError) {
            toast.error('Please fix all validation errors');
            return;
        }

        try {
            await addChatbot(newChatbot);
            toast.success('Chatbot created successfully');
            setIsCreateOpen(false);
            setNewChatbot({ name: '', businessId: '', model: 'gpt-4o-mini', visibility: 'public' });
            setErrors({ name: '', businessId: '' });
            setTouched({ name: false, businessId: false });
        } catch (error) {
            toast.error('Failed to create chatbot');
        }
    };

    const handleDelete = async () => {
        if (!chatbotToDelete) return;
        try {
            await removeChatbot(chatbotToDelete);
            toast.success('Chatbot deleted successfully');
            setIsDeleteOpen(false);
            setChatbotToDelete(null);
        } catch (error) {
            toast.error('Failed to delete chatbot');
        }
    };

    const handleChatbotClick = (id: string) => {
        selectChatbot(id);
        router.push('/user-dashboard/chatbot');
    };

    const getBusinessName = (businessId: string) => {
        const business = businesses.find(b => b.id === businessId);
        return business?.name || 'Unknown';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isInitialLoading) {
        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <Skeleton className="h-6 w-32 mb-2" />
                                <Skeleton className="h-4 w-full mb-4" />
                                <Skeleton className="h-4 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chatbots</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all your chatbots</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chatbot
                </Button>
            </div>

            {/* Chatbots Grid */}
            {chatbots.length === 0 ? (
                <Card className="p-12 text-center">
                    <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No chatbots yet</h3>
                    <p className="text-gray-500 mb-4">Create your first chatbot to get started</p>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Chatbot
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chatbots.map((chatbot, index) => (
                        <Card
                            key={`chatbot-card-${chatbot.id}-${index}`}
                            className="card-interactive cursor-pointer group"
                            onClick={() => handleChatbotClick(chatbot.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Bot className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{chatbot.name}</CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge
                                                    variant={chatbot.status === 'trained' ? 'success' : chatbot.status === 'training' ? 'warning' : 'destructive'}
                                                    className="text-xs"
                                                >
                                                    {chatbot.status}
                                                </Badge>
                                                <span className="text-[10px] text-gray-400">{chatbot.model.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setChatbotToDelete(chatbot.id);
                                            setIsDeleteOpen(true);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-xs text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-3 h-3" />
                                        <span>{getBusinessName(chatbot.businessId)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>Created {formatDate(chatbot.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                        <span>{chatbot.characterCount.toLocaleString()} characters</span>
                                        <Badge variant="outline" className="text-[10px]">{chatbot.visibility}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Chatbot Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Chatbot</DialogTitle>
                        <DialogDescription>
                            Add a new chatbot to your account
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="bot-name" className="text-gray-700 font-medium">
                                Chatbot Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="bot-name"
                                    placeholder="e.g., Customer Support Bot"
                                    value={newChatbot.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    onBlur={handleNameBlur}
                                    className={`transition-all ${
                                        errors.name && touched.name
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                    }`}
                                />
                                {errors.name && touched.name && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {errors.name && touched.name && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bot-business" className="text-gray-700 font-medium">
                                Business <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={newChatbot.businessId}
                                onValueChange={handleBusinessChange}
                                onOpenChange={(open) => {
                                    if (!open) handleBusinessBlur();
                                }}
                            >
                                <SelectTrigger 
                                    id="bot-business"
                                    className={`transition-all ${
                                        errors.businessId && touched.businessId
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                    }`}
                                >
                                    <SelectValue placeholder="Select a business" />
                                </SelectTrigger>
                                <SelectContent position="popper" sideOffset={4}>
                                    {businesses.length === 0 ? (
                                        <div className="p-4 text-sm text-gray-500 text-center">
                                            No businesses available. Create a business first.
                                        </div>
                                    ) : (
                                        businesses.map((business, index) => (
                                            <SelectItem key={`select-biz-${business.id}-${index}`} value={business.id}>
                                                {business.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.businessId && touched.businessId && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.businessId}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bot-visibility">Visibility</Label>
                            <Select
                                value={newChatbot.visibility}
                                onValueChange={(value) => setNewChatbot({ ...newChatbot, visibility: value as Chatbot['visibility'] })}
                            >
                                <SelectTrigger id="bot-visibility">
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
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setIsCreateOpen(false);
                                setErrors({ name: '', businessId: '' });
                                setTouched({ name: false, businessId: false });
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreate} 
                            disabled={
                                isMutating || 
                                !newChatbot.name.trim() || 
                                !newChatbot.businessId ||
                                (touched.name && errors.name !== '') ||
                                (touched.businessId && errors.businessId !== '')
                            }
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isMutating ? 'Creating...' : 'Create Chatbot'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Chatbot</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this chatbot? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isMutating}>
                            {isMutating ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
