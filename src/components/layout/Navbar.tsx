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
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Tenant Switcher (Simplified for right now) */}
        <div className="hidden sm:block">
          <select
            className="bg-transparent border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-neutral-200"
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
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-neutral-900"></span>
        </button>
      </div>
    </header>
  );
}
