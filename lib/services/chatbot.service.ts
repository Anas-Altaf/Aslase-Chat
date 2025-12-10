import type {
    Chatbot,
    ChatbotSettings,
    ApiResponse,
} from '@/types';
import { api } from '../api';
import { auth } from '@/lib/firebase/config';

// Backend chatbot interface (matches backend schema)
interface BackendChatbot {
    _id: string;
    name: string;
    description: string;
    businessId: string;
    userId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Convert backend chatbot to frontend Chatbot type
function convertBackendToFrontend(backendChatbot: BackendChatbot): Chatbot {
    return {
        id: backendChatbot._id,
        businessId: backendChatbot.businessId,
        name: backendChatbot.name,
        model: 'gpt-4o-mini', // Default model
        status: 'trained',
        visibility: 'public',
        characterCount: 0,
        createdAt: backendChatbot.createdAt,
        lastTrainedAt: backendChatbot.createdAt,
    };
}

// ==========================================
// SAMPLE DATA
// ==========================================

const sampleChatbots: Chatbot[] = [
    {
        id: 'VUyBtr3F23QcD2fF',
        businessId: 'biz_1',
        name: 'Chatbot 7/2/2025, 2:50:46 PM',
        model: 'gpt-4o-mini',
        status: 'trained',
        visibility: 'public',
        characterCount: 23153,
        createdAt: '2025-07-02T14:50:46Z',
        lastTrainedAt: '2025-08-03T22:39:32Z',
    },
    {
        id: 'Xk9mPqR5TvWzA1bC',
        businessId: 'biz_1',
        name: 'NEW Chatbot_',
        model: 'gpt-4o',
        status: 'training',
        visibility: 'private',
        characterCount: 5420,
        createdAt: '2025-08-01T10:30:00Z',
        lastTrainedAt: null,
    },
];

// const sampleSettings: Record<string, ChatbotSettings> = {
//     'VUyBtr3F23QcD2fF': {
//         chatbotId: 'VUyBtr3F23QcD2fF',
//         name: 'Chatbot 7/2/2025, 2:50:46 PM',
//         model: 'gpt-4o-mini',
//         temperature: 0.7,
//         maxTokens: 1024,
//         welcomeMessage: 'Hi! How can I help you today?',
//         placeholder: 'Type your message...',
//         primaryColor: '#22c55e',
//         rateLimitPerMinute: 20,
//         requireEmailCapture: false,
//         emailNotifications: true,
//         notificationEmail: 'admin@aslaschat.ai',
//         webhookUrl: '',
//     },
// };

// ==========================================
// SIMULATED DELAY (Remove in production)
// ==========================================

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// CHATBOT API SERVICE
// ==========================================

export async function getChatbots(): Promise<ApiResponse<Chatbot[]>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'User not authenticated',
                data: []
            };
        }

        const backendChatbots: BackendChatbot[] = await api.get(`/chatbots/owner/${user.uid}`);
        const chatbots = backendChatbots.map(convertBackendToFrontend);

        return {
            success: true,
            data: chatbots,
        };
    } catch (error) {
        console.error('Error fetching chatbots:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch chatbots',
            data: []
        };
    }
}

export async function getChatbotById(id: string): Promise<ApiResponse<Chatbot | null>> {
    try {
        const backendChatbot: BackendChatbot = await api.get(`/chatbots/${id}`);
        const chatbot = convertBackendToFrontend(backendChatbot);
        
        return {
            success: true,
            data: chatbot,
        };
    } catch (error) {
        console.error('Error fetching chatbot:', error);
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Chatbot not found',
        };
    }
}

export async function createChatbot(data: {
    name: string;
    businessId: string;
    model: Chatbot['model'];
    visibility: Chatbot['visibility'];
}): Promise<ApiResponse<Chatbot>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'User not authenticated',
                data: null as unknown as Chatbot
            };
        }

        const backendData = {
            name: data.name,
            description: data.name, // Use chatbot name as description
            businessId: data.businessId,
            userId: user.uid,
            isActive: true,
        };

        const backendChatbot: BackendChatbot = await api.post('/chatbots', backendData);
        const chatbot = convertBackendToFrontend(backendChatbot);

        return {
            success: true,
            data: chatbot,
        };
    } catch (error) {
        console.error('Error creating chatbot:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create chatbot',
            data: null as unknown as Chatbot
        };
    }
}

export async function updateChatbot(
    id: string,
    data: Partial<Chatbot>
): Promise<ApiResponse<Chatbot>> {
    try {
        const backendChatbot: BackendChatbot = await api.patch(`/chatbots/${id}`, data);
        const chatbot = convertBackendToFrontend(backendChatbot);

        return {
            success: true,
            data: chatbot,
        };
    } catch (error) {
        console.error('Error updating chatbot:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update chatbot',
            data: null as unknown as Chatbot
        };
    }
}

export async function deleteChatbot(id: string): Promise<ApiResponse<void>> {
    try {
        await api.delete(`/chatbots/${id}`);
        
        return {
            success: true,
            data: undefined,
        };
    } catch (error) {
        console.error('Error deleting chatbot:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete chatbot',
            data: undefined
        };
    };
}

// ==========================================
// SAMPLE DATA FOR SETTINGS (TEMPORARY)
// ==========================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sampleSettings: Record<string, ChatbotSettings> = {};

// ==========================================
// CHATBOT SETTINGS API
// ==========================================

export async function getChatbotSettings(chatbotId: string): Promise<ApiResponse<ChatbotSettings | null>> {
    await delay(300);
    const settings = sampleSettings[chatbotId] || null;
    return {
        success: !!settings,
        data: settings,
    };
}

export async function updateChatbotSettings(
    chatbotId: string,
    data: Partial<ChatbotSettings>
): Promise<ApiResponse<ChatbotSettings>> {
    await delay(500);
    if (!sampleSettings[chatbotId]) {
        sampleSettings[chatbotId] = {
            chatbotId,
            name: '',
            model: 'gpt-4o-mini',
            temperature: 0.7,
            maxTokens: 1024,
            welcomeMessage: 'Hi! How can I help you today?',
            placeholder: 'Type your message...',
            primaryColor: '#22c55e',
            rateLimitPerMinute: 20,
            requireEmailCapture: false,
            emailNotifications: false,
            notificationEmail: '',
            webhookUrl: '',
        };
    }
    sampleSettings[chatbotId] = { ...sampleSettings[chatbotId], ...data };
    return {
        success: true,
        data: sampleSettings[chatbotId],
    };
}

// ==========================================
// TRAIN CHATBOT
// ==========================================

export async function trainChatbot(id: string): Promise<ApiResponse<Chatbot>> {
    await delay(2000); // Simulate training
    const index = sampleChatbots.findIndex(c => c.id === id);
    if (index === -1) {
        return { success: false, data: null as any, error: 'Chatbot not found' };
    }
    sampleChatbots[index].status = 'trained';
    sampleChatbots[index].lastTrainedAt = new Date().toISOString();
    return {
        success: true,
        data: sampleChatbots[index],
    };
}
