'use client';

import { Upload, Trash2, FileText } from 'lucide-react';

export default function Sources() {
  const files = [
    { id: 1, name: '1621154940000 Aadaas Hindusi', chars: '20338 detected char' },
    { id: 2, name: '1621154500000 AslasChat_para.txt', chars: '2778 detected char' },
  ];

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* Left Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 flex-shrink-0">Data Sources</h1>
        <p className="text-gray-600 text-xs mb-3 flex-shrink-0">Add your data sources to train your chatbot</p>

        <div className="flex-1 overflow-y-auto space-y-3">
          <div>
            <h3 className="text-gray-900 font-semibold mb-2 text-sm">Files</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-gray-700 text-xs">Drag & drop your files here, or <span className="text-green-500 font-medium cursor-pointer">Browse</span></p>
              <p className="text-gray-500 text-xs mt-0.5">no files is supported</p>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-2 text-sm">Uploaded Files</h3>
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-xs font-medium truncate">{file.name}</p>
                    <p className="text-gray-500 text-xs">{file.chars}</p>
                  </div>
                  <button className="text-red-500 hover:text-red-700 flex-shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Sources Info */}
      <div className="w-56 flex flex-col flex-shrink-0 bg-green-50 rounded-lg p-3 overflow-hidden">
        <h3 className="text-gray-900 font-semibold mb-2 text-sm">Sources</h3>
        <p className="text-gray-600 text-xs mb-2">Total detected characters:</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">23153</p>
        <p className="text-gray-600 text-xs mb-2">/ 1100000 limit</p>
        <div className="space-y-1 text-xs text-gray-600">
          <p>2 Files (20338 char)</p>
          <p>0 QnA (36 char)</p>
          <p>Text (2778 char)</p>
        </div>
      </div>
    </div>
  );
}
