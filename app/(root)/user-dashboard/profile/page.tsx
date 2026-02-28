'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Bell,
    Palette,
    Key,
    Camera,
    Save,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Upload,
    X,
    Loader2,
    ImagePlus
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user, updateUserProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phone: '',
        company: '',
    });

    // Initialize form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || '',
                email: user.email || '',
                phone: '',
                company: '',
            });
            setPreviewImage(user.photoURL || null);
        }
    }, [user]);

    const userName = user?.displayName || 'User';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
    const userEmail = user?.email || 'user@example.com';
    const memberSince = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Unknown';

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            const updateData: { displayName?: string; photoURL?: string } = {};

            // Only update displayName if it's changed
            if (formData.displayName && formData.displayName !== user.displayName) {
                updateData.displayName = formData.displayName;
            }

            // Update photoURL if there's a new preview image
            if (previewImage && previewImage !== user.photoURL) {
                updateData.photoURL = previewImage;
            }

            if (Object.keys(updateData).length > 0) {
                await updateUserProfile(updateData);
                toast.success('Profile updated successfully!');
            } else {
                toast.info('No changes to save');
            }

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setIsUploadingPhoto(true);

        try {
            // Convert file to base64 for preview and storage
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewImage(base64String);
                setIsUploadingPhoto(false);
                toast.success('Photo ready! Click "Save Changes" to apply.');
            };
            reader.onerror = () => {
                toast.error('Failed to read image file');
                setIsUploadingPhoto(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing photo:', error);
            toast.error('Failed to process photo');
            setIsUploadingPhoto(false);
        }
    };

    const handleRemovePhoto = () => {
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.info('Photo removed. Click "Save Changes" to apply.');
    };

    const handleCancelEdit = () => {
        // Reset form data and preview to original values
        if (user) {
            setFormData({
                displayName: user.displayName || '',
                email: user.email || '',
                phone: '',
                company: '',
            });
            setPreviewImage(user.photoURL || null);
        }
        setIsEditing(false);
    };

    const stats = [
        { label: 'Chatbots Created', value: '5', icon: Sparkles },
        { label: 'Total Conversations', value: '1.2K', icon: CheckCircle2 },
        { label: 'Active Sessions', value: '12', icon: AlertCircle },
    ];

    const settings = [
        {
            icon: Shield,
            title: 'Security',
            description: 'Manage your password and 2FA settings',
            href: '/user-dashboard/settings/security',
            color: 'emerald'
        },
        {
            icon: Bell,
            title: 'Notifications',
            description: 'Configure email and push notifications',
            href: '/user-dashboard/settings/notifications',
            color: 'blue'
        },
        {
            icon: Palette,
            title: 'Appearance',
            description: 'Customize your dashboard theme',
            href: '/user-dashboard/settings/chat-interface',
            color: 'violet'
        },
        {
            icon: Key,
            title: 'API Keys',
            description: 'Manage your API access tokens',
            href: '/user-dashboard/settings/general',
            color: 'amber'
        },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                        <User className="w-4 h-4" />
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Card */}
            <Card className="overflow-hidden">
                {/* Banner */}
                <div className="h-32 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                <CardContent className="relative pt-0">
                    {/* Avatar */}
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 relative z-10">
                        <div className="relative group">
                            <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                                <AvatarImage src={previewImage || user?.photoURL || ''} alt={userName} />
                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-3xl font-bold">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>

                            {isEditing && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {isUploadingPhoto ? (
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handlePhotoClick}
                                            className="absolute inset-0 bg-black/0 hover:bg-black/40 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                                        >
                                            <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                                <Camera className="w-6 h-6 text-gray-700" />
                                            </div>
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Remove photo button */}
                            {isEditing && previewImage && (
                                <button
                                    onClick={handleRemovePhoto}
                                    className="absolute -top-1 -right-1 p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 pb-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 w-fit">
                                    Pro Plan
                                </Badge>
                            </div>
                            <p className="text-gray-500 mt-1">{userEmail}</p>
                            {isEditing && (
                                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                                    <ImagePlus className="w-3 h-3" />
                                    Click on your avatar to change your profile photo
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Form */}
            {isEditing && (
                <Card className="animate-slideUp">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-emerald-600" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Full Name</Label>
                                <Input
                                    id="displayName"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    placeholder="John Doe"
                                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-400">Email cannot be changed</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 123-4567"
                                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                <p className="text-xs text-gray-400">Phone is stored locally only</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Acme Inc."
                                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                <p className="text-xs text-gray-400">Company is stored locally only</p>
                            </div>
                        </div>

                        {/* Photo Upload Section */}
                        <Separator />
                        <div className="space-y-4">
                            <Label>Profile Photo</Label>
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border-2 border-gray-200">
                                    <AvatarImage src={previewImage || user?.photoURL || ''} alt={userName} />
                                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePhotoClick}
                                        disabled={isUploadingPhoto}
                                        className="gap-2"
                                    >
                                        {isUploadingPhoto ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Upload className="w-4 h-4" />
                                        )}
                                        {isUploadingPhoto ? 'Processing...' : 'Upload Photo'}
                                    </Button>
                                    {previewImage && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRemovePhoto}
                                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4" />
                                            Remove Photo
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 flex-1">
                                    Recommended: Square image, at least 200x200px. Max 5MB.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Account Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-emerald-600" />
                        Account Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-500">{userEmail}</p>
                            </div>
                        </div>
                        {user?.emailVerified ? (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-amber-600 border-amber-300">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Not Verified
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Member Since</p>
                                <p className="text-sm text-gray-500">{memberSince}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-violet-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-500">Add an extra layer of security</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Settings Links */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {settings.map((setting) => {
                        const Icon = setting.icon;
                        const colorClasses = {
                            emerald: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200',
                            blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
                            violet: 'bg-violet-100 text-violet-600 group-hover:bg-violet-200',
                            amber: 'bg-amber-100 text-amber-600 group-hover:bg-amber-200',
                        };

                        return (
                            <a
                                key={setting.title}
                                href={setting.href}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${colorClasses[setting.color as keyof typeof colorClasses]}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{setting.title}</p>
                                    <p className="text-sm text-gray-500">{setting.description}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Danger Zone */}
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions for your account</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900">Delete Account</p>
                        <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                </CardContent>
            </Card>
        </div>
    );
}
