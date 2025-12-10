'use client';

import React from 'react';
import ChatbotBar from '@/components/user-dashboard/chatbot-bar';
import Menubar from '@/components/user-dashboard/menubar';
import Header from '@/components/user-dashboard/header';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-50">
            <ChatbotBar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 flex gap-4 p-8">
                    <div className="w-80 bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <Menubar />
                    </div>
                    <main className="flex-1 bg-white rounded-lg border border-gray-200 p-8 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
