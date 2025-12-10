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
            console.log('Creating business with files:', pendingFiles.length);
            
            // Create business with documents
            const result = await addBusiness({
                ...newBusiness,
                urls: newBusiness.urls.filter(u => u.trim()),
            }, pendingFiles); // Pass files here

            toast.success('Business created successfully');
            setIsCreateOpen(false);
            setNewBusiness({ name: '', description: '', contactEmail: '', contactPhone: '', urls: [''] });
            setPendingFiles([]);
        } catch (error) {
            console.error('Error creating business:', error);
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
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader className="space-y-3 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className="h-7 w-7 bg-green-500 rounded-lg mt-6 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Create New Business</DialogTitle>
                                <DialogDescription className="text-sm">
                                    Set up your business profile and start engaging with customers
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-6 overflow-y-auto flex-1 px-1">
                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <div className="h-6 w-1 bg-purple-500 rounded-full"></div>
                                Basic Information
                            </div>
                            
                            <div className="space-y-4 pl-3">
                                <div className="space-y-2">
                                    <Label htmlFor="biz-name" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        Business Name
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="biz-name"
                                        placeholder="e.g., Acme Corporation"
                                        value={newBusiness.name}
                                        onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                                        className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="biz-desc" className="text-sm font-medium text-gray-700">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="biz-desc"
                                        placeholder="Tell us about your business, what you do, and what makes you unique..."
                                        value={newBusiness.description}
                                        onChange={(e) => setNewBusiness({ ...newBusiness, description: e.target.value })}
                                        className="min-h-[100px] resize-none border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                                        rows={4}
                                    />
                                    <p className="text-xs text-gray-500">{newBusiness.description.length}/500 characters</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <div className="h-6 w-1 bg-blue-500 rounded-full"></div>
                                Contact Information
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3">
                                <div className="space-y-2">
                                    <Label htmlFor="biz-email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="biz-email"
                                        type="email"
                                        placeholder="contact@acme.com"
                                        value={newBusiness.contactEmail}
                                        onChange={(e) => setNewBusiness({ ...newBusiness, contactEmail: e.target.value })}
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="biz-phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <span className="text-gray-400">📞</span>
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="biz-phone"
                                        placeholder="+1 (555) 123-4567"
                                        value={newBusiness.contactPhone}
                                        onChange={(e) => setNewBusiness({ ...newBusiness, contactPhone: e.target.value })}
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Website URLs Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <div className="h-6 w-1 bg-green-500 rounded-full"></div>
                                    Website URLs
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={addUrlField} 
                                    type="button"
                                    className="h-8 text-xs hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                                >
                                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                                    Add URL
                                </Button>
                            </div>
                            
                            <div className="space-y-3 pl-3">
                                {newBusiness.urls.map((url, index) => (
                                    <div key={`url-field-${index}`} className="flex gap-2 items-start">
                                        <div className="flex-1 space-y-1">
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    placeholder="https://www.example.com"
                                                    value={url}
                                                    onChange={(e) => updateUrl(index, e.target.value)}
                                                    className="h-11 pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                                                />
                                            </div>
                                        </div>
                                        {newBusiness.urls.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeUrl(index)}
                                                type="button"
                                                className="h-11 w-11 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                                    Documents
                                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                                </div>
                            </div>
                            
                            <div className="pl-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    multiple
                                    accept=".pdf,.docx"
                                />
                                
                                {pendingFiles.length === 0 ? (
                                    <div
                                        className="group border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-200"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3 group-hover:bg-orange-200 transition-colors">
                                            <Upload className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">Upload documents</p>
                                        <p className="text-xs text-gray-500">PDF or DOCX files up to 10MB</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {pendingFiles.map((file, index) => (
                                            <div 
                                                key={`file-${index}`} 
                                                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-50/50 border border-orange-100 group hover:border-orange-200 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-orange-200">
                                                        <FileText className="w-4 h-4 text-orange-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => removeFile(index)}
                                                    type="button"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                            type="button"
                                            className="w-full h-9 border-dashed hover:bg-orange-50 hover:border-orange-300"
                                        >
                                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                                            Add More Files
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <DialogFooter className="border-t pt-4 gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsCreateOpen(false)}
                            className="min-w-24"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreate} 
                            variant="default"
                            disabled={isCreating || !newBusiness.name.trim()}
                            className="min-w-32 "
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Building2 className="w-4 h-4 mr-2" />
                                    Create Business
                                </>
                            )}
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
