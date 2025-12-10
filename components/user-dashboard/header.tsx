'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

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
    // Clean up label - remove "User" prefix
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
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-150"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium text-sm">{item.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="text-gray-300">/</span>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </header>
  );
}
