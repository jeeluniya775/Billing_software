export type SaleStatus = 'Paid' | 'Partial' | 'Overdue' | 'Draft';

export interface SaleItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  salesperson: string;
  amount: number;
  paid: number;
  due: number;
  status: SaleStatus;
  date: string;
  dueDate: string;
  category: string;
  tags: string[];
  notes?: string;
  discount: number;
  tax: number;
  lineItems: SaleItem[];
  isRecurring: boolean;
}

export interface SalesSummaryKPIs {
  totalSalesToday: number;
  totalSalesThisMonth: number;
  totalRevenue: number;
  paidAmount: number;
  unpaidAmount: number;
  overdueAmount: number;
  salesGrowthPercent: number;
}
