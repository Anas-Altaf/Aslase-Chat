'use client';

import { useState, useEffect } from 'react';
import { Search, UserCircle, CheckCircle2, XCircle, Mail, Phone, Key, Calendar } from 'lucide-react';
import { getUsers } from '@/lib/services';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { User } from '@/types';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getUsers();
        if (res.success) {
          setUsers(res.data);
        } else {
          toast.error(res.error ?? 'Failed to load users');
        }
      } catch {
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-xs text-gray-500 mt-0.5">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <UserCircle className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">{search ? 'No users match your search' : 'No users found'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="rounded-full bg-green-100 p-2 shrink-0">
                    <UserCircle className="w-6 h-6 text-green-600" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {user.displayName || 'Unnamed user'}
                      </span>
                      <span
                        className={cn(
                          'flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700',
                        )}
                      >
                        {user.isActive ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <XCircle className="w-2.5 h-2.5" />
                        )}
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-600 truncate">{user.email}</span>
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-600">{user.phoneNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Key className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-400 font-mono truncate">
                          {user.uid}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-400">
                          Joined {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
