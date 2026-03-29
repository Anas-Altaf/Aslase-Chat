import type {
    ChatSession,
    Lead,
    ApiResponse,
    PaginatedResponse,
} from '@/types';
import { api } from '../api';
import { auth } from '@/lib/firebase/config';

// ==========================================
// BACKEND SHAPES
// ==========================================

interface BackendMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface BackendChat {
    _id: string;
    chatbotId: string;
    messages: BackendMessage[];
    createdAt: string;
}

interface BackendLead {
    _id: string;
    chatbot_id: string;
    userName: string;
    userEmail?: string;
    phone?: string;
    timestamp?: string;
    createdAt?: string;
}

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
    chatId?: string,
): Promise<SendMessageResponse> {
    const payload: Record<string, string> = { chatbotId, message };
    if (chatId) payload.chatId = chatId;
    return api.post<SendMessageResponse>('/chatbots/chat/message', payload);
}

// ==========================================
// CHAT SESSIONS
// ==========================================

export async function getChatSessions(
    chatbotId: string,
    _filters?: {
        source?: string;
        startDate?: string;
        endDate?: string;
        minConfidence?: number;
    },
): Promise<ApiResponse<PaginatedResponse<ChatSession>>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'User not authenticated',
                data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false },
            };
        }

        const chats = await api.get<BackendChat[]>(`/chatbots/chat/user/all?chatbotId=${chatbotId}`);

        const sessions: ChatSession[] = chats.map((chat) => ({
            id: chat._id,
            chatbotId: chat.chatbotId,
            messages: chat.messages.map((msg, index) => ({
                id: `${chat._id}-${index}`,
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp,
            })),
            source: 'embed' as const,
            confidenceScore: 0,
            createdAt: chat.createdAt,
        }));

        return {
            success: true,
            data: { items: sessions, total: sessions.length, page: 1, pageSize: 20, hasMore: false },
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch chat sessions',
            data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false },
        };
    }
}

export async function getChatSessionById(id: string): Promise<ApiResponse<ChatSession | null>> {
    try {
        const chat = await api.get<BackendChat>(`/chatbots/chat/${id}`);
        const session: ChatSession = {
            id: chat._id,
            chatbotId: chat.chatbotId,
            messages: chat.messages.map((msg, index) => ({
                id: `${chat._id}-${index}`,
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp,
            })),
            source: 'embed' as const,
            confidenceScore: 0,
            createdAt: chat.createdAt,
        };
        return { success: true, data: session };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Chat session not found',
            data: null,
        };
    }
}

export async function exportChatSessions(
    _chatbotId: string,
    _format: 'csv' | 'json' = 'csv',
): Promise<ApiResponse<string>> {
    return { success: false, error: 'Export not yet implemented', data: '' };
}

// ==========================================
// LEADS
// ==========================================

export async function getLeads(
    chatbotId: string,
    _filters?: { startDate?: string; endDate?: string },
): Promise<ApiResponse<PaginatedResponse<Lead>>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'User not authenticated',
                data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false },
            };
        }

        const backendLeads = await api.get<BackendLead[]>(`/leads/chatbot/${chatbotId}`);

        const leads: Lead[] = backendLeads.map((lead) => ({
            id: lead._id,
            chatbotId: lead.chatbot_id,
            name: lead.userName,
            email: lead.userEmail || '',
            phone: lead.phone || '',
            message: 'Contact information captured',
            createdAt: lead.timestamp || lead.createdAt || '',
        }));

        return {
            success: true,
            data: { items: leads, total: leads.length, page: 1, pageSize: 20, hasMore: false },
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch leads',
            data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false },
        };
    }
}

export async function deleteLead(id: string): Promise<ApiResponse<boolean>> {
    try {
        await api.delete(`/leads/${id}`);
        return { success: true, data: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete lead',
            data: false,
        };
    }
}

export async function exportLeads(
    _chatbotId: string,
    _format: 'csv' | 'json' = 'csv',
): Promise<ApiResponse<string>> {
    return { success: false, error: 'Export not yet implemented', data: '' };
}
