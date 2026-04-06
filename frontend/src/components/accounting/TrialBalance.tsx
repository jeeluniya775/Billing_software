'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AccountType } from '@/types/accounting';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { accountingService } from '@/services/accounting.service';
import { toast } from 'sonner';

const ACCOUNT_TYPES: AccountType[] = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];
const ACCOUNT_TYPE_COLORS: Record<AccountType, string> = {
  ASSET: '#10b981',
  LIABILITY: '#ef4444',
  EQUITY: '#6366f1',
  REVENUE: '#14b8a6',
  EXPENSE: '#f59e0b',
};

export function TrialBalance() {
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().slice(0, 10));
  const { data: rows = [], isLoading, refetch } = useQuery({
    queryKey: ['accounting-trial-balance', { dateFilter }],
    queryFn: () => accountingService.getTrialBalance({ to: dateFilter }),
  });

  const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 1;

  const byType = ACCOUNT_TYPES.map(type => ({
    type,
    rows: rows.filter((r) => r.accountType === type),
    debit: rows.filter((r) => r.accountType === type).reduce((s, r) => s + r.debit, 0),
    credit: rows.filter((r) => r.accountType === type).reduce((s, r) => s + r.credit, 0),
  }));

  const hasRows = rows.length > 0;

  const quickSetDate = (mode: 'today' | 'monthStart' | 'quarterStart' | 'yearStart') => {
    const date = new Date();
    if (mode === 'monthStart') date.setDate(1);
    if (mode === 'quarterStart') date.setMonth(Math.floor(date.getMonth() / 3) * 3, 1);
    if (mode === 'yearStart') date.setMonth(0, 1);
    setDateFilter(date.toISOString().slice(0, 10));
  };

  const downloadCsv = () => {
    if (!hasRows) {
      toast.error('No trial balance rows to export');
      return;
    }
    const header = ['Account Code', 'Account Name', 'Type', 'Debit', 'Credit'];
    const csvRows = rows.map((row) => [
      row.accountCode,
      `"${row.accountName.replace(/"/g, '""')}"`,
      row.accountType,
      row.debit.toFixed(2),
      row.credit.toFixed(2),
    ]);
    const footer = ['TOTALS', '', '', totalDebit.toFixed(2), totalCredit.toFixed(2)];
    const csv = [header.join(','), ...csvRows.map((r) => r.join(',')), footer.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trial_balance_${dateFilter}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-3 items-center flex-wrap">
          <div>
            <label className="text-xs text-neutral-500 mb-1.5 block font-medium">As of Date</label>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="h-9 px-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-transparent dark:text-white" />
          </div>
          <div className="pt-5 flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => quickSetDate('today')}>Today</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => quickSetDate('monthStart')}>Month Start</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => quickSetDate('yearStart')}>Year Start</Button>
          </div>
          <div className="pt-5">
            {isBalanced ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="h-4 w-4" /> Balanced
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full">
                <AlertTriangle className="h-4 w-4" /> Imbalanced by ${Math.abs(totalDebit - totalCredit).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 h-9" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2 h-9" onClick={downloadCsv}>
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-12 text-center text-sm text-neutral-400">
          Loading trial balance...
        </div>
      ) : !hasRows ? (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-12 text-center text-sm text-neutral-400">
          No posted journal data available for the selected date.
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Account Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Debit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Credit</th>
              </tr>
            </thead>
            <tbody>
              {byType.flatMap(({ type, rows, debit, credit }) => ([
                  <tr key={`type-label-${type}`} className="bg-neutral-50/80 dark:bg-neutral-800/80 border-t border-neutral-200 dark:border-neutral-600">
                    <td colSpan={5} className="px-4 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCOUNT_TYPE_COLORS[type] }}>
                        {type}
                      </span>
                    </td>
                  </tr>,
                  ...rows.map(row => (
                    <tr key={row.accountId} className="border-b border-neutral-100 dark:border-neutral-700/50 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-xs text-neutral-400">{row.accountCode}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300">{row.accountName}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: ACCOUNT_TYPE_COLORS[row.accountType] + '20', color: ACCOUNT_TYPE_COLORS[row.accountType] }}>
                          {row.accountType}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-emerald-600">
                        {row.debit > 0 ? `$${row.debit.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-red-500">
                        {row.credit > 0 ? `$${row.credit.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  )),
                  <tr key={`type-total-${type}`} className="bg-neutral-50 dark:bg-neutral-800/50">
                    <td colSpan={3} className="px-4 py-2 text-xs font-medium text-neutral-500 text-right">{type} Total</td>
                    <td className="px-4 py-2 text-right text-sm font-bold text-emerald-700">{debit > 0 ? `$${debit.toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-2 text-right text-sm font-bold text-red-600">{credit > 0 ? `$${credit.toLocaleString()}` : '—'}</td>
                  </tr>,
                ]))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neutral-200 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-900/60">
                <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">TOTALS</td>
                <td className={`px-4 py-3 text-right text-base font-bold ${isBalanced ? 'text-emerald-700' : 'text-red-600'}`}>${totalDebit.toLocaleString()}</td>
                <td className={`px-4 py-3 text-right text-base font-bold ${isBalanced ? 'text-emerald-700' : 'text-red-600'}`}>${totalCredit.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
