export type CustomerTag = 'Retail' | 'Wholesale' | 'VIP' | 'High Risk' | 'Corporate' | 'Distributor';

export type PaymentTerms = 'Net 7' | 'Net 15' | 'Net 30' | 'Due on Receipt' | 'Custom';

export type CustomerStatus = 'Active' | 'Inactive' | 'On Hold' | 'Blocked';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

export interface CustomerDocument {
  id: string;
  name: string;
  type: 'KYC' | 'Contract' | 'Other' | 'Tax Form';
  size: string; // e.g., '2.4 MB'
  uploadedAt: string;
  url: string;
}

export interface LedgerTransaction {
  id: string;
  date: string;
  type: 'Invoice' | 'Payment' | 'Credit Note' | 'Refund' | 'Fee';
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string; // Primary email
  phone: string; // Primary phone
  website?: string;
  
  // Tax & Legal
  taxNumber?: string; // GST/VAT/EIN
  registrationNumber?: string;
  
  // Contacts
  contacts: ContactPerson[];
  
  // Addresses
  billingAddress: Address;
  shippingAddress: Address;
  sameAsBilling: boolean;
  
  // Financial Control
  currency: string;
  paymentTerms: PaymentTerms;
  creditLimit: number;
  currentBalance: number;
  
  // Aging (amounts in specific buckets)
  aging: {
    current: number;
    days30: number;
    days60: number;
    days90: number;
    over90: number;
  };
  
  // Metrics & Behavior
  paymentBehaviorScore: number; // 0-100
  latePaymentInterestRate: number; // percentage
  status: CustomerStatus;
  
  // Metadata
  tags: CustomerTag[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  documents?: CustomerDocument[];
  ledger?: LedgerTransaction[];
}
