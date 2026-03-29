"use client";

import { useState, useEffect } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { ChatbotSettings } from "@/types";

const MODEL_OPTIONS: ChatbotSettings["model"][] = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-3.5-turbo",
];

export default function Model() {
  const { selectedChatbot, editChatbot } = useChatbot();
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [model, setModel] = useState<ChatbotSettings["model"]>("gpt-4o-mini");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);

  const handleModelChange = (value: string) => {
    if (MODEL_OPTIONS.includes(value as ChatbotSettings["model"])) {
      setModel(value as ChatbotSettings["model"]);
    }
  };

  useEffect(() => {
    if (selectedChatbot) {
      loadSettings();
    }
  }, [selectedChatbot]);

  const loadSettings = async () => {
    if (!selectedChatbot) return;
    setIsLoading(true);
    try {
      const response = await getChatbotSettings(selectedChatbot.id);
      if (response.success && response.data) {
        setSettings(response.data);
        setModel(response.data.model);
        setTemperature(response.data.temperature);
        setMaxTokens(response.data.maxTokens);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedChatbot) return;
    setIsSaving(true);
    try {
      await updateChatbotSettings(selectedChatbot.id, {
        model,
        temperature,
        maxTokens,
      });
      await editChatbot(selectedChatbot.id, { model });
      toast.success("Model settings saved");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Model</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>AI Model</Label>
            <Select value={model} onValueChange={handleModelChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">
                  GPT-4o Mini (Recommended)
                </SelectItem>
                <SelectItem value="gpt-4o">GPT-4o (More Powerful)</SelectItem>
                <SelectItem value="gpt-3.5-turbo">
                  GPT-3.5 Turbo (Fastest)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Temperature: {temperature}</Label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <p className="text-xs text-gray-500">
              Lower = more focused, Higher = more creative
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              min={256}
              max={4096}
            />
            <p className="text-xs text-gray-500">
              Maximum response length (256-4096)
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
