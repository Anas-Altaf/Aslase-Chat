import type {
    AnalyticsData,
    Integration,
    ApiResponse,
} from '@/types';

// ==========================================
// SAMPLE DATA
// ==========================================

const sampleAnalytics: Record<string, AnalyticsData> = {
    'VUyBtr3F23QcD2fF': {
        chatbotId: 'VUyBtr3F23QcD2fF',
        period: 'monthly',
        data: [
            { date: '2025-01', chats: 45, leads: 12 },
            { date: '2025-02', chats: 62, leads: 18 },
            { date: '2025-03', chats: 78, leads: 22 },
            { date: '2025-04', chats: 95, leads: 28 },
            { date: '2025-05', chats: 120, leads: 35 },
            { date: '2025-06', chats: 145, leads: 42 },
            { date: '2025-07', chats: 180, leads: 55 },
            { date: '2025-08', chats: 156, leads: 48 },
        ],
        totals: {
            totalChats: 881,
            totalLeads: 260,
            avgConfidence: 0.78,
        },
    },
};

const integrations: Integration[] = [
    { id: 'int_1', name: 'Add to Slack', platform: 'slack', status: 'coming_soon' },
    { id: 'int_2', name: 'Add to WhatsApp', platform: 'whatsapp', status: 'subscription_required' },
    { id: 'int_3', name: 'Add to Wordpress', platform: 'wordpress', status: 'available' },
    { id: 'int_4', name: 'Add to Messenger', platform: 'messenger', status: 'coming_soon' },
    { id: 'int_5', name: 'Add to Shopify', platform: 'shopify', status: 'subscription_required' },
    { id: 'int_6', name: 'Add to Instagram', platform: 'instagram', status: 'coming_soon' },
];

// ==========================================
// SIMULATED DELAY
// ==========================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// ANALYTICS API SERVICE
// ==========================================

export async function getAnalytics(
    chatbotId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'monthly',
    dateRange?: { start: string; end: string }
): Promise<ApiResponse<AnalyticsData>> {
    await delay(600);

    const analytics = sampleAnalytics[chatbotId] || {
        chatbotId,
        period,
        data: [],
        totals: { totalChats: 0, totalLeads: 0, avgConfidence: 0 },
    };

    return {
        success: true,
        data: { ...analytics, period },
    };
}

export async function exportAnalytics(
    chatbotId: string,
    format: 'csv' | 'pdf' = 'csv'
): Promise<ApiResponse<string>> {
    await delay(1000);
    return {
        success: true,
        data: `https://api.aslaschat.ai/exports/${chatbotId}/analytics.${format}`,
    };
}

// ==========================================
// INTEGRATIONS API SERVICE
// ==========================================

export async function getIntegrations(): Promise<ApiResponse<Integration[]>> {
    await delay(300);
    return {
        success: true,
        data: integrations,
    };
}

export async function connectIntegration(
    integrationId: string,
    config: Record<string, string>
): Promise<ApiResponse<Integration>> {
    await delay(1000);

    const index = integrations.findIndex(i => i.id === integrationId);
    if (index === -1) {
        return { success: false, data: null as any, error: 'Integration not found' };
    }

    integrations[index].status = 'connected';

    return {
        success: true,
        data: integrations[index],
    };
}

export async function disconnectIntegration(integrationId: string): Promise<ApiResponse<boolean>> {
    await delay(500);

    const index = integrations.findIndex(i => i.id === integrationId);
    if (index !== -1) {
        integrations[index].status = 'available';
    }

    return {
        success: true,
        data: true,
    };
}

// ==========================================
// EMBED CODE GENERATION
// ==========================================

export function generateEmbedCode(chatbotId: string): {
    iframe: string;
    script: string;
} {
    return {
        iframe: `<iframe src="https://app.aslaschat.ai/chatbot/iframe/${chatbotId}" width="100%" style="height: 100%; min-height: 700px" frameborder="0"></iframe>`,
        script: `<script>
  window.embeddedChatbotConfig = {
    chatbotId: "${chatbotId}",
    domain: "www.aslaschat.ai"
  }
</script>
<script src="https://app.aslaschat.ai/embed.min.js" defer></script>`,
    };
}
