export type ExpenseStatus = 'PAID' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CHEQUE' | 'UPI';

export interface Expense {
  id: string;
  tenantId: string;
  employeeId?: string;
  vendor?: string;
  date: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  status: ExpenseStatus;
  isRecurring?: boolean;
  recurringPeriod?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    firstName: string;
    lastName: string;
  };
}

export interface ExpenseSummary {
  totalToday: number;
  totalThisMonth: number;
  totalLastMonth: number;
  growthPercent: number;
  pendingAmount: number;
  recurringMonthly: number;
  categoryBreakdown: { category: string; amount: number; percent: number }[];
}

export interface ExpenseAnalytics {
  monthlyTrend: { name: string; amount: number; budget: number }[];
  topVendors: { vendor: string; amount: number; count: number }[];
  paymentMethodRatio: { method: string; value: number }[];
  categoryDistribution: { name: string; value: number; color: string }[];
  cashVsBank: { name: string; value: number }[];
}
