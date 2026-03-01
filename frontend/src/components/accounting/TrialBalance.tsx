'use client';

import { useState } from 'react';
import { MOCK_TRIAL_BALANCE } from '@/lib/mock-accounting';
import { ACCOUNT_TYPE_COLORS } from '@/lib/mock-accounting';
import type { AccountType } from '@/types/accounting';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ACCOUNT_TYPES: AccountType[] = ['Assets', 'Liabilities', 'Equity', 'Income', 'Expenses'];

export function TrialBalance() {
  const [dateFilter, setDateFilter] = useState('2026-02-28');

  const totalDebit = MOCK_TRIAL_BALANCE.reduce((s, r) => s + r.debit, 0);
  const totalCredit = MOCK_TRIAL_BALANCE.reduce((s, r) => s + r.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 1;

  const byType = ACCOUNT_TYPES.map(type => ({
    type,
    rows: MOCK_TRIAL_BALANCE.filter(r => r.accountType === type),
    debit: MOCK_TRIAL_BALANCE.filter(r => r.accountType === type).reduce((s, r) => s + r.debit, 0),
    credit: MOCK_TRIAL_BALANCE.filter(r => r.accountType === type).reduce((s, r) => s + r.credit, 0),
  }));

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-3 items-center flex-wrap">
          <div>
            <label className="text-xs text-neutral-500 mb-1.5 block font-medium">As of Date</label>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="h-9 px-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-transparent dark:text-white" />
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
        <Button variant="outline" size="sm" className="gap-2 h-9">
          <Download className="h-3.5 w-3.5" /> Download
        </Button>
      </div>

      {/* Trial Balance Table */}
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
            {byType.map(({ type, rows, debit, credit }) => (
              <>
                {/* Type section header */}
                <tr key={`header-${type}`} className="bg-neutral-50/80 dark:bg-neutral-800/80 border-t border-neutral-200 dark:border-neutral-600">
                  <td colSpan={5} className="px-4 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCOUNT_TYPE_COLORS[type] }}>
                      {type}
                    </span>
                  </td>
                </tr>
                {rows.map(row => (
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
                ))}
                {/* Type subtotal */}
                <tr key={`sub-${type}`} className="bg-neutral-50 dark:bg-neutral-800/50">
                  <td colSpan={3} className="px-4 py-2 text-xs font-medium text-neutral-500 text-right">{type} Total</td>
                  <td className="px-4 py-2 text-right text-sm font-bold text-emerald-700">{debit > 0 ? `$${debit.toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-2 text-right text-sm font-bold text-red-600">{credit > 0 ? `$${credit.toLocaleString()}` : '—'}</td>
                </tr>
              </>
            ))}
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
    </div>
  );
}
