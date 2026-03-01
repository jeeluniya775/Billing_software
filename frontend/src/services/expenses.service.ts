import type { Expense, ExpenseSummary, ExpenseAnalytics } from '@/types/expense';
import { MOCK_EXPENSES, MOCK_EXPENSE_SUMMARY, MOCK_EXPENSE_ANALYTICS } from '@/lib/mock-expenses';

const simulateDelay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const expensesService = {
  async getExpenses(): Promise<Expense[]> {
    await simulateDelay();
    return MOCK_EXPENSES;
  },

  async getSummary(): Promise<ExpenseSummary> {
    await simulateDelay();
    return MOCK_EXPENSE_SUMMARY;
  },

  async getAnalytics(): Promise<ExpenseAnalytics> {
    await simulateDelay();
    return MOCK_EXPENSE_ANALYTICS;
  },

  async createExpense(data: Partial<Expense>): Promise<Expense> {
    await simulateDelay(600);
    console.log('POST /api/expenses', data);
    return { ...MOCK_EXPENSES[0], ...data, id: `e${Date.now()}`, expenseNo: `EXP-${Math.floor(Math.random() * 900 + 100)}` } as Expense;
  },

  async updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
    await simulateDelay();
    console.log(`PUT /api/expenses/${id}`, data);
    const expense = MOCK_EXPENSES.find(e => e.id === id) || MOCK_EXPENSES[0];
    return { ...expense, ...data };
  },

  async deleteExpense(id: string): Promise<void> {
    await simulateDelay();
    console.log(`DELETE /api/expenses/${id}`);
  },

  async markAsPaid(id: string): Promise<void> {
    await simulateDelay();
    console.log(`PUT /api/expenses/${id} { status: 'Paid' }`);
  },

  async requestApproval(id: string): Promise<void> {
    await simulateDelay();
    console.log(`POST /api/expenses/${id}/approval`);
  },
};
