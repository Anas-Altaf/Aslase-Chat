import type {
    ChatSession,
    ChatMessage,
    Lead,
    ApiResponse,
    PaginatedResponse,
} from '@/types';
import { api } from '../api';
import { auth } from '@/lib/firebase/config';

// ==========================================
// CHAT MESSAGE API
// ==========================================

export interface SendMessageResponse {
    chatId: string;
    message: string;
    timestamp: Date;
}

export async function sendChatMessage(
    chatbotId: string,
    message: string,
    chatId?: string
): Promise<SendMessageResponse> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const payload = {
        chatbotId,
        message,
        userId: user.uid,
        chatId,
    };

    const response = await api.post('/chatbots/chat/message', payload);
    return response;
}

// ==========================================
// SAMPLE DATA
// ==========================================

const sampleSessions: ChatSession[] = [
    {
        id: 'session_1',
        chatbotId: 'VUyBtr3F23QcD2fF',
        messages: [
            { id: 'm1', role: 'user', content: 'hi', timestamp: '2025-07-31T10:00:00Z' },
            { id: 'm2', role: 'assistant', content: 'Hi, How can I assist you today?', timestamp: '2025-07-31T10:00:01Z' },
        ],
        source: 'embed',
        confidenceScore: 0.92,
        createdAt: '2025-07-31T10:00:00Z',
    },
    {
        id: 'session_2',
        chatbotId: 'VUyBtr3F23QcD2fF',
        messages: [
            { id: 'm3', role: 'user', content: 'What is AslasChat?', timestamp: '2025-08-03T14:30:00Z' },
            { id: 'm4', role: 'assistant', content: 'AslasChat is an AI-powered chatbot platform that helps businesses automate customer support.', timestamp: '2025-08-03T14:30:02Z' },
        ],
        source: 'embed',
        confidenceScore: 0.88,
        createdAt: '2025-08-03T14:30:00Z',
    },
    {
        id: 'session_3',
        chatbotId: 'VUyBtr3F23QcD2fF',
        messages: [
            { id: 'm5', role: 'user', content: 'lkj', timestamp: '2025-08-08T09:15:00Z' },
            { id: 'm6', role: 'assistant', content: 'Hi, How can I assist you today?', timestamp: '2025-08-08T09:15:01Z' },
        ],
        source: 'api',
        confidenceScore: 0.45,
        createdAt: '2025-08-08T09:15:00Z',
    },
];

const sampleLeads: Lead[] = [
    {
        id: 'lead_1',
        chatbotId: 'VUyBtr3F23QcD2fF',
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '0313-2022231',
        message: 'Let us know how to contact you',
        createdAt: '2024-08-20T19:04:00Z',
    },
    {
        id: 'lead_2',
        chatbotId: 'VUyBtr3F23QcD2fF',
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        phone: '0313-2022232',
        message: 'Let us know how to contact you',
        createdAt: '2024-08-20T19:04:00Z',
    },
    {
        id: 'lead_3',
        chatbotId: 'VUyBtr3F23QcD2fF',
        name: 'Mike Johnson',
        email: 'mikejohnson@example.com',
        phone: '0313-2022233',
        message: 'Let us know how to contact you',
        createdAt: '2024-08-20T19:04:00Z',
    },
];

// ==========================================
// SIMULATED DELAY
// ==========================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// CHAT LOGS API SERVICE
// ==========================================

export async function getChatSessions(
    chatbotId: string,
    filters?: {
        source?: string;
        startDate?: string;
        endDate?: string;
        minConfidence?: number;
    }
): Promise<ApiResponse<PaginatedResponse<ChatSession>>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'User not authenticated',
                data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false }
            };
        }

        // Get all chats for this chatbot
        const chats = await api.get(`/chatbots/chat/user/all?chatbotId=${chatbotId}`);
        
        // Convert backend chats to frontend ChatSession format
        const sessions: ChatSession[] = chats.map((chat: any) => ({
            id: chat._id,
            chatbotId: chat.chatbotId,
            messages: chat.messages.map((msg: any, index: number) => ({
                id: `${chat._id}-${index}`,
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp
            })),
            source: 'embed', // Default source
            confidenceScore: 0.85, // Default confidence
            createdAt: chat.createdAt
        }));

        return {
            success: true,
            data: {
                items: sessions,
                total: sessions.length,
                page: 1,
                pageSize: 20,
                hasMore: false,
            },
        };
    } catch (error) {
        console.error('Error fetching chat sessions:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch chat sessions',
            data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false }
        };
    }
}

export async function getChatSessionById(id: string): Promise<ApiResponse<ChatSession | null>> {
    await delay(200);
    const session = sampleSessions.find(s => s.id === id) || null;
    return {
        success: !!session,
        data: session,
    };
}

export async function exportChatSessions(
    chatbotId: string,
    format: 'csv' | 'json' = 'csv'
): Promise<ApiResponse<string>> {
    await delay(1000);
    // In real implementation, this would return a download URL
    return {
        success: true,
        data: `https://api.aslaschat.ai/exports/${chatbotId}/chat-logs.${format}`,
    };
}

// ==========================================
// LEADS API SERVICE
// ==========================================

export async function getLeads(
    chatbotId: string,
    filters?: {
        startDate?: string;
        endDate?: string;
    }
): Promise<ApiResponse<PaginatedResponse<Lead>>> {
    await delay(400);

    const filtered = sampleLeads.filter(l => l.chatbotId === chatbotId);

    return {
        success: true,
        data: {
            items: filtered,
            total: filtered.length,
            page: 1,
            pageSize: 20,
            hasMore: false,
        },
    };
}

export async function deleteLead(id: string): Promise<ApiResponse<boolean>> {
    await delay(300);
    const index = sampleLeads.findIndex(l => l.id === id);
    if (index !== -1) {
        sampleLeads.splice(index, 1);
    }
    return {
        success: true,
        data: true,
    };
}

export async function exportLeads(
    chatbotId: string,
    format: 'csv' | 'json' = 'csv'
): Promise<ApiResponse<string>> {
    await delay(1000);
    return {
        success: true,
        data: `https://api.aslaschat.ai/exports/${chatbotId}/leads.${format}`,
    };
}
