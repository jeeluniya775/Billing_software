import { api } from './api';
import { useAuthStore, User } from '../store/auth.store';
import { useTenantStore } from '../store/tenant.store';

export const authService = {
  async login(credentials: any) {
    const response = await api.post('/auth/login', credentials);
    // If the interceptor unwrapped it, response.data will be the data object (user, accessToken, tenant)
    // If it didn't (e.g. error), it will have success: false
    if (response.data && (response.data.accessToken || response.data.success !== false)) {
      const { user, accessToken, tenant } = response.data;
      useAuthStore.getState().login(user, accessToken);
      useTenantStore.getState().setTenants([tenant]);
      return response.data;
    }
    throw new Error(response.data?.message || 'Login failed');
  },

  async register(data: any) {
    const response = await api.post('/auth/register', data);
    if (response.data && (response.data.accessToken || response.data.success !== false)) {
      const { user, accessToken, tenant } = response.data;
      useAuthStore.getState().login(user, accessToken);
      useTenantStore.getState().setTenants([tenant]);
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
