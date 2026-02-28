'use client';

import { useState } from 'react';
import {
  LayoutDashboard, BookOpen, FileText, BarChart3, Scale, PieChart,
  Settings2, Download, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountingKpiCards } from '@/components/accounting/AccountingKpiCards';
import { AccountingCharts } from '@/components/accounting/AccountingCharts';
import { ChartOfAccounts } from '@/components/accounting/ChartOfAccounts';
import { JournalEntries } from '@/components/accounting/JournalEntries';
import { GeneralLedger } from '@/components/accounting/GeneralLedger';
import { TrialBalance } from '@/components/accounting/TrialBalance';
import { FinancialReports } from '@/components/accounting/FinancialReports';
import { SmartAccountingPanel } from '@/components/accounting/SmartAccountingPanel';
import { MOCK_ACCOUNTING_SUMMARY, MOCK_PL_DATA, MOCK_CASH_FLOW_DATA } from '@/lib/mock-accounting';

type Tab = 'overview' | 'accounts' | 'journal' | 'ledger' | 'trial' | 'reports' | 'settings';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview',           icon: LayoutDashboard },
  { id: 'accounts', label: 'Chart of Accounts',  icon: BookOpen },
  { id: 'journal',  label: 'Journal Entries',    icon: FileText },
  { id: 'ledger',   label: 'General Ledger',     icon: BarChart3 },
  { id: 'trial',    label: 'Trial Balance',      icon: Scale },
  { id: 'reports',  label: 'Reports',            icon: PieChart },
  { id: 'settings', label: 'Controls',           icon: Settings2 },
];

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 px-4 md:px-6 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Accounting</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Double-entry bookkeeping · FY 2025-26 · Period: Open
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Sync
          </Button>
          <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
            <Download className="h-3.5 w-3.5" /> Export All
          </Button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                active
                  ? 'bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 shadow-sm border border-neutral-200 dark:border-neutral-700'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <AccountingKpiCards summary={MOCK_ACCOUNTING_SUMMARY} />
            <AccountingCharts plData={MOCK_PL_DATA} cashFlowData={MOCK_CASH_FLOW_DATA} />
          </div>
        )}

        {activeTab === 'accounts' && <ChartOfAccounts />}

        {activeTab === 'journal' && <JournalEntries />}

        {activeTab === 'ledger' && <GeneralLedger />}

        {activeTab === 'trial' && <TrialBalance />}

        {activeTab === 'reports' && <FinancialReports />}

        {activeTab === 'settings' && <SmartAccountingPanel />}
      </div>
    </div>
  );
}
