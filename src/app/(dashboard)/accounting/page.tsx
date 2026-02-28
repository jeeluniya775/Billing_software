'use client';

import { useState } from 'react';
import {
  Calculator, BookOpen, FileText, BarChart3, Scale, PieChart,
  Settings2, Download, RefreshCw, LayoutDashboard, Sparkles
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
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
  return (
    <ProtectedRoute>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-indigo-950 dark:bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Calculator className="h-6 w-6" />
               </div>
               <h1 className="text-4xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Accounting</h1>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] italic ml-1.5 flex items-center gap-2">
               Double-entry bookkeeping · FY 2025-26 · Period: Open <Sparkles className="h-3 w-3 text-indigo-400" />
            </p>
          </div>
          
          <div className="flex gap-3">
             <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
                <RefreshCw className="h-4 w-4" /> Sync
             </Button>
             <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 shadow-xl px-6 transition-all active:scale-95">
                <Download className="h-4 w-4" /> Export All
             </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-10">
          <div className="border-b border-neutral-100 dark:border-neutral-800 sticky top-0 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl z-30 -mx-4 md:-mx-8 px-4 md:px-8">
            <TabsList className="h-16 bg-transparent gap-8 p-0">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className="h-full border-b-4 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent rounded-none px-2 font-black uppercase tracking-widest text-[10px] text-neutral-400 data-[state=active]:text-indigo-950 dark:data-[state=active]:text-white transition-all gap-2"
                  >
                    <Icon className="h-4 w-4 mb-0.5" /> {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-10 outline-none">
            <AccountingKpiCards summary={MOCK_ACCOUNTING_SUMMARY} />
            <AccountingCharts plData={MOCK_PL_DATA} cashFlowData={MOCK_CASH_FLOW_DATA} />
          </TabsContent>

          <TabsContent value="accounts" className="outline-none">
            <ChartOfAccounts />
          </TabsContent>

          <TabsContent value="journal" className="outline-none">
            <JournalEntries />
          </TabsContent>

          <TabsContent value="ledger" className="outline-none">
            <GeneralLedger />
          </TabsContent>

          <TabsContent value="trial" className="outline-none">
            <TrialBalance />
          </TabsContent>

          <TabsContent value="reports" className="outline-none">
            <FinancialReports />
          </TabsContent>

          <TabsContent value="settings" className="outline-none">
            <SmartAccountingPanel />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
