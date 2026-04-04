import { api } from './api';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  imageUrl?: string;
  category: string;
  unit: string;
  price: number;
  costPrice?: number;
  taxRate: number;
  stock: number;
  lowStockAlert: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  description?: string;
  imageUrl?: string;
  category: string;
  unit: string;
  price: number;
  costPrice?: number;
  taxRate?: number;
  stock?: number;
  lowStockAlert?: number;
  isActive?: boolean;
}

export const productsService = {
  async getAll(options: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async create(data: CreateProductDto) {
    const response = await api.post('/products', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateProductDto>) {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
