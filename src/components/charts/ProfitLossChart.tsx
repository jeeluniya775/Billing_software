'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { mockData } from '@/lib/mock-data';

export function ProfitLossChart() {
  return (
    <div className="h-[300px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <LineChart data={mockData.profitLoss}>
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line 
            type="monotone" 
            name="Profit"
            dataKey="profit" 
            stroke="#059669" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#059669', strokeWidth: 0 }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            name="Loss"
            dataKey="loss" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
