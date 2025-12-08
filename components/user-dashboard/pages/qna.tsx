'use client';

import { Plus, Trash2, HelpCircle } from 'lucide-react';

export default function QnA() {
  const qnas = [
    { id: 1, question: 'What is AslasChat?', answer: 'AslasChat is an AI-powered chatbot platform...', chars: 450 },
    { id: 2, question: 'How do I integrate the chatbot?', answer: 'You can integrate using our iframe or script tag...', chars: 380 },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Q & A</h1>
        <button className="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Q&A
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {qnas.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded p-2">
            <div className="flex items-start gap-2 mb-1">
              <HelpCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-900 font-medium text-sm flex-1">{item.question}</p>
              <button className="text-red-500 hover:text-red-700 flex-shrink-0">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <p className="text-gray-600 text-xs ml-6 line-clamp-2">{item.answer}</p>
            <p className="text-gray-500 text-xs ml-6 mt-0.5">{item.chars} characters</p>
          </div>
        ))}
      </div>
    </div>
  );
}
