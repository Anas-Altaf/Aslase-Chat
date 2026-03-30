import { NextResponse } from 'next/server';

export const revalidate = 21600; // cache for 6 hours

interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: { prompt: string; completion: string };
  top_provider?: { context_length?: number; max_completion_tokens?: number };
  architecture?: { modality: string };
}

function getProvider(modelId: string): string {
  const prefix = modelId.split('/')[0];
  const MAP: Record<string, string> = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    google: 'Google',
    'meta-llama': 'Meta',
    mistralai: 'Mistral',
    cohere: 'Cohere',
    qwen: 'Qwen',
    deepseek: 'DeepSeek',
    microsoft: 'Microsoft',
    'x-ai': 'xAI',
    perplexity: 'Perplexity',
  };
  return MAP[prefix] ?? prefix ?? 'Other';
}

function isFree(model: OpenRouterModel): boolean {
  return (
    parseFloat(model.pricing.prompt) === 0 &&
    parseFloat(model.pricing.completion) === 0
  );
}

export async function GET() {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Accept: 'application/json' },
      next: { revalidate: 21600 },
    });

    if (!res.ok) {
      throw new Error(`OpenRouter returned ${res.status}`);
    }

    const json = await res.json();
    const allModels: OpenRouterModel[] = json?.data ?? [];

    // Filter: text/multimodal models with decent context + exclude embedding/image-gen models
    const filtered = allModels.filter(
      (m) =>
        m.context_length >= 4096 &&
        !m.id.includes('embed') &&
        !m.id.includes('image') &&
        !m.id.includes('diffusion') &&
        !m.id.includes('tts') &&
        !m.id.includes('whisper') &&
        (m.architecture?.modality === 'text->text' ||
          m.architecture?.modality === 'text+image->text' ||
          !m.architecture),
    );

    // Sort: by provider, then by name
    filtered.sort((a, b) => {
      const pa = getProvider(a.id);
      const pb = getProvider(b.id);
      if (pa !== pb) return pa.localeCompare(pb);
      return a.name.localeCompare(b.name);
    });

    const models = filtered.map((m) => ({
      id: m.id,
      name: m.name,
      provider: getProvider(m.id),
      contextLength: m.context_length,
      isFree: isFree(m),
      description: m.description?.slice(0, 120),
    }));

    return NextResponse.json({ models });
  } catch (err) {
    // Return a fallback list so the UI doesn't break
    return NextResponse.json({
      models: [
        { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', contextLength: 128000, isFree: false },
        { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', contextLength: 128000, isFree: false },
        { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', contextLength: 16385, isFree: false },
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', contextLength: 200000, isFree: false },
        { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', provider: 'Google', contextLength: 1000000, isFree: false },
        { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', provider: 'Meta', contextLength: 131072, isFree: true },
        { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek', contextLength: 163840, isFree: false },
        { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B Instruct', provider: 'Mistral', contextLength: 32768, isFree: false },
      ],
      fallback: true,
    });
  }
}
