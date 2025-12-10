'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBusiness } from '@/contexts/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Building2,
    ArrowLeft,
    Save,
    Globe,
    Mail,
    Phone,
    FileText,
    Plus,
    Trash2,
    Upload
} from 'lucide-react';
import { toast } from 'sonner';
import type { Business } from '@/types';

export default function BusinessDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { businesses, editBusiness, isMutating, isInitialLoading } = useBusiness();

    const businessId = params.id as string;
    const business = businesses.find(b => b.id === businessId);

    const [formData, setFormData] = useState<Partial<Business>>({});
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name,
                description: business.description,
                contactEmail: business.contactEmail,
                contactPhone: business.contactPhone,
                urls: [...business.urls],
            });
        }
    }, [business]);

    const handleChange = (field: keyof Business, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!businessId) return;
        try {
            await editBusiness(businessId, formData);
            toast.success('Business updated successfully');
            setHasChanges(false);
        } catch (error) {
            toast.error('Failed to update business');
        }
    };

    const addUrl = () => {
        const urls = formData.urls || [];
        handleChange('urls', [...urls, '']);
    };

    const updateUrl = (index: number, value: string) => {
        const urls = [...(formData.urls || [])];
        urls[index] = value;
        handleChange('urls', urls);
    };

    const removeUrl = (index: number) => {
        const urls = [...(formData.urls || [])];
        urls.splice(index, 1);
        handleChange('urls', urls);
    };

    if (isInitialLoading) {
        return (
            <div className="space-y-6 animate-fadeIn">
                <Skeleton className="h-8 w-48" />
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-1/2" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Business not found</h2>
                <p className="text-gray-500 mb-4">The business you're looking for doesn't exist.</p>
                <Button onClick={() => router.push('/user-dashboard/businesses')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Businesses
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/user-dashboard/businesses')}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                        <p className="text-gray-500 text-sm">Edit business details</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={!hasChanges || isMutating}>
                    <Save className="w-4 h-4 mr-2" />
                    {isMutating ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Business Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={4}
                                    value={formData.description || ''}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.contactEmail || ''}
                                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={formData.contactPhone || ''}
                                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Website URLs</CardTitle>
                            <Button variant="outline" size="sm" onClick={addUrl}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add URL
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {(formData.urls || []).length === 0 ? (
                                <p className="text-gray-400 text-sm">No URLs added yet</p>
                            ) : (
                                (formData.urls || []).map((url, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="flex-1 flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <Input
                                                value={url}
                                                onChange={(e) => updateUrl(index, e.target.value)}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeUrl(index)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Documents & Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {business.documents.length === 0 ? (
                                <div className="text-center py-6">
                                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm mb-3">No documents yet</p>
                                    <Button variant="outline" size="sm">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {business.documents.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-700">{doc.name}</span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" className="w-full mt-3">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload More
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Created</span>
                                <span className="text-gray-900">{new Date(business.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-gray-500">Updated</span>
                                <span className="text-gray-900">{new Date(business.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-gray-500">Documents</span>
                                <span className="text-gray-900">{business.documents.length}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-gray-500">URLs</span>
                                <span className="text-gray-900">{business.urls.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
