import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Business } from '@/types';
import { getBusinesses, createBusiness, updateBusiness, deleteBusiness } from '@/lib/services/business.service';

interface BusinessState {
  businesses: Business[];
  selectedBusiness: Business | null;
  isInitialLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

interface BusinessActions {
  initialize: () => Promise<void>;
  selectBusiness: (id: string | null) => void;
  addBusiness: (data: Omit<Business, 'id' | 'createdAt' | 'updatedAt' | 'documents'>, files?: File[]) => Promise<Business>;
  editBusiness: (id: string, data: Partial<Business>) => Promise<void>;
  removeBusiness: (id: string) => Promise<void>;
  refreshBusinesses: () => Promise<void>;
}

export const useBusinessStore = create<BusinessState & BusinessActions>()(
  devtools(
    (set, get) => ({
      businesses: [],
      selectedBusiness: null,
      isInitialLoading: true,
      isMutating: false,
      error: null,

      initialize: async () => {
        try {
          const response = await getBusinesses();
          if (response.success) {
            const businesses = response.data.items;
            const { selectedBusiness } = get();
            const nextSelected = selectedBusiness
              ? businesses.find((b) => b.id === selectedBusiness.id) ?? businesses[0] ?? null
              : businesses[0] ?? null;
            set({ businesses, selectedBusiness: nextSelected });
          }
        } catch {
          set({ error: 'Failed to load businesses' });
        } finally {
          set({ isInitialLoading: false });
        }
      },

      selectBusiness: (id) => {
        if (!id) { set({ selectedBusiness: null }); return; }
        const business = get().businesses.find((b) => b.id === id);
        if (business) set({ selectedBusiness: business });
      },

      addBusiness: async (data, files) => {
        set({ isMutating: true });
        try {
          const response = await createBusiness(data, files);
          if (!response.success) throw new Error(response.error ?? 'Failed to create business');
          set((s) => ({ businesses: [...s.businesses, response.data], selectedBusiness: response.data }));
          return response.data;
        } finally {
          set({ isMutating: false });
        }
      },

      editBusiness: async (id, data) => {
        set({ isMutating: true });
        try {
          const response = await updateBusiness(id, data);
          if (!response.success) throw new Error(response.error ?? 'Failed to update business');
          set((s) => ({
            businesses: s.businesses.map((b) => (b.id === id ? response.data : b)),
            selectedBusiness: s.selectedBusiness?.id === id ? response.data : s.selectedBusiness,
          }));
        } finally {
          set({ isMutating: false });
        }
      },

      removeBusiness: async (id) => {
        set({ isMutating: true });
        const prev = get();
        try {
          const response = await deleteBusiness(id);
          if (!response.success) throw new Error(response.error ?? 'Failed to delete business');
          const remaining = prev.businesses.filter((b) => b.id !== id);
          set({
            businesses: remaining,
            selectedBusiness: prev.selectedBusiness?.id === id ? (remaining[0] ?? null) : prev.selectedBusiness,
          });
        } finally {
          set({ isMutating: false });
        }
      },

      refreshBusinesses: async () => {
        try {
          const response = await getBusinesses();
          if (response.success) set({ businesses: response.data.items });
        } catch {
          set({ error: 'Failed to refresh businesses' });
        }
      },
    }),
    { name: 'business-store' },
  ),
);
