import { Customer, LedgerTransaction } from '@/types/customer';

const generateLedger = (): LedgerTransaction[] => {
  let bal = 0;
  return [
    { id: 'TRX-001', date: '2023-01-15', type: 'Invoice', reference: 'INV-2023-001', description: 'Initial Setup Fee', debit: 500, credit: 0, balance: (bal += 500) },
    { id: 'TRX-002', date: '2023-02-10', type: 'Payment', reference: 'PAY-8821', description: 'Wire Transfer', debit: 0, credit: 500, balance: (bal -= 500) },
    { id: 'TRX-003', date: '2023-03-05', type: 'Invoice', reference: 'INV-2023-089', description: 'Monthly Retainer', debit: 1200, credit: 0, balance: (bal += 1200) },
    { id: 'TRX-004', date: '2023-04-01', type: 'Invoice', reference: 'INV-2023-142', description: 'Ad-hoc Consulting', debit: 450, credit: 0, balance: (bal += 450) },
    { id: 'TRX-005', date: '2023-04-15', type: 'Payment', reference: 'PAY-9012', description: 'Credit Card', debit: 0, credit: 1200, balance: (bal -= 1200) },
    { id: 'TRX-006', date: '2023-05-01', type: 'Invoice', reference: 'INV-2023-201', description: 'Monthly Retainer', debit: 1200, credit: 0, balance: (bal += 1200) },
    { id: 'TRX-007', date: '2023-06-10', type: 'Credit Note', reference: 'CN-2023-05', description: 'Service Discount', debit: 0, credit: 150, balance: (bal -= 150) },
    // Adjust final transaction to match current balance if needed
  ].reverse() as LedgerTransaction[]; // Newest first
};

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Acme Corp',
    company: 'Acme Corporation Ltd.',
    email: 'billing@acme.example.com',
    phone: '+1 (555) 123-4567',
    website: 'https://acme.example.com',
    taxNumber: 'GST-987654321',
    registrationNumber: 'REG-12398LLC',
    status: 'Active',
    tags: ['VIP', 'Corporate'],
    currency: 'USD',
    paymentTerms: 'Net 30',
    creditLimit: 50000,
    currentBalance: 12500.50,
    paymentBehaviorScore: 92,
    latePaymentInterestRate: 1.5,
    aging: {
      current: 12500.50,
      days30: 0,
      days60: 0,
      days90: 0,
      over90: 0,
    },
    contacts: [
      { id: 'ct-1', name: 'John Doe', email: 'john@acme.example.com', phone: '+1 555-111-2222', role: 'Purchasing Manager', isPrimary: true },
      { id: 'ct-2', name: 'Jane Smith', email: 'ap@acme.example.com', phone: '+1 555-333-4444', role: 'Accounts Payable', isPrimary: false },
    ],
    billingAddress: {
      street: '123 Acme Way, Suite 400',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    shippingAddress: {
      street: 'Warehouse B, 45 Industrial Blvd',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10002',
      country: 'USA'
    },
    sameAsBilling: false,
    notes: 'Premium enterprise customer since 2021. Requires purchase orders for all invoices over $5,000.',
    createdAt: '2021-03-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    documents: [
      { id: 'doc-1', name: 'MSA_Acme_2021.pdf', type: 'Contract', size: '2.4 MB', uploadedAt: '2021-03-16T09:00:00Z', url: '#' },
      { id: 'doc-2', name: 'W9_Form_2024.pdf', type: 'Tax Form', size: '1.1 MB', uploadedAt: '2024-01-05T11:20:00Z', url: '#' },
    ],
    ledger: generateLedger(),
  },
  {
    id: 'CUST-002',
    name: 'GlobalTech Solutions',
    company: 'GlobalTech LLC',
    email: 'finance@globaltech.example.com',
    phone: '+1 (415) 555-0198',
    taxNumber: 'EIN-45-7890123',
    status: 'Blocked',
    tags: ['High Risk', 'Wholesale'],
    currency: 'USD',
    paymentTerms: 'Due on Receipt',
    creditLimit: 10000,
    currentBalance: 14250.00, // Over limit
    paymentBehaviorScore: 35,
    latePaymentInterestRate: 2.0,
    aging: {
      current: 0,
      days30: 2000,
      days60: 4250,
      days90: 5000,
      over90: 3000,
    },
    contacts: [
      { id: 'ct-3', name: 'Michael Chen', email: 'm.chen@globaltech.example.com', phone: '+1 415-555-0199', role: 'Director', isPrimary: true },
    ],
    billingAddress: {
      street: '789 Tech Parkway',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    shippingAddress: {
      street: '789 Tech Parkway',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    sameAsBilling: true,
    notes: 'Account blocked due to severe payment delays and exceeding credit limit. Sent to collections on 2024-02-01.',
    createdAt: '2022-08-11T08:15:00Z',
    updatedAt: '2024-02-05T09:00:00Z',
    documents: [
      { id: 'doc-3', name: 'Credit_Application.pdf', type: 'KYC', size: '1.5 MB', uploadedAt: '2022-08-10T14:00:00Z', url: '#' },
    ],
    ledger: generateLedger(),
  },
  {
    id: 'CUST-003',
    name: 'Sarah Jenkins',
    company: 'Sarah J. Consulting',
    email: 'sarah@sjconsulting.example.com',
    phone: '+44 20 7123 4567',
    taxNumber: 'GB123456789',
    status: 'Active',
    tags: ['Retail'],
    currency: 'GBP',
    paymentTerms: 'Net 15',
    creditLimit: 2500,
    currentBalance: 450.00,
    paymentBehaviorScore: 98,
    latePaymentInterestRate: 1.0,
    aging: {
      current: 450,
      days30: 0,
      days60: 0,
      days90: 0,
      over90: 0,
    },
    contacts: [
      { id: 'ct-4', name: 'Sarah Jenkins', email: 'sarah@sjconsulting.example.com', phone: '+44 7700 900123', role: 'Owner', isPrimary: true },
    ],
    billingAddress: {
      street: '45 Oxford St',
      city: 'London',
      state: 'Greater London',
      zipCode: 'W1D 2DZ',
      country: 'UK'
    },
    shippingAddress: {
      street: '45 Oxford St',
      city: 'London',
      state: 'Greater London',
      zipCode: 'W1D 2DZ',
      country: 'UK'
    },
    sameAsBilling: true,
    notes: 'Always pays early.',
    createdAt: '2023-11-20T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
    ledger: generateLedger(),
  },
  {
    id: 'CUST-004',
    name: 'Nexus Dynamics',
    company: 'Nexus Dynamics Group',
    email: 'accounts@nexus.example.com',
    phone: '+1 (512) 555-8899',
    status: 'On Hold',
    tags: ['Corporate', 'Distributor'],
    currency: 'USD',
    paymentTerms: 'Net 30',
    creditLimit: 150000,
    currentBalance: 120500.00,
    paymentBehaviorScore: 65,
    latePaymentInterestRate: 1.5,
    aging: {
      current: 80000,
      days30: 40500,
      days60: 0,
      days90: 0,
      over90: 0,
    },
    contacts: [
      { id: 'ct-5', name: 'David Kim', email: 'dkim@nexus.example.com', phone: '+1 512-555-8898', role: 'VP Finance', isPrimary: true },
    ],
    billingAddress: {
      street: '9900 Innovation Dr',
      city: 'Austin',
      state: 'TX',
      zipCode: '78728',
      country: 'USA'
    },
    shippingAddress: {
      street: '9900 Innovation Dr',
      city: 'Austin',
      state: 'TX',
      zipCode: '78728',
      country: 'USA'
    },
    sameAsBilling: true,
    createdAt: '2021-06-14T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
  }
];
