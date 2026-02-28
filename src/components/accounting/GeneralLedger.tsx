'use client';

import { useState } from 'react';
import { MOCK_ACCOUNTS, MOCK_LEDGER_ENTRIES } from '@/lib/mock-accounting';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function GeneralLedger() {
  const [selectedAccountId, setSelectedAccountId] = useState('a4');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const selectedAccount = MOCK_ACCOUNTS.find(a => a.id === selectedAccountId);
  const entries = (MOCK_LEDGER_ENTRIES[selectedAccountId] || []).filter(e => {
    return (!dateFrom || e.date >= dateFrom) && (!dateTo || e.date <= dateTo);
  });

  const leafAccounts = MOCK_ACCOUNTS.filter(a => !a.isHeader);

  return (
    <div className="space-y-4">
      {/* Account Selector */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 flex flex-col md:flex-row gap-3 md:items-end justify-between">
        <div className="flex gap-3 flex-wrap items-end">
          <div>
            <label className="text-xs text-neutral-500 mb-1.5 block font-medium">Account</label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="h-9 w-[260px] text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {leafAccounts.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.code} — {a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1.5 block font-medium">From</label>
            <Input type="date" className="h-9 text-sm w-[140px]" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1.5 block font-medium">To</label>
            <Input type="date" className="h-9 text-sm w-[140px]" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-9">
          <Download className="h-3.5 w-3.5" /> Export Ledger
        </Button>
      </div>

      {/* Account Info */}
      {selectedAccount && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Account Name', value: selectedAccount.name },
            { label: 'Account Code', value: selectedAccount.code },
            { label: 'Type', value: selectedAccount.type },
            { label: 'Current Balance', value: `$${selectedAccount.balance.toLocaleString()}` },
          ].map(item => (
            <div key={item.label} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-4">
              <p className="text-xs text-neutral-500 mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-700">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">Entry No</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Debit</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Credit</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">Running Balance</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr><td colSpan={6} className="h-32 text-center text-neutral-400 text-sm">No ledger entries found for the selected account and date range.</td></tr>
              ) : entries.map((entry, i) => (
                <tr key={entry.id} className={`border-b border-neutral-100 dark:border-neutral-700/50 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition-colors ${i % 2 === 0 ? '' : 'bg-neutral-50/30 dark:bg-neutral-800/30'}`}>
                  <td className="px-4 py-2.5 text-xs text-neutral-500 whitespace-nowrap">{entry.date}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{entry.entryNo}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300">{entry.description}</td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    {entry.debit > 0 ? (
                      <span className="flex items-center justify-end gap-1 text-emerald-600 font-semibold">
                        <ArrowUpRight className="h-3 w-3" /> ${entry.debit.toLocaleString()}
                      </span>
                    ) : <span className="text-neutral-300">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    {entry.credit > 0 ? (
                      <span className="flex items-center justify-end gap-1 text-red-500 font-semibold">
                        <ArrowDownRight className="h-3 w-3" /> ${entry.credit.toLocaleString()}
                      </span>
                    ) : <span className="text-neutral-300">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    ${entry.runningBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
