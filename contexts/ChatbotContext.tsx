'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Chatbot } from '@/types';
import { getChatbots, getChatbotById, createChatbot, updateChatbot, deleteChatbot } from '@/lib/services';
import { auth } from '@/lib/firebase/config';

interface ChatbotContextType {
    // State
    chatbots: Chatbot[];
    selectedChatbot: Chatbot | null;
    isInitialLoading: boolean; // Only true on first load
    isMutating: boolean; // True during create/update/delete
    error: string | null;

    // Actions
    refreshChatbots: () => Promise<void>;
    selectChatbot: (id: string) => void; // Synchronous - no loading
    addChatbot: (data: { name: string; businessId: string; model: Chatbot['model']; visibility: Chatbot['visibility'] }) => Promise<Chatbot>;
    editChatbot: (id: string, data: Partial<Chatbot>) => Promise<void>;
    removeChatbot: (id: string) => Promise<void>;
    clearError: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
    const [chatbots, setChatbots] = useState<Chatbot[]>([]);
    const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshChatbots = useCallback(async () => {
        setError(null);
        try {
            const response = await getChatbots();
            if (response.success) {
                setChatbots(response.data);
                // If selected chatbot exists, update it with fresh data
                if (selectedChatbot) {
                    const updated = response.data.find(c => c.id === selectedChatbot.id);
                    if (updated) {
                        setSelectedChatbot(updated);
                    }
                } else if (response.data.length > 0) {
                    // Auto-select first chatbot only if none selected
                    setSelectedChatbot(response.data[0]);
                }
            } else {
                setError(response.error || 'Failed to load chatbots');
            }
        } catch (err) {
            setError('Failed to load chatbots');
        } finally {
            setIsInitialLoading(false);
        }
    }, [selectedChatbot]);

    // Synchronous selection - no loading needed, data is in memory
    const selectChatbot = useCallback((id: string) => {
        const chatbot = chatbots.find(c => c.id === id);
        if (chatbot) {
            setSelectedChatbot(chatbot);
        }
    }, [chatbots]);

    const addChatbot = useCallback(async (data: { name: string; businessId: string; model: Chatbot['model']; visibility: Chatbot['visibility'] }) => {
        setIsMutating(true);
        setError(null);
        try {
            const response = await createChatbot(data);
            if (response.success) {
                // Optimistic: add to list immediately
                setChatbots(prev => [...prev, response.data]);
                setSelectedChatbot(response.data);
                return response.data;
            } else {
                throw new Error(response.error || 'Failed to create chatbot');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, []);

    const editChatbot = useCallback(async (id: string, data: Partial<Chatbot>) => {
        setIsMutating(true);
        setError(null);

        // Optimistic update: update immediately in UI
        const previousChatbots = chatbots;
        const previousSelected = selectedChatbot;

        setChatbots(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
        if (selectedChatbot?.id === id) {
            setSelectedChatbot(prev => prev ? { ...prev, ...data } : null);
        }

        try {
            const response = await updateChatbot(id, data);
            if (!response.success) {
                // Rollback on failure
                setChatbots(previousChatbots);
                setSelectedChatbot(previousSelected);
                throw new Error(response.error || 'Failed to update chatbot');
            }
        } catch (err) {
            // Rollback on error
            setChatbots(previousChatbots);
            setSelectedChatbot(previousSelected);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, [selectedChatbot, chatbots]);

    const removeChatbot = useCallback(async (id: string) => {
        setIsMutating(true);
        setError(null);

        const previousChatbots = chatbots;

        try {
            const response = await deleteChatbot(id);
            if (response.success) {
                setChatbots(prev => prev.filter(c => c.id !== id));
                if (selectedChatbot?.id === id) {
                    // Select another chatbot
                    const remaining = chatbots.filter(c => c.id !== id);
                    setSelectedChatbot(remaining[0] || null);
                }
            } else {
                throw new Error(response.error || 'Failed to delete chatbot');
            }
        } catch (err) {
            setChatbots(previousChatbots);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, [selectedChatbot, chatbots]);

    const clearError = useCallback(() => setError(null), []);

    // Wait for auth and then load chatbots
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                refreshChatbots();
            } else {
                setIsInitialLoading(false);
            }
        });
        return unsubscribe;
    }, []);

    return (
        <ChatbotContext.Provider
            value={{
                chatbots,
                selectedChatbot,
                isInitialLoading,
                isMutating,
                error,
                refreshChatbots,
                selectChatbot,
                addChatbot,
                editChatbot,
                removeChatbot,
                clearError,
            }}
        >
            {children}
        </ChatbotContext.Provider>
    );
}

export function useChatbot() {
    const context = useContext(ChatbotContext);
    if (context === undefined) {
        throw new Error('useChatbot must be used within a ChatbotProvider');
    }
    return context;
}
