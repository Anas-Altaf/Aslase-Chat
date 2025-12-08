'use client';

export default function ChatInterface() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Chat Interface</h1>
        <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
          Save Changes
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        <div>
          <p className="text-gray-600 text-xs mb-0.5">Chat Title</p>
          <input type="text" placeholder="AslasChat Assistant" className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <p className="text-gray-600 text-xs mb-0.5">Welcome Message</p>
          <textarea placeholder="Welcome to our chatbot! How can I help you today?" className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500 h-12" />
        </div>

        <div>
          <p className="text-gray-600 text-xs mb-0.5">Primary Color</p>
          <div className="flex gap-2 items-center">
            <input type="color" defaultValue="#22c55e" className="w-10 h-8 rounded cursor-pointer" />
            <input type="text" value="#22c55e" readOnly className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50" />
          </div>
        </div>

        <div>
          <p className="text-gray-600 text-xs mb-0.5">Show Powered By</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-gray-700 text-xs">Display "Powered by AslasChat"</span>
          </label>
        </div>
      </div>
    </div>
  );
}
