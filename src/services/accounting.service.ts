import type { Account, JournalEntry, LedgerEntry, TrialBalanceRow } from '@/types/accounting';
import {
  MOCK_ACCOUNTS, MOCK_JOURNAL_ENTRIES, MOCK_LEDGER_ENTRIES,
  MOCK_TRIAL_BALANCE, MOCK_ACCOUNTING_SUMMARY, MOCK_PL_DATA, MOCK_CASH_FLOW_DATA,
} from '@/lib/mock-accounting';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const accountingService = {
  // GET /api/accounts
  async getAccounts(): Promise<Account[]> {
    await delay();
    return MOCK_ACCOUNTS;
  },

  // POST /api/accounts
  async createAccount(data: Partial<Account>): Promise<Account> {
    await delay(600);
    console.log('POST /api/accounts', data);
    return { ...MOCK_ACCOUNTS[0], ...data, id: `acc_${Date.now()}` } as Account;
  },

  // PUT /api/accounts/:id
  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    await delay();
    console.log(`PUT /api/accounts/${id}`, data);
    const acc = MOCK_ACCOUNTS.find(a => a.id === id) || MOCK_ACCOUNTS[0];
    return { ...acc, ...data };
  },

  // DELETE /api/accounts/:id
  async deleteAccount(id: string): Promise<void> {
    await delay();
    console.log(`DELETE /api/accounts/${id}`);
  },

  // GET /api/journal-entries
  async getJournalEntries(): Promise<JournalEntry[]> {
    await delay();
    return MOCK_JOURNAL_ENTRIES;
  },

  // POST /api/journal-entries
  async createJournalEntry(data: Partial<JournalEntry>): Promise<JournalEntry> {
    await delay(600);
    console.log('POST /api/journal-entries', data);
    return { ...MOCK_JOURNAL_ENTRIES[0], ...data, id: `je_${Date.now()}`, entryNo: `JE-${Math.floor(Math.random() * 900 + 100)}` } as JournalEntry;
  },

  // GET /api/ledger/:accountId
  async getLedger(accountId: string): Promise<LedgerEntry[]> {
    await delay();
    return MOCK_LEDGER_ENTRIES[accountId] || [];
  },

  // GET /api/reports/trial-balance
  async getTrialBalance(): Promise<TrialBalanceRow[]> {
    await delay();
    return MOCK_TRIAL_BALANCE;
  },

  // GET /api/reports/profit-loss
  async getPLReport() {
    await delay();
    return MOCK_PL_DATA;
  },

  // GET /api/reports/balance-sheet
  async getBalanceSheet() {
    await delay();
    return MOCK_ACCOUNTING_SUMMARY;
  },

  // GET /api/reports/cash-flow
  async getCashFlow() {
    await delay();
    return MOCK_CASH_FLOW_DATA;
  },

  async getSummary() {
    await delay();
    return MOCK_ACCOUNTING_SUMMARY;
  },
};
