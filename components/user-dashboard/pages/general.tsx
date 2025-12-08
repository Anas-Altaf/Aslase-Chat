'use client';

import { Copy } from 'lucide-react';

export default function General() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">General</h1>
        <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
          Save Changes
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-gray-600 text-xs mb-0.5">Chatbot ID</p>
            <div className="flex items-center gap-1">
              <input type="text" value="VUyBtr3F23QcD2fF" readOnly className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50" />
              <Copy className="w-3 h-3 text-gray-400 cursor-pointer" />
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-0.5">No. of Characters</p>
            <input type="text" value="23153" readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50" />
          </div>
        </div>
        <div>
          <p className="text-gray-600 text-xs mb-0.5">Name</p>
          <input type="text" placeholder="Chatbot 7/2/2025, 2:50:46 PM" className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </div>
    </div>
  );
}
