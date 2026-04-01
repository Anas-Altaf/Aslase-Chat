import type {
  ChatSession,
  ApiResponse,
  PaginatedResponse,
} from "@/types";
import { api } from "../api";

// ==========================================
// BACKEND SHAPES
// ==========================================

interface BackendMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface BackendChat {
  _id: string;
  chatbotId: string;
  messages?: BackendMessage[];
  isAnonymous?: boolean;
  messageCount?: number;
  createdAt: string;
  updatedAt?: string;
  previewMessage?: string | null;
  previewTimestamp?: string | null;
}

// ==========================================
// CONVERTERS
// ==========================================

function convertChat(chat: BackendChat): ChatSession {
  return {
    id: chat._id,
    chatbotId: chat.chatbotId,
    messages: (chat.messages ?? []).map((msg, index) => ({
      id: `${chat._id}-${index}`,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    })),
    previewMessage: chat.previewMessage ?? undefined,
    source: "embed" as const,
    confidenceScore: 0,
    isAnonymous: chat.isAnonymous ?? true,
    messageCount: chat.messageCount ?? (chat.messages?.length ?? 0),
    leadName: (chat as any).leadName ?? null,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  };
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
  return api.post<SendMessageResponse>("/chatbots/chat/message", payload);
}

// ==========================================
// CHAT SESSIONS
// ==========================================

export async function getChatSessions(
  chatbotId: string,
  filters?: {
    page?: number;
    limit?: number;
    isAnonymous?: boolean;
  },
): Promise<ApiResponse<PaginatedResponse<ChatSession>>> {
  try {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 50;
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.isAnonymous !== undefined) {
      params.set("isAnonymous", String(filters.isAnonymous));
    }

    // Owner endpoint — returns ALL conversations for this chatbot (not just own chats)
    const raw = await api.get<unknown>(
      `/chatbots/${chatbotId}/chats?${params.toString()}`,
    );

    const isArr = Array.isArray(raw);
    const chats: BackendChat[] = isArr ? (raw as BackendChat[]) : ((raw as any)?.data ?? []);
    const sessions = chats.map(convertChat);
    const totalPages = isArr ? 1 : ((raw as any)?.totalPages ?? (raw as any)?.pages ?? 1);

    return {
      success: true,
      data: {
        items: sessions,
        total: isArr ? sessions.length : ((raw as any)?.total ?? sessions.length),
        page: isArr ? page : ((raw as any)?.page ?? page),
        pageSize: isArr ? limit : ((raw as any)?.limit ?? limit),
        hasMore: (isArr ? page : ((raw as any)?.page ?? page)) < totalPages,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch chat sessions",
      data: { items: [], total: 0, page: 1, pageSize: 50, hasMore: false },
    };
  }
}

export async function getChatHistory(
  chatId: string,
): Promise<ApiResponse<ChatSession | null>> {
  try {
    const chat = await api.get<BackendChat>(`/chatbots/chat/${chatId}`);
    return { success: true, data: convertChat(chat) };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to load chat history",
      data: null,
    };
  }
}

export async function getChatSessionById(
  id: string,
): Promise<ApiResponse<ChatSession | null>> {
  return getChatHistory(id);
}

export async function exportChatSessions(
  _chatbotId: string,
  _format: "csv" | "json" = "csv",
  isAnonymous?: boolean,
): Promise<ApiResponse<string>> {
  try {
    const qs = new URLSearchParams({ format: _format });
    if (isAnonymous !== undefined) qs.set("isAnonymous", String(isAnonymous));

    const res = await api.get<{ export: string }>(
      `/chatbots/${_chatbotId}/chats/export?${qs.toString()}`,
    );
    return { success: true, data: res.export };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export chat sessions",
      data: "",
    };
  }
}

