'use client';

import { 
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, 
  ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart, Line
} from 'recharts';
import type { LeadTrend, FunnelStage, ChannelPerformance } from '@/types/marketing';

interface MarketingChartsProps {
  trendData: LeadTrend[];
  funnelData: FunnelStage[];
  channelData: ChannelPerformance[];
  isLoading?: boolean;
}

const fmtK = (v: number) => `$${(v / 1000).toFixed(0)}k`;

export function MarketingCharts({ trendData, funnelData, channelData, isLoading }: MarketingChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[300px] bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Lead Generation Trend */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Lead Generation Trend</h3>
          <p className="text-xs text-neutral-500">Monthly leads vs conversion performance</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#6366f1" fill="url(#leadGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="conversions" name="Conversions" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Conversion Funnel</h3>
          <p className="text-xs text-neutral-500">Full lifecycle marketing funnel</p>
        </div>
        <div className="space-y-4">
          {funnelData.map((stage) => (
            <div key={stage.stage} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-700 dark:text-gray-300">{stage.stage}</span>
                <span className="text-neutral-500">{stage.count} ({stage.percent}%)</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000" 
                  style={{ width: `${stage.percent}%`, backgroundColor: stage.color }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Performance */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Channel Performance</h3>
          <p className="text-xs text-neutral-500">Leads and ROI by acquisition channel</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis type="number" hide />
              <YAxis dataKey="channel" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="leads" name="Leads Generated" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} />
              <Bar dataKey="roi" name="ROI %" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign ROI Comparison */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">ROI vs Spend Matrix</h3>
            <p className="text-xs text-neutral-500">Comparing campaign efficiency</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
              <div className="h-2 w-2 rounded-full bg-emerald-500" /> High ROI
            </div>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={fmtK} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="spend" name="Budget Spent" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
              <Line type="monotone" dataKey="conversions" name="Conversions" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
