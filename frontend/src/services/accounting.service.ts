import { api } from './api';
import type { Account, JournalEntry, LedgerEntry, TrialBalanceRow } from '@/types/accounting';

export const accountingService = {
  // GET /accounting/accounts
  async getAccounts(): Promise<Account[]> {
    const response = await api.get('/accounting/accounts');
    return response.data;
  },

  // POST /accounting/accounts
  async createAccount(data: any): Promise<Account> {
    const response = await api.post('/accounting/accounts', data);
    return response.data;
  },

  // POST /accounting/accounts/:id
  async updateAccount(id: string, data: any): Promise<Account> {
    const response = await api.post(`/accounting/accounts/${id}`, data);
    return response.data;
  },

  // GET /accounting/journal-entries
  async getJournalEntries(): Promise<JournalEntry[]> {
    const response = await api.get('/accounting/journal-entries');
    return response.data;
  },

  // POST /accounting/journal-entries
  async createJournalEntry(data: any): Promise<JournalEntry> {
    const response = await api.post('/accounting/journal-entries', data);
    return response.data;
  },

  // GET /accounting/ledger/:accountId
  async getLedger(accountId: string): Promise<LedgerEntry[]> {
    const response = await api.get(`/accounting/ledger/${accountId}`);
    return response.data;
  },

  // GET /accounting/reports/trial-balance
  async getTrialBalance(): Promise<TrialBalanceRow[]> {
    const response = await api.get('/accounting/reports/trial-balance');
    return response.data;
  },

  // GET /accounting/reports/profit-loss
  async getPLReport() {
    const response = await api.get('/accounting/reports/profit-loss');
    return response.data;
  },

  // GET /accounting/reports/balance-sheet
  async getBalanceSheet() {
    const response = await api.get('/accounting/reports/balance-sheet');
    return response.data;
  },

  async getSummary() {
    // Return a composite summary for the dashboard
    const [pl, bs] = await Promise.all([
      this.getPLReport(),
      this.getBalanceSheet(),
    ]);
    return {
      netIncome: pl.netIncome,
      totalAssets: bs.totalAssets,
      totalLiabilities: bs.totalLiabilities,
      totalEquity: bs.totalEquity,
    };
  },
};
