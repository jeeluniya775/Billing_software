'use client';

import { useState } from 'react';
import { MOCK_ACCOUNTING_SUMMARY, MOCK_PL_DATA } from '@/lib/mock-accounting';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, TrendingUp, Scale, ArrowRightLeft, Receipt, Users, CreditCard } from 'lucide-react';

const REPORTS = [
  { id: 'pl', name: 'Profit & Loss', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'bs', name: 'Balance Sheet', icon: Scale, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { id: 'cf', name: 'Cash Flow Statement', icon: ArrowRightLeft, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-900/20' },
  { id: 'tax', name: 'Tax Summary', icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 'ar', name: 'AR Aging Report', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { id: 'ap', name: 'AP Aging Report', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
];

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export function FinancialReports() {
  const [activeReport, setActiveReport] = useState('pl');
  const [period, setPeriod] = useState('This Year');
  const [comparePrev, setComparePrev] = useState(false);
  const s = MOCK_ACCOUNTING_SUMMARY;

  return (
    <div className="space-y-5">
      {/* Report Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {REPORTS.map(r => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={() => setActiveReport(r.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${activeReport === r.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-emerald-300'}`}
            >
              <div className={`p-2 rounded-lg ${activeReport === r.id ? 'bg-emerald-100 dark:bg-emerald-900/40' : r.bg}`}>
                <Icon className={`h-5 w-5 ${r.color}`} />
              </div>
              <span className={`text-xs font-medium leading-tight ${activeReport === r.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-600 dark:text-neutral-400'}`}>{r.name}</span>
            </button>
          );
        })}
      </div>

      {/* Report Controls */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-3 items-center flex-wrap">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-9 w-[160px] text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['This Month', 'This Quarter', 'This Year', 'Last Year', 'Custom'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
            <input type="checkbox" className="rounded" checked={comparePrev} onChange={e => setComparePrev(e.target.checked)} />
            Compare previous period
          </label>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
            <Download className="h-3.5 w-3.5" /> PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
            <FileText className="h-3.5 w-3.5" /> Excel
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {REPORTS.find(r => r.id === activeReport)?.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">Period: {period}{comparePrev && ' vs Previous Year'}</p>
        </div>

        {/* P&L */}
        {activeReport === 'pl' && (
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Income</p>
              {[['Sales Revenue', s.grossRevenue * 0.877], ['Service Revenue', s.grossRevenue * 0.098], ['Other Income', s.grossRevenue * 0.025]].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-sm py-1 border-b border-neutral-100 dark:border-neutral-700/50">
                  <span className="text-gray-600 dark:text-gray-400">{k}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{fmt(v as number)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-1.5">
                <span className="font-semibold text-gray-900 dark:text-white">Total Revenue</span>
                <span className="font-bold text-emerald-600">{fmt(s.grossRevenue)}</span>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold uppercase text-red-500 tracking-wider">Expenses</p>
              {[['COGS', s.totalExpenses * 0.479], ['Salaries', s.totalExpenses * 0.263], ['Rent', s.totalExpenses * 0.091], ['Marketing', s.totalExpenses * 0.071], ['Other', s.totalExpenses * 0.096]].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-sm py-1 border-b border-neutral-100 dark:border-neutral-700/50">
                  <span className="text-gray-600 dark:text-gray-400">{k}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{fmt(v as number)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-1.5">
                <span className="font-semibold text-gray-900 dark:text-white">Total Expenses</span>
                <span className="font-bold text-red-600">{fmt(s.totalExpenses)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-600">
              <div className="flex justify-between text-base">
                <span className="font-bold text-gray-900 dark:text-white">Net Profit</span>
                <span className="text-xl font-extrabold text-indigo-600">{fmt(s.netProfit)}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Profit Margin: {((s.netProfit / s.grossRevenue) * 100).toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Balance Sheet */}
        {activeReport === 'bs' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-600 tracking-wider mb-3">Assets</p>
              {[['Cash & Equivalents', 48000], ['Accounts Receivable', 92000], ['Inventory', 35000], ['Fixed Assets', 180000], ['Other Assets', 70000]].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-sm py-1.5 border-b border-neutral-100 dark:border-neutral-700/50">
                  <span className="text-gray-600 dark:text-gray-400">{k}</span>
                  <span className="font-medium">{fmt(v as number)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-2 font-bold text-emerald-600 border-t border-emerald-200">
                <span>Total Assets</span><span>{fmt(s.totalAssets)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-red-500 tracking-wider mb-3">Liabilities & Equity</p>
              {[['Accounts Payable', 42000], ['Short-term Loans', 30000], ['Tax Payable', 12000], ['Long-term Debt', 100000], ['Share Capital', 150000], ['Retained Earnings', 80000]].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-sm py-1.5 border-b border-neutral-100 dark:border-neutral-700/50">
                  <span className="text-gray-600 dark:text-gray-400">{k}</span>
                  <span className="font-medium">{fmt(v as number)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-2 font-bold text-indigo-600 border-t border-indigo-200">
                <span>Total L + E</span><span>{fmt(s.totalLiabilities + s.equity)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Other reports placeholder */}
        {!['pl', 'bs'].includes(activeReport) && (
          <div className="p-6 flex flex-col items-center justify-center h-40 text-neutral-400">
            <FileText className="h-10 w-10 mb-3 opacity-40" />
            <p className="font-medium text-gray-600 dark:text-gray-400">{REPORTS.find(r => r.id === activeReport)?.name}</p>
            <p className="text-xs mt-1">Select period and click <span className="font-semibold">Excel</span> or <span className="font-semibold">PDF</span> to generate report</p>
          </div>
        )}
      </div>
    </div>
  );
}
