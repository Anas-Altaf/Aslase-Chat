'use client';

import { Send, Filter, Calendar, MessageCircle, User } from 'lucide-react';

export default function ChatLogs() {
  const sessions = [
    {
      id: 1,
      customer: 'Customer: hi',
      message: 'Bot: Hi, How can I assist you today?',
      date: '31/07/2025',
    },
    {
      id: 2,
      customer: 'Customer: lkj',
      message: 'Bot: Hi, How can I assist you today?',
      date: '03/08/2025',
    },
    {
      id: 3,
      customer: 'Customer: hi',
      message: 'Bot: Hi, How can I assist you today?',
      date: '08/08/2025',
    },
  ];

  return (
    <div className="flex gap-6 h-full overflow-hidden">
      {/* Left Section - Chat Logs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900">Chat Logs</h1>
          <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm">
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4 flex-shrink-0">
          <h3 className="text-gray-900 font-semibold mb-3 text-sm">Filters</h3>
          <div className="flex gap-3 items-end mb-3">
            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Select a Date Range"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Source</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Confidence Score</option>
            </select>
          </div>
        </div>

        {/* Sessions */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-gray-900 font-semibold mb-3 text-sm flex-shrink-0">Embedded Site Sessions</h3>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                <div className="flex items-start gap-2 mb-1">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-900 font-medium">{session.customer}</p>
                </div>
                <div className="flex items-start gap-2 mb-1 ml-6">
                  <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{session.message}</p>
                </div>
                <p className="text-gray-500 text-xs ml-6">{session.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Chat Interface */}
      <div className="w-80 flex flex-col flex-shrink-0 overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex-shrink-0">Chatbot</h2>
        <div className="bg-white border border-gray-200 rounded-lg flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 space-y-3 mb-3 overflow-y-auto p-3">
            <div className="flex justify-end">
              <div className="bg-green-500 text-white px-3 py-2 rounded-lg max-w-xs text-sm">
                What is AslasChat?
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-3 py-2 rounded-lg max-w-xs text-sm">
                AslasChat supports multiple languages to cater to diverse audiences and enhance user experience.
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
