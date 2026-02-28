import { Sale, SalesSummaryKPIs } from '@/types/sale';

const MOCK_CUSTOMERS = [
  'Acme Corp', 'Globex Inc', 'Initech', 'Soylent Corp', 'Umbrella Corp', 
  'Stark Industries', 'Wayne Enterprises', 'Massive Dynamic'
];

const MOCK_SALESPERSONS = ['Alice Smith', 'Bob Johnson', 'Charlie Davis'];
const MOCK_CATEGORIES = ['Software License', 'Consulting', 'Hardware', 'Support Plan'];

const generateMockSales = (count: number): Sale[] => {
  const sales: Sale[] = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const amount = Math.floor(Math.random() * 9000) + 1000; // $1,000 - $10,000
    
    // Determine status & paid amounts
    const statusRoll = Math.random();
    let status: Sale['status'] = 'Paid';
    let paid = amount;
    let due = 0;

    if (statusRoll > 0.6 && statusRoll <= 0.8) {
      status = 'Partial';
      paid = Math.floor(amount * (Math.random() * 0.5 + 0.2)); // 20-70% paid
      due = amount - paid;
    } else if (statusRoll > 0.8 && statusRoll <= 0.95) {
      status = 'Overdue';
      paid = 0;
      due = amount;
    } else if (statusRoll > 0.95) {
      status = 'Draft';
      paid = 0;
      due = amount;
    }

    // Dates (Spread over last 3 months and next 1 month)
    const dateOffset = Math.floor(Math.random() * 120) - 90; // -90 to +30 days
    const date = new Date(now);
    date.setDate(date.getDate() + dateOffset);
    
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30); // Net 30

    // Ensure Overdue logic is correct based on dates
    if (status === 'Overdue' && dueDate > now) {
       dueDate.setDate(now.getDate() - (Math.floor(Math.random() * 10) + 1)); // Make it in the past
    } else if (status !== 'Overdue' && dueDate < now && status !== 'Paid') {
       status = 'Overdue';
    }

    const customer = MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)];

    sales.push({
      id: `sale-${i.toString().padStart(4, '0')}`,
      invoiceNo: `INV-2026-${(1000 + i).toString()}`,
      customerId: `cus-${customer.replace(/\s+/g, '').toLowerCase()}`,
      customerName: customer,
      salesperson: MOCK_SALESPERSONS[Math.floor(Math.random() * MOCK_SALESPERSONS.length)],
      amount,
      paid,
      due,
      status,
      date: date.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      category: MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)],
      tags: status === 'Overdue' ? ['Action Required'] : (amount > 5000 ? ['High Value'] : []),
      discount: Math.floor(Math.random() * 500),
      tax: amount * 0.1,
      lineItems: [
        {
          id: `item-${i}-1`,
          description: MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)],
          quantity: 1,
          rate: amount,
          total: amount
        }
      ],
      isRecurring: Math.random() > 0.8
    });
  }
  
  // Sort descending by date
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const MOCK_SALES_DATA: Sale[] = generateMockSales(55);

// Pre-calculate KPIs
export const MOCK_SALES_SUMMARY: SalesSummaryKPIs = {
  totalSalesToday: MOCK_SALES_DATA.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
  totalSalesThisMonth: MOCK_SALES_DATA.filter(s => s.date.startsWith(new Date().toISOString().slice(0, 7))).length,
  totalRevenue: MOCK_SALES_DATA.reduce((acc, curr) => acc + curr.amount, 0),
  paidAmount: MOCK_SALES_DATA.reduce((acc, curr) => acc + curr.paid, 0),
  unpaidAmount: MOCK_SALES_DATA.reduce((acc, curr) => curr.status !== 'Draft' ? acc + curr.due : acc, 0),
  overdueAmount: MOCK_SALES_DATA.reduce((acc, curr) => curr.status === 'Overdue' ? acc + curr.due : acc, 0),
  salesGrowthPercent: 12.5 // Mock static value
};

// Data for charts
export const MOCK_REVENUE_TREND = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 59000 },
  { name: 'Jun', revenue: 68000 },
  { name: 'Jul', revenue: 75000 },
];

export const MOCK_SALES_BY_STATUS = [
  { name: 'Paid', value: MOCK_SALES_DATA.filter(s => s.status === 'Paid').length, color: '#10b981' }, // Emerald 500
  { name: 'Partial', value: MOCK_SALES_DATA.filter(s => s.status === 'Partial').length, color: '#f59e0b' }, // Amber 500
  { name: 'Overdue', value: MOCK_SALES_DATA.filter(s => s.status === 'Overdue').length, color: '#ef4444' }, // Red 500
  { name: 'Draft', value: MOCK_SALES_DATA.filter(s => s.status === 'Draft').length, color: '#6b7280' }, // Gray 500
];
