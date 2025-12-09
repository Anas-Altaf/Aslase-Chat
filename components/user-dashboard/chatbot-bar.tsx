'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Chatbot {
  id: string;
  name: string;
  image: string;
}

interface ChatbotBarProps {
  chatbots?: Chatbot[];
  userImage?: string;
  userName?: string;
}

export default function ChatbotBar({
  chatbots = [
    { id: '1', name: 'Chatbot 7/2/202_', image: '/chatbot-avatar.png' },
    { id: '2', name: 'NEW Chatbot_', image: '/chatbot-avatar.png' },
  ],
  userImage = '/user-avatar.png',
  userName = 'Muhammad _',
}: ChatbotBarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Image
          src="/AslasChat.jpg"
          alt="AslasChat Logo"
          width={120}
          height={80}
          className="w-full"
        />
      </div>

      {/* Chatbots Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-gray-700 font-semibold text-sm mb-4">Chatbots</h2>

        {/* Chatbot Cards */}
        <div className="space-y-3">
          {chatbots.map((chatbot) => (
            <div
              key={chatbot.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <Image
                src='/chatbot.png'
                alt={chatbot.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-md object-cover flex-shrink-0"
              />
              <span className="text-gray-800 text-sm font-medium truncate">
                {chatbot.name}
              </span>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <button className="text-green-500 text-sm font-medium mt-4 hover:text-green-600 transition-colors">
          View All
        </button>
      </div>

      {/* Profile Card */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
          <Image
            src='/chatbot.png'
            alt={userName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
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
