'use client';

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface SalesByStatusPieProps {
  data: { name: string; value: number; color: string }[];
  isLoading?: boolean;
}

export function SalesByStatusPie({ data, isLoading }: SalesByStatusPieProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-6 h-[350px] animate-pulse">
        <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-4" />
        <div className="h-[250px] w-full bg-neutral-100 dark:bg-neutral-700/50 rounded-full scale-75" />
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales by Status</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Invoice count distribution.</p>
      </div>
      <div className="h-[280px] w-full relative min-h-[280px]">
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value} Invoices`, 'Count']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value: string) => (
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium ml-1 mr-4">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{total}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</span>
        </div>
      </div>
    </div>
  );
}
