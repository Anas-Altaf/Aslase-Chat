import type { Chatbot, ChatbotSettings, ApiResponse } from "@/types";
import { api } from "../api";
import { auth } from "@/lib/firebase/config";

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

function convertBackendToFrontend(backendChatbot: BackendChatbot): Chatbot {
  return {
    id: backendChatbot._id,
    businessId: backendChatbot.businessId,
    name: backendChatbot.name,
    model: "gpt-4o-mini",
    status: "trained",
    visibility: "public",
    characterCount: 0,
    createdAt: backendChatbot.createdAt,
    lastTrainedAt: backendChatbot.createdAt,
  };
}

// ==========================================
// CHATBOT API SERVICE
// ==========================================

export async function getChatbots(): Promise<ApiResponse<Chatbot[]>> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "User not authenticated", data: [] };
    }
    const backendChatbots = await api.get<BackendChatbot[]>(
      `/chatbots/owner/${user.uid}`,
    );
    return {
      success: true,
      data: backendChatbots.map(convertBackendToFrontend),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch chatbots",
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
  model: Chatbot["model"];
  visibility: Chatbot["visibility"];
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
      error:
        error instanceof Error ? error.message : "Failed to create chatbot",
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
      error:
        error instanceof Error ? error.message : "Failed to update chatbot",
      data: null as unknown as Chatbot,
    };
  }
}

export async function trainChatbot(
  chatbotId: string,
): Promise<ApiResponse<{ queued: boolean }>> {
  try {
    // Backend train endpoint may not be available in all environments yet.
    await api.post(`/chatbots/${chatbotId}/train`, {});
    return { success: true, data: { queued: true } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to train chatbot",
      data: { queued: false },
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
      error:
        error instanceof Error ? error.message : "Failed to delete chatbot",
      data: undefined,
    };
  }
}

// ==========================================
// CHATBOT SETTINGS (in-memory until backend endpoint exists)
// ==========================================

const settingsStore: Record<string, ChatbotSettings> = {};

export async function getChatbotSettings(
  chatbotId: string,
): Promise<ApiResponse<ChatbotSettings | null>> {
  const settings = settingsStore[chatbotId] ?? null;
  return { success: !!settings, data: settings };
}

export async function updateChatbotSettings(
  chatbotId: string,
  data: Partial<ChatbotSettings>,
): Promise<ApiResponse<ChatbotSettings>> {
  const defaults: ChatbotSettings = {
    chatbotId,
    name: "",
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 1024,
    welcomeMessage: "Hi! How can I help you today?",
    placeholder: "Type your message...",
    primaryColor: "#22c55e",
    rateLimitPerMinute: 20,
    requireEmailCapture: false,
    emailNotifications: false,
    notificationEmail: "",
    webhookUrl: "",
  };
  settingsStore[chatbotId] = { ...defaults, ...settingsStore[chatbotId], ...data, chatbotId };
  return { success: true, data: settingsStore[chatbotId] };
}
