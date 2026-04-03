import type { Account, JournalEntry, LedgerEntry, TrialBalanceRow, AccountingSummary, PLData, CashFlowData } from '@/types/accounting';

// ─── Chart of Accounts ──────────────────────────────────────────────────────
export const MOCK_ACCOUNTS: Account[] = [
  // ASSETS
  { id: 'a1',  code: '1000', name: 'Assets',                        type: 'Assets',      balance: 425000, openingBalance: 400000, currency: 'USD', status: 'Active', isHeader: true },
  { id: 'a2',  code: '1100', name: 'Current Assets',                type: 'Assets',      parentId: 'a1',  balance: 185000, openingBalance: 170000, currency: 'USD', status: 'Active', isHeader: true },
  { id: 'a3',  code: '1110', name: 'Cash & Cash Equivalents',       type: 'Assets',      parentId: 'a2',  balance: 48000,  openingBalance: 42000, currency: 'USD', status: 'Active', isHeader: false, description: 'Petty cash + bank' },
  { id: 'a4',  code: '1120', name: 'Accounts Receivable',           type: 'Assets',      parentId: 'a2',  balance: 92000,  openingBalance: 85000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'a5',  code: '1130', name: 'Inventory',                     type: 'Assets',      parentId: 'a2',  balance: 35000,  openingBalance: 30000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'a6',  code: '1140', name: 'Prepaid Expenses',              type: 'Assets',      parentId: 'a2',  balance: 10000,  openingBalance: 13000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'a7',  code: '1200', name: 'Non-Current Assets',            type: 'Assets',      parentId: 'a1',  balance: 240000, openingBalance: 230000, currency: 'USD', status: 'Active', isHeader: true },
  { id: 'a8',  code: '1210', name: 'Property & Equipment',          type: 'Assets',      parentId: 'a7',  balance: 180000, openingBalance: 175000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'a9',  code: '1220', name: 'Accumulated Depreciation',      type: 'Assets',      parentId: 'a7',  balance: -28000, openingBalance: -22000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'a10', code: '1230', name: 'Intangible Assets',             type: 'Assets',      parentId: 'a7',  balance: 88000,  openingBalance: 77000, currency: 'USD', status: 'Active', isHeader: false },
  // LIABILITIES
  { id: 'l1',  code: '2000', name: 'Liabilities',                   type: 'Liabilities', balance: 195000, openingBalance: 185000, currency: 'USD', status: 'Active', isHeader: true },
  { id: 'l2',  code: '2100', name: 'Current Liabilities',           type: 'Liabilities', parentId: 'l1',  balance: 95000,  openingBalance: 88000, currency: 'USD', status: 'Active', isHeader: true },
  { id: 'l3',  code: '2110', name: 'Accounts Payable',              type: 'Liabilities', parentId: 'l2',  balance: 42000,  openingBalance: 38000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'l4',  code: '2120', name: 'Short-Term Loans',              type: 'Liabilities', parentId: 'l2',  balance: 30000,  openingBalance: 30000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'l5',  code: '2130', name: 'Tax Payable',                   type: 'Liabilities', parentId: 'l2',  balance: 12000,  openingBalance: 10000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'l6',  code: '2140', name: 'Accrued Expenses',              type: 'Liabilities', parentId: 'l2',  balance: 11000,  openingBalance: 10000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'l7',  code: '2200', name: 'Long-Term Liabilities',         type: 'Liabilities', parentId: 'l1',  balance: 100000, openingBalance: 97000, currency: 'USD', status: 'Active', isHeader: true },
  { id: 'l8',  code: '2210', name: 'Bank Loan',                     type: 'Liabilities', parentId: 'l7',  balance: 100000, openingBalance: 97000, currency: 'USD', status: 'Active', isHeader: false },
  // EQUITY
  { id: 'e1',  code: '3000', name: 'Equity',                        type: 'Equity',      balance: 230000, openingBalance: 215000, currency: 'USD', status: 'Active', isHeader: true },
  { id: 'e2',  code: '3100', name: 'Share Capital',                 type: 'Equity',      parentId: 'e1',  balance: 150000, openingBalance: 150000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'e3',  code: '3200', name: 'Retained Earnings',             type: 'Equity',      parentId: 'e1',  balance: 80000,  openingBalance: 65000, currency: 'USD', status: 'Active', isHeader: false },
  // INCOME
  { id: 'i1',  code: '4000', name: 'Income',                        type: 'Income',      balance: 285000, openingBalance: 240000, currency: 'USD', status: 'Active', isHeader: true },
  { id: 'i2',  code: '4100', name: 'Sales Revenue',                 type: 'Income',      parentId: 'i1',  balance: 250000, openingBalance: 210000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'i3',  code: '4200', name: 'Service Revenue',               type: 'Income',      parentId: 'i1',  balance: 28000,  openingBalance: 24000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'i4',  code: '4300', name: 'Other Income',                  type: 'Income',      parentId: 'i1',  balance: 7000,   openingBalance: 6000, currency: 'USD', status: 'Active', isHeader: false },
  // EXPENSES
  { id: 'x1',  code: '5000', name: 'Expenses',                      type: 'Expenses',    balance: 198000, openingBalance: 175000, currency: 'USD', status: 'Active', isHeader: true },
  { id: 'x2',  code: '5100', name: 'Cost of Goods Sold',            type: 'Expenses',    parentId: 'x1',  balance: 95000,  openingBalance: 83000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'x3',  code: '5200', name: 'Salaries & Wages',              type: 'Expenses',    parentId: 'x1',  balance: 52000,  openingBalance: 46000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'x4',  code: '5300', name: 'Rent Expense',                  type: 'Expenses',    parentId: 'x1',  balance: 18000,  openingBalance: 16000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'x5',  code: '5400', name: 'Marketing & Advertising',       type: 'Expenses',    parentId: 'x1',  balance: 14000,  openingBalance: 12000, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'x6',  code: '5500', name: 'Depreciation',                  type: 'Expenses',    parentId: 'x1',  balance: 8000,   openingBalance: 6500, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'x7',  code: '5600', name: 'Utilities',                     type: 'Expenses',    parentId: 'x1',  balance: 6000,   openingBalance: 5500, currency: 'USD', status: 'Active', isHeader: false },
  { id: 'x8',  code: '5700', name: 'Miscellaneous Expenses',        type: 'Expenses',    parentId: 'x1',  balance: 5000,   openingBalance: 6000, currency: 'USD', status: 'Active', isHeader: false },
];

// ─── Journal Entries ─────────────────────────────────────────────────────────
export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j1', entryNo: 'JE-001', date: '2026-02-01', reference: 'INV-2026-001',
    description: 'Sales invoice to Acme Corp', currency: 'USD', status: 'Posted',
    totalDebit: 11800, totalCredit: 11800, createdBy: 'Admin',
    lines: [
      { id: 'jl1', accountId: 'a4', accountName: 'Accounts Receivable', description: 'Acme Corp invoice', debit: 11800, credit: 0 },
      { id: 'jl2', accountId: 'i2', accountName: 'Sales Revenue', description: 'Product sale', debit: 0, credit: 10000 },
      { id: 'jl3', accountId: 'l5', accountName: 'Tax Payable', description: 'GST 18%', debit: 0, credit: 1800 },
    ],
  },
  {
    id: 'j2', entryNo: 'JE-002', date: '2026-02-03', reference: 'BILL-002',
    description: 'Vendor payment – WeWork Office', currency: 'USD', status: 'Posted',
    totalDebit: 4130, totalCredit: 4130, createdBy: 'Accountant',
    lines: [
      { id: 'jl4', accountId: 'x4', accountName: 'Rent Expense', description: 'Feb rent', debit: 3500, credit: 0 },
      { id: 'jl5', accountId: 'l5', accountName: 'Tax Payable', description: 'GST', debit: 630, credit: 0 },
      { id: 'jl6', accountId: 'a3', accountName: 'Cash & Cash Equivalents', description: 'Payment', debit: 0, credit: 4130 },
    ],
  },
  {
    id: 'j3', entryNo: 'JE-003', date: '2026-02-05', reference: 'INV-2026-002',
    description: 'Service invoice – consulting', currency: 'USD', status: 'Posted',
    totalDebit: 5000, totalCredit: 5000, createdBy: 'Admin',
    lines: [
      { id: 'jl7', accountId: 'a4', accountName: 'Accounts Receivable', description: 'Consulting fee', debit: 5000, credit: 0 },
      { id: 'jl8', accountId: 'i3', accountName: 'Service Revenue', description: 'Consulting', debit: 0, credit: 5000 },
    ],
  },
  {
    id: 'j4', entryNo: 'JE-004', date: '2026-02-08', reference: 'PAY-008',
    description: 'Salary disbursement – Feb 1st batch', currency: 'USD', status: 'Posted',
    totalDebit: 26000, totalCredit: 26000, createdBy: 'HR-Finance',
    lines: [
      { id: 'jl9',  accountId: 'x3', accountName: 'Salaries & Wages', description: 'Dev team', debit: 20000, credit: 0 },
      { id: 'jl10', accountId: 'x3', accountName: 'Salaries & Wages', description: 'Sales team', debit: 6000, credit: 0 },
      { id: 'jl11', accountId: 'a3', accountName: 'Cash & Cash Equivalents', description: 'Bank transfer', debit: 0, credit: 26000 },
    ],
  },
  {
    id: 'j5', entryNo: 'JE-005', date: '2026-02-10', reference: 'ADJ-001',
    description: 'Monthly depreciation adjustment', currency: 'USD', status: 'Posted',
    totalDebit: 2000, totalCredit: 2000, createdBy: 'Accountant',
    lines: [
      { id: 'jl12', accountId: 'x6', accountName: 'Depreciation', description: 'Equipment depreciation', debit: 2000, credit: 0 },
      { id: 'jl13', accountId: 'a9', accountName: 'Accumulated Depreciation', description: 'Acc. depr.', debit: 0, credit: 2000 },
    ],
  },
  {
    id: 'j6', entryNo: 'JE-006', date: '2026-02-14', reference: 'RCPT-006',
    description: 'Cash receipt from customer', currency: 'USD', status: 'Posted',
    totalDebit: 15000, totalCredit: 15000, createdBy: 'Admin',
    lines: [
      { id: 'jl14', accountId: 'a3', accountName: 'Cash & Cash Equivalents', description: 'Receipt', debit: 15000, credit: 0 },
      { id: 'jl15', accountId: 'a4', accountName: 'Accounts Receivable', description: 'AR cleared', debit: 0, credit: 15000 },
    ],
  },
  {
    id: 'j7', entryNo: 'JE-007', date: '2026-02-17', reference: 'DRAFT-007',
    description: 'Prepaid insurance adjustment — draft', currency: 'USD', status: 'Draft',
    totalDebit: 3600, totalCredit: 3600, createdBy: 'Accountant', notes: 'Pending CFO approval',
    lines: [
      { id: 'jl16', accountId: 'a6', accountName: 'Prepaid Expenses', description: 'Insurance Q1', debit: 3600, credit: 0 },
      { id: 'jl17', accountId: 'a3', accountName: 'Cash & Cash Equivalents', description: 'Premium paid', debit: 0, credit: 3600 },
    ],
  },
  {
    id: 'j8', entryNo: 'JE-008', date: '2026-02-20', reference: 'INV-2026-011',
    description: 'Product sale – Retail customer', currency: 'USD', status: 'Posted',
    totalDebit: 8260, totalCredit: 8260, createdBy: 'Admin',
    lines: [
      { id: 'jl18', accountId: 'a4', accountName: 'Accounts Receivable', description: 'Retail customer', debit: 8260, credit: 0 },
      { id: 'jl19', accountId: 'i2', accountName: 'Sales Revenue', description: 'Product', debit: 0, credit: 7000 },
      { id: 'jl20', accountId: 'l5', accountName: 'Tax Payable', description: 'GST', debit: 0, credit: 1260 },
    ],
  },
  {
    id: 'j9', entryNo: 'JE-009', date: '2026-02-22', reference: 'PAY-022',
    description: 'Google Ads – Marketing payment', currency: 'USD', status: 'Posted',
    totalDebit: 2200, totalCredit: 2200, createdBy: 'Marketing',
    lines: [
      { id: 'jl21', accountId: 'x5', accountName: 'Marketing & Advertising', description: 'Google Ads Feb', debit: 2200, credit: 0 },
      { id: 'jl22', accountId: 'a3', accountName: 'Cash & Cash Equivalents', description: 'UPI payment', debit: 0, credit: 2200 },
    ],
  },
  {
    id: 'j10', entryNo: 'JE-010', date: '2026-02-25', reference: 'REV-009',
    description: 'Reversal of JE-003 – duplicate entry', currency: 'USD', status: 'Reversed',
    totalDebit: 5000, totalCredit: 5000, createdBy: 'Admin', notes: 'Reversed: duplicate of JE-003',
    lines: [
      { id: 'jl23', accountId: 'i3', accountName: 'Service Revenue', description: 'Reversed', debit: 5000, credit: 0 },
      { id: 'jl24', accountId: 'a4', accountName: 'Accounts Receivable', description: 'Reversed', debit: 0, credit: 5000 },
    ],
  },
];

// ─── General Ledger (for Accounts Receivable: a4) ───────────────────────────
export const MOCK_LEDGER_ENTRIES: Record<string, LedgerEntry[]> = {
  'a4': [
    { id: 'le1', date: '2026-02-01', entryNo: 'JE-001', description: 'Sales invoice – Acme Corp', debit: 11800, credit: 0,     runningBalance: 96800, journalId: 'j1' },
    { id: 'le2', date: '2026-02-03', entryNo: 'JE-003', description: 'Service invoice – consulting', debit: 5000,  credit: 0,     runningBalance: 101800, journalId: 'j3' },
    { id: 'le3', date: '2026-02-14', entryNo: 'JE-006', description: 'Cash receipt from customer',  debit: 0,     credit: 15000, runningBalance: 86800, journalId: 'j6' },
    { id: 'le4', date: '2026-02-20', entryNo: 'JE-008', description: 'Product sale – Retail',       debit: 8260,  credit: 0,     runningBalance: 95060, journalId: 'j8' },
    { id: 'le5', date: '2026-02-25', entryNo: 'JE-010', description: 'Reversal JE-003',             debit: 0,     credit: 5000,  runningBalance: 90060, journalId: 'j10' },
  ],
  'a3': [
    { id: 'le6', date: '2026-02-03', entryNo: 'JE-002', description: 'WeWork rent payment',         debit: 0,     credit: 4130,  runningBalance: 43870, journalId: 'j2' },
    { id: 'le7', date: '2026-02-08', entryNo: 'JE-004', description: 'Salary – Feb 1st',            debit: 0,     credit: 26000, runningBalance: 17870, journalId: 'j4' },
    { id: 'le8', date: '2026-02-14', entryNo: 'JE-006', description: 'Cash receipt',                debit: 15000, credit: 0,     runningBalance: 32870, journalId: 'j6' },
    { id: 'le9', date: '2026-02-17', entryNo: 'JE-007', description: 'Prepaid insurance',           debit: 0,     credit: 3600,  runningBalance: 29270, journalId: 'j7' },
    { id: 'le10',date: '2026-02-22', entryNo: 'JE-009', description: 'Google Ads payment',          debit: 0,     credit: 2200,  runningBalance: 27070, journalId: 'j9' },
  ],
};

// ─── Trial Balance ────────────────────────────────────────────────────────────
export const MOCK_TRIAL_BALANCE: TrialBalanceRow[] = [
  { accountId: 'a3', accountCode: '1110', accountName: 'Cash & Cash Equivalents',  accountType: 'Assets',      debit: 48000,  credit: 0 },
  { accountId: 'a4', accountCode: '1120', accountName: 'Accounts Receivable',      accountType: 'Assets',      debit: 92000,  credit: 0 },
  { accountId: 'a5', accountCode: '1130', accountName: 'Inventory',                accountType: 'Assets',      debit: 35000,  credit: 0 },
  { accountId: 'a6', accountCode: '1140', accountName: 'Prepaid Expenses',         accountType: 'Assets',      debit: 10000,  credit: 0 },
  { accountId: 'a8', accountCode: '1210', accountName: 'Property & Equipment',     accountType: 'Assets',      debit: 180000, credit: 0 },
  { accountId: 'a9', accountCode: '1220', accountName: 'Accumulated Depreciation', accountType: 'Assets',      debit: 0,      credit: 28000 },
  { accountId: 'l3', accountCode: '2110', accountName: 'Accounts Payable',         accountType: 'Liabilities', debit: 0,      credit: 42000 },
  { accountId: 'l4', accountCode: '2120', accountName: 'Short-Term Loans',         accountType: 'Liabilities', debit: 0,      credit: 30000 },
  { accountId: 'l5', accountCode: '2130', accountName: 'Tax Payable',              accountType: 'Liabilities', debit: 0,      credit: 12000 },
  { accountId: 'l8', accountCode: '2210', accountName: 'Bank Loan',                accountType: 'Liabilities', debit: 0,      credit: 100000 },
  { accountId: 'e2', accountCode: '3100', accountName: 'Share Capital',            accountType: 'Equity',      debit: 0,      credit: 150000 },
  { accountId: 'e3', accountCode: '3200', accountName: 'Retained Earnings',        accountType: 'Equity',      debit: 0,      credit: 80000 },
  { accountId: 'i2', accountCode: '4100', accountName: 'Sales Revenue',            accountType: 'Income',      debit: 0,      credit: 250000 },
  { accountId: 'i3', accountCode: '4200', accountName: 'Service Revenue',          accountType: 'Income',      debit: 0,      credit: 28000 },
  { accountId: 'i4', accountCode: '4300', accountName: 'Other Income',             accountType: 'Income',      debit: 0,      credit: 7000 },
  { accountId: 'x2', accountCode: '5100', accountName: 'Cost of Goods Sold',       accountType: 'Expenses',    debit: 95000,  credit: 0 },
  { accountId: 'x3', accountCode: '5200', accountName: 'Salaries & Wages',         accountType: 'Expenses',    debit: 52000,  credit: 0 },
  { accountId: 'x4', accountCode: '5300', accountName: 'Rent Expense',             accountType: 'Expenses',    debit: 18000,  credit: 0 },
  { accountId: 'x5', accountCode: '5400', accountName: 'Marketing',                accountType: 'Expenses',    debit: 14000,  credit: 0 },
  { accountId: 'x6', accountCode: '5500', accountName: 'Depreciation',             accountType: 'Expenses',    debit: 8000,   credit: 0 },
  { accountId: 'x7', accountCode: '5600', accountName: 'Utilities',                accountType: 'Expenses',    debit: 6000,   credit: 0 },
  { accountId: 'x8', accountCode: '5700', accountName: 'Miscellaneous',            accountType: 'Expenses',    debit: 5000,   credit: 0 },
];

// ─── Accounting KPI summary ───────────────────────────────────────────────────
export const MOCK_ACCOUNTING_SUMMARY: AccountingSummary = {
  totalAssets: 425000,
  totalLiabilities: 195000,
  equity: 230000,
  netProfit: 87000,
  cashFlow: 32000,
  accountsReceivable: 92000,
  accountsPayable: 42000,
  grossRevenue: 285000,
  totalExpenses: 198000,
};

// ─── P&L Trend ────────────────────────────────────────────────────────────────
export const MOCK_PL_DATA: PLData[] = [
  { month: 'Sep', revenue: 210000, expenses: 165000, profit: 45000 },
  { month: 'Oct', revenue: 225000, expenses: 172000, profit: 53000 },
  { month: 'Nov', revenue: 240000, expenses: 180000, profit: 60000 },
  { month: 'Dec', revenue: 268000, expenses: 195000, profit: 73000 },
  { month: 'Jan', revenue: 258000, expenses: 188000, profit: 70000 },
  { month: 'Feb', revenue: 285000, expenses: 198000, profit: 87000 },
];

// ─── Cash Flow ────────────────────────────────────────────────────────────────
export const MOCK_CASH_FLOW_DATA: CashFlowData[] = [
  { month: 'Sep', inflow: 195000, outflow: 165000, net: 30000 },
  { month: 'Oct', inflow: 208000, outflow: 175000, net: 33000 },
  { month: 'Nov', inflow: 232000, outflow: 185000, net: 47000 },
  { month: 'Dec', inflow: 255000, outflow: 200000, net: 55000 },
  { month: 'Jan', inflow: 242000, outflow: 195000, net: 47000 },
  { month: 'Feb', inflow: 273000, outflow: 241000, net: 32000 },
];

// ─── Account type distribution (for pie) ─────────────────────────────────────
export const ACCOUNT_TYPE_DISTRIBUTION = [
  { name: 'Assets',      value: 425000, color: '#10b981' },
  { name: 'Liabilities', value: 195000, color: '#ef4444' },
  { name: 'Equity',      value: 230000, color: '#6366f1' },
  { name: 'Income',      value: 285000, color: '#f59e0b' },
  { name: 'Expenses',    value: 198000, color: '#94a3b8' },
];

export const ACCOUNT_TYPE_COLORS: Record<string, string> = {
  Assets: '#10b981',
  Liabilities: '#ef4444',
  Equity: '#6366f1',
  Income: '#f59e0b',
  Expenses: '#94a3b8',
};
