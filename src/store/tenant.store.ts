import { create } from 'zustand';

export interface Tenant {
  id: string;
  name: string;
}

interface TenantState {
  selectedTenant: Tenant | null;
  tenants: Tenant[];
  switchTenant: (tenant: Tenant) => void;
  setTenants: (tenants: Tenant[]) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  selectedTenant: null,
  tenants: [],
  switchTenant: (tenant) => set({ selectedTenant: tenant }),
  setTenants: (tenants) => set({ tenants, selectedTenant: tenants[0] || null }),
}));
