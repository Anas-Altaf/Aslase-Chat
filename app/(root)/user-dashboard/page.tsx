'use client';

import { useState } from 'react';
import ChatbotBar from '@/components/user-dashboard/chatbot-bar';
import Menubar from '@/components/user-dashboard/menubar';
import Header from '@/components/user-dashboard/header';
import Welcome from '@/components/user-dashboard/pages/welcome';
import ChatbotDetails from '@/components/user-dashboard/pages/chatbot-details';
import ChatLogs from '@/components/user-dashboard/pages/chat-logs';
import Leads from '@/components/user-dashboard/pages/leads';
import Analytics from '@/components/user-dashboard/pages/analytics';
import Model from '@/components/user-dashboard/pages/model';
import EmbedOnSite from '@/components/user-dashboard/pages/embed-on-site';
import Sources from '@/components/user-dashboard/pages/sources';
import Integrations from '@/components/user-dashboard/pages/integrations';
import General from '@/components/user-dashboard/pages/general';
import Text from '@/components/user-dashboard/pages/text';
import Website from '@/components/user-dashboard/pages/website';
import QnA from '@/components/user-dashboard/pages/qna';
import ChatInterface from '@/components/user-dashboard/pages/chat-interface';
import Security from '@/components/user-dashboard/pages/security';
import Notifications from '@/components/user-dashboard/pages/notifications';
import WebBooks from '@/components/user-dashboard/pages/web-books';
import Domains from '@/components/user-dashboard/pages/domains';

export default function UserDashboard() {
  const [currentPage, setCurrentPage] = useState('welcome');

  const renderPage = () => {
    switch (currentPage) {
      case 'chatbot':
        return <ChatbotDetails />;
      case 'chat-logs':
        return <ChatLogs />;
      case 'leads':
        return <Leads />;
      case 'analytics':
        return <Analytics />;
      case 'dashboard':
        return <div className="text-center text-gray-600">Dashboard Page</div>;
      case 'sources':
        return <Sources />;
      case 'files':
        return <Sources />;
      case 'text':
        return <Text />;
      case 'website':
        return <Website />;
      case 'q-&-a':
        return <QnA />;
      case 'integrations':
        return <Integrations />;
      case 'settings':
        return <General />;
      case 'general':
        return <General />;
      case 'model':
        return <Model />;
      case 'chat-interface':
        return <ChatInterface />;
      case 'security':
        return <Security />;
      case 'leads-settings':
        return <Leads />;
      case 'notifications':
        return <Notifications />;
      case 'web-books':
        return <WebBooks />;
      case 'domains':
        return <Domains />;
      case 'embed-on-site':
        return <EmbedOnSite />;
      default:
        return <Welcome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatbotBar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex gap-4 p-8">
          <div className="w-80 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Menubar onMenuClick={setCurrentPage} />
          </div>
          <main className="flex-1 bg-white rounded-lg border border-gray-200 p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}
