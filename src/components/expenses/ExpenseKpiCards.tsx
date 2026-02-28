'use client';

import { DollarSign, TrendingUp, TrendingDown, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import type { ExpenseSummary } from '@/types/expense';
import { EXPENSE_BUDGET_MONTHLY } from '@/lib/mock-expenses';

interface ExpenseKpiCardsProps {
  summary: ExpenseSummary;
  isLoading?: boolean;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

const budgetUsedPercent = (totalThisMonth: number) =>
  Math.min(100, Math.round((totalThisMonth / EXPENSE_BUDGET_MONTHLY) * 100));

export function ExpenseKpiCards({ summary, isLoading }: ExpenseKpiCardsProps) {
  const budgetPct = budgetUsedPercent(summary.totalThisMonth);
  const overBudget = summary.totalThisMonth > EXPENSE_BUDGET_MONTHLY;

  const cards = [
    {
      label: 'Total This Month',
      value: formatCurrency(summary.totalThisMonth),
      sub: `Today: ${formatCurrency(summary.totalToday)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Growth vs Last Month',
      value: `${summary.growthPercent > 0 ? '+' : ''}${summary.growthPercent.toFixed(1)}%`,
      sub: `Last month: ${formatCurrency(summary.totalLastMonth)}`,
      icon: summary.growthPercent > 0 ? TrendingUp : TrendingDown,
      color: summary.growthPercent > 0 ? 'text-red-600' : 'text-emerald-600',
      bg: summary.growthPercent > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Pending Payments',
      value: formatCurrency(summary.pendingAmount),
      sub: 'Awaiting settlement',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Recurring (Monthly)',
      value: formatCurrency(summary.recurringMonthly),
      sub: 'Fixed recurring commitments',
      icon: RefreshCw,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-5 h-[110px] animate-pulse">
            <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-3" />
            <div className="h-7 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-2" />
            <div className="h-3 w-20 bg-neutral-100 dark:bg-neutral-700/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Budget warning */}
      {overBudget && (
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          <span>
            <strong>Budget exceeded!</strong> Monthly spend of {formatCurrency(summary.totalThisMonth)} is above the
            budget of {formatCurrency(EXPENSE_BUDGET_MONTHLY)} ({budgetPct}% used).
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`p-2.5 rounded-xl ${card.bg} shrink-0`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">{card.label}</p>
                <p className={`text-xl font-bold ${card.color} leading-tight`}>{card.value}</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget progress bar */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-4">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Monthly Budget Usage</span>
          <span className={`font-bold ${overBudget ? 'text-red-600' : 'text-emerald-600'}`}>
            {budgetPct}% — {formatCurrency(summary.totalThisMonth)} / {formatCurrency(EXPENSE_BUDGET_MONTHLY)}
          </span>
        </div>
        <div className="h-2.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${overBudget ? 'bg-red-500' : budgetPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(100, budgetPct)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
