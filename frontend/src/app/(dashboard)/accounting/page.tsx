'use client';

import { useEffect, useState } from 'react';
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
import { AccountingSummary } from '@/types/accounting';
import { useTenantStore } from '@/store/tenant.store';

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

import { useQuery } from '@tanstack/react-query';

export default function AccountingPage() {
  const { selectedTenant } = useTenantStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const { data, isLoading } = useQuery({
    queryKey: ['accounting-overview', { tenantId: selectedTenant?.id }],
    queryFn: async () => {
      const [summaryData, plReport] = await Promise.all([
        accountingService.getSummary(),
        accountingService.getPLReport(),
      ]);
      return {
        summary: summaryData as any,
        plData: plReport,
      };
    },
    enabled: activeTab === 'overview',
    placeholderData: (previousData) => previousData,
  });

  const summary = data?.summary || null;
  const plData = data?.plData || null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={selectedTenant ? `Accounting: ${selectedTenant.name}` : "Accounting"}
        subtitle="Double-entry bookkeeping · FY 2025-26"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2 h-9 text-xs" onClick={() => setActiveTab(activeTab)}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
              <Download className="h-3.5 w-3.5" /> Export All
            </Button>
          </>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            {TABS.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 outline-none">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-24 bg-white dark:bg-neutral-800 rounded-xl animate-pulse" />)}
            </div>
          ) : summary ? (
            <>
              <AccountingKpiCards summary={summary} />
              <AccountingCharts plData={plData} cashFlowData={[]} />
            </>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-neutral-800 rounded-xl border border-dashed border-neutral-200">
              <p className="text-neutral-500">No accounting data available. Start by adding accounts.</p>
            </div>
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
