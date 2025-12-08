'use client';

import { Calendar } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <button className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm">
          Export
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3 flex-shrink-0">
        <h3 className="text-gray-900 font-semibold mb-2 text-sm">Filters</h3>
        <div className="flex gap-3 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Select a Date Range"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-gray-900 font-semibold mb-2 text-sm flex-shrink-0">Activities</h3>
        <div className="flex gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded"></div>
            <span className="text-gray-700 text-xs">Chats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded"></div>
            <span className="text-gray-700 text-xs">Leads</span>
          </div>
          <select className="px-2 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500 ml-auto">
            <option>monthly</option>
          </select>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 h-48 flex items-center justify-center">
          <div className="text-center text-gray-500 text-xs">Chart visualization area</div>
        </div>
      </div>
    </div>
  );
}
