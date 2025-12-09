'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-20 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/AslasChat.jpg" alt="AslasChat" className="h-20 w-auto" />
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-16">
            {navItems.map((item) => (
              <div key={item.href} className="relative pb-1">
                <Link 
                  href={item.href}
                  className={`text-base transition-colors block ${
                    isActive(item.href)
                      ? 'text-gray-900 font-bold'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/sign-up"
              className="px-6 py-2.5 text-base font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors"
            >
              Build Your AI Chatbot
            </Link>
            <Link
              href="/sign-in"
              className="px-6 py-2.5 text-base font-semibold text-gray-900 border-2 border-gray-900 rounded-full hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
