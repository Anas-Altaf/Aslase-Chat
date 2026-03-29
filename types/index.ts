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
    model: string;
    status: 'trained' | 'training' | 'error';
    visibility: 'public' | 'private';
    characterCount: number;
    createdAt: string;
    lastTrainedAt: string | null;
    avatar?: string;
}

// Fields persisted to backend via PATCH /chatbots/:id/settings
export interface BackendChatbotSettings {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPromptOverride?: string;
    welcomeMessage?: string;
}

// Full settings used by components (backend fields + UI-only via localStorage)
export interface ChatbotSettings extends BackendChatbotSettings {
    chatbotId: string;
    name: string;               // from chatbot doc; saved via PATCH /chatbots/:id
    // UI-only (localStorage):
    placeholder: string;
    primaryColor: string;
    rateLimitPerMinute: number;
    requireEmailCapture: boolean;
    emailNotifications: boolean;
    notificationEmail: string;
    webhookUrl: string;
}

// ==========================================
// CHAT & SESSIONS TYPES
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
    isAnonymous?: boolean;
    messageCount?: number;
    createdAt: string;
    updatedAt?: string;
}

// ==========================================
// LEADS TYPES
// ==========================================

export type LeadStatus = 'new' | 'contacted' | 'converted' | 'rejected';
export type LeadSource = 'website' | 'public_widget' | 'api' | 'whatsapp' | 'instagram' | 'slack';

export interface Lead {
    id: string;
    chatbotId: string;
    name: string;
    email: string;
    phone: string;
    status: LeadStatus;
    source: LeadSource;
    notes?: string;
    additionalInfo: Record<string, any>;
    capturedAt: string;
}

// ==========================================
// SOURCES TYPES
// ==========================================

export interface Source {
    id: string;
    chatbotId: string;
    type: 'document' | 'text' | 'url';
    title: string;
    content: string;
    sourceUrl?: string;
    fileName?: string;
    characterCount: number;     // computed: content.length
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
    urlCount: number;
    urlCharacters: number;
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

export interface SentimentBreakdown {
    positive: number;
    negative: number;
    neutral: number;
}

export interface ChatbotAnalytics {
    chatbotId: string;
    chatbotName: string;
    totalConversations: number;
    totalMessages: number;
    totalLeads: number;
    totalQueries: number;
    sentimentBreakdown: SentimentBreakdown;
    dailyMessageVolume: Array<{ date: string; count: number }>;
    topQueries: Array<{ query: string; count: number }>;
}

// Legacy alias (kept for compatibility)
export type AnalyticsData = ChatbotAnalytics;

// ==========================================
// QUERIES TYPES
// ==========================================

export type SentimentType = 'Positive' | 'Negative' | 'Neutral';

export interface ChatQuery {
    id: string;
    chatbotId: string;
    sessionId: string | null;
    isAnonymous: boolean;
    userMessage: string;
    botResponse: string;
    userSentiment: SentimentType;
    replySentiment: SentimentType;
    leadCaptured: boolean;
    createdAt: string;
}

// ==========================================
// USER TYPES
// ==========================================

export interface User {
    id: string;           // mapped from _id
    uid: string;          // Firebase UID
    email: string;
    displayName: string;
    phoneNumber?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ==========================================
// BUSINESS ANALYTICS TYPES
// ==========================================

export interface BusinessAnalytics {
    businessId: string;
    totals: {
        totalConversations: number;
        totalMessages: number;
        totalLeads: number;
        totalQueries: number;
        sentimentBreakdown: SentimentBreakdown;
    };
    perChatbot: ChatbotAnalytics[];
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

// Frontend paginated response (used by components)
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// Backend paginated result shape (used internally in services)
export interface BackendPaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
