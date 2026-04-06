'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, Scale, RefreshCw } from 'lucide-react';
import { accountingService } from '@/services/accounting.service';
import { toast } from 'sonner';

const REPORTS = [
  { id: 'pl', name: 'Profit & Loss', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'bs', name: 'Balance Sheet', icon: Scale, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
];

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

export function FinancialReports() {
  const [activeReport, setActiveReport] = useState('pl');
  const [period, setPeriod] = useState('This Year');
  const [comparePrev, setComparePrev] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const now = new Date();
  const toDate = new Date(now);
  const fromDate = new Date(now);
  if (period === 'This Month') fromDate.setDate(1);
  else if (period === 'This Quarter') fromDate.setMonth(Math.floor(fromDate.getMonth() / 3) * 3, 1);
  else if (period === 'This Year') fromDate.setMonth(0, 1);
  else if (period === 'Last Year') {
    fromDate.setFullYear(fromDate.getFullYear() - 1, 0, 1);
    toDate.setFullYear(toDate.getFullYear() - 1, 11, 31);
  }

  const from = period === 'Custom' ? customFrom : toIsoDate(fromDate);
  const to = period === 'Custom' ? customTo : toIsoDate(toDate);

  const previousFromDate = new Date(fromDate);
  const previousToDate = new Date(toDate);
  if (period === 'This Month') {
    previousFromDate.setMonth(previousFromDate.getMonth() - 1, 1);
    previousToDate.setMonth(previousToDate.getMonth() - 1, 0);
  } else if (period === 'This Quarter') {
    previousFromDate.setMonth(previousFromDate.getMonth() - 3, 1);
    previousToDate.setMonth(previousToDate.getMonth() - 3);
  } else if (period === 'This Year') {
    previousFromDate.setFullYear(previousFromDate.getFullYear() - 1, 0, 1);
    previousToDate.setFullYear(previousToDate.getFullYear() - 1, 11, 31);
  } else if (period === 'Last Year') {
    previousFromDate.setFullYear(previousFromDate.getFullYear() - 1, 0, 1);
    previousToDate.setFullYear(previousToDate.getFullYear() - 1, 11, 31);
  }

  const previousFrom = toIsoDate(previousFromDate);
  const previousTo = toIsoDate(previousToDate);
  const canQuery = Boolean(from && to);

  const { data: pl, isLoading: plLoading, refetch: refetchPl } = useQuery({
    queryKey: ['accounting-pl-report', { from, to }],
    queryFn: () => accountingService.getPLReport({ from, to }),
    enabled: canQuery,
  });
  const { data: bs, isLoading: bsLoading, refetch: refetchBs } = useQuery({
    queryKey: ['accounting-bs-report', { from, to }],
    queryFn: () => accountingService.getBalanceSheet({ from, to }),
    enabled: canQuery,
  });

  const { data: prevPl } = useQuery({
    queryKey: ['accounting-pl-report-prev', { previousFrom, previousTo }],
    queryFn: () => accountingService.getPLReport({ from: previousFrom, to: previousTo }),
    enabled: comparePrev && period !== 'Custom',
  });
  const { data: prevBs } = useQuery({
    queryKey: ['accounting-bs-report-prev', { previousFrom, previousTo }],
    queryFn: () => accountingService.getBalanceSheet({ from: previousFrom, to: previousTo }),
    enabled: comparePrev && period !== 'Custom',
  });

  const isLoading = activeReport === 'pl' ? plLoading : bsLoading;
  const hasContent = activeReport === 'pl'
    ? Boolean((pl?.revenue?.length || 0) + (pl?.expenses?.length || 0))
    : Boolean((bs?.assets?.length || 0) + (bs?.liabilities?.length || 0) + (bs?.equity?.length || 0));

  const refreshActiveReport = () => {
    if (activeReport === 'pl') refetchPl();
    else refetchBs();
  };

  const exportCsv = () => {
    if (!canQuery) {
      toast.error('Select a valid date range first');
      return;
    }

    let content = '';
    let fileName = '';
    if (activeReport === 'pl') {
      if (!pl) {
        toast.error('No Profit & Loss data to export');
        return;
      }
      fileName = `profit_loss_${from}_${to}.csv`;
      const revenueRows = (pl.revenue || []).map((item: { name: string; amount: number }) => [`Revenue`, item.name, item.amount.toFixed(2)].join(','));
      const expenseRows = (pl.expenses || []).map((item: { name: string; amount: number }) => [`Expense`, item.name, item.amount.toFixed(2)].join(','));
      content = [
        'Section,Account,Amount',
        ...revenueRows,
        `Total Revenue,,${(pl.totalRevenue || 0).toFixed(2)}`,
        ...expenseRows,
        `Total Expenses,,${(pl.totalExpenses || 0).toFixed(2)}`,
        `Net Income,,${(pl.netIncome || 0).toFixed(2)}`,
      ].join('\n');
    } else {
      if (!bs) {
        toast.error('No Balance Sheet data to export');
        return;
      }
      fileName = `balance_sheet_${from}_${to}.csv`;
      const assetRows = (bs.assets || []).map((item: { name: string; amount: number }) => [`Asset`, item.name, item.amount.toFixed(2)].join(','));
      const liabilityRows = (bs.liabilities || []).map((item: { name: string; amount: number }) => [`Liability`, item.name, item.amount.toFixed(2)].join(','));
      const equityRows = (bs.equity || []).map((item: { name: string; amount: number }) => [`Equity`, item.name, item.amount.toFixed(2)].join(','));
      content = [
        'Section,Account,Amount',
        ...assetRows,
        `Total Assets,,${(bs.totalAssets || 0).toFixed(2)}`,
        ...liabilityRows,
        `Total Liabilities,,${(bs.totalLiabilities || 0).toFixed(2)}`,
        ...equityRows,
        `Total Equity,,${(bs.totalEquity || 0).toFixed(2)}`,
      ].join('\n');
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCustomRange = period !== 'Custom' || (Boolean(customFrom) && Boolean(customTo) && customFrom <= customTo);

  return (
    <div className="space-y-5">
      {/* Report Selector */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-3">
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
          {period === 'Custom' && (
            <>
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="h-9 px-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-transparent dark:text-white" />
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="h-9 px-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-transparent dark:text-white" />
            </>
          )}
          <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
            <input type="checkbox" className="rounded" checked={comparePrev} onChange={e => setComparePrev(e.target.checked)} />
            Compare previous period
          </label>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 h-9 text-xs" onClick={refreshActiveReport} disabled={!validCustomRange || !canQuery}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2 h-9 text-xs" onClick={exportCsv} disabled={!validCustomRange || !canQuery}>
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {REPORTS.find(r => r.id === activeReport)?.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Period: {period} ({from || '---'} to {to || '---'}){comparePrev && period !== 'Custom' && ` vs ${previousFrom} to ${previousTo}`}
          </p>
        </div>

        {!validCustomRange ? (
          <div className="p-8 text-sm text-red-500">Custom date range is invalid. Please select valid From/To dates.</div>
        ) : isLoading ? (
          <div className="p-8 text-sm text-neutral-400">Loading report data...</div>
        ) : !hasContent ? (
          <div className="p-8 text-sm text-neutral-400">No posted accounting data found for this period.</div>
        ) : activeReport === 'pl' ? (
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Income</p>
              {(pl?.revenue || []).map((item: any) => (
                <div key={item.name as string} className="flex justify-between text-sm py-1 border-b border-neutral-100 dark:border-neutral-700/50">
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{fmt(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-1.5">
                <span className="font-semibold text-gray-900 dark:text-white">Total Revenue</span>
                <span className="font-bold text-emerald-600">{fmt(pl?.totalRevenue || 0)}</span>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold uppercase text-red-500 tracking-wider">Expenses</p>
              {(pl?.expenses || []).map((item: any) => (
                <div key={item.name as string} className="flex justify-between text-sm py-1 border-b border-neutral-100 dark:border-neutral-700/50">
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{fmt(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-1.5">
                <span className="font-semibold text-gray-900 dark:text-white">Total Expenses</span>
                <span className="font-bold text-red-600">{fmt(pl?.totalExpenses || 0)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-600">
              <div className="flex justify-between text-base">
                <span className="font-bold text-gray-900 dark:text-white">Net Profit</span>
                <span className="text-xl font-extrabold text-indigo-600">{fmt(pl?.netIncome || 0)}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Profit Margin: {pl?.totalRevenue ? (((pl.netIncome / pl.totalRevenue) * 100).toFixed(1)) : '0.0'}%</p>
              {comparePrev && period !== 'Custom' && (
                <p className="text-xs text-neutral-500 mt-1">
                  Previous Net Income: <span className="font-semibold">{fmt(prevPl?.netIncome || 0)}</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-600 tracking-wider mb-3">Assets</p>
              {(bs?.assets || []).map((item: any) => (
                <div key={item.name as string} className="flex justify-between text-sm py-1.5 border-b border-neutral-100 dark:border-neutral-700/50">
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  <span className="font-medium">{fmt(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-2 font-bold text-emerald-600 border-t border-emerald-200">
                <span>Total Assets</span><span>{fmt(bs?.totalAssets || 0)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-red-500 tracking-wider mb-3">Liabilities & Equity</p>
              {[...(bs?.liabilities || []), ...(bs?.equity || [])].map((item: any) => (
                <div key={item.name as string} className="flex justify-between text-sm py-1.5 border-b border-neutral-100 dark:border-neutral-700/50">
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  <span className="font-medium">{fmt(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-2 font-bold text-indigo-600 border-t border-indigo-200">
                <span>Total L + E</span><span>{fmt((bs?.totalLiabilities || 0) + (bs?.totalEquity || 0))}</span>
              </div>
              {comparePrev && period !== 'Custom' && (
                <p className="text-xs text-neutral-500 mt-2">
                  Previous Total L + E: <span className="font-semibold">{fmt((prevBs?.totalLiabilities || 0) + (prevBs?.totalEquity || 0))}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
