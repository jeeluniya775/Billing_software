import { api } from './api';
import { Customer } from '@/types/customer';

export const customersService = {
  /**
   * GET /sales/customers
   */
  getCustomers: async (search?: string): Promise<Customer[]> => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    
    const response = await api.get(`/sales/customers?${query.toString()}`);
    return response.data;
  },

  getGlobalCustomers: async (search?: string): Promise<Customer[]> => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    
    const response = await api.get(`/sales/customers/global?${query.toString()}`);
    return response.data;
  },

  /**
   * GET /sales/customers/:id
   */
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/sales/customers/${id}`);
    return response.data;
  },

  /**
   * POST /sales/customers
   */
  createCustomer: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await api.post('/sales/customers', data);
    return response.data;
  },

  /**
   * PATCH /sales/customers/:id
   */
  updateCustomer: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.patch(`/sales/customers/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /sales/customers/:id
   */
  deleteCustomer: async (id: string): Promise<void> => {
    await api.delete(`/sales/customers/${id}`);
  }
};
