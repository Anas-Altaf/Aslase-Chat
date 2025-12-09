'use client';

import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Security() {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Security</h1>
        <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
          Save Changes
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        <div className="bg-blue-50 border border-blue-200 rounded p-2">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 font-medium text-xs">API Key</p>
              <p className="text-blue-700 text-xs mt-0.5">Keep your API key secure and never share it publicly</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-gray-600 text-xs mb-0.5">Your API Key</p>
          <div className="flex gap-1 items-center">
            <input type={showKey ? 'text' : 'password'} value="sk_live_abc123def456ghi789jkl" readOnly className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 font-mono" />
            <button onClick={() => setShowKey(!showKey)} className="text-gray-600 hover:text-gray-900">
              {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div>
          <p className="text-gray-600 text-xs mb-0.5">Allowed Domains</p>
          <textarea placeholder="example.com&#10;www.example.com" className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500 h-12" />
          <p className="text-gray-500 text-xs mt-0.5">One domain per line</p>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-gray-700 text-xs">Require authentication</span>
          </label>
        </div>
      </div>
    </div>
  );
}
