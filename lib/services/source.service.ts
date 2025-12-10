import type {
    Source,
    SourceStats,
    ApiResponse,
} from '@/types';

// ==========================================
// SAMPLE DATA
// ==========================================

const sampleSources: Source[] = [
    {
        id: 'src_1',
        chatbotId: 'VUyBtr3F23QcD2fF',
        type: 'file',
        name: '1621154940000 Aadaas Hindusi.pdf',
        characterCount: 20338,
        createdAt: '2025-07-02T15:00:00Z',
    },
    {
        id: 'src_2',
        chatbotId: 'VUyBtr3F23QcD2fF',
        type: 'file',
        name: 'AslasChat_para.txt',
        characterCount: 2778,
        createdAt: '2025-07-02T15:05:00Z',
    },
    {
        id: 'src_3',
        chatbotId: 'VUyBtr3F23QcD2fF',
        type: 'text',
        name: 'Company Description',
        characterCount: 37,
        createdAt: '2025-07-02T15:10:00Z',
    },
];

// ==========================================
// SIMULATED DELAY
// ==========================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// SOURCES API SERVICE
// ==========================================

export async function getSources(chatbotId: string): Promise<ApiResponse<Source[]>> {
    await delay(400);
    const sources = sampleSources.filter(s => s.chatbotId === chatbotId);
    return {
        success: true,
        data: sources,
    };
}

export async function getSourceStats(chatbotId: string): Promise<ApiResponse<SourceStats>> {
    await delay(200);
    const sources = sampleSources.filter(s => s.chatbotId === chatbotId);

    const stats: SourceStats = {
        totalCharacters: sources.reduce((sum, s) => sum + s.characterCount, 0),
        characterLimit: 1100000,
        fileCount: sources.filter(s => s.type === 'file').length,
        fileCharacters: sources.filter(s => s.type === 'file').reduce((sum, s) => sum + s.characterCount, 0),
        qnaCount: sources.filter(s => s.type === 'qna').length,
        qnaCharacters: sources.filter(s => s.type === 'qna').reduce((sum, s) => sum + s.characterCount, 0),
        textCharacters: sources.filter(s => s.type === 'text').reduce((sum, s) => sum + s.characterCount, 0),
    };

    return {
        success: true,
        data: stats,
    };
}

export async function uploadSource(
    chatbotId: string,
    file: { name: string; content: string }
): Promise<ApiResponse<Source>> {
    await delay(1500); // Simulate upload

    const newSource: Source = {
        id: `src_${Date.now()}`,
        chatbotId,
        type: 'file',
        name: file.name,
        characterCount: file.content.length,
        createdAt: new Date().toISOString(),
    };

    sampleSources.push(newSource);

    return {
        success: true,
        data: newSource,
    };
}

export async function addTextSource(
    chatbotId: string,
    data: { name: string; content: string }
): Promise<ApiResponse<Source>> {
    await delay(500);

    const newSource: Source = {
        id: `src_${Date.now()}`,
        chatbotId,
        type: 'text',
        name: data.name,
        characterCount: data.content.length,
        createdAt: new Date().toISOString(),
    };

    sampleSources.push(newSource);

    return {
        success: true,
        data: newSource,
    };
}

export async function deleteSource(id: string): Promise<ApiResponse<boolean>> {
    await delay(300);
    const index = sampleSources.findIndex(s => s.id === id);
    if (index !== -1) {
        sampleSources.splice(index, 1);
    }
    return {
        success: true,
        data: true,
    };
}
