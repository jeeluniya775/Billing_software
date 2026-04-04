import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tenant {
  id: string;
  name: string;
}

interface TenantState {
  selectedTenant: Tenant | null;
  tenants: Tenant[];
  switchTenant: (tenant: Tenant) => void;
  setTenants: (tenants: Tenant[]) => void;
  setSelectedTenant: (tenant: Tenant | null) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      selectedTenant: null,
      tenants: [],
      switchTenant: (tenant) => set({ selectedTenant: tenant }),
      setTenants: (tenants) => set({ tenants, selectedTenant: tenants[0] || null }),
      setSelectedTenant: (tenant) => set({ selectedTenant: tenant }),
    }),
    {
      name: 'tenant-storage',
    }
  )
);
