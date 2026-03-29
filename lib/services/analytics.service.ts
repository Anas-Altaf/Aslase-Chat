import type {
  ChatbotAnalytics,
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

export async function exportAnalytics(
  _chatbotId: string,
  _format: "csv" | "pdf" = "csv",
): Promise<ApiResponse<string>> {
  return { success: false, error: "Export not yet implemented", data: "" };
}
