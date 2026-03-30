import type { Chatbot, ChatbotSettings, BackendChatbotSettings, ApiResponse } from "@/types";
import { api } from "../api";
import { auth } from "@/lib/firebase/config";

// ==========================================
// BACKEND CHATBOT INTERFACE
// ==========================================

interface BackendChatbot {
  _id: string;
  name: string;
  description: string;
  businessId: string;
  userId: string;
  isActive: boolean;
  settings?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPromptOverride?: string;
    welcomeMessage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

function convertBackendToFrontend(backendChatbot: BackendChatbot): Chatbot {
  return {
    id: backendChatbot._id,
    businessId: backendChatbot.businessId,
    name: backendChatbot.name,
    model: backendChatbot.settings?.model ?? "openai/gpt-4o-mini",
    status: backendChatbot.isActive ? "trained" : "error",
    visibility: "public",
    characterCount: 0,
    createdAt: backendChatbot.createdAt,
    lastTrainedAt: backendChatbot.updatedAt,
  };
}

// ==========================================
// CHATBOT CRUD
// ==========================================

export async function getChatbots(): Promise<ApiResponse<Chatbot[]>> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "User not authenticated", data: [] };
    }
    const raw = await api.get<unknown>(`/chatbots/owner/${user.uid}`);
    const list: BackendChatbot[] = Array.isArray(raw) ? (raw as BackendChatbot[]) : ((raw as any)?.data ?? []);
    return {
      success: true,
      data: list.map(convertBackendToFrontend),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch chatbots",
      data: [],
    };
  }
}

export async function getChatbotById(
  id: string,
): Promise<ApiResponse<Chatbot | null>> {
  try {
    const backendChatbot = await api.get<BackendChatbot>(`/chatbots/${id}`);
    return { success: true, data: convertBackendToFrontend(backendChatbot) };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Chatbot not found",
    };
  }
}

export async function createChatbot(data: {
  name: string;
  businessId: string;
  model: string;
  visibility: string;
}): Promise<ApiResponse<Chatbot>> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
        data: null as unknown as Chatbot,
      };
    }
    const backendChatbot = await api.post<BackendChatbot>("/chatbots", {
      name: data.name,
      businessId: data.businessId,
      userId: user.uid,
      isActive: true,
    });
    return { success: true, data: convertBackendToFrontend(backendChatbot) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create chatbot",
      data: null as unknown as Chatbot,
    };
  }
}

export async function updateChatbot(
  id: string,
  data: Partial<Chatbot>,
): Promise<ApiResponse<Chatbot>> {
  try {
    const backendChatbot = await api.patch<BackendChatbot>(
      `/chatbots/${id}`,
      data,
    );
    return { success: true, data: convertBackendToFrontend(backendChatbot) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update chatbot",
      data: null as unknown as Chatbot,
    };
  }
}

export async function deleteChatbot(id: string): Promise<ApiResponse<void>> {
  try {
    await api.delete(`/chatbots/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete chatbot",
      data: undefined,
    };
  }
}

// ==========================================
// CHATBOT TRAINING
// ==========================================

export async function trainChatbot(
  chatbotId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    // Trigger re-training by updating the chatbot via the existing PATCH endpoint
    await api.patch(`/chatbots/${chatbotId}`, { isActive: true });
    return { success: true, data: { success: true } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to train chatbot",
      data: { success: false },
    };
  }
}

// ==========================================
// CHATBOT SETTINGS
// ==========================================

const localKey = (id: string) => `chatbot_ui_settings_${id}`;

const UI_DEFAULTS = {
  placeholder: "Type your message...",
  primaryColor: "#22c55e",
  rateLimitPerMinute: 20,
  requireEmailCapture: false,
  emailNotifications: false,
  notificationEmail: "",
  webhookUrl: "",
};

export async function getChatbotSettings(
  chatbotId: string,
): Promise<ApiResponse<ChatbotSettings | null>> {
  try {
    const backendSettings = await api.get<BackendChatbotSettings>(
      `/chatbots/${chatbotId}/settings`,
    );

    const stored: Partial<ChatbotSettings> =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(localKey(chatbotId)) ?? "{}")
        : {};

    const merged: ChatbotSettings = {
      chatbotId,
      name: stored.name ?? "",
      model: backendSettings.model ?? "gpt-4o-mini",
      temperature: backendSettings.temperature ?? 0.7,
      maxTokens: backendSettings.maxTokens ?? 1024,
      systemPromptOverride: backendSettings.systemPromptOverride,
      welcomeMessage:
        backendSettings.welcomeMessage ?? "Hi! How can I help you today?",
      ...UI_DEFAULTS,
      ...stored,
    };

    return { success: true, data: merged };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to load settings",
      data: null,
    };
  }
}

export async function updateChatbotSettings(
  chatbotId: string,
  data: Partial<ChatbotSettings>,
): Promise<ApiResponse<ChatbotSettings>> {
  try {
    // Extract backend-relevant fields only
    const backendFields: BackendChatbotSettings = {};
    if (data.model !== undefined) backendFields.model = data.model;
    if (data.temperature !== undefined) backendFields.temperature = data.temperature;
    if (data.maxTokens !== undefined) backendFields.maxTokens = data.maxTokens;
    if (data.systemPromptOverride !== undefined)
      backendFields.systemPromptOverride = data.systemPromptOverride;
    if (data.welcomeMessage !== undefined)
      backendFields.welcomeMessage = data.welcomeMessage;

    if (Object.keys(backendFields).length > 0) {
      await api.patch(`/chatbots/${chatbotId}/settings`, backendFields);
    }

    // Persist all fields (including UI-only) to localStorage
    const current: Partial<ChatbotSettings> =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(localKey(chatbotId)) ?? "{}")
        : {};
    if (typeof window !== "undefined") {
      localStorage.setItem(
        localKey(chatbotId),
        JSON.stringify({ ...current, ...data }),
      );
    }

    const result = await getChatbotSettings(chatbotId);
    return result.success && result.data
      ? { success: true, data: result.data }
      : {
          success: false,
          error: result.error ?? "Failed to reload settings",
          data: null as unknown as ChatbotSettings,
        };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update settings",
      data: null as unknown as ChatbotSettings,
    };
  }
}
