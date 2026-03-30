import type {
  ChatQuery,
  SentimentType,
  ApiResponse,
  PaginatedResponse,
  BackendPaginatedResult,
} from "@/types";
import { api } from "../api";

// ==========================================
// BACKEND SHAPE
// ==========================================

interface BackendQuery {
  _id: string;
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

function convertQuery(q: BackendQuery): ChatQuery {
  return {
    id: q._id,
    chatbotId: q.chatbotId,
    sessionId: q.sessionId,
    isAnonymous: q.isAnonymous,
    userMessage: q.userMessage,
    botResponse: q.botResponse,
    userSentiment: q.userSentiment,
    replySentiment: q.replySentiment,
    leadCaptured: q.leadCaptured,
    createdAt: q.createdAt,
  };
}

// ==========================================
// QUERIES API SERVICE
// ==========================================

export async function getQueries(
  chatbotId: string,
  params?: {
    sentiment?: SentimentType;
    isAnonymous?: boolean;
    search?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  },
): Promise<ApiResponse<PaginatedResponse<ChatQuery>>> {
  try {
    const qs = new URLSearchParams();
    if (params?.sentiment) qs.set("sentiment", params.sentiment);
    if (params?.isAnonymous !== undefined)
      qs.set("isAnonymous", String(params.isAnonymous));
    if (params?.search) qs.set("search", params.search);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit ?? 20));

    const query = qs.toString();
    const result = await api.get<BackendPaginatedResult<BackendQuery>>(
      `/queries/chatbot/${chatbotId}${query ? `?${query}` : ""}`,
    );

    const queries = (result.data ?? []).map(convertQuery);

    return {
      success: true,
      data: {
        items: queries,
        total: result.total ?? queries.length,
        page: result.page ?? 1,
        pageSize: result.limit ?? 20,
        hasMore: (result.page ?? 1) < (result.totalPages ?? 1),
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch queries",
      data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false },
    };
  }
}

export async function deleteQuery(id: string): Promise<ApiResponse<void>> {
  try {
    await api.delete(`/queries/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete query",
      data: undefined,
    };
  }
}

export async function deleteAllQueries(
  chatbotId: string,
): Promise<ApiResponse<{ deleted: number }>> {
  try {
    const result = await api.delete<{ message: string; deleted: number }>(
      `/queries/chatbot/${chatbotId}/all`,
    );
    const deleted =
      typeof result === "object" && result !== null && "deleted" in result
        ? (result as { deleted: number }).deleted
        : 0;
    return { success: true, data: { deleted } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete queries",
      data: { deleted: 0 },
    };
  }
}

export async function exportQueries(
  chatbotId: string,
  params: {
    sentiment?: SentimentType;
    isAnonymous?: boolean;
    search?: string;
    from?: string;
    to?: string;
    limit?: number;
  },
  format: "csv" | "json" = "csv",
): Promise<ApiResponse<string>> {
  try {
    const qs = new URLSearchParams();
    qs.set("format", format);
    if (params.sentiment) qs.set("sentiment", params.sentiment);
    if (params.isAnonymous !== undefined)
      qs.set("isAnonymous", String(params.isAnonymous));
    if (params.search) qs.set("search", params.search);
    if (params.from) qs.set("from", params.from);
    if (params.to) qs.set("to", params.to);
    if (params.limit) qs.set("limit", String(params.limit));

    const res = await api.get<{ export: string }>(
      `/queries/chatbot/${chatbotId}/export?${qs.toString()}`,
    );
    return { success: true, data: res.export };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to export queries",
      data: "",
    };
  }
}
