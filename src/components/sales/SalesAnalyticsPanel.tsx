'use client';

import { MOCK_SALES_DATA } from '@/lib/mock-sales';
import { Award, UserCircle2 } from 'lucide-react';

export function SalesAnalyticsPanel() {
  // Compute Top Customers by Revenue
  const customerMap = new Map<string, number>();
  MOCK_SALES_DATA.forEach(sale => {
    customerMap.set(sale.customerName, (customerMap.get(sale.customerName) || 0) + sale.amount);
  });
  
  const topCustomers = Array.from(customerMap.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Compute Top Salespersons
  const salesRepMap = new Map<string, number>();
  MOCK_SALES_DATA.forEach(sale => {
    salesRepMap.set(sale.salesperson, (salesRepMap.get(sale.salesperson) || 0) + sale.amount);
  });

  const topSalesReps = Array.from(salesRepMap.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Analytics</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Top performers and key metrics.</p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Top Customers Segment */}
        <div>
          <h4 className="flex items-center text-sm font-semibold text-gray-900 dark:text-white mb-3">
            <Award className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
            Top 5 Customers
          </h4>
          <div className="space-y-3">
            {topCustomers.map((customer, idx) => (
              <div key={customer.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 text-center text-xs font-bold text-neutral-400">{idx + 1}</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{customer.name}</div>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(customer.total)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-700" />

        {/* Top Sales Reps Segment */}
        <div>
          <h4 className="flex items-center text-sm font-semibold text-gray-900 dark:text-white mb-3">
            <UserCircle2 className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Top Salespersons
          </h4>
          <div className="space-y-4">
            {topSalesReps.map((rep) => {
              // Calculate percentage of top seller for progress bar width
              const maxRepTotal = topSalesReps[0].total;
              const percentage = Math.max(10, Math.round((rep.total / maxRepTotal) * 100));

              return (
                <div key={rep.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{rep.name}</span>
                    <span className="font-semibold">{formatCurrency(rep.total)}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}
