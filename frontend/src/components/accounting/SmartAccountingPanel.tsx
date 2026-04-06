'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Lock, Unlock, Globe, RefreshCw, ShieldCheck, ClipboardList, UserCheck, BookLock, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { accountingService } from '@/services/accounting.service';
import { toast } from 'sonner';

export function SmartAccountingPanel() {
  const [fiscalYear, setFiscalYear] = useState('FY 2025-26');
  const [periodLocked, setPeriodLocked] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['accounting-settings'],
    queryFn: () => accountingService.getSettings(),
  });

  const { data: recurringEntries = [] } = useQuery({
    queryKey: ['accounting-recurring-entries'],
    queryFn: () => accountingService.getRecurringEntries(),
  });

  const { data: draftEntries, isLoading: draftsLoading } = useQuery({
    queryKey: ['accounting-journal-drafts'],
    queryFn: () => accountingService.getJournalEntries({ status: 'DRAFT', page: 1, limit: 20 }),
  });

  const { data: recentEntries, isLoading: recentLoading } = useQuery({
    queryKey: ['accounting-journal-recent'],
    queryFn: () => accountingService.getJournalEntries({ page: 1, limit: 10 }),
  });

  const postMutation = useMutation({
    mutationFn: (id: string) => accountingService.postJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-journal-drafts'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-journal-recent'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-trial-balance'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-pl-report'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-bs-report'] });
      toast.success('Journal entry approved and posted');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to approve entry'),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => accountingService.cancelJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-journal-drafts'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-journal-recent'] });
      toast.success('Journal entry rejected');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to reject entry'),
  });

  const saveSettingsMutation = useMutation({
    mutationFn: (payload: { fiscalYear?: string; baseCurrency?: string; periodLocked?: boolean }) => accountingService.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-settings'] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to save settings'),
  });

  const createRecurringMutation = useMutation({
    mutationFn: () =>
      accountingService.createRecurringEntry({
        title: 'Monthly Recurring Journal',
        description: 'Auto-generated recurring entry template',
        frequency: 'MONTHLY',
        dayOfMonth: 1,
        isActive: true,
        template: {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-recurring-entries'] });
      toast.success('Recurring entry template saved');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to create recurring entry'),
  });

  useEffect(() => {
    if (!settings) return;
    setFiscalYear(settings.fiscalYear || 'FY 2025-26');
    setCurrency(settings.baseCurrency || 'USD');
    setPeriodLocked(Boolean(settings.periodLocked));
  }, [settings]);

  const pendingApprovals = (draftEntries?.items || []).map((entry: any) => ({
    id: entry.id,
    entryNo: entry.reference || entry.id.slice(0, 8),
    desc: entry.description,
    amount: (entry.items || []).reduce((sum: number, item: any) => sum + (item.debit || 0), 0),
    by: 'Accounting Team',
    status: 'Pending approval',
  }));

  const auditLog = (recentEntries?.items || []).map((entry: any) => ({
    id: entry.id,
    action:
      entry.status === 'POSTED'
        ? `Entry posted (${entry.reference || entry.id.slice(0, 8)})`
        : entry.status === 'CANCELLED'
        ? `Entry cancelled (${entry.reference || entry.id.slice(0, 8)})`
        : `Draft created (${entry.reference || entry.id.slice(0, 8)})`,
    by: 'Accounting',
    at: new Date(entry.date).toLocaleString(),
    type: entry.status === 'POSTED' ? 'success' : entry.status === 'CANCELLED' ? 'warning' : 'info',
  }));

  const setActivePeriod = () => {
    saveSettingsMutation.mutate(
      { fiscalYear },
      {
        onSuccess: () => toast.success(`Active period set to ${fiscalYear}`),
      },
    );
  };

  const applyCurrency = () => {
    saveSettingsMutation.mutate(
      { baseCurrency: currency },
      {
        onSuccess: () => toast.success(`Base currency updated to ${currency}`),
      },
    );
  };

  const closeBooks = () => {
    saveSettingsMutation.mutate(
      { periodLocked: true },
      {
        onSuccess: () => {
          setPeriodLocked(true);
          toast.success(`Books closed for ${fiscalYear}`);
        },
      },
    );
  };

  const manageRecurringEntries = () => {
    createRecurringMutation.mutate();
  };

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
          <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-9 text-xs" onClick={setActivePeriod}>
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
            onClick={() => {
              const next = !periodLocked;
              saveSettingsMutation.mutate(
                { periodLocked: next },
                {
                  onSuccess: () => {
                    setPeriodLocked(next);
                    toast.success(next ? 'Period locked successfully' : 'Period unlocked successfully');
                  },
                },
              );
            }}
            disabled={saveSettingsMutation.isPending}
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
          <Button size="sm" className="w-full bg-sky-600 hover:bg-sky-700 text-white h-9 text-xs" onClick={applyCurrency}>
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
            <span className="ml-auto bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">{draftsLoading ? '...' : `${pendingApprovals.length} pending`}</span>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> All entries approved
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.entryNo} — {item.desc}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">By {item.by} · ${item.amount.toLocaleString()} · {item.status}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5"
                        onClick={() => {
                          if (periodLocked) {
                            toast.error('Period is locked. Unlock period to approve entries.');
                            return;
                          }
                          postMutation.mutate(item.id);
                        }}
                        disabled={periodLocked || postMutation.isPending || cancelMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-red-600 border-red-200 px-2.5"
                        onClick={() => cancelMutation.mutate(item.id)}
                        disabled={periodLocked || postMutation.isPending || cancelMutation.isPending}
                      >
                        Reject
                      </Button>
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
            {recentLoading ? (
              <div className="text-xs text-neutral-400">Loading recent activity...</div>
            ) : auditLog.length === 0 ? (
              <div className="text-xs text-neutral-400">No recent accounting activity.</div>
            ) : null}
            {auditLog.map((log) => (
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
          <Button size="sm" variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-9 text-xs" onClick={closeBooks}>
            <Lock className="mr-2 h-3.5 w-3.5" /> Close Books for {fiscalYear}
          </Button>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg"><RefreshCw className="h-4 w-4 text-teal-600" /></div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recurring Journal Entries</h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">Schedule journal entries to auto-post on a recurring basis (monthly depreciation, rent accruals, etc.).</p>
          <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white h-9 text-xs" onClick={manageRecurringEntries}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Manage Recurring Entries
          </Button>
          <p className="mt-2 text-[11px] text-neutral-400">Saved recurring templates: {recurringEntries.length}</p>
        </div>
      </div>
    </div>
  );
}
