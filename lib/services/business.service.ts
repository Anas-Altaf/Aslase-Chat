import type { Business, ApiResponse, PaginatedResponse } from '@/types';
import { api } from '../api';
import { auth } from '@/lib/firebase/config';

// Backend business interface (matches backend schema)
interface BackendBusiness {
    _id: string;
    name: string;
    description?: string;
    ownerUid: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    isActive: boolean;
    documents?: Array<{
        fileName: string;
        extractedText: string;
        uploadedAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

// Convert backend business to frontend Business type
function convertBackendToFrontend(backendBiz: BackendBusiness): Business {
    return {
        id: backendBiz._id,
        name: backendBiz.name,
        description: backendBiz.description || '',
        urls: backendBiz.website ? [backendBiz.website] : [],
        contactEmail: backendBiz.email || '',
        contactPhone: backendBiz.phone || '',
        documents: backendBiz.documents?.map((doc, index) => ({
            id: `${backendBiz._id}-doc-${index}`,
            name: doc.fileName,
            url: '', // We don't store file URLs since we only store extracted text
            type: doc.fileName.endsWith('.pdf') ? 'pdf' as const : 'doc' as const,
            uploadedAt: doc.uploadedAt,
        })) || [],
        createdAt: backendBiz.createdAt,
        updatedAt: backendBiz.updatedAt,
    };
}

// Get all businesses
export async function getBusinesses(): Promise<ApiResponse<PaginatedResponse<Business>>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'User not authenticated',
                data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false }
            };
        }

        // Get businesses for current user using query parameter
        const backendBusinesses: BackendBusiness[] = await api.get(`/businesses?ownerUid=${user.uid}`);
        const businesses = backendBusinesses.map(convertBackendToFrontend);

        return {
            success: true,
            data: {
                items: businesses,
                total: businesses.length,
                page: 1,
                pageSize: 20,
                hasMore: false,
            },
        };
    } catch (error) {
        // error swallowed — caller receives success:false
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch businesses',
            data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false }
        };
    }
}

// Get single business by ID
export async function getBusiness(id: string): Promise<ApiResponse<Business>> {
    try {
        const backendBiz: BackendBusiness = await api.get(`/businesses/${id}`);
        const business = convertBackendToFrontend(backendBiz);
        return { success: true, data: business };
    } catch (error) {
        // error swallowed — caller receives success:false
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Business not found',
            data: null as unknown as Business
        };
    }
}

// Create business
export async function createBusiness(data: Omit<Business, 'id' | 'createdAt' | 'updatedAt' | 'documents'>, files?: File[]): Promise<ApiResponse<Business>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'User not authenticated',
                data: null as unknown as Business
            };
        }

        // If files are provided, use FormData
        if (files && files.length > 0) {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('ownerUid', user.uid);
            if (data.description) formData.append('description', data.description);
            if (data.contactEmail) formData.append('email', data.contactEmail);
            if (data.contactPhone) formData.append('phone', data.contactPhone);
            if (data.urls?.[0]) formData.append('website', data.urls[0]);
            files.forEach((file) => formData.append('documents', file));

            const backendBiz: BackendBusiness = await api.postFormData('/businesses', formData);
            const business = convertBackendToFrontend(backendBiz);
            return { success: true, data: business };
        } else {
            const backendData = {
                name: data.name,
                description: data.description || undefined,
                ownerUid: user.uid,
                email: data.contactEmail || undefined,
                phone: data.contactPhone || undefined,
                website: data.urls?.[0] || undefined,
            };

            const backendBiz: BackendBusiness = await api.post('/businesses', backendData);
            const business = convertBackendToFrontend(backendBiz);
            return { success: true, data: business };
        }
    } catch (error) {
        // error swallowed — caller receives success:false
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create business',
            data: null as unknown as Business
        };
    }
}

// Update business
export async function updateBusiness(id: string, data: Partial<Business>): Promise<ApiResponse<Business>> {
    try {
        // Convert frontend format to backend format
        const backendData: any = {};
        if (data.name) backendData.name = data.name;
        if (data.description !== undefined) backendData.description = data.description;
        if (data.contactEmail !== undefined) backendData.email = data.contactEmail;
        if (data.contactPhone !== undefined) backendData.phone = data.contactPhone;
        if (data.urls && data.urls.length > 0) backendData.website = data.urls[0];

        const backendBiz: BackendBusiness = await api.patch(`/businesses/${id}`, backendData);
        const business = convertBackendToFrontend(backendBiz);
        return { success: true, data: business };
    } catch (error) {
        // error swallowed — caller receives success:false
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update business',
            data: null as unknown as Business
        };
    }
}

// Delete business
export async function deleteBusiness(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
        await api.delete(`/businesses/${id}`);
        return { success: true, data: { deleted: true } };
    } catch (error) {
        // error swallowed — caller receives success:false
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete business',
            data: { deleted: false }
        };
    }
}

// Upload document to business (placeholder - will be implemented later)
export async function uploadBusinessDocument(
    businessId: string,
    document: { name: string; file: File }
): Promise<ApiResponse<Business>> {
    // TODO: Implement document upload API
    // not yet implemented
    return {
        success: false,
        error: 'Document upload not yet implemented',
        data: null as unknown as Business
    };
}

// Delete document from business (placeholder - will be implemented later)
export async function deleteBusinessDocument(
    businessId: string,
    documentId: string
): Promise<ApiResponse<Business>> {
    // TODO: Implement document delete API
    // not yet implemented
    return {
        success: false,
        error: 'Document delete not yet implemented',
        data: null as unknown as Business
    };
}


