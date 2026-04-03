'use client';

import { useUIStore } from '@/store/ui.store';
import { useTenantStore } from '@/store/tenant.store';
import { Menu, Bell, Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

export function Navbar() {
  const { toggleSidebar, theme, toggleTheme } = useUIStore();
  const { selectedTenant, tenants } = useTenantStore();

  // Apply theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle mock tenants initialization if empty
  useEffect(() => {
    const { tenants, setTenants } = useTenantStore.getState();
    if (tenants.length === 0) {
      setTenants([
        { id: 't1', name: 'Company A' },
        { id: 't2', name: 'Company B' },
        { id: 't3', name: 'Company C' },
      ]);
    }
  }, []);

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

        {/* Tenant Switcher */}
        <div className="hidden sm:block">
          <select
            className="bg-transparent border border-neutral-100 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-neutral-200"
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
        </div>
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
