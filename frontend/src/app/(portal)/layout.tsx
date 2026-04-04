'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    if (user && user.role !== 'CUSTOMER') router.push('/');
  }, [isAuthenticated, user, router]);

  if (!user || user.role !== 'CUSTOMER') return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col font-sans">
      <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-emerald-600 tracking-tighter uppercase">BillFast Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">{user.name}</span>
          <button 
            onClick={() => useAuthStore.getState().logout()}
            className="text-xs font-semibold text-rose-600 hover:text-rose-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
