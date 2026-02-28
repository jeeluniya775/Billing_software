'use client';

import {
  ComposedChart, Bar, Line, AreaChart, Area, PieChart, Pie, Cell, Legend,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import type { PLData, CashFlowData } from '@/types/accounting';
import { ACCOUNT_TYPE_DISTRIBUTION } from '@/lib/mock-accounting';

interface AccountingChartsProps {
  plData: PLData[];
  cashFlowData: CashFlowData[];
}

const fmtK = (v: number) => `$${(v / 1000).toFixed(0)}k`;

export function AccountingCharts({ plData, cashFlowData }: AccountingChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* P&L Trend */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Profit & Loss Trend</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">6-month Revenue vs Expenses vs Net Profit</p>
        </div>
        <div className="h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <ComposedChart data={plData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={fmtK} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, '']} />
              <Legend iconSize={8} iconType="circle" />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="expenses" name="Expenses" fill="#94a3b8" radius={[3, 3, 0, 0]} barSize={14} />
              <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Cash Flow</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Monthly inflow, outflow, and net cash</p>
        </div>
        <div className="h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <AreaChart data={cashFlowData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={fmtK} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, '']} />
              <Legend iconSize={8} iconType="circle" />
              <Area type="monotone" dataKey="inflow" name="Cash Inflow" stroke="#10b981" fill="url(#inflowGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="outflow" name="Cash Outflow" stroke="#ef4444" fill="url(#outflowGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="net" name="Net Cash" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense vs Revenue Bar */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Expense vs Revenue</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Monthly comparison view</p>
        </div>
        <div className="h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <ComposedChart data={plData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={fmtK} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, '']} />
              <Legend iconSize={8} iconType="circle" />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[3, 3, 0, 0]} barSize={20} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={20} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Account Type Distribution Pie */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Account Type Distribution</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Balance split across account categories</p>
        </div>
        <div className="h-[250px] min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <PieChart>
              <Pie
                data={ACCOUNT_TYPE_DISTRIBUTION}
                cx="50%"
                cy="42%"
                outerRadius={85}
                innerRadius={55}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {ACCOUNT_TYPE_DISTRIBUTION.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, '']} />
              <Legend verticalAlign="bottom" height={32} iconSize={8} iconType="circle" formatter={(v) => <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
