import type { Business, ApiResponse, PaginatedResponse } from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Sample businesses data
const sampleBusinesses: Business[] = [
    {
        id: 'biz_1',
        name: 'Aslas Technologies',
        description: 'AI-powered solutions for modern businesses. We specialize in chatbots, automation, and digital transformation.',
        logo: '/business-logo-1.png',
        urls: ['https://aslastech.com', 'https://blog.aslastech.com'],
        contactEmail: 'contact@aslastech.com',
        contactPhone: '+1 (555) 123-4567',
        documents: [
            { id: 'doc_1', name: 'Company Overview.pdf', url: '/docs/overview.pdf', type: 'pdf', uploadedAt: '2024-01-15' },
            { id: 'doc_2', name: 'Services Brochure.pdf', url: '/docs/brochure.pdf', type: 'pdf', uploadedAt: '2024-02-10' },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-06-15',
    },
    {
        id: 'biz_2',
        name: 'RetailMax Store',
        description: 'Premium e-commerce platform for fashion and lifestyle products.',
        logo: '/business-logo-2.png',
        urls: ['https://retailmax.store'],
        contactEmail: 'support@retailmax.store',
        contactPhone: '+1 (555) 987-6543',
        documents: [
            { id: 'doc_3', name: 'Product Catalog.pdf', url: '/docs/catalog.pdf', type: 'pdf', uploadedAt: '2024-03-01' },
        ],
        createdAt: '2024-02-15',
        updatedAt: '2024-05-20',
    },
    {
        id: 'biz_3',
        name: 'HealthFirst Clinic',
        description: 'Providing quality healthcare services with a focus on patient experience.',
        urls: ['https://healthfirst.clinic'],
        contactEmail: 'info@healthfirst.clinic',
        contactPhone: '+1 (555) 456-7890',
        documents: [],
        createdAt: '2024-03-10',
        updatedAt: '2024-04-25',
    },
];

// Get all businesses
export async function getBusinesses(): Promise<ApiResponse<PaginatedResponse<Business>>> {
    await delay(300);
    return {
        success: true,
        data: {
            items: sampleBusinesses,
            total: sampleBusinesses.length,
            page: 1,
            pageSize: 20,
            hasMore: false,
        },
    };
}

// Get single business by ID
export async function getBusiness(id: string): Promise<ApiResponse<Business>> {
    await delay(200);
    const business = sampleBusinesses.find(b => b.id === id);
    if (!business) {
        return { success: false, data: null as unknown as Business, error: 'Business not found' };
    }
    return { success: true, data: business };
}

// Create business
export async function createBusiness(data: Omit<Business, 'id' | 'createdAt' | 'updatedAt' | 'documents'>): Promise<ApiResponse<Business>> {
    await delay(400);
    const uniqueId = `biz_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const newBusiness: Business = {
        ...data,
        id: uniqueId,
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    // Check if ID already exists (safety check)
    const existingIndex = sampleBusinesses.findIndex(b => b.id === uniqueId);
    if (existingIndex === -1) {
        sampleBusinesses.push(newBusiness);
    }
    return { success: true, data: newBusiness };
}

// Update business
export async function updateBusiness(id: string, data: Partial<Business>): Promise<ApiResponse<Business>> {
    await delay(300);
    const index = sampleBusinesses.findIndex(b => b.id === id);
    if (index === -1) {
        return { success: false, data: null as unknown as Business, error: 'Business not found' };
    }
    sampleBusinesses[index] = {
        ...sampleBusinesses[index],
        ...data,
        updatedAt: new Date().toISOString(),
    };
    return { success: true, data: sampleBusinesses[index] };
}

// Delete business
export async function deleteBusiness(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    await delay(300);
    const index = sampleBusinesses.findIndex(b => b.id === id);
    if (index === -1) {
        return { success: false, data: { deleted: false }, error: 'Business not found' };
    }
    sampleBusinesses.splice(index, 1);
    return { success: true, data: { deleted: true } };
}

// Upload document to business
export async function uploadBusinessDocument(
    businessId: string,
    document: { name: string; file: File }
): Promise<ApiResponse<Business>> {
    await delay(500);
    const index = sampleBusinesses.findIndex(b => b.id === businessId);
    if (index === -1) {
        return { success: false, data: null as unknown as Business, error: 'Business not found' };
    }
    const newDoc = {
        id: `doc_${Date.now()}`,
        name: document.name,
        url: `/docs/${document.name}`,
        type: 'pdf' as const,
        uploadedAt: new Date().toISOString(),
    };
    sampleBusinesses[index].documents.push(newDoc);
    return { success: true, data: sampleBusinesses[index] };
}

// Delete document from business
export async function deleteBusinessDocument(
    businessId: string,
    documentId: string
): Promise<ApiResponse<Business>> {
    await delay(300);
    const index = sampleBusinesses.findIndex(b => b.id === businessId);
    if (index === -1) {
        return { success: false, data: null as unknown as Business, error: 'Business not found' };
    }
    sampleBusinesses[index].documents = sampleBusinesses[index].documents.filter(d => d.id !== documentId);
    return { success: true, data: sampleBusinesses[index] };
}

// Get sample businesses for initial state (sync)
export function getSampleBusinesses(): Business[] {
    return [...sampleBusinesses];
}
