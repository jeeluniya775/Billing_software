'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    // If we're not authenticated and not on an auth page, redirect to login
    if (!isAuthenticated && !isAuthPage) {
      router.push('/login');
    }
    
    // If we are authenticated and on an auth page, redirect to dashboard
    if (isAuthenticated && isAuthPage) {
      router.push('/');
    }
  }, [isAuthenticated, pathname, router]);

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  // If redirecting, we don't render children to avoid flash of content
  if (!isAuthenticated && !isAuthPage) {
    return null;
  }

  return <>{children}</>;
}
