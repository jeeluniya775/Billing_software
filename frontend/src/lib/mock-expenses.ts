import type { Expense, ExpenseSummary, ExpenseAnalytics } from '@/types/expense';

export const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', expenseNo: 'EXP-001', vendor: 'AWS Cloud Services', category: 'Software & Subscriptions', description: 'Monthly EC2 & S3 bill', amount: 1200, tax: 216, totalAmount: 1416, paymentMethod: 'Bank Transfer', status: 'Paid', date: '2026-02-01', isRecurring: true, recurringPeriod: 'Monthly', isReimbursable: false, tags: ['Cloud', 'Infrastructure'], attachmentUrl: '/receipts/aws.pdf' },
  { id: 'e2', expenseNo: 'EXP-002', vendor: 'WeWork Office', category: 'Rent', description: 'Feb office space rental', amount: 3500, tax: 630, totalAmount: 4130, paymentMethod: 'Bank Transfer', status: 'Paid', date: '2026-02-01', isRecurring: true, recurringPeriod: 'Monthly', isReimbursable: false, tags: ['Office', 'Fixed'] },
  { id: 'e3', expenseNo: 'EXP-003', vendor: 'Emirates Airlines', category: 'Travel', description: 'Client visit to Dubai', amount: 850, tax: 0, totalAmount: 850, paymentMethod: 'Credit Card', status: 'Reimbursable', date: '2026-02-05', isRecurring: false, isReimbursable: true, reimbursedBy: 'Sales Dept', tags: ['Client', 'International'], notes: 'Awaiting manager approval' },
  { id: 'e4', expenseNo: 'EXP-004', vendor: 'Figma Inc.', category: 'Software & Subscriptions', description: 'Design team annual plan', amount: 450, tax: 81, totalAmount: 531, paymentMethod: 'Credit Card', status: 'Paid', date: '2026-02-08', isRecurring: true, recurringPeriod: 'Yearly', isReimbursable: false, tags: ['Design', 'Tools'] },
  { id: 'e5', expenseNo: 'EXP-005', vendor: 'Staples India', category: 'Office Supplies', description: 'A4 paper, toner, pens', amount: 220, tax: 39.6, totalAmount: 259.6, paymentMethod: 'Cash', status: 'Paid', date: '2026-02-10', isRecurring: false, isReimbursable: false, tags: ['Supplies'] },
  { id: 'e6', expenseNo: 'EXP-006', vendor: 'Google Ads', category: 'Marketing', description: 'CPC Campaign Feb', amount: 2200, tax: 396, totalAmount: 2596, paymentMethod: 'Credit Card', status: 'Paid', date: '2026-02-12', isRecurring: true, recurringPeriod: 'Monthly', isReimbursable: false, tags: ['Ads', 'Marketing'] },
  { id: 'e7', expenseNo: 'EXP-007', vendor: 'BSES Electricity', category: 'Utilities', description: 'Office electricity bill', amount: 340, tax: 0, totalAmount: 340, paymentMethod: 'UPI', status: 'Pending', date: '2026-02-14', dueDate: '2026-03-01', isRecurring: true, recurringPeriod: 'Monthly', isReimbursable: false, tags: ['Utility'] },
  { id: 'e8', expenseNo: 'EXP-008', vendor: 'Zomato Business', category: 'Meals & Entertainment', description: 'Team lunch – product launch', amount: 580, tax: 104.4, totalAmount: 684.4, paymentMethod: 'UPI', status: 'Paid', date: '2026-02-15', isRecurring: false, isReimbursable: true, reimbursedBy: 'HR', tags: ['Team', 'Entertainment'] },
  { id: 'e9', expenseNo: 'EXP-009', vendor: 'Dell Technologies', category: 'Equipment', description: '2x Monitor Upgrade', amount: 1400, tax: 252, totalAmount: 1652, paymentMethod: 'Bank Transfer', status: 'Pending', date: '2026-02-17', dueDate: '2026-03-05', isRecurring: false, isReimbursable: false, tags: ['Hardware'] },
  { id: 'e10', expenseNo: 'EXP-010', vendor: 'Slack Technologies', category: 'Software & Subscriptions', description: 'Slack Pro – 20 seats', amount: 200, tax: 36, totalAmount: 236, paymentMethod: 'Credit Card', status: 'Paid', date: '2026-02-01', isRecurring: true, recurringPeriod: 'Monthly', isReimbursable: false, tags: ['Communication'] },
  { id: 'e11', expenseNo: 'EXP-011', vendor: 'Makemytrip', category: 'Travel', description: 'Bangalore conference hotel', amount: 720, tax: 129.6, totalAmount: 849.6, paymentMethod: 'Credit Card', status: 'Reimbursable', date: '2026-02-19', isRecurring: false, isReimbursable: true, reimbursedBy: 'Tech Dept', tags: ['Conference', 'Hotel'] },
  { id: 'e12', expenseNo: 'EXP-012', vendor: 'Urban Company', category: 'Office Supplies', description: 'Office deep cleaning service', amount: 150, tax: 27, totalAmount: 177, paymentMethod: 'UPI', status: 'Paid', date: '2026-02-20', isRecurring: false, isReimbursable: false, tags: ['Cleaning'] },
  { id: 'e13', expenseNo: 'EXP-013', vendor: 'HubSpot', category: 'Software & Subscriptions', description: 'CRM subscription – Starter', amount: 360, tax: 64.8, totalAmount: 424.8, paymentMethod: 'Credit Card', status: 'Paid', date: '2026-02-05', isRecurring: true, recurringPeriod: 'Monthly', isReimbursable: false, tags: ['CRM', 'Sales'] },
  { id: 'e14', expenseNo: 'EXP-014', vendor: 'Digital Ocean', category: 'Software & Subscriptions', description: 'App server hosting', amount: 80, tax: 14.4, totalAmount: 94.4, paymentMethod: 'Credit Card', status: 'Paid', date: '2026-02-01', isRecurring: true, recurringPeriod: 'Monthly', isReimbursable: false, tags: ['Hosting'] },
  { id: 'e15', expenseNo: 'EXP-015', vendor: 'Café Coffee Day', category: 'Meals & Entertainment', description: 'Client meeting coffee', amount: 45, tax: 8.1, totalAmount: 53.1, paymentMethod: 'Cash', status: 'Paid', date: '2026-02-22', isRecurring: false, isReimbursable: true, reimbursedBy: 'Sales Rep', tags: ['Client'] },
  { id: 'e16', expenseNo: 'EXP-016', vendor: 'LinkedIn Learning', category: 'Software & Subscriptions', description: 'Team training subscription', amount: 240, tax: 43.2, totalAmount: 283.2, paymentMethod: 'Bank Transfer', status: 'Pending', date: '2026-02-23', dueDate: '2026-03-10', isRecurring: true, recurringPeriod: 'Monthly', isReimbursable: false, tags: ['Training', 'HR'] },
  { id: 'e17', expenseNo: 'EXP-017', vendor: 'Tata Power', category: 'Utilities', description: 'Data center electricity Q1', amount: 900, tax: 0, totalAmount: 900, paymentMethod: 'Cheque', status: 'Pending', date: '2026-02-24', dueDate: '2026-03-15', isRecurring: false, isReimbursable: false, tags: ['Utility', 'DC'] },
  { id: 'e18', expenseNo: 'EXP-018', vendor: 'Internshala', category: 'Marketing', description: 'Internship postings', amount: 120, tax: 21.6, totalAmount: 141.6, paymentMethod: 'UPI', status: 'Paid', date: '2026-02-25', isRecurring: false, isReimbursable: false, tags: ['HR', 'Hiring'] },
  { id: 'e19', expenseNo: 'EXP-019', vendor: 'Misc Vendor', category: 'Miscellaneous', description: 'Courier charges and misc', amount: 60, tax: 10.8, totalAmount: 70.8, paymentMethod: 'Cash', status: 'Paid', date: '2026-02-26', isRecurring: false, isReimbursable: false, tags: [] },
  { id: 'e20', expenseNo: 'EXP-020', vendor: 'Dropbox Business', category: 'Software & Subscriptions', description: 'File storage team plan', amount: 180, tax: 32.4, totalAmount: 212.4, paymentMethod: 'Credit Card', status: 'Paid', date: '2026-02-01', isRecurring: true, recurringPeriod: 'Monthly', isReimbursable: false, tags: ['Storage'] },
];

export const MOCK_EXPENSE_SUMMARY: ExpenseSummary = {
  totalToday: 342,
  totalThisMonth: 16428.9,
  totalLastMonth: 14280,
  growthPercent: 15.04,
  pendingAmount: 2481,
  recurringMonthly: 6210,
  categoryBreakdown: [
    { category: 'Software & Subscriptions', amount: 3497.8, percent: 21.3 },
    { category: 'Rent', amount: 4130, percent: 25.1 },
    { category: 'Travel', amount: 1699.6, percent: 10.3 },
    { category: 'Marketing', amount: 2737.6, percent: 16.7 },
    { category: 'Utilities', amount: 1240, percent: 7.5 },
    { category: 'Others', amount: 3124, percent: 19.1 },
  ],
};

export const MOCK_EXPENSE_ANALYTICS: ExpenseAnalytics = {
  monthlyTrend: [
    { name: 'Sep', amount: 10200, budget: 15000 },
    { name: 'Oct', amount: 11400, budget: 15000 },
    { name: 'Nov', amount: 13500, budget: 15000 },
    { name: 'Dec', amount: 17200, budget: 15000 },
    { name: 'Jan', amount: 14280, budget: 15000 },
    { name: 'Feb', amount: 16429, budget: 15000 },
  ],
  topVendors: [
    { vendor: 'WeWork Office', amount: 4130, count: 1 },
    { vendor: 'AWS Cloud Services', amount: 2832, count: 2 },
    { vendor: 'Google Ads', amount: 2596, count: 1 },
    { vendor: 'HubSpot', amount: 849.6, count: 2 },
    { vendor: 'Figma Inc.', amount: 531, count: 1 },
  ],
  paymentMethodRatio: [
    { method: 'Bank Transfer', value: 9262 },
    { method: 'Credit Card', value: 5049.8 },
    { method: 'UPI', value: 1177.5 },
    { method: 'Cash', value: 383 },
    { method: 'Cheque', value: 900 },
  ],
  categoryDistribution: [
    { name: 'Rent', value: 25, color: '#10b981' },
    { name: 'Software', value: 21, color: '#6366f1' },
    { name: 'Marketing', value: 17, color: '#f59e0b' },
    { name: 'Travel', value: 10, color: '#0ea5e9' },
    { name: 'Utilities', value: 8, color: '#8b5cf6' },
    { name: 'Others', value: 19, color: '#94a3b8' },
  ],
  cashVsBank: [
    { name: 'Bank/Card', value: 14311.8 },
    { name: 'Cash/UPI', value: 2117.1 },
  ],
};

export const EXPENSE_BUDGET_MONTHLY = 15000;

export const EXPENSE_CATEGORIES = [
  'Travel',
  'Office Supplies',
  'Software & Subscriptions',
  'Marketing',
  'Salaries',
  'Rent',
  'Utilities',
  'Meals & Entertainment',
  'Equipment',
  'Miscellaneous',
];
