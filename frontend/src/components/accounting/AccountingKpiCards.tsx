'use client';

import { TrendingUp, DollarSign, CreditCard, ArrowUpRight, ArrowDownRight, Briefcase, Receipt, BarChart2 } from 'lucide-react';
import type { AccountingSummary } from '@/types/accounting';

interface AccountingKpiCardsProps {
  summary: AccountingSummary;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export function AccountingKpiCards({ summary }: AccountingKpiCardsProps) {
  const cards = [
    {
      label: 'Total Assets',
      value: fmt(summary.totalAssets),
      sub: 'Equity: ' + fmt(summary.equity),
      icon: Briefcase,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      trend: '+6.3%',
      up: true,
    },
    {
      label: 'Total Liabilities',
      value: fmt(summary.totalLiabilities),
      sub: 'Debt ratio: 45.9%',
      icon: CreditCard,
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-900/20',
      trend: '+5.4%',
      up: true,
    },
    {
      label: 'Net Profit (YTD)',
      value: fmt(summary.netProfit),
      sub: 'Revenue: ' + fmt(summary.grossRevenue),
      icon: TrendingUp,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      trend: '+24.3%',
      up: true,
    },
    {
      label: 'Cash Flow (Feb)',
      value: fmt(summary.cashFlow),
      sub: 'Net operating cash',
      icon: DollarSign,
      color: 'text-sky-600',
      bg: 'bg-sky-50 dark:bg-sky-900/20',
      trend: '-31.9%',
      up: false,
    },
    {
      label: 'Accounts Receivable',
      value: fmt(summary.accountsReceivable),
      sub: 'Outstanding invoices',
      icon: ArrowUpRight,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      trend: '+8.2%',
      up: true,
    },
    {
      label: 'Accounts Payable',
      value: fmt(summary.accountsPayable),
      sub: 'Vendor bills due',
      icon: Receipt,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      trend: '+10.5%',
      up: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.up ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={card.label}
            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${card.bg} shrink-0`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <span className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full ${card.up ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
                <TrendIcon className="h-2.5 w-2.5 mr-0.5" />
                {card.trend}
              </span>
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">{card.label}</p>
              <p className={`text-base font-bold ${card.color} leading-tight`}>{card.value}</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
