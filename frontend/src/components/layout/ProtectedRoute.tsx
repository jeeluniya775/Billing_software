'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Only set hydrated to true once the client-side store has been restored
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    
    // Check if it's already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    // If we're not authenticated and not on an auth page, redirect to login
    if (!isAuthenticated && !isAuthPage) {
      router.push('/login');
    }
    
    // If we are authenticated and on an auth page, redirect to dashboard
    if (isAuthenticated && isAuthPage) {
      router.push('/');
    }
  }, [isAuthenticated, pathname, router, hasHydrated]);

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  
  // Wait for hydration to avoid incorrect redirects
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-vh-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // If redirecting, we don't render children to avoid flash of content
  if (!isAuthenticated && !isAuthPage) {
    return null;
  }

  return <>{children}</>;
}
