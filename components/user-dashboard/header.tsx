'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LogOut, ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    if (label === 'User Dashboard') {
      label = 'Dashboard';
    }
    breadcrumbs.push({ label, href: currentPath });
  }

  if (breadcrumbs.length > 0) {
    delete breadcrumbs[breadcrumbs.length - 1].href;
  }

  return breadcrumbs;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const breadcrumbs = generateBreadcrumbs(pathname);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-100/50 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-br from-green-400 via-emerald-500 to-teal-500"></div>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2">
        <Link
          href="/user-dashboard"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Home className="w-4 h-4 text-gray-500" />
        </Link>

        {breadcrumbs.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 animate-fadeIn"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ChevronRight className="w-4 h-4 text-gray-300" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-all duration-300 hover:scale-105 relative group px-2 py-1 rounded-lg hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-bold px-3 py-1.5 rounded-lg bg-linear-to-br from-green-50 to-emerald-50 border border-green-100">
                <span className="bg-linear-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {item.label}
                </span>
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-gray-600 hover:text-white hover:bg-linear-to-br hover:from-red-500 hover:to-rose-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 group rounded-xl"
      >
        <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
        Logout
      </Button>
    </header>
  );
}
