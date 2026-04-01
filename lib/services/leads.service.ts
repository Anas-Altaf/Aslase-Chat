import type {
  Lead,
  LeadStatus,
  ApiResponse,
  PaginatedResponse,
} from "@/types";
import { api } from "../api";
import { getAuthToken } from "../api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ==========================================
// BACKEND SHAPE
// ==========================================

interface BackendLead {
  _id: string;
  chatbot_id: string;
  userName: string;
  userEmail?: string | null;
  phone?: string | null;
  status: LeadStatus;
  source: string;
  notes?: string | null;
  additionalInfo: Record<string, any>;
  capturedAt: string;
  updatedAt: string;
}

function convertLead(l: BackendLead): Lead {
  return {
    id: l._id,
    chatbotId: typeof l.chatbot_id === "object" ? String(l.chatbot_id) : l.chatbot_id,
    name: l.userName ?? "",
    email: l.userEmail ?? "",
    phone: l.phone ?? "",
    status: l.status,
    source: l.source as Lead["source"],
    notes: l.notes ?? undefined,
    additionalInfo: l.additionalInfo ?? {},
    capturedAt: l.capturedAt,
  };
}

// ==========================================
// LEADS API SERVICE
// ==========================================

export async function getLeads(
  chatbotId: string,
  params?: {
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  },
): Promise<ApiResponse<PaginatedResponse<Lead>>> {
  try {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));

    const query = qs.toString();
    const raw = await api.get<unknown>(
      `/leads/chatbot/${chatbotId}${query ? `?${query}` : ""}`,
    );

    const isArr = Array.isArray(raw);
    const list: BackendLead[] = isArr
      ? (raw as BackendLead[])
      : ((raw as any)?.data ?? []);
    const leads = list.map(convertLead);
    const total = isArr ? leads.length : ((raw as any)?.total ?? leads.length);
    const page = isArr ? 1 : ((raw as any)?.page ?? 1);
    const limit = isArr ? leads.length : ((raw as any)?.limit ?? 20);
    const totalPages = isArr ? 1 : ((raw as any)?.totalPages ?? 1);

    return {
      success: true,
      data: {
        items: leads,
        total,
        page,
        pageSize: limit,
        hasMore: page < totalPages,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch leads",
      data: { items: [], total: 0, page: 1, pageSize: 20, hasMore: false },
    };
  }
}

export async function deleteLead(id: string): Promise<ApiResponse<void>> {
  try {
    await api.delete(`/leads/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete lead",
      data: undefined,
    };
  }
}

export async function updateLead(
  id: string,
  data: { status?: LeadStatus; notes?: string },
): Promise<ApiResponse<Lead>> {
  try {
    const updated = await api.patch<BackendLead>(`/leads/${id}`, data);
    return { success: true, data: convertLead(updated) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update lead",
      data: null as unknown as Lead,
    };
  }
}

export async function exportLeads(
  chatbotId: string,
  format: "csv" | "json" = "csv",
): Promise<ApiResponse<string>> {
  try {
    const res = await api.get<{ export: string }>(
      `/leads/chatbot/${chatbotId}/export?format=${format}`,
    );
    return { success: true, data: res.export };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export leads",
      data: "",
    };
  }
}
