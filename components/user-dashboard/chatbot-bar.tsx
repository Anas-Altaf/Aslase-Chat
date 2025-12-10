'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
    <Card className="w-64 rounded-none border-r border-l-0 border-t-0 border-b-0 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="block transition-transform duration-200 hover:scale-105">
          <Image
            src="/AslasChat.jpg"
            alt="AslasChat Logo"
            width={120}
            height={80}
            className="w-full"
          />
        </Link>
      </div>

      <Separator />

      {/* Chatbots Section */}
      <div className="flex-1 overflow-hidden p-4">
        <h2 className="text-gray-700 font-semibold text-sm mb-4">Chatbots</h2>

        <ScrollArea className="flex-1 h-[calc(100%-2rem)]">
          <div className="space-y-2">
            {chatbots.map((chatbot) => (
              <Link
                key={chatbot.id}
                href={`/user-dashboard/chatbot`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <Avatar className="w-10 h-10 rounded-lg">
                  <AvatarImage src="/chatbot.png" alt={chatbot.name} />
                  <AvatarFallback className="rounded-lg bg-green-100 text-green-700">CB</AvatarFallback>
                </Avatar>
                <span className="text-gray-800 text-sm font-medium truncate">
                  {chatbot.name}
                </span>
              </Link>
            ))}
          </div>
        </ScrollArea>

        <Button variant="link" className="text-green-600 hover:text-green-700 p-0 h-auto mt-4">
          View All
        </Button>
      </div>

      <Separator />

      {/* Profile Card */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/chatbot.png" alt={userName} />
            <AvatarFallback className="bg-green-100 text-green-700">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-sm font-medium truncate">
              {userName}
            </p>
            <Link
              href="/profile"
              className="text-green-600 text-xs hover:text-green-700 transition-colors"
            >
              View Profile →
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
