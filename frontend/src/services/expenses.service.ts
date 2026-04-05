import { api } from './api';
import { Expense, ExpenseSummary } from '@/types/expense';

export const expensesService = {
  // GET /expense
  async getExpenses(params?: any): Promise<{ items: Expense[], meta: any }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== 'all' && value !== '') {
          query.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/expense?${query.toString()}`);
    return response.data;
  },

  // POST /expense
  async createExpense(data: Partial<Expense>): Promise<Expense> {
    const response = await api.post('/expense', data);
    return response.data;
  },

  // PATCH /expense/:id
  async updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
    const response = await api.patch(`/expense/${id}`, data);
    return response.data;
  },

  // DELETE /expense/:id
  async deleteExpense(id: string) {
    const response = await api.delete(`/expense/${id}`);
    return response.data;
  },

  async approveExpense(id: string) {
    const response = await api.patch(`/expense/${id}/approve`);
    return response.data;
  },

  async rejectExpense(id: string) {
    const response = await api.patch(`/expense/${id}/reject`);
    return response.data;
  },

  // GET /expense/summary
  async getExpenseSummary(): Promise<ExpenseSummary> {
    const response = await api.get('/expense/summary');
    return response.data;
  },
};
