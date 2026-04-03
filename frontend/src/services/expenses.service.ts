import { api } from './api';
import { Expense, ExpenseSummary, ExpenseCategory } from '@/types/expense';

export const expensesService = {
  // GET /expense
  async getExpenses(): Promise<Expense[]> {
    const response = await api.get('/expense');
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
  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/expense/${id}`);
  },

  // GET /expense/summary (Mock or implement in backend)
  async getExpenseSummary(): Promise<ExpenseSummary> {
    try {
      const response = await api.get('/expense/summary');
      return response.data;
    } catch (err) {
      return {
        totalToday: 0,
        totalThisMonth: 0,
        totalLastMonth: 0,
        growthPercent: 0,
        pendingAmount: 0,
        recurringMonthly: 0,
        categoryBreakdown: [],
      };
    }
  },
};
