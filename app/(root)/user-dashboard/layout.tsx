'use client';

import React from 'react';
import { ChatbotProvider } from '@/contexts/ChatbotContext';
import ChatbotBar from '@/components/user-dashboard/chatbot-bar';
import Menubar from '@/components/user-dashboard/menubar';
import Header from '@/components/user-dashboard/header';
import { Card } from '@/components/ui/card';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <ChatbotProvider>
            <div className="flex h-screen bg-gray-50/50">
                <ChatbotBar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <div className="flex-1 flex gap-4 p-6">
                        <Card className="w-80 overflow-hidden">
                            <Menubar />
                        </Card>
                        <Card className="flex-1 p-6 overflow-auto">
                            {children}
                        </Card>
                    </div>
                </div>
            </div>
        </ChatbotProvider>
    );
}
