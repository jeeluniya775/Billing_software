'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, AreaChart, 
  Area, PieChart, Pie, Cell 
} from 'recharts';
import { Zap, Clock, History } from 'lucide-react';
import { TimeSummary } from '@/types/time';

interface TimeChartsProps {
  summary: TimeSummary;
  isLoading?: boolean;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export function TimeCharts({ summary, isLoading }: TimeChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[300px] bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 animate-pulse" />
        ))}
      </div>
    );
  }

  const billableVsNon = [
    { name: 'Billable', value: summary.billableHoursWeek },
    { name: 'Non-Billable', value: summary.nonBillableHoursWeek },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Time Trend */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Weekly Capacity Utilization</h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Total Hours vs Billable target</p>
        </div>
        <div className="h-[250px] w-full min-h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="hours" name="Total Hours" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="billable" name="Billable" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Billable vs Non-Billable Pie */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Billing Distribution</h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Revenue generating vs overhead time</p>
        </div>
        <div className="h-[250px] w-full min-h-[250px] min-w-0 flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={billableVsNon}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                nameKey="name"
              >
                <Cell fill="#6366f1" stroke="transparent" />
                <Cell fill="#f1f5f9" stroke="transparent" className="dark:fill-neutral-700" />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingLeft: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project-wise Time Distribution */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Project Allocation</h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Time spent across active engagements</p>
        </div>
        <div className="h-[250px] w-full min-h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.projectDistribution} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis type="number" hide />
              <YAxis dataKey="project" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} width={120} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="hours" name="Hours Spent" radius={[0, 4, 4, 0]} barSize={20}>
                {summary.projectDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Productivity Matrix (Placeholder/Simplified) */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Productivity Insights</h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">Performance indicators (Dummy)</p>
        </div>
        <div className="space-y-4">
           {[
             { label: 'Deep Work Hours', value: '28.5h', icon: Zap, color: 'text-violet-600', sub: 'Focused execution' },
             { label: 'Meetings / Sync', value: '8.0h', icon: Clock, color: 'text-indigo-500', sub: 'Collaboration overhead' },
             { label: 'Unrecorded Time', value: '2.5h', icon: History, color: 'text-neutral-400', sub: 'Idle / Admin' }
           ].map(item => (
             <div key={item.label} className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg bg-white dark:bg-neutral-800 ${item.color} shadow-sm`}>
                      <item.icon className="h-4 w-4" />
                   </div>
                   <div>
                      <p className="text-xs font-black text-indigo-950 dark:text-white leading-none">{item.label}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1 italic">{item.sub}</p>
                   </div>
                </div>
                <p className="text-sm font-black text-indigo-950 dark:text-white">{item.value}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
