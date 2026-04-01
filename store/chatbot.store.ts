import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Chatbot } from '@/types';
import { getChatbots, createChatbot, updateChatbot, deleteChatbot } from '@/lib/services';

interface ChatbotState {
  chatbots: Chatbot[];
  selectedChatbot: Chatbot | null;
  isInitialLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

interface ChatbotActions {
  initialize: () => Promise<void>;
  refreshChatbots: () => Promise<void>;
  selectChatbot: (id: string) => void;
  addChatbot: (data: { name: string; businessId: string; model: Chatbot['model']; visibility: Chatbot['visibility'] }) => Promise<Chatbot>;
  editChatbot: (id: string, data: Partial<Chatbot>) => Promise<void>;
  removeChatbot: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useChatbotStore = create<ChatbotState & ChatbotActions>()(
  devtools(
    (set, get) => ({
      chatbots: [],
      selectedChatbot: null,
      isInitialLoading: true,
      isMutating: false,
      error: null,

      initialize: async () => {
        set({ error: null });
        try {
          const response = await getChatbots();
          if (response.success) {
            const chatbots = response.data;
            const { selectedChatbot } = get();
            let nextSelected = selectedChatbot
              ? chatbots.find((c) => c.id === selectedChatbot.id) ?? chatbots[0] ?? null
              : chatbots[0] ?? null;
            set({ chatbots, selectedChatbot: nextSelected });
          } else {
            set({ error: response.error ?? 'Failed to load chatbots' });
          }
        } catch {
          set({ error: 'Failed to load chatbots' });
        } finally {
          set({ isInitialLoading: false });
        }
      },

      refreshChatbots: async () => {
        set({ error: null });
        try {
          const response = await getChatbots();
          if (response.success) {
            const chatbots = response.data;
            const { selectedChatbot } = get();
            let nextSelected = selectedChatbot
              ? chatbots.find((c) => c.id === selectedChatbot.id) ?? null
              : null;
            set({ chatbots, selectedChatbot: nextSelected });
          } else {
            set({ error: response.error ?? 'Failed to load chatbots' });
          }
        } catch {
          set({ error: 'Failed to load chatbots' });
        }
      },

      selectChatbot: (id: string) => {
        const chatbot = get().chatbots.find((c) => c.id === id);
        if (chatbot) set({ selectedChatbot: chatbot });
      },

      addChatbot: async (data) => {
        set({ isMutating: true, error: null });
        try {
          const response = await createChatbot(data);
          if (response.success) {
            set((s) => ({
              chatbots: [...s.chatbots, response.data],
              selectedChatbot: response.data,
            }));
            return response.data;
          } else {
            throw new Error(response.error ?? 'Failed to create chatbot');
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
          set({ error: msg });
          throw err;
        } finally {
          set({ isMutating: false });
        }
      },

      editChatbot: async (id, data) => {
        set({ isMutating: true, error: null });
        const prev = get();
        // Optimistic update
        set((s) => ({
          chatbots: s.chatbots.map((c) => (c.id === id ? { ...c, ...data } : c)),
          selectedChatbot: s.selectedChatbot?.id === id ? { ...s.selectedChatbot, ...data } : s.selectedChatbot,
        }));
        try {
          const response = await updateChatbot(id, data);
          if (!response.success) {
            // Rollback
            set({ chatbots: prev.chatbots, selectedChatbot: prev.selectedChatbot });
            throw new Error(response.error ?? 'Failed to update chatbot');
          }
        } catch (err) {
          set({ chatbots: prev.chatbots, selectedChatbot: prev.selectedChatbot, error: err instanceof Error ? err.message : 'An unexpected error occurred' });
          throw err;
        } finally {
          set({ isMutating: false });
        }
      },

      removeChatbot: async (id) => {
        set({ isMutating: true, error: null });
        const prev = get();
        try {
          const response = await deleteChatbot(id);
          if (response.success) {
            const remaining = prev.chatbots.filter((c) => c.id !== id);
            set({
              chatbots: remaining,
              selectedChatbot: prev.selectedChatbot?.id === id ? (remaining[0] ?? null) : prev.selectedChatbot,
            });
          } else {
            throw new Error(response.error ?? 'Failed to delete chatbot');
          }
        } catch (err) {
          set({ chatbots: prev.chatbots, error: err instanceof Error ? err.message : 'An unexpected error occurred' });
          throw err;
        } finally {
          set({ isMutating: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'chatbot-store' },
  ),
);
