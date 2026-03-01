'use client';

import { useState, useEffect } from 'react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, AreaChart, 
  Area, PieChart, Pie, Cell 
} from 'recharts';
import { AssetSummary } from '@/types/asset';

interface AssetChartsProps {
  summary: AssetSummary;
  isLoading?: boolean;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export function AssetCharts({ summary, isLoading }: AssetChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[300px] bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Asset Value Trend */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Asset Value Trend</h3>
            <p className="text-[10px] text-neutral-500">Monthly growth and valuation</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-indigo-600" /> Total Valuation
          </div>
        </div>
        <div className="h-[250px] w-full min-h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.monthlyValueTrend}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorVal)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Category Distribution</h3>
          <p className="text-[10px] text-neutral-500">Asset count by classification</p>
        </div>
        <div className="h-[250px] w-full min-h-[250px] min-w-0 flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={summary.categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="category"
              >
                {summary.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingLeft: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Maintenance Cost Trend */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Maintenance Expenditure</h3>
            <p className="text-[10px] text-neutral-500">Monthly repair and routine check costs</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-emerald-600" /> Monthly Budget
          </div>
        </div>
        <div className="h-[250px] w-full min-h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.maintenanceCosts}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Depreciation Overview (Simplified Bar/Line) */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Depreciation Insights</h3>
          <p className="text-[10px] text-neutral-500">Comparing original vs current market value</p>
        </div>
        <div className="space-y-6">
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/50">
             <div className="flex justify-between items-baseline mb-2">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest">Total Depreciation</span>
                <span className="text-lg font-black text-rose-800 dark:text-rose-300">$125,400</span>
             </div>
             <div className="h-2 w-full bg-rose-200 dark:bg-rose-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full" style={{ width: '15%' }} />
             </div>
             <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-2 font-medium italic">~14.8% of total portfolio value lost over time</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest leading-none mb-1">Highest Dep.</p>
                <p className="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase leading-none">Vehicles</p>
                <p className="text-[11px] text-indigo-600/70 mt-3 font-bold">22.4% Annual</p>
             </div>
             <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest leading-none mb-1">Lowest Dep.</p>
                <p className="text-sm font-black text-emerald-900 dark:text-emerald-300 uppercase leading-none">Infrastructure</p>
                <p className="text-[11px] text-emerald-600/70 mt-3 font-bold">2.1% Annual</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
