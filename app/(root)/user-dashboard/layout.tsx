'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChatbotProvider } from '@/contexts/ChatbotContext';
import { BusinessProvider } from '@/contexts/BusinessContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import ChatbotBar from '@/components/user-dashboard/chatbot-bar';
import Menubar from '@/components/user-dashboard/menubar';
import Header from '@/components/user-dashboard/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/components/ui/resizable';
import { PanelLeft, Menu } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { subscriptionStatus, subscriptionLoading } = useAuth();
    const [sidebarHovered, setSidebarHovered] = useState(false);
    const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!subscriptionLoading && (subscriptionStatus === 'none' || subscriptionStatus === 'canceled')) {
            router.push('/pricing');
        }
    }, [subscriptionStatus, subscriptionLoading, router]);

    if (subscriptionLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Hide menubar for businesses/chatbots list pages
    const hideMenubar = pathname === '/user-dashboard/businesses' ||
        pathname === '/user-dashboard/chatbots' ||
        pathname === '/user-dashboard' ||
        pathname.startsWith('/user-dashboard/businesses/');

    return (
        <BusinessProvider>
            <ChatbotProvider>
            <SocketProvider>
                {/* Premium light theme gradient */}
                <div className="flex h-screen bg-gray-100 overflow-hidden">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden fixed top-4 left-4 z-50"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    {/* Mobile Overlay */}
                    {mobileMenuOpen && (
                        <div
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                    )}

                    {/* Mobile Sidebar */}
                    <div className={`
                        lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300
                        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <ChatbotBar collapsed={false} />
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:flex flex-1 h-screen relative">
                        {/* Chatbot Sidebar — absolute overlay, icon strip at rest, expands on hover */}
                        <div
                            className="absolute left-0 top-0 h-full z-40"
                            onMouseEnter={() => setSidebarHovered(true)}
                            onMouseLeave={() => { if (!sidebarDropdownOpen) setSidebarHovered(false); }}
                        >
                            <ChatbotBar
                                collapsed={!sidebarHovered && !sidebarDropdownOpen}
                                onToggleCollapse={() => {}}
                                onDropdownOpenChange={setSidebarDropdownOpen}
                            />
                        </div>

                        <ResizablePanelGroup direction="horizontal" className="h-full flex-1 pl-14">

                            {/* Menu + Content Area */}
                            <ResizablePanel defaultSize={100} minSize={60} className="min-w-0">
                                <div className="flex flex-col h-full">
                                    <Header />
                                    <div className="flex-1 p-3 xl:p-4 overflow-hidden">
                                        {hideMenubar ? (
                                            /* Full-width content for list pages */
                                            <Card className="h-full p-4 xl:p-5 overflow-auto bg-white/80 backdrop-blur-sm shadow-xl border-green-100/50">
                                                {children}
                                            </Card>
                                        ) : (
                                            /* Menubar + Content for chatbot pages */
                                            <div className="flex h-full gap-0 rounded-lg overflow-hidden">
                                                <Card className="h-full overflow-hidden rounded-r-none border-r-0 bg-white/80 backdrop-blur-sm shadow-lg border-green-100/50 shrink-0">
                                                    <Menubar />
                                                </Card>
                                                <Card className="h-full p-4 xl:p-5 overflow-auto flex-1 min-w-0 rounded-l-none bg-white backdrop-blur-sm shadow-xl border-green-100/50">
                                                    {children}
                                                </Card>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>

                    {/* Mobile Content */}
                    <div className="lg:hidden flex-1 flex flex-col min-w-0 pt-14">
                        <Header />
                        <div className="flex-1 p-4 overflow-hidden">
                            <div className="flex flex-col gap-4 h-full">
                                {!hideMenubar && (
                                    <Card className="p-4 overflow-auto max-h-[35vh]">
                                        <Menubar />
                                    </Card>
                                )}
                                <Card className="flex-1 p-4 overflow-auto">
                                    {children}
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SocketProvider>
            </ChatbotProvider>
        </BusinessProvider>
    );
}

// Collapsed sidebar view
function CollapsedSidebar({ onExpand }: { onExpand: () => void }) {
    return (
        <div className="h-full bg-white border-r flex flex-col items-center py-4">
            <Button
                variant="ghost"
                size="icon"
                onClick={onExpand}
                className="mb-4"
                title="Expand sidebar"
            >
                <PanelLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 flex flex-col items-center gap-2 overflow-auto py-2">
                {/* Could add collapsed chatbot icons here */}
            </div>
        </div>
    );
}
