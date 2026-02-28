'use client';

import { DollarSign, Users, UserCheck, ShieldAlert } from 'lucide-react';

interface CustomerKpiCardsProps {
  totalBalance: number;
  totalCustomers: number;
  activeCount: number;
  highRiskCount: number;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export function CustomerKpiCards({ 
  totalBalance, 
  totalCustomers, 
  activeCount, 
  highRiskCount 
}: CustomerKpiCardsProps) {
  const cards = [
    {
      label: 'Total A/R Balance',
      value: formatCurrency(totalBalance),
      sub: 'Total outstanding invoices',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Total Customers',
      value: totalCustomers.toString(),
      sub: 'Accounts in database',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Active Contacts',
      value: activeCount.toString(),
      sub: 'Engagement this month',
      icon: UserCheck,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      label: 'At Risk / Blocked',
      value: highRiskCount.toString(),
      sub: 'Credit hold / issues',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
    },
  ];

  return (
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
  );
}
