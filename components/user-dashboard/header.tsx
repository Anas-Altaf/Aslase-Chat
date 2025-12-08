'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  onLogout?: () => void;
}

export default function Header({
  breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Current Page' },
  ],
  onLogout,
}: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      router.push('/');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium text-sm">{item.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="text-gray-400 text-sm">›</span>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
      >
        Logout
      </button>
    </header>
  );
}
