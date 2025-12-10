'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface Chatbot {
  id: string;
  name: string;
  image: string;
}

interface ChatbotBarProps {
  chatbots?: Chatbot[];
}

export default function ChatbotBar({
  chatbots = [
    { id: '1', name: 'Chatbot 7/2/202_', image: '/chatbot-avatar.png' },
    { id: '2', name: 'NEW Chatbot_', image: '/chatbot-avatar.png' },
  ],
}: ChatbotBarProps) {
  const { user } = useAuth();
  const userName = user?.displayName || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/">
          <Image
            src="/AslasChat.jpg"
            alt="AslasChat Logo"
            width={120}
            height={80}
            className="w-full"
          />
        </Link>
      </div>

      {/* Chatbots Section */}
      <div className="flex-1 overflow-hidden p-4">
        <h2 className="text-gray-700 font-semibold text-sm mb-4">Chatbots</h2>

        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {chatbots.map((chatbot) => (
              <Link
                key={chatbot.id}
                href={`/user-dashboard/chatbot`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <Avatar className="w-10 h-10 rounded-md">
                  <AvatarImage src="/chatbot.png" alt={chatbot.name} />
                  <AvatarFallback className="rounded-md">CB</AvatarFallback>
                </Avatar>
                <span className="text-gray-800 text-sm font-medium truncate">
                  {chatbot.name}
                </span>
              </Link>
            ))}
          </div>
        </ScrollArea>

        {/* View All Link */}
        <Button variant="link" className="text-green-500 hover:text-green-600 p-0 mt-4">
          View All
        </Button>
      </div>

      {/* Profile Card */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/chatbot.png" alt={userName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-sm font-medium truncate">
              {userName}
            </p>
            <Link
              href="/profile"
              className="text-green-500 text-xs hover:text-green-600 transition-colors"
            >
              View Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
