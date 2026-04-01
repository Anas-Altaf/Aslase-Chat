'use client';

import React, { useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { useChatbotStore } from '@/store/chatbot.store';

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const initialize = useChatbotStore((s) => s.initialize);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        initialize();
      } else {
        useChatbotStore.setState({ isInitialLoading: false, chatbots: [], selectedChatbot: null });
      }
    });
    return unsubscribe;
  }, [initialize]);

  return <>{children}</>;
}

export function useChatbot() {
  return useChatbotStore();
}
