'use client';

export default function Model() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Model</h1>
        <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
          Save Changes
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        <div>
          <p className="text-gray-600 text-xs mb-0.5">Last Trained At</p>
          <p className="text-gray-900 text-xs">8/3/2025, 10:39:32 PM</p>
        </div>

        <div>
          <h3 className="text-gray-900 font-semibold mb-1 text-xs">Instructions</h3>
          <textarea placeholder="Customize your bot instructions in this field..." className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500 h-16" />
          <p className="text-gray-500 text-xs mt-0.5">*These instructions allow you to tailor your chatbot's personality and style.*</p>
        </div>

        <div>
          <h3 className="text-gray-900 font-semibold mb-1 text-xs">Model</h3>
          <select className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>GPT-4o mini</option>
          </select>
          <p className="text-gray-500 text-xs mt-0.5">*GPT-4o mini is a cost-efficient AI model for chatbots.*</p>
        </div>
      </div>
    </div>
  );
}
