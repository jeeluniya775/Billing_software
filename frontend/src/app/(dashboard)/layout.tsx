'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ModuleNav } from '@/components/layout/ModuleNav';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useTenantStore } from '@/store/tenant.store';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const { selectedTenant, setSelectedTenant } = useTenantStore();

  useEffect(() => {
    // If user is not an owner and has a tenantId, or if it's a manager role
    // and the selected tenant mismatch or is not set, force it.
    if (user && user.role !== 'OWNER' && user.tenantId && selectedTenant?.id !== user.tenantId) {
      setSelectedTenant({ id: user.tenantId, name: 'Assigned Shop' });
    }
  }, [user, selectedTenant, setSelectedTenant]);
  
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto w-full">
              {/* Top Greeting area will be in individual pages, but ModuleNav is global for authenticated routes */}
              <div className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 sticky top-0 z-20 shadow-sm">
                <ModuleNav />
              </div>

              <div className="p-6 md:p-8" key={selectedTenant?.id}>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
