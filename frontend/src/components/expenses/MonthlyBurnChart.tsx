'use client';

import {
  Bar,
  BarChart,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { ExpenseAnalytics } from '@/types/expense';
import { EXPENSE_BUDGET_MONTHLY } from '@/lib/mock-expenses';

interface MonthlyBurnChartProps {
  data: ExpenseAnalytics['monthlyTrend'];
  isLoading?: boolean;
}

export function MonthlyBurnChart({ data, isLoading }: MonthlyBurnChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-6 h-[350px] animate-pulse">
        <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-700 rounded mb-4" />
        <div className="h-[260px] w-full bg-neutral-100 dark:bg-neutral-700/50 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Monthly Burn Rate</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Monthly spend vs budget (limit: ${(EXPENSE_BUDGET_MONTHLY / 1000).toFixed(0)}k)
        </p>
      </div>
      <div className="h-[280px] w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-neutral-700" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: unknown, name?: string) => [`$${Number(value).toLocaleString()}`, name === 'amount' ? 'Expenses' : 'Budget']}
            />
            <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{value === 'amount' ? 'Monthly Expenses' : 'Budget Limit'}</span>} />
            <ReferenceLine y={EXPENSE_BUDGET_MONTHLY} stroke="#ef4444" strokeDasharray="6 3" />
            <Bar dataKey="amount" name="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
            <Line type="monotone" dataKey="budget" name="budget" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
