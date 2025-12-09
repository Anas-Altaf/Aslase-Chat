'use client';

import { Bell } from 'lucide-react';

export default function Notifications() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
          Save Changes
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div className="flex-1">
              <p className="text-gray-900 font-medium text-xs">New Messages</p>
              <p className="text-gray-600 text-xs">Get notified when users send messages</p>
            </div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div className="flex-1">
              <p className="text-gray-900 font-medium text-xs">New Leads</p>
              <p className="text-gray-600 text-xs">Get notified when new leads are captured</p>
            </div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
            <input type="checkbox" className="w-4 h-4" />
            <div className="flex-1">
              <p className="text-gray-900 font-medium text-xs">Daily Summary</p>
              <p className="text-gray-600 text-xs">Receive daily summary of chatbot activity</p>
            </div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div className="flex-1">
              <p className="text-gray-900 font-medium text-xs">Email Notifications</p>
              <p className="text-gray-600 text-xs">Send notifications to your email</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
