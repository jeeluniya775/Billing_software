'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { mockData } from '@/lib/mock-data';

const COLORS = ['#059669', '#0ea5e9', '#6366f1', '#f59e0b'];

export function ExpensePieChart() {
  return (
    <div className="h-[300px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <PieChart>
          <Pie
            data={mockData.expensePie}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {mockData.expensePie.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: unknown) => `$${value}`}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
