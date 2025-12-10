import type {
    Chatbot,
    ChatbotSettings,
    ApiResponse,
} from '@/types';

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

const sampleSettings: Record<string, ChatbotSettings> = {
    'VUyBtr3F23QcD2fF': {
        chatbotId: 'VUyBtr3F23QcD2fF',
        name: 'Chatbot 7/2/2025, 2:50:46 PM',
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 1024,
        welcomeMessage: 'Hi! How can I help you today?',
        placeholder: 'Type your message...',
        primaryColor: '#22c55e',
        rateLimitPerMinute: 20,
        requireEmailCapture: false,
        emailNotifications: true,
        notificationEmail: 'admin@aslaschat.ai',
        webhookUrl: '',
    },
};

// ==========================================
// SIMULATED DELAY (Remove in production)
// ==========================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// CHATBOT API SERVICE
// ==========================================

export async function getChatbots(): Promise<ApiResponse<Chatbot[]>> {
    await delay(500); // Simulate network delay
    return {
        success: true,
        data: sampleChatbots,
    };
}

export async function getChatbotById(id: string): Promise<ApiResponse<Chatbot | null>> {
    await delay(300);
    const chatbot = sampleChatbots.find(c => c.id === id) || null;
    return {
        success: !!chatbot,
        data: chatbot,
        error: chatbot ? undefined : 'Chatbot not found',
    };
}

export async function createChatbot(data: {
    name: string;
    businessId: string;
    model: Chatbot['model'];
    visibility: Chatbot['visibility'];
}): Promise<ApiResponse<Chatbot>> {
    await delay(800);
    // Generate truly unique ID using random string
    const uniqueId = `cb_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const newChatbot: Chatbot = {
        id: uniqueId,
        businessId: data.businessId,
        name: data.name,
        model: data.model,
        status: 'training',
        visibility: data.visibility,
        characterCount: 0,
        createdAt: new Date().toISOString(),
        lastTrainedAt: null,
    };
    // Check if ID already exists (shouldn't happen but safety check)
    const existingIndex = sampleChatbots.findIndex(c => c.id === uniqueId);
    if (existingIndex === -1) {
        sampleChatbots.push(newChatbot);
    }
    return {
        success: true,
        data: newChatbot,
    };
}

export async function updateChatbot(
    id: string,
    data: Partial<Chatbot>
): Promise<ApiResponse<Chatbot>> {
    await delay(500);
    const index = sampleChatbots.findIndex(c => c.id === id);
    if (index === -1) {
        return { success: false, data: null as any, error: 'Chatbot not found' };
    }
    sampleChatbots[index] = { ...sampleChatbots[index], ...data };
    return {
        success: true,
        data: sampleChatbots[index],
    };
}

export async function deleteChatbot(id: string): Promise<ApiResponse<boolean>> {
    await delay(500);
    const index = sampleChatbots.findIndex(c => c.id === id);
    if (index === -1) {
        return { success: false, data: false, error: 'Chatbot not found' };
    }
    sampleChatbots.splice(index, 1);
    return {
        success: true,
        data: true,
    };
}

// ==========================================
// SETTINGS API SERVICE
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
