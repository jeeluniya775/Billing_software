'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { ExpenseAnalytics } from '@/types/expense';

interface ExpenseCategoryChartProps {
  data: ExpenseAnalytics['categoryDistribution'];
  isLoading?: boolean;
}

export function ExpenseCategoryChart({ data, isLoading }: ExpenseCategoryChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-6 h-[350px] animate-pulse">
        <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-700 rounded mb-4" />
        <div className="h-[260px] w-full bg-neutral-100 dark:bg-neutral-700/50 rounded-full scale-75" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Category Distribution</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Spending split by expense category</p>
      </div>
      <div className="h-[280px] w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontWeight: 600, color: '#111827' }}
              formatter={(value: unknown) => [`${value}%`, 'Share']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
