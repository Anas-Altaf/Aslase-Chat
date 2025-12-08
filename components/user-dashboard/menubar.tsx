'use client';

import { useState } from 'react';
import { ChevronDown, Share2, Trash2, LayoutDashboard, Database, Settings, Code, Zap } from 'lucide-react';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  submenu?: string[];
}

interface MenubarProps {
  onMenuClick: (page: string) => void;
}

export default function Menubar({ onMenuClick }: MenubarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      label: 'Chatbot',
      icon: <Code className="w-5 h-5" />,
    },
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      submenu: ['Chat Logs', 'Leads', 'Analytics'],
    },
    {
      label: 'Sources',
      icon: <Database className="w-5 h-5" />,
      submenu: ['Files', 'Text', 'Website', 'Q & A'],
    },
    {
      label: 'Integrations',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      submenu: ['General', 'Model', 'Chat Interface', 'Security', 'Leads', 'Notifications', 'Web Books', 'Domains'],
    },
    {
      label: 'Embed on Site',
      icon: <Code className="w-5 h-5" />,
    },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const handleMenuClick = (label: string) => {
    onMenuClick(label.toLowerCase().replace(/\s+/g, '-'));
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white flex flex-col h-full overflow-hidden">
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.label}>
            <button
              onClick={() => {
                handleMenuClick(item.label);
                item.submenu && toggleMenu(item.label);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                item.label === 'Embed on Site'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : expandedMenu === item.label
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.submenu && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedMenu === item.label ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Submenu */}
            {item.submenu && expandedMenu === item.label && (
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-green-300 pl-4 max-h-40 overflow-y-auto">
                {item.submenu.map((subitem) => (
                  <button
                    key={subitem}
                    onClick={() => handleMenuClick(subitem)}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                  >
                    {subitem}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Share and Delete Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-3 flex-shrink-0">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300">
          <Share2 className="w-4 h-4" />
          <span className="font-medium">Share</span>
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors bg-red-100 border border-red-200">
          <Trash2 className="w-4 h-4" />
          <span className="font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
}
