import axios from 'axios';
import { useAuthStore } from '../store/auth.store';
import { useTenantStore } from '../store/tenant.store';

// Mock API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT and Tenant ID
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const role = useAuthStore.getState().user?.role;
    const tenantId = useTenantStore.getState().selectedTenant?.id;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (tenantId && role !== 'CUSTOMER') {
      config.headers['X-Tenant-Id'] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for unwrapping standard ApiResponse and handling 401
api.interceptors.response.use(
  (response) => {
    // If the response follows our standard { success: true, data: ... } format, unwrap it
    if (response.data && response.data.success === true && 'data' in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
