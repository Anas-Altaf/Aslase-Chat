'use client';

import { Calendar, Mail, Phone, User, LinkIcon } from 'lucide-react';

export default function Leads() {
  const leads = [
    { id: 1, message: 'Let us know how to contact you', date: '20/08/2024 at 7:04pm', name: 'John Doe', phone: '0313-2022231', email: 'johndoe@example.com' },
    { id: 2, message: 'Let us know how to contact you', date: '20/08/2024 at 7:04pm', name: 'Jane Smith', phone: '0313-2022232', email: 'janesmith@example.com' },
    { id: 3, message: 'Let us know how to contact you', date: '20/08/2024 at 7:04pm', name: 'Mike Johnson', phone: '0313-2022233', email: 'mikejohnson@example.com' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-xl font-bold text-gray-900 mb-2 flex-shrink-0">Leads</h1>

      <div className="bg-white border border-gray-200 rounded p-2 mb-2 flex-shrink-0">
        <h3 className="text-gray-900 font-semibold mb-1 text-xs">Filters</h3>
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex gap-1 items-center">
            <input type="text" placeholder="Select a Date Range" className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500" />
            <Calendar className="w-3 h-3 text-gray-400" />
          </div>
          <select className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>All</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-gray-900 font-semibold mb-2 text-xs flex-shrink-0">Previous Leads</h3>
        <div className="space-y-2">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-green-50 border border-green-200 rounded p-2">
              <div className="flex items-start gap-1 mb-1">
                <LinkIcon className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-xs">{lead.message}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{lead.date}</p>
                </div>
              </div>
              <div className="space-y-0.5 ml-4">
                <div className="flex items-center gap-1">
                  <User className="w-2 h-2 text-gray-400 flex-shrink-0" />
                  <p className="text-gray-900 font-medium text-xs">{lead.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-2 h-2 text-gray-400 flex-shrink-0" />
                  <p className="text-gray-700 text-xs">{lead.phone}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-2 h-2 text-gray-400 flex-shrink-0" />
                  <p className="text-gray-700 text-xs truncate">{lead.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
