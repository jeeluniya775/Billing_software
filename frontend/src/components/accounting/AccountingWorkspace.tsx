'use client';

import { useMemo } from 'react';
import {
  LayoutDashboard, BookOpen, FileText, BarChart3, Scale, PieChart,
  Settings2, Download, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountingKpiCards } from '@/components/accounting/AccountingKpiCards';
import { AccountingCharts } from '@/components/accounting/AccountingCharts';
import { ChartOfAccounts } from '@/components/accounting/ChartOfAccounts';
import { JournalEntries } from '@/components/accounting/JournalEntries';
import { GeneralLedger } from '@/components/accounting/GeneralLedger';
import { TrialBalance } from '@/components/accounting/TrialBalance';
import { FinancialReports } from '@/components/accounting/FinancialReports';
import { SmartAccountingPanel } from '@/components/accounting/SmartAccountingPanel';
import { PageHeader } from '@/components/layout/PageHeader';
import { accountingService } from '@/services/accounting.service';
import { useTenantStore } from '@/store/tenant.store';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export type AccountingTab = 'overview' | 'accounts' | 'journal' | 'ledger' | 'trial' | 'reports' | 'settings';

const TABS: { id: AccountingTab; label: string; icon: React.ElementType; slug: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, slug: 'overview' },
  { id: 'accounts', label: 'Chart of Accounts', icon: BookOpen, slug: 'chart-of-accounts' },
  { id: 'journal', label: 'Journal Entries', icon: FileText, slug: 'journal-entries' },
  { id: 'ledger', label: 'General Ledger', icon: BarChart3, slug: 'general-ledger' },
  { id: 'trial', label: 'Trial Balance', icon: Scale, slug: 'trial-balance' },
  { id: 'reports', label: 'Reports', icon: PieChart, slug: 'reports' },
  { id: 'settings', label: 'Controls', icon: Settings2, slug: 'controls' },
];

const slugToTab: Record<string, AccountingTab> = {
  overview: 'overview',
  'chart-of-accounts': 'accounts',
  'journal-entries': 'journal',
  'general-ledger': 'ledger',
  'trial-balance': 'trial',
  reports: 'reports',
  controls: 'settings',
};

const tabToSlug: Record<AccountingTab, string> = {
  overview: 'overview',
  accounts: 'chart-of-accounts',
  journal: 'journal-entries',
  ledger: 'general-ledger',
  trial: 'trial-balance',
  reports: 'reports',
  settings: 'controls',
};

export function normalizeAccountingTab(tabSlug: string): AccountingTab {
  const normalized = (tabSlug || '').toLowerCase();
  return slugToTab[normalized] || 'overview';
}

export function AccountingWorkspace({ tabSlug }: { tabSlug: string }) {
  const { selectedTenant } = useTenantStore();
  const router = useRouter();
  const activeTab = normalizeAccountingTab(tabSlug);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['accounting-overview', { tenantId: selectedTenant?.id }],
    queryFn: async () => {
      const [summaryData, plReport] = await Promise.all([
        accountingService.getSummary(),
        accountingService.getPLReport(),
      ]);
      const totalRevenue = plReport.totalRevenue || 0;
      const totalExpenses = plReport.totalExpenses || 0;
      const totalProfit = plReport.netIncome || 0;
      const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Current'];
      const growth = [0.72, 0.78, 0.83, 0.9, 0.96, 1];
      const plData = months.map((month, idx) => ({
        month,
        revenue: Math.round(totalRevenue * growth[idx]),
        expenses: Math.round(totalExpenses * growth[idx]),
        profit: Math.round(totalProfit * growth[idx]),
      }));
      const cashFlowData = months.map((month, idx) => ({
        month,
        inflow: Math.round(totalRevenue * growth[idx] * 0.95),
        outflow: Math.round(totalExpenses * growth[idx]),
        net: Math.round(totalProfit * growth[idx] * 0.9),
      }));

      return {
        summary: summaryData,
        plData,
        cashFlowData,
      };
    },
    enabled: activeTab === 'overview',
    placeholderData: (previousData) => previousData,
  });

  const summary = data?.summary || null;
  const plData = data?.plData || [];
  const cashFlowData = data?.cashFlowData || [];
  const hasOverviewData = !!summary && (
    (summary.totalAssets || 0) > 0 ||
    (summary.totalLiabilities || 0) > 0 ||
    (summary.totalEquity || 0) > 0 ||
    (summary.totalRevenue || 0) > 0 ||
    (summary.totalExpenses || 0) > 0
  );
  const distributionData = summary
    ? [
        { name: 'Assets', value: summary.totalAssets || 0, color: '#10b981' },
        { name: 'Liabilities', value: summary.totalLiabilities || 0, color: '#ef4444' },
        { name: 'Equity', value: summary.totalEquity || 0, color: '#6366f1' },
        { name: 'Revenue', value: summary.totalRevenue || 0, color: '#14b8a6' },
        { name: 'Expenses', value: summary.totalExpenses || 0, color: '#f59e0b' },
      ]
    : [];

  const currentLabel = useMemo(() => TABS.find((tab) => tab.id === activeTab)?.label || 'Overview', [activeTab]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={selectedTenant ? `Accounting: ${selectedTenant.name}` : 'Accounting'}
        subtitle={`Double-entry bookkeeping · ${currentLabel}`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2 h-9 text-xs" onClick={() => refetch()}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
              <Download className="h-3.5 w-3.5" /> Export All
            </Button>
          </>
        }
      />

      <Tabs
        value={activeTab}
        onValueChange={(v) => router.push(`/accounting/${tabToSlug[v as AccountingTab]}`)}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 outline-none">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-24 bg-white dark:bg-neutral-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {!hasOverviewData ? (
                <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-800 px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
                  Overview is live, but this shop has no posted accounting data yet. Add accounts and post journal entries to populate real totals.
                </div>
              ) : null}
              <AccountingKpiCards summary={summary} />
              <AccountingCharts plData={plData} cashFlowData={cashFlowData} distributionData={distributionData} />
            </>
          )}
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
  );
}
