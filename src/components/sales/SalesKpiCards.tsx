'use client';


import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  BarChart3 
} from 'lucide-react';
import { SalesSummaryKPIs } from '@/types/sale';

interface SalesKpiCardsProps {
  summary: SalesSummaryKPIs;
  isLoading?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function SalesKpiCards({ summary, isLoading }: SalesKpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700 h-[104px]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Total Revenue</h3>
          <span className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg"><DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /></span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {formatCurrency(summary.totalRevenue)}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Paid Amount</h3>
          <span className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg"><CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" /></span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {formatCurrency(summary.paidAmount)}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Unpaid Due</h3>
          <span className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg"><FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" /></span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {formatCurrency(summary.unpaidAmount)}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Overdue</h3>
          <span className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg"><AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" /></span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {formatCurrency(summary.overdueAmount)}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Sales (Month)</h3>
          <span className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg"><BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /></span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {summary.totalSalesThisMonth} <span className="text-sm font-normal text-neutral-500">inv.</span>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Growth</h3>
          <span className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg"><TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /></span>
        </div>
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
          +{summary.salesGrowthPercent}%
        </div>
      </div>

    </div>
  );
}
