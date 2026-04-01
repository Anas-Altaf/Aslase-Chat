'use client';

import React, { useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { useBusinessStore } from '@/store/business.store';

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const initialize = useBusinessStore((s) => s.initialize);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        initialize();
      } else {
        useBusinessStore.setState({ isInitialLoading: false, businesses: [], selectedBusiness: null });
      }
    });
    return unsubscribe;
  }, [initialize]);

  return <>{children}</>;
}

export function useBusiness() {
  return useBusinessStore();
}
