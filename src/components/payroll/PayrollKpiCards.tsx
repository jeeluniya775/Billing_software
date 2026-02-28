'use client';

import { 
  Wallet, Users, Clock, TrendingDown, 
  CreditCard, TrendingUp, DollarSign, ShieldCheck 
} from 'lucide-react';
import { PayrollSummary } from '@/types/payroll';

interface PayrollKpiCardsProps {
  summary: PayrollSummary;
  isLoading?: boolean;
}

export function PayrollKpiCards({ summary, isLoading }: PayrollKpiCardsProps) {
  const cards = [
    {
      label: 'Total Payroll',
      value: `$${summary.totalPayroll.toLocaleString()}`,
      sub: 'Budgeted - Feb 2024',
      icon: Wallet,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/40',
      trend: `+${summary.growthPercentage}%`,
      up: true,
    },
    {
      label: 'Employees Paid',
      value: summary.totalEmployeesPaid,
      sub: 'Processed successfully',
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/40',
      trend: 'Target Reach',
      up: true,
    },
    {
      label: 'Pending Payroll',
      value: `$${summary.pendingPayroll.toLocaleString()}`,
      sub: 'Action required',
      icon: Clock,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/40',
      trend: '-12%',
      up: false,
    },
    {
      label: 'Total Deductions',
      value: `$${summary.totalDeductions.toLocaleString()}`,
      sub: 'Tax, PF, ESI, etc.',
      icon: TrendingDown,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/40',
      trend: 'Compliant',
      up: true,
    },
    {
      label: 'Net Salary Paid',
      value: `$${summary.netSalaryPaid.toLocaleString()}`,
      sub: 'Total disbursal',
      icon: CreditCard,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/40',
      trend: 'Secure',
      up: true,
    },
    {
      label: 'Payroll Growth',
      value: `${summary.growthPercentage}%`,
      sub: 'Monthly variance',
      icon: TrendingUp,
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-900/40',
      trend: '+1.2%',
      up: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-5 transition-all hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${card.bg} group-hover:rotate-12 transition-transform`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${card.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {card.trend}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1.5">{card.label}</p>
              <h3 className="text-xl font-black text-indigo-950 dark:text-white leading-none">{card.value}</h3>
              <p className="text-[10px] text-neutral-400 mt-2 font-bold italic truncate">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
