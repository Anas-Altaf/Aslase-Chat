import type {
  ChatSession,
  Lead,
  LeadStatus,
  LeadSource,
  ApiResponse,
  PaginatedResponse,
  BackendPaginatedResult,
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
  messages: BackendMessage[];
  isAnonymous?: boolean;
  messageCount?: number;
  createdAt: string;
  updatedAt?: string;
}

interface BackendLead {
  _id: string;
  chatbot_id: string;
  userName: string;
  userEmail?: string;
  phone?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  additionalInfo: Record<string, any>;
  capturedAt: string;
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
    source: "embed" as const,
    confidenceScore: 0,
    isAnonymous: chat.isAnonymous ?? true,
    messageCount: chat.messageCount ?? (chat.messages?.length ?? 0),
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  };
}

function convertLead(lead: BackendLead): Lead {
  return {
    id: lead._id,
    chatbotId: lead.chatbot_id,
    name: lead.userName,
    email: lead.userEmail ?? "",
    phone: lead.phone ?? "",
    status: lead.status ?? "new",
    source: lead.source ?? "website",
    notes: lead.notes,
    additionalInfo: lead.additionalInfo ?? {},
    capturedAt: lead.capturedAt,
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
    const result = await api.get<BackendPaginatedResult<BackendChat>>(
      `/chatbots/${chatbotId}/chats?${params.toString()}`,
    );

    const sessions = (result.data ?? []).map(convertChat);
    const totalPages = result.totalPages ?? (result as any).pages ?? 1;

    return {
      success: true,
      data: {
        items: sessions,
        total: result.total ?? sessions.length,
        page: result.page ?? page,
        pageSize: result.limit ?? limit,
        hasMore: (result.page ?? page) < totalPages,
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
): Promise<ApiResponse<string>> {
  return { success: false, error: "Export not yet implemented", data: "" };
}

// ==========================================
// LEADS
// ==========================================

export async function getLeads(
  chatbotId: string,
  filters?: { status?: string; from?: string; to?: string; page?: number; limit?: number },
): Promise<ApiResponse<PaginatedResponse<Lead>>> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.from) params.set("from", filters.from);
    if (filters?.to) params.set("to", filters.to);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    const qs = params.toString();
    const result = await api.get<BackendPaginatedResult<BackendLead>>(
      `/leads/chatbot/${chatbotId}${qs ? `?${qs}` : ""}`,
    );

    const leads = (result.data ?? []).map(convertLead);

    return {
      success: true,
      data: {
        items: leads,
        total: result.total ?? leads.length,
        page: result.page ?? 1,
        pageSize: result.limit ?? 20,
        hasMore: (result.page ?? 1) < (result.totalPages ?? 1),
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch leads",
      data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false },
    };
  }
}

export async function updateLead(
  id: string,
  data: { status?: LeadStatus; notes?: string; additionalInfo?: Record<string, any> },
): Promise<ApiResponse<Lead>> {
  try {
    const backendLead = await api.patch<BackendLead>(`/leads/${id}`, data);
    return { success: true, data: convertLead(backendLead) };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update lead",
      data: null as unknown as Lead,
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
      error:
        error instanceof Error ? error.message : "Failed to delete lead",
      data: false,
    };
  }
}

export async function exportLeads(
  _chatbotId: string,
  _format: "csv" | "json" = "csv",
): Promise<ApiResponse<string>> {
  return { success: false, error: "Export not yet implemented", data: "" };
}
