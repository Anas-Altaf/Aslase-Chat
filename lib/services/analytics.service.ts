import type {
  ChatbotAnalytics,
  BusinessAnalytics,
  Integration,
  ApiResponse,
} from "@/types";
import { api } from "../api";

// ==========================================
// ANALYTICS API SERVICE (real backend)
// ==========================================

export async function getChatbotAnalytics(
  chatbotId: string,
): Promise<ApiResponse<ChatbotAnalytics>> {
  try {
    const data = await api.get<ChatbotAnalytics>(
      `/analytics/chatbot/${chatbotId}`,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch analytics",
      data: null as unknown as ChatbotAnalytics,
    };
  }
}

// Legacy alias used by analytics.tsx
export async function getAnalytics(
  chatbotId: string,
): Promise<ApiResponse<ChatbotAnalytics>> {
  return getChatbotAnalytics(chatbotId);
}

export async function getBusinessAnalytics(
  businessId: string,
): Promise<ApiResponse<BusinessAnalytics>> {
  try {
    const data = await api.get<BusinessAnalytics>(
      `/analytics/business/${businessId}`,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch business analytics",
      data: null as unknown as BusinessAnalytics,
    };
  }
}

// ==========================================
// INTEGRATIONS (mock — future OAuth scope)
// ==========================================

const integrations: Integration[] = [
  { id: "int_1", name: "Add to Slack", platform: "slack", status: "coming_soon" },
  { id: "int_2", name: "Add to WhatsApp", platform: "whatsapp", status: "subscription_required" },
  { id: "int_3", name: "Add to Wordpress", platform: "wordpress", status: "available" },
  { id: "int_4", name: "Add to Messenger", platform: "messenger", status: "coming_soon" },
  { id: "int_5", name: "Add to Shopify", platform: "shopify", status: "subscription_required" },
  { id: "int_6", name: "Add to Instagram", platform: "instagram", status: "coming_soon" },
];

export async function getIntegrations(): Promise<ApiResponse<Integration[]>> {
  return { success: true, data: integrations };
}

export async function connectIntegration(
  integrationId: string,
  _config: Record<string, string>,
): Promise<ApiResponse<Integration>> {
  const index = integrations.findIndex((i) => i.id === integrationId);
  if (index === -1) {
    return { success: false, data: null as any, error: "Integration not found" };
  }
  integrations[index].status = "connected";
  return { success: true, data: integrations[index] };
}

export async function disconnectIntegration(
  integrationId: string,
): Promise<ApiResponse<boolean>> {
  const index = integrations.findIndex((i) => i.id === integrationId);
  if (index !== -1) integrations[index].status = "available";
  return { success: true, data: true };
}

// ==========================================
// EMBED CODE (no backend needed)
// ==========================================

export function generateEmbedCode(
  chatbotId: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL ?? "",
): {
  iframe: string;
  script: string;
  shareUrl: string;
} {
  // Fall back to relative paths if baseUrl not yet known (SSR)
  const base = baseUrl || "";
  return {
    shareUrl: `${base}/chatbot/${chatbotId}`,
    iframe: `<iframe\n  src="${base}/chatbot/iframe/${chatbotId}"\n  width="100%"\n  style="height: 100%; min-height: 700px"\n  frameborder="0"\n  allow="microphone"\n></iframe>`,
    script: `<script>
  window.embeddedChatbotConfig = {
    chatbotId: "${chatbotId}",
    baseUrl: "${base}"
  }
</script>
<script src="${base}/embed.min.js" defer></script>`,
  };
}

export async function exportAnalytics(
  _chatbotId: string,
  _format: "csv" | "json" | "pdf" = "csv",
): Promise<ApiResponse<string>> {
  try {
    const backendFormat = _format === "pdf" ? "csv" : _format;
    const res = await api.get<{ export: string }>(
      `/analytics/chatbot/${_chatbotId}/export?format=${encodeURIComponent(backendFormat)}`,
    );
    return { success: true, data: res.export };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export analytics",
      data: "",
    };
  }
}
