'use client';

import { Plus, Trash2, Globe } from 'lucide-react';

export default function Website() {
  const websites = [
    { id: 1, url: 'https://www.example.com', status: 'Indexed', chars: 5420 },
    { id: 2, url: 'https://www.example.com/blog', status: 'Indexing', chars: 3210 },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Website Sources</h1>
        <button className="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Website
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {websites.map((site) => (
          <div key={site.id} className="bg-white border border-gray-200 rounded p-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                <Globe className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-sm truncate">{site.url}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded ${site.status === 'Indexed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {site.status}
                    </span>
                    <p className="text-gray-500 text-xs">{site.chars} chars</p>
                  </div>
                </div>
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
