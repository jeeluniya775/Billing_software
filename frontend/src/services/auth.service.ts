import { api } from './api';
import { useAuthStore, User } from '../store/auth.store';
import { useTenantStore } from '../store/tenant.store';

export const authService = {
  async login(credentials: any) {
    const response = await api.post('/auth/login', credentials);
    if (response.data && (response.data.accessToken || response.data.success !== false)) {
      const { user, accessToken, tenant, ownedTenants } = response.data;
      useAuthStore.getState().login(user, accessToken);
      if (ownedTenants && ownedTenants.length > 0) {
        useTenantStore.getState().setTenants(ownedTenants);
      } else if (tenant) {
        useTenantStore.getState().setTenants([tenant]);
      }
      return response.data;
    }
    throw new Error(response.data?.message || 'Login failed');
  },

  async register(data: any) {
    const response = await api.post('/auth/register', data);
    if (response.data && (response.data.accessToken || response.data.success !== false)) {
      const { user, accessToken, tenant, ownedTenants } = response.data;
      useAuthStore.getState().login(user, accessToken);
      if (ownedTenants && ownedTenants.length > 0) {
        useTenantStore.getState().setTenants(ownedTenants);
      } else if (tenant) {
        useTenantStore.getState().setTenants([tenant]);
      }
      return response.data;
    }
    throw new Error(response.data?.message || 'Registration failed');
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout() {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  },
};
