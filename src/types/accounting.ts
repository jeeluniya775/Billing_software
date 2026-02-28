export type AccountType = 'Assets' | 'Liabilities' | 'Equity' | 'Income' | 'Expenses';
export type AccountStatus = 'Active' | 'Inactive';
export type JournalStatus = 'Draft' | 'Posted' | 'Reversed';
export type ReportPeriod = 'This Month' | 'This Quarter' | 'This Year' | 'Last Year' | 'Custom';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  balance: number;
  openingBalance: number;
  currency: string;
  status: AccountStatus;
  description?: string;
  isHeader: boolean;
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entryNo: string;
  date: string;
  reference: string;
  description: string;
  lines: JournalLine[];
  status: JournalStatus;
  totalDebit: number;
  totalCredit: number;
  createdBy: string;
  notes?: string;
  attachmentUrl?: string;
  isRecurring?: boolean;
  currency: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  entryNo: string;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
  journalId: string;
}

export interface TrialBalanceRow {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  debit: number;
  credit: number;
}

export interface AccountingSummary {
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
  netProfit: number;
  cashFlow: number;
  accountsReceivable: number;
  accountsPayable: number;
  grossRevenue: number;
  totalExpenses: number;
}

export interface PLData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface CashFlowData {
  month: string;
  inflow: number;
  outflow: number;
  net: number;
}
