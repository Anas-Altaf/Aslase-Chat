'use client';

import { Plus, Trash2 } from 'lucide-react';

export default function Text() {
  const textSources = [
    { id: 1, title: 'Product Description', content: 'Our AI chatbot helps businesses...', chars: 1250 },
    { id: 2, title: 'FAQ Section', content: 'Common questions about our service...', chars: 890 },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Text Sources</h1>
        <button className="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Text
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {textSources.map((source) => (
          <div key={source.id} className="bg-white border border-gray-200 rounded p-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-900 font-medium text-sm">{source.title}</p>
                <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">{source.content}</p>
                <p className="text-gray-500 text-xs mt-1">{source.chars} characters</p>
              </div>
              <button className="text-red-500 hover:text-red-700 flex-shrink-0">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
