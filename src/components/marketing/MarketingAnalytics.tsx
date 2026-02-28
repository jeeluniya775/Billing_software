'use client';

import { 
  TrendingUp, TrendingDown, Target, Users, Megaphone, 
  ArrowUpRight, DollarSign, PieChart as PieChartIcon, 
  BarChart as BarChartIcon, Layout, Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, AreaChart, 
  Area, PieChart, Pie, Cell 
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import type { ChannelPerformance, LeadTrend, MarketingSummary } from '@/types/marketing';

interface MarketingAnalyticsProps {
  summary: MarketingSummary;
  channelData: ChannelPerformance[];
  trendData: LeadTrend[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f43f5e', '#f97316'];

export function MarketingAnalytics({ summary, channelData, trendData }: MarketingAnalyticsProps) {
  return (
    <div className="space-y-8 pb-8">
      {/* Performance Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Customer Acquisition Cost', value: `$${(summary.totalSpend / summary.totalConversions).toFixed(2)}`, trend: '-4.2%', up: false, icon: Target, color: 'text-indigo-600' },
          { label: 'Lifetime Value (LTV)', value: '$1,240', trend: '+12.5%', up: true, icon: Users, color: 'text-violet-600' },
          { label: 'LTV : CAC Ratio', value: '4.8 : 1', trend: '+0.4', up: true, icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Payback Period', value: '3.2 Mo', trend: '-0.2', up: false, icon: Calendar, color: 'text-amber-600' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h4>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ad Spend Allocation */}
        <div className="lg:col-span-1 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-neutral-400" /> Ad Spend Allocation
            </h3>
            <p className="text-[10px] text-neutral-500">Distribution of budget by channel</p>
          </div>
          <div className="h-[280px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="spend"
                  nameKey="channel"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-50 dark:border-neutral-700 grid grid-cols-2 gap-4">
             <div>
               <p className="text-[10px] text-neutral-400 font-bold uppercase">Least Expensive</p>
               <p className="text-xs font-bold">Email Marketing</p>
             </div>
             <div className="text-right">
               <p className="text-[10px] text-neutral-400 font-bold uppercase">Highest Spend</p>
               <p className="text-xs font-bold text-indigo-600">Google Search</p>
             </div>
          </div>
        </div>

        {/* Lead Velocity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChartIcon className="h-4 w-4 text-neutral-400" /> Lead Velocity Index
              </h3>
              <p className="text-[10px] text-neutral-500">Comparing lead volume vs quality month over month</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                 <div className="h-2 w-2 rounded-full bg-indigo-600" /> Volume
               </div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                 <div className="h-2 w-2 rounded-full bg-rose-500" /> Quality
               </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="leads" name="Lead Volume" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="conversions" name="New Customers" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advanced Performance Matrix */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-50 dark:border-neutral-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Channel Efficiency Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
             <thead>
               <tr className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-400 font-bold uppercase tracking-widest px-6">
                 <th className="px-6 py-4 text-left">Acquisition Channel</th>
                 <th className="px-6 py-4 text-center">Efficiency Score</th>
                 <th className="px-6 py-4 text-right">Budget (Actual)</th>
                 <th className="px-6 py-4 text-right">Revenue Attributed</th>
                 <th className="px-6 py-4 text-right">ROI Rank</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                {channelData.map((channel, i) => (
                  <tr key={channel.channel} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-bold text-gray-700 dark:text-gray-300">{channel.channel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center justify-center gap-2">
                         <div className="h-1.5 w-16 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (channel.roi / 1000) * 100)}%` }} />
                         </div>
                         <span className="text-[10px] font-bold text-neutral-400 italic">{(channel.roi / 100).toFixed(1)}x</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-neutral-500">
                      ${channel.spend.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-gray-900 dark:text-white">${(channel.roi * channel.spend / 100).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Badge className={i < 2 ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}>
                         Rank #{i + 1}
                       </Badge>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
