'use client';

import { Send, Copy, RotateCcw, RefreshCw } from 'lucide-react';

export default function ChatbotDetails() {
  return (
    <div className="flex gap-6 h-full overflow-hidden">
      {/* Left Section - Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Section - Title and Details */}
        <div className="flex justify-between items-start mb-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900">Chatbot 7/2/2025, 2:50:46 PM</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
          {/* Left Column - Chatbot Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Chatbot ID</p>
              <div className="flex items-center gap-2">
                <code className="text-gray-900 font-mono text-sm font-semibold">VUyBtr3F23QcD2fF</code>
                <Copy className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">No. of Characters</p>
              <p className="text-gray-900 font-semibold">23153</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">Visibility</p>
              <p className="text-gray-900 font-semibold">Public</p>
            </div>
          </div>

          {/* Right Column - Model Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Model</p>
              <p className="text-gray-900 font-semibold">GPT-4o mini</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">Status</p>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold">
                Trained
              </span>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">Last Trained At</p>
              <p className="text-gray-900 text-sm">8/3/2025, 10:39:32 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Chat Interface */}
      <div className="w-80 flex flex-col flex-shrink-0 overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex-shrink-0">Chatbot</h2>
        <div className="bg-white border border-gray-200 rounded-lg flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 space-y-3 mb-3 overflow-y-auto p-3">
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-3 py-2 rounded-lg max-w-xs text-sm">
                Hi! How can I help?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-green-500 text-white px-3 py-2 rounded-lg max-w-xs text-sm">
                Hello! How can I assist you today?
              </div>
            </div>
          </div>
          <div className="flex gap-2 p-3 flex-shrink-0">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-right text-gray-500 text-xs mt-2 flex-shrink-0">Powered by AslasChat</p>
      </div>
    </div>
  );
}
