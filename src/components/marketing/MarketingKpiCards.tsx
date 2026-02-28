'use client';

import { Megaphone, Users, UserCheck, Target, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { MarketingSummary } from '@/types/marketing';

interface MarketingKpiCardsProps {
  summary: MarketingSummary;
  isLoading?: boolean;
}

const fmt = (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v);
const fmtCurr = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export function MarketingKpiCards({ summary, isLoading }: MarketingKpiCardsProps) {
  const cards = [
    {
      label: 'Total Campaigns',
      value: summary.totalCampaigns,
      sub: `${summary.activeCampaigns} Active now`,
      icon: Megaphone,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      trend: '+12%',
      up: true,
    },
    {
      label: 'Leads Generated',
      value: fmt(summary.totalLeads),
      sub: 'This month',
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      trend: '+24%',
      up: true,
    },
    {
      label: 'Conversion Rate',
      value: `${summary.conversionRate}%`,
      sub: 'Leads to Customer',
      icon: UserCheck,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      trend: '+2.1%',
      up: true,
    },
    {
      label: 'Cost per Lead',
      value: `$${summary.costPerLead.toFixed(2)}`,
      sub: 'Avg. across channels',
      icon: Target,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      trend: '-8.5%',
      up: false,
    },
    {
      label: 'Total Marketing ROI',
      value: `${summary.averageROI}%`,
      sub: 'Revenue Attributed',
      icon: TrendingUp,
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      trend: '+45%',
      up: true,
    },
    {
      label: 'Rev. Attributed',
      value: fmtCurr(summary.revenueAttributed),
      sub: `Spend: ${fmtCurr(summary.totalSpend)}`,
      icon: DollarSign,
      color: 'text-sky-600',
      bg: 'bg-sky-50 dark:bg-sky-900/20',
      trend: '+18.2%',
      up: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.up ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={card.label}
            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-4 transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.bg} group-hover:scale-110 transition-transform`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${card.up ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                <TrendIcon className="h-2.5 w-2.5 mr-0.5" />
                {card.trend}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{card.label}</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{card.value}</h3>
              <p className="text-[10px] text-neutral-400 mt-1 truncate">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
