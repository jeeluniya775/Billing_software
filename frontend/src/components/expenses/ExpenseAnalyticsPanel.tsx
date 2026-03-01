'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';
import type { ExpenseAnalytics } from '@/types/expense';

interface ExpenseAnalyticsPanelProps {
  analytics: ExpenseAnalytics;
  isLoading?: boolean;
}

const PAYMENT_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#0ea5e9', '#8b5cf6'];

export function ExpenseAnalyticsPanel({ analytics, isLoading }: ExpenseAnalyticsPanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-6 h-[280px] animate-pulse">
            <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-4" />
            <div className="h-[200px] bg-neutral-100 dark:bg-neutral-700/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Vendors Bar Chart */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Top Vendors by Spend</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">Highest expense contributors</p>
        <div className="h-[220px] min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={220}>
            <BarChart
              data={analytics.topVendors}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => `$${v / 1000}k`} />
              <YAxis type="category" dataKey="vendor" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} width={110} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: unknown) => [`$${Number(value).toLocaleString()}`, 'Spend']}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={18}>
                {analytics.topVendors.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#10b981' : i === 1 ? '#6366f1' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Method Ratio */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Payment Method Split</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">How expenses are paid</p>
        <div className="h-[220px] min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={220}>
            <PieChart>
              <Pie
                data={analytics.paymentMethodRatio}
                dataKey="value"
                nameKey="method"
                cx="50%"
                cy="45%"
                outerRadius={75}
                paddingAngle={2}
                stroke="none"
              >
                {analytics.paymentMethodRatio.map((_, i) => (
                  <Cell key={i} fill={PAYMENT_COLORS[i % PAYMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: unknown) => [`$${Number(value).toLocaleString()}`, 'Amount']}
              />
              <Legend verticalAlign="bottom" height={30} iconSize={8} iconType="circle" formatter={(value) => <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
