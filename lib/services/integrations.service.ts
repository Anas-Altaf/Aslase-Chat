import type { ApiResponse } from '@/types';
import { api } from '../api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ChatwootConfig {
  connected: boolean;
  chatbotId: string;
  baseUrl?: string;
  accountId?: string;
  hasToken?: boolean;
  webhookToken?: string;
  webhookUrl?: string; // absolute public URL from the backend (preferred when present)
  isActive?: boolean;
}

export interface ConnectChatwootPayload {
  chatbotId: string;
  baseUrl: string;
  accountId: string;
  apiAccessToken?: string; // optional on reconfigure — blank keeps the stored token
}

/** Full inbound webhook URL the business pastes into their Chatwoot Agent Bot. */
export function chatwootWebhookUrl(webhookToken: string): string {
  return `${API_BASE}/integrations/chatwoot/webhook/${webhookToken}`;
}

export async function getChatwootConfig(chatbotId: string): Promise<ApiResponse<ChatwootConfig>> {
  try {
    const data = await api.get<ChatwootConfig>(`/integrations/chatwoot/${chatbotId}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load Chatwoot config',
      data: { connected: false, chatbotId },
    };
  }
}

export async function connectChatwoot(payload: ConnectChatwootPayload): Promise<ApiResponse<ChatwootConfig>> {
  try {
    const data = await api.post<ChatwootConfig>('/integrations/chatwoot', payload);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect Chatwoot',
      data: { connected: false, chatbotId: payload.chatbotId },
    };
  }
}

export async function disconnectChatwoot(chatbotId: string): Promise<ApiResponse<{ message: string }>> {
  try {
    const data = await api.delete<{ message: string }>(`/integrations/chatwoot/${chatbotId}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to disconnect Chatwoot',
      data: { message: '' },
    };
  }
}
