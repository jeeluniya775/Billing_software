import { api } from './api';
import { Sale, SalesSummaryKPIs, SaleStatus } from '@/types/sale';

export const salesService = {
  /**
   * GET /sales/invoices
   */
  getSales: async (params?: { status?: string, q?: string }): Promise<Sale[]> => {
    const query = new URLSearchParams();
    if (params?.q) query.append('search', params.q);
    
    const response = await api.get(`/sales/invoices?${query.toString()}`);
    return (response.data || []).map(mapInvoiceToSale);
  },

  /**
   * GET /sales/invoices/summary
   */
  getSummary: async (): Promise<SalesSummaryKPIs> => {
    const response = await api.get('/sales/invoices/summary');
    return response.data;
  },

  /**
   * POST /sales/invoices
   */
  createSale: async (saleData: any): Promise<Sale> => {
    const payload = mapSaleFormToInvoiceDto(saleData);
    const response = await api.post('/sales/invoices', payload);
    return mapInvoiceToSale(response.data);
  },

  /**
   * PATCH /sales/invoices/:id
   */
  updateStatus: async (id: string, status: string): Promise<boolean> => {
    await api.patch(`/sales/invoices/${id}`, { status });
    return true;
  },

  /**
   * GET /sales/analytics
   */
  getAnalytics: async (): Promise<any> => {
    const response = await api.get('/sales/invoices/analytics');
    return response.data;
  }
};

/**
 * Mappers
 */
function mapInvoiceToSale(invoice: any): Sale {
  return {
    id: invoice.id,
    invoiceNo: invoice.invoiceNo,
    customerId: invoice.customerId,
    customerName: invoice.customer?.name || 'Unknown',
    salesperson: 'Admin',
    amount: invoice.total || 0,
    paid: invoice.status === 'PAID' ? invoice.total : 0,
    due: invoice.status === 'PAID' ? 0 : invoice.total,
    status: mapBackendStatus(invoice.status),
    date: invoice.date,
    dueDate: invoice.dueDate,
    category: 'Sales',
    tags: [],
    notes: invoice.notes,
    discount: invoice.discount || 0,
    tax: invoice.taxTotal || 0,
    lineItems: (invoice.items || []).map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      total: item.total
    })),
    isRecurring: false,
  };
}

function mapBackendStatus(status: string): SaleStatus {
  switch (status) {
    case 'PAID': return 'Paid';
    case 'PARTIAL': return 'Partial';
    case 'OVERDUE': return 'Overdue';
    case 'DRAFT': return 'Draft';
    default: return 'Draft';
  }
}

function mapSaleFormToInvoiceDto(values: any) {
  // Line items amounts
  const items = (values.lineItems || []).map((item: any) => ({
    description: item.description,
    quantity: Number(item.quantity),
    rate: Number(item.rate),
    total: Number(item.quantity) * Number(item.rate),
  }));

  const subtotal = items.reduce((acc: number, curr: any) => acc + curr.total, 0);
  const taxTotal = (subtotal * (values.taxRate || 0)) / 100;
  const total = subtotal + taxTotal - (values.discount || 0);

  return {
    invoiceNo: `INV-${Date.now().toString().slice(-6)}`, // Auto-generate if not provided
    customerId: values.customerId,
    dueDate: values.dueDate,
    status: values.status?.toUpperCase() || 'DRAFT',
    currency: 'USD',
    subtotal,
    taxTotal,
    discount: values.discount || 0,
    total,
    notes: values.notes,
    items,
  };
}
