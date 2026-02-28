// ==========================================
// BUSINESS TYPES
// ==========================================

export interface BusinessDocument {
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'image' | 'other';
    uploadedAt: string;
}

export interface Business {
    id: string;
    name: string;
    description: string;
    logo?: string;
    urls: string[];
    contactEmail: string;
    contactPhone: string;
    documents: BusinessDocument[];
    createdAt: string;
    updatedAt: string;
}

// ==========================================
// CHATBOT TYPES
// ==========================================

export interface Chatbot {
    id: string;
    businessId: string;
    name: string;
    model: 'gpt-4o-mini' | 'gpt-4o' | 'gpt-3.5-turbo';
    status: 'trained' | 'training' | 'error';
    visibility: 'public' | 'private';
    characterCount: number;
    createdAt: string;
    lastTrainedAt: string | null;
    avatar?: string;
}

export interface ChatbotSettings {
    chatbotId: string;
    // General
    name: string;
    // Model
    model: string;
    temperature: number;
    maxTokens: number;
    // Chat Interface
    welcomeMessage: string;
    placeholder: string;
    primaryColor: string;
    // Security
    rateLimitPerMinute: number;
    requireEmailCapture: boolean;
    // Notifications
    emailNotifications: boolean;
    notificationEmail: string;
    webhookUrl: string;
}

// ==========================================
// CHAT & LEADS TYPES
// ==========================================

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface ChatSession {
    id: string;
    chatbotId: string;
    messages: ChatMessage[];
    source: 'embed' | 'api' | 'playground';
    confidenceScore: number;
    createdAt: string;
}

export interface Lead {
    id: string;
    chatbotId: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
}

// ==========================================
// SOURCES TYPES
// ==========================================

export interface Source {
    id: string;
    chatbotId: string;
    type: 'file' | 'text' | 'qna' | 'website';
    name: string;
    characterCount: number;
    createdAt: string;
}

export interface SourceStats {
    totalCharacters: number;
    characterLimit: number;
    fileCount: number;
    fileCharacters: number;
    qnaCount: number;
    qnaCharacters: number;
    textCharacters: number;
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

export interface AnalyticsData {
    chatbotId: string;
    period: 'daily' | 'weekly' | 'monthly';
    data: {
        date: string;
        chats: number;
        leads: number;
    }[];
    totals: {
        totalChats: number;
        totalLeads: number;
        avgConfidence: number;
    };
}

// ==========================================
// INTEGRATIONS TYPES
// ==========================================

export type IntegrationStatus = 'available' | 'coming_soon' | 'subscription_required' | 'connected';

export interface Integration {
    id: string;
    name: string;
    platform: 'slack' | 'whatsapp' | 'wordpress' | 'messenger' | 'shopify' | 'instagram';
    status: IntegrationStatus;
    configUrl?: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
