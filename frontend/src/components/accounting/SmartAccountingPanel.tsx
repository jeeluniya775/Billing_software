'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Lock, Unlock, Globe, RefreshCw, ShieldCheck, ClipboardList, UserCheck, BookLock, AlertCircle, CheckCircle2,
} from 'lucide-react';

const AUDIT_LOG = [
  { id: 1, action: 'JE-010 Reversed', by: 'Admin', at: '2026-02-25 14:32', type: 'warning' },
  { id: 2, action: 'Account "Prepaid Expenses" updated', by: 'Accountant', at: '2026-02-23 10:15', type: 'info' },
  { id: 3, action: 'Trial Balance exported PDF', by: 'CFO', at: '2026-02-22 09:00', type: 'info' },
  { id: 4, action: 'JE-004 posted – $26,000', by: 'HR-Finance', at: '2026-02-08 11:45', type: 'success' },
  { id: 5, action: 'Fiscal year 2025 locked', by: 'Admin', at: '2026-01-01 00:01', type: 'warning' },
];

const PENDING_APPROVALS = [
  { id: 'j7', entryNo: 'JE-007', desc: 'Prepaid insurance adjustment', amount: 3600, by: 'Accountant', status: 'Pending CFO' },
];

export function SmartAccountingPanel() {
  const [fiscalYear, setFiscalYear] = useState('FY 2025-26');
  const [periodLocked, setPeriodLocked] = useState(false);
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="space-y-6">
      {/* Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Fiscal Year */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"><BookLock className="h-4 w-4 text-indigo-600" /></div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Fiscal Year</h3>
          </div>
          <Select value={fiscalYear} onValueChange={setFiscalYear}>
            <SelectTrigger className="h-9 text-sm mb-3"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="FY 2023-24">FY 2023-24</SelectItem>
              <SelectItem value="FY 2024-25">FY 2024-25</SelectItem>
              <SelectItem value="FY 2025-26">FY 2025-26 (Current)</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-9 text-xs">
            Set Active Period
          </Button>
        </div>

        {/* Period Lock */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ${periodLocked ? 'bg-red-50 dark:bg-red-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
              {periodLocked ? <Lock className="h-4 w-4 text-red-600" /> : <Unlock className="h-4 w-4 text-emerald-600" />}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Period Lock</h3>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${periodLocked ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
              {periodLocked ? 'LOCKED' : 'OPEN'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
            {periodLocked ? 'No new journal entries can be posted to this period.' : 'Entries can be posted to the current period.'}
          </p>
          <Button
            size="sm"
            onClick={() => setPeriodLocked(p => !p)}
            className={`w-full h-9 text-xs ${periodLocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
          >
            {periodLocked ? 'Unlock Period' : 'Lock Period'}
          </Button>
        </div>

        {/* Multi-currency */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg"><Globe className="h-4 w-4 text-sky-600" /></div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Base Currency</h3>
          </div>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-9 text-sm mb-3"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">🇺🇸 USD – US Dollar</SelectItem>
              <SelectItem value="INR">🇮🇳 INR – Indian Rupee</SelectItem>
              <SelectItem value="EUR">🇪🇺 EUR – Euro</SelectItem>
              <SelectItem value="GBP">🇬🇧 GBP – British Pound</SelectItem>
              <SelectItem value="AED">🇦🇪 AED – UAE Dirham</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="w-full bg-sky-600 hover:bg-sky-700 text-white h-9 text-xs">
            Apply Currency
          </Button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Approval Queue */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg"><UserCheck className="h-4 w-4 text-amber-600" /></div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Approval Queue</h3>
            <span className="ml-auto bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">{PENDING_APPROVALS.length} pending</span>
          </div>

          {PENDING_APPROVALS.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> All entries approved
            </div>
          ) : (
            <div className="space-y-3">
              {PENDING_APPROVALS.map(item => (
                <div key={item.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.entryNo} — {item.desc}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">By {item.by} · ${item.amount.toLocaleString()} · {item.status}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5">Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 px-2.5">Reject</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Trail */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg"><ClipboardList className="h-4 w-4 text-purple-600" /></div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Audit Trail</h3>
          </div>
          <div className="space-y-2.5">
            {AUDIT_LOG.map(log => (
              <div key={log.id} className="flex items-start gap-2.5 text-xs">
                {log.type === 'warning' ? <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" /> :
                 log.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> :
                 <ShieldCheck className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />}
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">{log.action}</p>
                  <p className="text-neutral-400">{log.by} · {log.at}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Close Books + Recurring Journal UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"><BookLock className="h-4 w-4 text-red-600" /></div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Close Books</h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">Finalise the accounting period and prevent further edits. This action requires CFO approval.</p>
          <Button size="sm" variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-9 text-xs">
            <Lock className="mr-2 h-3.5 w-3.5" /> Close Books for {fiscalYear}
          </Button>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg"><RefreshCw className="h-4 w-4 text-teal-600" /></div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recurring Journal Entries</h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">Schedule journal entries to auto-post on a recurring basis (monthly depreciation, rent accruals, etc.).</p>
          <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white h-9 text-xs">
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Manage Recurring Entries
          </Button>
        </div>
      </div>
    </div>
  );
}
