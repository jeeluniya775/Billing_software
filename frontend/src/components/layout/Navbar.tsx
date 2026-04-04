'use client';

import { useUIStore } from '@/store/ui.store';
import { useTenantStore } from '@/store/tenant.store';
import { Menu, Bell, Moon, Sun, Plus, LayoutGrid } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { useEffect } from 'react';
import { CreateShopModal } from '@/components/forms/CreateShopModal';

export function Navbar() {
  const { toggleSidebar, theme, toggleTheme } = useUIStore();
  const { selectedTenant, tenants } = useTenantStore();

  const { user } = useAuthStore();

  // Apply theme to document element

  return (
    <header className="h-14 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center space-x-6">
        <div className="flex items-center gap-2">
           <button
             onClick={toggleSidebar}
             className="p-2 -ml-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors md:hidden"
           >
             <Menu className="h-5 w-5" />
           </button>
           <span className="text-sm font-black text-emerald-600 tracking-tighter uppercase">BillFast</span>
        </div>

        {/* Tenant Switcher - ONLY for OWNER */}
        {(user?.role === 'OWNER') && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative group">
              <select
                className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-lg pl-3 pr-8 py-1.5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer min-w-[140px]"
                value={selectedTenant?.id || ''}
                onChange={(e) => {
                  const tenant = tenants.find((t) => t.id === e.target.value);
                  if (tenant) useTenantStore.getState().switchTenant(tenant);
                }}
              >
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-neutral-400">
                <Menu className="h-3 w-3" />
              </div>
            </div>
            
            <CreateShopModal />

            <Link 
              href="/consolidated"
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Consolidated View"
            >
              <LayoutGrid className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <button className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white dark:border-neutral-900"></span>
        </button>

        <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-[10px] font-black text-emerald-700">
           JU
        </div>
      </div>
    </header>
  );
}
