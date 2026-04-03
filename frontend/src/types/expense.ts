export type ExpenseStatus = 'Paid' | 'Pending' | 'Reimbursable' | 'Approved' | 'Rejected';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Credit Card' | 'Cheque' | 'UPI';
export type ExpenseCategory =
  | 'Travel'
  | 'Office Supplies'
  | 'Software & Subscriptions'
  | 'Marketing'
  | 'Salaries'
  | 'Rent'
  | 'Utilities'
  | 'Meals & Entertainment'
  | 'Equipment'
  | 'Miscellaneous';

export interface ExpenseTag {
  label: string;
  color: string;
}

export interface Expense {
  id: string;
  expenseNo: string;
  vendor: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  date: string;
  dueDate?: string;
  isRecurring: boolean;
  recurringPeriod?: 'Monthly' | 'Quarterly' | 'Yearly';
  isReimbursable: boolean;
  reimbursedBy?: string;
  attachmentUrl?: string;
  notes?: string;
  approvedBy?: string;
  tags: string[];
  splitWith?: string[];
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
