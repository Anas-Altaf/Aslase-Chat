'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Chatbot } from '@/types';
import { getChatbots, getChatbotById, createChatbot, updateChatbot, deleteChatbot } from '@/lib/services';

interface ChatbotContextType {
    // State
    chatbots: Chatbot[];
    selectedChatbot: Chatbot | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadChatbots: () => Promise<void>;
    selectChatbot: (id: string) => Promise<void>;
    addChatbot: (data: { name: string; model: Chatbot['model']; visibility: Chatbot['visibility'] }) => Promise<Chatbot>;
    editChatbot: (id: string, data: Partial<Chatbot>) => Promise<void>;
    removeChatbot: (id: string) => Promise<void>;
    clearError: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
    const [chatbots, setChatbots] = useState<Chatbot[]>([]);
    const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadChatbots = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getChatbots();
            if (response.success) {
                setChatbots(response.data);
                // Auto-select first chatbot if none selected
                if (!selectedChatbot && response.data.length > 0) {
                    setSelectedChatbot(response.data[0]);
                }
            } else {
                setError(response.error || 'Failed to load chatbots');
            }
        } catch (err) {
            setError('Failed to load chatbots');
        } finally {
            setIsLoading(false);
        }
    }, [selectedChatbot]);

    const selectChatbot = useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const response = await getChatbotById(id);
            if (response.success && response.data) {
                setSelectedChatbot(response.data);
            } else {
                setError(response.error || 'Chatbot not found');
            }
        } catch (err) {
            setError('Failed to select chatbot');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addChatbot = useCallback(async (data: { name: string; model: Chatbot['model']; visibility: Chatbot['visibility'] }) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await createChatbot(data);
            if (response.success) {
                setChatbots(prev => [...prev, response.data]);
                setSelectedChatbot(response.data);
                return response.data;
            } else {
                throw new Error(response.error || 'Failed to create chatbot');
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const editChatbot = useCallback(async (id: string, data: Partial<Chatbot>) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await updateChatbot(id, data);
            if (response.success) {
                setChatbots(prev => prev.map(c => c.id === id ? response.data : c));
                if (selectedChatbot?.id === id) {
                    setSelectedChatbot(response.data);
                }
            } else {
                throw new Error(response.error || 'Failed to update chatbot');
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedChatbot]);

    const removeChatbot = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await deleteChatbot(id);
            if (response.success) {
                setChatbots(prev => prev.filter(c => c.id !== id));
                if (selectedChatbot?.id === id) {
                    setSelectedChatbot(chatbots.find(c => c.id !== id) || null);
                }
            } else {
                throw new Error(response.error || 'Failed to delete chatbot');
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [selectedChatbot, chatbots]);

    const clearError = useCallback(() => setError(null), []);

    // Load chatbots on mount
    useEffect(() => {
        loadChatbots();
    }, []);

    return (
        <ChatbotContext.Provider
            value={{
                chatbots,
                selectedChatbot,
                isLoading,
                error,
                loadChatbots,
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
