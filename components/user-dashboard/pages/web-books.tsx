'use client';

import { Plus, Trash2, BookOpen } from 'lucide-react';

export default function WebBooks() {
  const books = [
    { id: 1, title: 'Product Documentation', url: 'https://docs.example.com', status: 'Active', chars: 8920 },
    { id: 2, title: 'API Reference', url: 'https://api.example.com/docs', status: 'Active', chars: 5640 },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Web Books</h1>
        <button className="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Book
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {books.map((book) => (
          <div key={book.id} className="bg-white border border-gray-200 rounded p-2">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium text-sm">{book.title}</p>
                <p className="text-gray-600 text-xs truncate">{book.url}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">{book.status}</span>
                  <p className="text-gray-500 text-xs">{book.chars} chars</p>
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
