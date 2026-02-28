import { MOCK_SALES_DATA, MOCK_SALES_SUMMARY, MOCK_REVENUE_TREND, MOCK_SALES_BY_STATUS } from '@/lib/mock-sales';
import { Sale, SalesSummaryKPIs } from '@/types/sale';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const salesService = {
  /**
   * GET /api/sales
   * Returns paginated sales data, with optional status/date filters
   */
  getSales: async (params?: { status?: string, q?: string }): Promise<Sale[]> => {
    await delay(600);
    let data = [...MOCK_SALES_DATA];
    
    if (params?.status && params.status !== 'All') {
      data = data.filter(s => s.status === params.status);
    }
    
    if (params?.q) {
      const q = params.q.toLowerCase();
      data = data.filter(s => 
        s.customerName.toLowerCase().includes(q) || 
        s.invoiceNo.toLowerCase().includes(q)
      );
    }
    return data;
  },

  /**
   * GET /api/sales/summary
   * Returns core KPI metrics for the dashboard
   */
  getSummary: async (): Promise<SalesSummaryKPIs> => {
    await delay(400);
    return MOCK_SALES_SUMMARY;
  },

  /**
   * GET /api/sales/analytics
   * Returns charts and trends data
   */
  getAnalytics: async () => {
    await delay(500);
    return {
      revenueTrend: MOCK_REVENUE_TREND,
      salesByStatus: MOCK_SALES_BY_STATUS,
    };
  },

  /**
   * POST /api/sales
   * Quick add a new sale
   */
  createSale: async (saleData: Partial<Sale>): Promise<Sale> => {
    await delay(800);
    const newSale: Sale = {
      ...saleData,
      id: `sale-${Math.floor(Math.random() * 10000)}`,
      invoiceNo: `INV-2026-${Math.floor(Math.random() * 9000) + 1000}`,
      status: saleData.status || 'Draft',
    } as Sale;
    
    // In a real app we'd mutate the DB here.
    return newSale;
  },

  /**
   * PUT /api/sales/:id/status
   * Update the status of an existing sale
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateStatus: async (_id: string, _status: Sale['status']): Promise<boolean> => {
    await delay(500);
    return true; // Mock success
  }
};
