import type { Source, SourceStats, ApiResponse } from "@/types";
import { api } from "../api";

// ==========================================
// BACKEND SHAPE
// ==========================================

interface BackendSource {
  _id: string;
  chatbotId: string;
  type: "url" | "document" | "text";
  title: string;
  content: string;
  sourceUrl?: string;
  fileName?: string;
  createdAt: string;
}

function convertSource(s: BackendSource): Source {
  return {
    id: s._id,
    chatbotId: s.chatbotId,
    type: s.type,
    title: s.title,
    content: s.content,
    sourceUrl: s.sourceUrl,
    fileName: s.fileName,
    characterCount: s.content?.length ?? 0,
    createdAt: s.createdAt,
  };
}

// ==========================================
// SOURCES API SERVICE
// ==========================================

export async function getSources(
  chatbotId: string,
): Promise<ApiResponse<Source[]>> {
  try {
    const backendSources = await api.get<BackendSource[]>(
      `/sources/chatbot/${chatbotId}`,
    );
    return { success: true, data: backendSources.map(convertSource) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch sources",
      data: [],
    };
  }
}

export async function uploadDocuments(
  chatbotId: string,
  files: File[],
): Promise<ApiResponse<Source[]>> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("documents", file));
    const backendSources = await api.postFormData<BackendSource[]>(
      `/sources/${chatbotId}/documents`,
      formData,
    );
    return {
      success: true,
      data: Array.isArray(backendSources)
        ? backendSources.map(convertSource)
        : [],
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to upload documents",
      data: [],
    };
  }
}

export async function addTextSource(
  chatbotId: string,
  title: string,
  content: string,
): Promise<ApiResponse<Source>> {
  try {
    const backendSource = await api.post<BackendSource>("/sources/text", {
      chatbotId,
      title,
      content,
    });
    return { success: true, data: convertSource(backendSource) };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add text source",
      data: null as unknown as Source,
    };
  }
}

export async function scrapeUrls(
  chatbotId: string,
  urls: string[],
): Promise<ApiResponse<Source[]>> {
  try {
    const backendSources = await api.post<BackendSource[]>("/sources/scrape", {
      chatbotId,
      urls,
    });
    return {
      success: true,
      data: Array.isArray(backendSources)
        ? backendSources.map(convertSource)
        : [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape URLs",
      data: [],
    };
  }
}

export async function deleteSource(
  id: string,
): Promise<ApiResponse<boolean>> {
  try {
    await api.delete(`/sources/${id}`);
    return { success: true, data: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete source",
      data: false,
    };
  }
}

// ==========================================
// STATS HELPER (pure function — no API call)
// ==========================================

export function computeSourceStats(sources: Source[]): SourceStats {
  const files = sources.filter((s) => s.type === "document");
  const texts = sources.filter((s) => s.type === "text");
  const urls = sources.filter((s) => s.type === "url");

  return {
    totalCharacters: sources.reduce((sum, s) => sum + s.characterCount, 0),
    characterLimit: 1_100_000,
    fileCount: files.length,
    fileCharacters: files.reduce((sum, s) => sum + s.characterCount, 0),
    qnaCount: 0,
    qnaCharacters: 0,
    textCharacters: texts.reduce((sum, s) => sum + s.characterCount, 0),
    urlCount: urls.length,
    urlCharacters: urls.reduce((sum, s) => sum + s.characterCount, 0),
  };
}
