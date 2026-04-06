export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export type JournalStatus = 'DRAFT' | 'POSTED' | 'CANCELLED';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  isActive: boolean;
  description?: string;
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountName: string;
  description?: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference?: string;
  description: string;
  lines: JournalLine[];
  status: JournalStatus;
  totalDebit: number;
  totalCredit: number;
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
  totalEquity: number;
  netIncome: number;
  totalRevenue: number;
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

export interface AccountingSettings {
  id: string;
  tenantId: string;
  fiscalYear: string;
  baseCurrency: string;
  periodLocked: boolean;
  lockedAt?: string | null;
  lockedBy?: string | null;
}

export interface RecurringJournalEntry {
  id: string;
  tenantId: string;
  title: string;
  description?: string | null;
  frequency: string;
  dayOfMonth: number;
  isActive: boolean;
  createdAt: string;
}
