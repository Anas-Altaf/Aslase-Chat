'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getBusinesses, createBusiness, updateBusiness, deleteBusiness } from '@/lib/services/business.service';
import { auth } from '@/lib/firebase/config';
import type { Business } from '@/types';

interface BusinessContextType {
    businesses: Business[];
    selectedBusiness: Business | null;
    isInitialLoading: boolean;
    isMutating: boolean;
    error: string | null;
    selectBusiness: (id: string | null) => void;
    addBusiness: (data: Omit<Business, 'id' | 'createdAt' | 'updatedAt' | 'documents'>, files?: File[]) => Promise<Business | null>;
    editBusiness: (id: string, data: Partial<Business>) => Promise<void>;
    removeBusiness: (id: string) => Promise<void>;
    refreshBusinesses: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Wait for auth and then load businesses
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                loadBusinesses();
            } else {
                setIsInitialLoading(false);
            }
        });
        return unsubscribe;
    }, []);

    const loadBusinesses = async () => {
        try {
            const response = await getBusinesses();
            if (response.success) {
                setBusinesses(response.data.items);
                // Select first business by default if none selected
                if (response.data.items.length > 0 && !selectedBusiness) {
                    setSelectedBusiness(response.data.items[0]);
                }
            }
        } catch (err) {
            setError('Failed to load businesses');
        } finally {
            setIsInitialLoading(false);
        }
    };

    const selectBusiness = useCallback((id: string | null) => {
        if (!id) {
            setSelectedBusiness(null);
            return;
        }
        const business = businesses.find(b => b.id === id);
        if (business) {
            setSelectedBusiness(business);
        }
    }, [businesses]);

    const addBusiness = useCallback(async (data: Omit<Business, 'id' | 'createdAt' | 'updatedAt' | 'documents'>, files?: File[]): Promise<Business | null> => {
        setIsMutating(true);
        try {
            const response = await createBusiness(data, files);
            if (response.success) {
                setBusinesses(prev => [...prev, response.data]);
                setSelectedBusiness(response.data);
                return response.data;
            } else {
                throw new Error(response.error || 'Failed to create business');
            }
        } finally {
            setIsMutating(false);
        }
        return null;
    }, []);

    const editBusiness = useCallback(async (id: string, data: Partial<Business>) => {
        setIsMutating(true);
        try {
            const response = await updateBusiness(id, data);
            if (response.success) {
                setBusinesses(prev => prev.map(b => b.id === id ? response.data : b));
                if (selectedBusiness?.id === id) {
                    setSelectedBusiness(response.data);
                }
            } else {
                throw new Error(response.error || 'Failed to update business');
            }
        } finally {
            setIsMutating(false);
        }
    }, [selectedBusiness]);

    const removeBusiness = useCallback(async (id: string) => {
        setIsMutating(true);
        try {
            const response = await deleteBusiness(id);
            if (response.success) {
                setBusinesses(prev => prev.filter(b => b.id !== id));
                if (selectedBusiness?.id === id) {
                    setSelectedBusiness(businesses.find(b => b.id !== id) || null);
                }
            } else {
                throw new Error(response.error || 'Failed to delete business');
            }
        } finally {
            setIsMutating(false);
        }
    }, [businesses, selectedBusiness]);

    const refreshBusinesses = useCallback(async () => {
        try {
            const response = await getBusinesses();
            if (response.success) {
                setBusinesses(response.data.items);
            }
        } catch (err) {
            setError('Failed to refresh businesses');
        }
    }, []);

    return (
        <BusinessContext.Provider value={{
            businesses,
            selectedBusiness,
            isInitialLoading,
            isMutating,
            error,
            selectBusiness,
            addBusiness,
            editBusiness,
            removeBusiness,
            refreshBusinesses,
        }}>
            {children}
        </BusinessContext.Provider>
    );
}

export function useBusiness() {
    const context = useContext(BusinessContext);
    if (!context) {
        throw new Error('useBusiness must be used within a BusinessProvider');
    }
    return context;
}
