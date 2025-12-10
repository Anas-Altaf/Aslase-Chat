'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBusiness } from '@/contexts/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Building2, Plus, Globe, Mail, Phone, FileText, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function BusinessesPage() {
    const router = useRouter();
    const { businesses, isInitialLoading, addBusiness, removeBusiness, isMutating } = useBusiness();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);
    const [newBusiness, setNewBusiness] = useState({
        name: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        urls: [''],
    });

    const handleCreate = async () => {
        if (!newBusiness.name.trim()) return;
        try {
            await addBusiness({
                ...newBusiness,
                urls: newBusiness.urls.filter(u => u.trim()),
            });
            toast.success('Business created successfully');
            setIsCreateOpen(false);
            setNewBusiness({ name: '', description: '', contactEmail: '', contactPhone: '', urls: [''] });
        } catch (error) {
            toast.error('Failed to create business');
        }
    };

    const handleDelete = async () => {
        if (!businessToDelete) return;
        try {
            await removeBusiness(businessToDelete);
            toast.success('Business deleted successfully');
            setIsDeleteOpen(false);
            setBusinessToDelete(null);
        } catch (error) {
            toast.error('Failed to delete business');
        }
    };

    const addUrlField = () => {
        setNewBusiness({ ...newBusiness, urls: [...newBusiness.urls, ''] });
    };

    const updateUrl = (index: number, value: string) => {
        const urls = [...newBusiness.urls];
        urls[index] = value;
        setNewBusiness({ ...newBusiness, urls });
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
                    <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your businesses and their settings</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Business
                </Button>
            </div>

            {/* Businesses Grid */}
            {businesses.length === 0 ? (
                <Card className="p-12 text-center">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses yet</h3>
                    <p className="text-gray-500 mb-4">Create your first business to get started</p>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Business
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {businesses.map(business => (
                        <Card
                            key={business.id}
                            className="card-interactive cursor-pointer group"
                            onClick={() => router.push(`/user-dashboard/businesses/${business.id}`)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{business.name}</CardTitle>
                                            <Badge variant="secondary" className="text-xs mt-1">
                                                {business.documents.length} docs
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/user-dashboard/businesses/${business.id}`);
                                            }}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBusinessToDelete(business.id);
                                                setIsDeleteOpen(true);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{business.description}</p>
                                <div className="space-y-1.5 text-xs text-gray-400">
                                    {business.contactEmail && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3 h-3" />
                                            <span className="truncate">{business.contactEmail}</span>
                                        </div>
                                    )}
                                    {business.urls.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3 h-3" />
                                            <span className="truncate">{business.urls[0]}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Business Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create New Business</DialogTitle>
                        <DialogDescription>
                            Add a new business to organize your chatbots
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
                            <Label>Website URLs</Label>
                            {newBusiness.urls.map((url, index) => (
                                <Input
                                    key={index}
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => updateUrl(index, e.target.value)}
                                />
                            ))}
                            <Button variant="outline" size="sm" onClick={addUrlField}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add URL
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isMutating || !newBusiness.name.trim()}>
                            {isMutating ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Business</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this business? This action cannot be undone.
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
