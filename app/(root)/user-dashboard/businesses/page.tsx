'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBusiness } from '@/contexts/BusinessContext';
import { uploadBusinessDocument } from '@/lib/services/business.service';
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
import { Building2, Plus, Globe, Mail, FileText, Trash2, Edit, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BusinessesPage() {
    const router = useRouter();
    const { businesses, isInitialLoading, addBusiness, removeBusiness, refreshBusinesses } = useBusiness();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [newBusiness, setNewBusiness] = useState({
        name: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        urls: [''],
    });
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);

    const handleCreate = async () => {
        if (!newBusiness.name.trim()) return;
        setIsCreating(true);
        try {
            // Create business first
            const result = await addBusiness({
                ...newBusiness,
                urls: newBusiness.urls.filter(u => u.trim()),
            });

            // Upload documents if any
            if (pendingFiles.length > 0 && result) {
                for (const file of pendingFiles) {
                    await uploadBusinessDocument(result.id, { name: file.name, file });
                }
                await refreshBusinesses();
            }

            toast.success('Business created successfully');
            setIsCreateOpen(false);
            setNewBusiness({ name: '', description: '', contactEmail: '', contactPhone: '', urls: [''] });
            setPendingFiles([]);
        } catch (error) {
            toast.error('Failed to create business');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!businessToDelete) return;
        setIsDeleting(true);
        setDeletingId(businessToDelete);
        try {
            await removeBusiness(businessToDelete);
            toast.success('Business deleted successfully');
            setIsDeleteOpen(false);
            setBusinessToDelete(null);
            // Stay on businesses page after deletion
        } catch (error) {
            toast.error('Failed to delete business');
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
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

    const removeUrl = (index: number) => {
        const urls = [...newBusiness.urls];
        urls.splice(index, 1);
        setNewBusiness({ ...newBusiness, urls: urls.length > 0 ? urls : [''] });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setPendingFiles(prev => [...prev, ...Array.from(files)]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== index));
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
                        <Card key={`skeleton-${i}`}>
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
                    {businesses.map((business, index) => (
                        <Card
                            key={`biz-card-${business.id}-${index}`}
                            className={`card-interactive cursor-pointer group relative ${deletingId === business.id ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={() => router.push(`/user-dashboard/businesses/${business.id}`)}
                        >
                            {deletingId === business.id && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg z-10">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                                </div>
                            )}
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

            {/* Create Business Dialog - Enhanced with documents */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Create New Business</DialogTitle>
                        <DialogDescription>
                            Add a new business with all its details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 overflow-y-auto flex-1">
                        {/* Basic Info */}
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

                        {/* Contact Info */}
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

                        {/* URLs */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Website URLs</Label>
                                <Button variant="ghost" size="sm" onClick={addUrlField} type="button">
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add
                                </Button>
                            </div>
                            {newBusiness.urls.map((url, index) => (
                                <div key={`url-field-${index}`} className="flex gap-2">
                                    <Input
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => updateUrl(index, e.target.value)}
                                    />
                                    {newBusiness.urls.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeUrl(index)}
                                            type="button"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Documents */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Documents</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    type="button"
                                >
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                </Button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                multiple
                                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                            />
                            {pendingFiles.length === 0 ? (
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <FileText className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-400 text-xs">Click to upload documents</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {pendingFiles.map((file, index) => (
                                        <div key={`file-${index}`} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => removeFile(index)}
                                                type="button"
                                            >
                                                <X className="w-3 h-3 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isCreating || !newBusiness.name.trim()}>
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : 'Create'}
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
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
