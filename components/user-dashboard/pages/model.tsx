"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useChatbot } from "@/contexts/ChatbotContext";
import { getChatbotSettings, updateChatbotSettings } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  isFree: boolean;
  description?: string;
  pricing?: { prompt: string; completion: string };
  modality?: string;
}

// ── Fallback models shown while fetching ──────────────────────────────────────

const FALLBACK_MODELS: ModelOption[] = [
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini (Recommended)", provider: "OpenAI", contextLength: 128000, isFree: false },
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI", contextLength: 128000, isFree: false },
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", contextLength: 16385, isFree: false },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", contextLength: 200000, isFree: false },
  { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash", provider: "Google", contextLength: 1000000, isFree: false },
  { id: "meta-llama/llama-3.1-8b-instruct", name: "Llama 3.1 8B Instruct", provider: "Meta", contextLength: 131072, isFree: true },
];

function formatCtx(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M ctx`;
  if (n >= 1_000) return `${Math.round(n / 1000)}K ctx`;
  return `${n} ctx`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Model() {
  const { selectedChatbot, editChatbot } = useChatbot();
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [models, setModels] = useState<ModelOption[]>(FALLBACK_MODELS);
  const [modelSearch, setModelSearch] = useState("");
  const [model, setModel] = useState<string>("openai/gpt-4o-mini");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);

  // ── Load settings ─────────────────────────────────────────────────────────

  const loadSettings = useCallback(async () => {
    if (!selectedChatbot) return;
    setIsSettingsLoading(true);
    try {
      const response = await getChatbotSettings(selectedChatbot.id);
      if (response.success && response.data) {
        setModel(response.data.model ?? "openai/gpt-4o-mini");
        setTemperature(response.data.temperature ?? 0.7);
        setMaxTokens(response.data.maxTokens ?? 1024);
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setIsSettingsLoading(false);
    }
  }, [selectedChatbot]);

  useEffect(() => {
    if (selectedChatbot) loadSettings();
  }, [selectedChatbot?.id]);

  // ── Fetch OpenRouter models via proxy ─────────────────────────────────────
  // Loaded once on mount (no auto-refresh on typing); the refresh button below
  // lets the user reload the list on demand.

  const fetchModels = useCallback(async () => {
    setIsModelsLoading(true);
    try {
      const json = await fetch("/api/models").then((r) => r.json());
      if (json?.models?.length) setModels(json.models);
    } catch {
      /* keep fallback list */
    } finally {
      setIsModelsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!selectedChatbot) return;
    setIsSaving(true);
    try {
      await updateChatbotSettings(selectedChatbot.id, { model, temperature, maxTokens });
      await editChatbot(selectedChatbot.id, { model });
      toast.success("Model settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Derived: group by provider + apply search ─────────────────────────────

  const filteredModels = modelSearch
    ? models.filter(
        (m) =>
          m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
          m.provider.toLowerCase().includes(modelSearch.toLowerCase()) ||
          m.id.toLowerCase().includes(modelSearch.toLowerCase()),
      )
    : models;

  const providerGroups = filteredModels.reduce<Record<string, ModelOption[]>>((acc, m) => {
    (acc[m.provider] = acc[m.provider] ?? []).push(m);
    return acc;
  }, {});

  const selectedModelInfo = models.find((m) => m.id === model);

  // ── Render ────────────────────────────────────────────────────────────────

  if (isSettingsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Model</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <Card className="p-4 space-y-5">

          {/* Model selector */}
          <div className="space-y-2">
            <Label>AI Model</Label>

            {/* Search box (searches model + provider) with manual refresh */}
            <div className="flex gap-2">
              <Input
                placeholder="Select model and provider"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                className="h-8 text-sm flex-1"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={fetchModels}
                disabled={isModelsLoading}
                className="h-8 shrink-0 gap-1.5"
                title="Refresh model list"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isModelsLoading && "animate-spin")} />
                Refresh
              </Button>
            </div>

            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model..." />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {filteredModels.length === 0 ? (
                  <div className="py-3 text-center text-sm text-gray-400">No models match</div>
                ) : (
                  Object.entries(providerGroups).map(([provider, group]) => (
                    <SelectGroup key={provider}>
                      <SelectLabel className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        {provider}
                      </SelectLabel>
                      {group.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          <span className="flex items-center gap-2 w-full">
                            <span className="flex-1 truncate">{opt.name}</span>
                            <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                              {formatCtx(opt.contextLength)}
                            </span>
                            {opt.isFree && (
                              <span className="text-[10px] bg-green-100 text-green-600 px-1 rounded font-bold shrink-0">
                                FREE
                              </span>
                            )}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Selected model info row */}
            {selectedModelInfo && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded px-2 py-1.5">
                <span className="font-mono truncate max-w-50">{selectedModelInfo.id}</span>
                <span className="text-gray-300">·</span>
                <span>{formatCtx(selectedModelInfo.contextLength)}</span>
                {selectedModelInfo.pricing && !selectedModelInfo.isFree && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span title="Input cost per 1M tokens">
                      ${(parseFloat(selectedModelInfo.pricing.prompt) * 1_000_000).toFixed(2)}/M in
                    </span>
                    <span className="text-gray-300">·</span>
                    <span title="Output cost per 1M tokens">
                      ${(parseFloat(selectedModelInfo.pricing.completion) * 1_000_000).toFixed(2)}/M out
                    </span>
                  </>
                )}
                {selectedModelInfo.modality && selectedModelInfo.modality !== 'text->text' && (
                  <span className="bg-blue-100 text-blue-700 px-1.5 rounded font-semibold">multimodal</span>
                )}
                {selectedModelInfo.isFree && (
                  <span className="bg-green-100 text-green-700 px-1.5 rounded font-semibold">FREE</span>
                )}
              </div>
            )}
            {isModelsLoading && (
              <p className="text-xs text-gray-400 italic">Fetching latest models from OpenRouter...</p>
            )}
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Temperature</Label>
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded",
                  temperature <= 0.3
                    ? "bg-blue-100 text-blue-700"
                    : temperature <= 0.7
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700",
                )}
              >
                {temperature.toFixed(2)} —{" "}
                {temperature <= 0.3 ? "Focused" : temperature <= 0.7 ? "Balanced" : "Creative"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>0 — Focused</span>
              <span>0.7 — Balanced</span>
              <span>1 — Creative</span>
            </div>
          </div>

          {/* Max tokens */}
          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Response Tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              value={maxTokens}
              onChange={(e) =>
                setMaxTokens(Math.max(256, Math.min(4096, parseInt(e.target.value) || 1024)))
              }
              min={256}
              max={4096}
            />
            <p className="text-xs text-gray-500">
              Controls max response length (256 – 4096 tokens, roughly 200 – 3 000 words).
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
