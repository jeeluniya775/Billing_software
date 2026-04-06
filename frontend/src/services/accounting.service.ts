import { api } from './api';
import type {
  Account,
  JournalEntry,
  LedgerEntry,
  TrialBalanceRow,
  AccountingSettings,
  RecurringJournalEntry,
} from '@/types/accounting';

export const accountingService = {
  async getAccounts(): Promise<Account[]> {
    const response = await api.get('/accounting/accounts');
    return response.data;
  },

  async createAccount(data: any): Promise<Account> {
    const response = await api.post('/accounting/accounts', data);
    return response.data;
  },

  async updateAccount(id: string, data: any): Promise<Account> {
    const response = await api.patch(`/accounting/accounts/${id}`, data);
    return response.data;
  },

  async getJournalEntries(params?: { status?: string; from?: string; to?: string; page?: number; limit?: number }): Promise<{ items: JournalEntry[]; meta: any }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await api.get(`/accounting/journal-entries${suffix}`);
    return response.data;
  },

  async createJournalEntry(data: any): Promise<JournalEntry> {
    const response = await api.post('/accounting/journal-entries', data);
    return response.data;
  },

  async postJournalEntry(id: string): Promise<JournalEntry> {
    const response = await api.patch(`/accounting/journal-entries/${id}/post`);
    return response.data;
  },

  async cancelJournalEntry(id: string): Promise<JournalEntry> {
    const response = await api.patch(`/accounting/journal-entries/${id}/cancel`);
    return response.data;
  },

  async getLedger(accountId: string, params?: { from?: string; to?: string }): Promise<LedgerEntry[]> {
    const query = new URLSearchParams();
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await api.get(`/accounting/ledger/${accountId}${suffix}`);
    return response.data;
  },

  async getTrialBalance(params?: { from?: string; to?: string }): Promise<TrialBalanceRow[]> {
    const query = new URLSearchParams();
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await api.get(`/accounting/reports/trial-balance${suffix}`);
    return response.data;
  },

  async getPLReport(params?: { from?: string; to?: string }) {
    const query = new URLSearchParams();
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await api.get(`/accounting/reports/profit-loss${suffix}`);
    return response.data;
  },

  async getBalanceSheet(params?: { from?: string; to?: string }) {
    const query = new URLSearchParams();
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await api.get(`/accounting/reports/balance-sheet${suffix}`);
    return response.data;
  },

  async getSummary() {
    const [pl, bs] = await Promise.all([
      this.getPLReport(),
      this.getBalanceSheet(),
    ]);
    return {
      netIncome: pl.netIncome || 0,
      totalAssets: bs.totalAssets || 0,
      totalLiabilities: bs.totalLiabilities || 0,
      totalEquity: bs.totalEquity || 0,
      totalRevenue: pl.totalRevenue || 0,
      totalExpenses: pl.totalExpenses || 0,
    };
  },

  async getSettings(): Promise<AccountingSettings> {
    const response = await api.get('/accounting/settings');
    return response.data;
  },

  async updateSettings(data: Partial<Pick<AccountingSettings, 'fiscalYear' | 'baseCurrency' | 'periodLocked'>>): Promise<AccountingSettings> {
    const response = await api.patch('/accounting/settings', data);
    return response.data;
  },

  async getRecurringEntries(): Promise<RecurringJournalEntry[]> {
    const response = await api.get('/accounting/recurring-entries');
    return response.data;
  },

  async createRecurringEntry(data: {
    title: string;
    description?: string;
    frequency?: string;
    dayOfMonth?: number;
    isActive?: boolean;
    template?: Record<string, unknown>;
  }): Promise<RecurringJournalEntry> {
    const response = await api.post('/accounting/recurring-entries', data);
    return response.data;
  },
};
