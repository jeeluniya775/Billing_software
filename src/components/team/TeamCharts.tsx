'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, AreaChart, 
  Area, PieChart, Pie, Cell 
} from 'recharts';
import { TeamSummary } from '@/types/team';

interface TeamChartsProps {
  summary: TeamSummary;
  isLoading?: boolean;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export function TeamCharts({ summary, isLoading }: TeamChartsProps) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hiring Trend */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Monthly Hiring Trend</h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1 italic">Growth momentum over 6 months</p>
        </div>
        <div className="h-[250px] w-full min-h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.hiringTrend}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="count" name="Joiners" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dept Distribution */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Department Distribution</h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1 italic">Internal resource allocation</p>
        </div>
        <div className="h-[250px] w-full min-h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={summary.deptDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {summary.deptDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingLeft: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Overview */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Attendance Overview</h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1 italic">Daily presence rate tracking</p>
        </div>
        <div className="h-[250px] w-full min-h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="rate" name="Attendance %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Role Distribution</h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1 italic">Company-wide headcount breakdown</p>
        </div>
        <div className="h-[250px] w-full min-h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.roleDistribution} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis type="number" hide />
              <YAxis dataKey="role" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} width={100} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="count" name="Employees" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
