'use client';

import { 
  Users, UserCheck, Briefcase, UserPlus, 
  Calendar, Activity, TrendingUp, TrendingDown 
} from 'lucide-react';
import { TeamSummary } from '@/types/team';

interface TeamKpiCardsProps {
  summary: TeamSummary;
  isLoading?: boolean;
}

export function TeamKpiCards({ summary, isLoading }: TeamKpiCardsProps) {
  const cards = [
    {
      label: 'Total Employees',
      value: summary.totalEmployees,
      sub: 'All registered accounts',
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/40',
      trend: '+12%',
      up: true,
    },
    {
      label: 'Active Employees',
      value: summary.activeEmployees,
      sub: 'Currently working',
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/40',
      trend: '+2',
      up: true,
    },
    {
      label: 'Departments',
      value: summary.departmentsCount,
      sub: 'Org-wide units',
      icon: Briefcase,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/40',
      trend: 'Finalized',
      up: true,
    },
    {
      label: 'New Joiners',
      value: summary.newJoinersMonth,
      sub: 'This month',
      icon: UserPlus,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-900/40',
      trend: '+50%',
      up: true,
    },
    {
      label: 'On Leave Today',
      value: summary.onLeaveToday,
      sub: 'Out of office',
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/40',
      trend: 'Low',
      up: false,
    },
    {
      label: 'Attendance Rate',
      value: `${summary.attendanceRate}%`,
      sub: 'Weekly average',
      icon: Activity,
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-900/40',
      trend: '+2.5%',
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
