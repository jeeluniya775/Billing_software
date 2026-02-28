'use client';

import { 
  Package, CheckCircle2, AlertCircle, DollarSign, 
  TrendingDown, TrendingUp, Activity, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { AssetSummary } from '@/types/asset';

interface AssetKpiCardsProps {
  summary: AssetSummary;
  isLoading?: boolean;
}

const fmt = (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v);
const fmtCurr = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export function AssetKpiCards({ summary, isLoading }: AssetKpiCardsProps) {
  const cards = [
    {
      label: 'Total Assets',
      value: summary.totalAssets,
      sub: 'Across all categories',
      icon: Package,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/40',
      trend: '+4.2%',
      up: true,
    },
    {
      label: 'Active Assets',
      value: summary.activeAssets,
      sub: 'Currently in use',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/40',
      trend: '+2.1%',
      up: true,
    },
    {
      label: 'In Maintenance',
      value: summary.maintenanceAssets,
      sub: 'Repair or routine check',
      icon: Activity,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/40',
      trend: '+12%',
      up: false,
    },
    {
      label: 'Total Asset Value',
      value: fmtCurr(summary.totalValue),
      sub: 'Original purchase cost',
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/40',
      trend: '+18.2%',
      up: true,
    },
    {
      label: 'Depreciated Value',
      value: fmtCurr(summary.depreciatedValue),
      sub: 'Total value lost',
      icon: TrendingDown,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/40',
      trend: '+5.4%',
      up: true, // Depreciation increasing is "up" in value trend terms usually, but color is rose
    },
    {
      label: 'Utilization Rate',
      value: `${summary.utilizationRate}%`,
      sub: 'Overall efficiency',
      icon: TrendingUp,
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-900/40',
      trend: '+0.8%',
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
        const TrendIcon = card.up ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={card.label}
            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-5 transition-all hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${card.bg} group-hover:scale-110 transition-transform`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${card.up ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30'}`}>
                <TrendIcon className="h-2.5 w-2.5 mr-0.5" />
                {card.trend}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest leading-none mb-1.5">{card.label}</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">{card.value}</h3>
              <p className="text-[10px] text-neutral-400 mt-2 truncate">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
