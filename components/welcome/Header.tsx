'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-900/5 border-b border-gray-100/50'
            : 'bg-transparent'
          }`}
      >
        {/* Animated gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-br from-green-400 via-emerald-500 to-teal-500 opacity-80"></div>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 ">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative ">
                <img
                  src="/AslasChat.jpg"
                  alt="AslasChat"
                  className="h-16 w-auto transition-transform duration-300 group-hover:scale-105 rounded-full"
                />
                <div className="absolute -inset-2 bg-linear-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              {navItems.map((item, index) => (
                <div
                  key={item.href}
                  className="relative group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link
                    href={item.href}
                    className={`text-base font-medium transition-all duration-300 py-2 ${isActive(item.href)
                        ? 'text-green-600 font-bold'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {item.label}
                  </Link>
                  {/* Animated underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-br from-green-500 to-emerald-500 transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                  ></span>
                  {/* Active dot indicator */}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-glow"></span>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Button asChild variant="gradient" rounded="full" size="lg" className="group">
                <Link href="/sign-up" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  Build Your AI Chatbot
                </Link>
              </Button>
              <Button asChild variant="outline" rounded="full" size="lg">
                <Link href="/sign-in">
                  Sign In
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
        <div
          className={`absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-6 transition-all duration-300 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
        >
          <div className="space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-xl text-lg font-medium transition-all duration-200 ${isActive(item.href)
                    ? 'bg-linear-to-br from-green-50 to-emerald-50 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <Button asChild variant="gradient" className="w-full" size="lg">
                <Link href="/sign-up" className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Build Your AI Chatbot
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/sign-in">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
