'use client';

import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, TrendingUp, Download, Filter, RefreshCw, Loader2, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssetCharts } from '@/components/assets/AssetCharts';
import { assetService } from '@/services/asset.service';
import { AssetSummary } from '@/types/asset';

export default function AssetsAnalyticsPage() {
  const [summary, setSummary] = useState<AssetSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6m');

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const sumData = await assetService.getAssetAnalytics();
      setSummary(sumData || null);
    } catch (error) {
      console.error('Error fetching asset summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleExportReport = () => {
    if (!summary) return;
    
    const depPercent = summary.totalValue > 0 ? Math.round((summary.depreciatedValue / summary.totalValue) * 1000) / 10 : 0;
    const csvRows = [
      'ASSET ANALYTICS AUDIT REPORT',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '--- PORTFOLIO SUMMARY ---',
      `Total Assets,${summary.totalAssets}`,
      `Active Assets,${summary.activeAssets}`,
      `In Maintenance,${summary.maintenanceAssets}`,
      `In Repair,${summary.inRepairAssets || 0}`,
      `Disposed,${summary.disposedAssets || 0}`,
      '',
      '--- FINANCIAL OVERVIEW ---',
      `Total Investment,$${summary.totalValue.toLocaleString()}`,
      `Current Portfolio Value,$${(summary.currentValue || summary.totalValue - summary.depreciatedValue).toLocaleString()}`,
      `Total Depreciation,$${summary.depreciatedValue.toLocaleString()}`,
      `Depreciation Rate,${depPercent}%`,
      `Utilization Rate,${summary.utilizationRate}%`,
      `Total Maintenance Spend,$${(summary.totalMaintenanceSpend || 0).toLocaleString()}`,
      `Number of Service Records,${summary.totalMaintenanceCount || 0}`,
      '',
      '--- CATEGORY BREAKDOWN ---',
      'Category,Count,Purchase Value,Current Value,Depreciation %',
      ...(summary.categoryDistribution || []).map(c => {
        const dep = summary.categoryDepreciation?.find(d => d.category === c.category);
        return `${c.category},${c.count},$${c.value.toLocaleString()},$${(c.currentValue || 0).toLocaleString()},${dep?.depPercent || 0}%`;
      }),
      '',
      '--- MONTHLY MAINTENANCE COSTS ---',
      'Month,Cost',
      ...(summary.maintenanceCosts || []).map(m => `${m.month},$${m.cost}`),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asset_audit_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const portfolioValue = summary ? (summary.currentValue || (summary.totalValue - summary.depreciatedValue)) : 0;
  const depPercent = summary && summary.totalValue > 0 ? Math.round((summary.depreciatedValue / summary.totalValue) * 1000) / 10 : 0;

  return (
    <div className="space-y-8 slide-in-from-bottom-2">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-wider">Analytics Dashboard</h3>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Real-time data from {summary?.totalAssets || 0} assets</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-9 w-32 text-[10px] font-bold border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchSummary}
            disabled={isLoading}
            className="h-9 text-[10px] font-bold uppercase tracking-widest border-neutral-100 dark:border-neutral-800"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Refresh
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleExportReport}
            disabled={!summary}
            className="h-9 text-[10px] font-bold uppercase tracking-widest bg-indigo-950 dark:bg-indigo-600 hover:bg-black text-white"
          >
            <Download className="h-3 w-3 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-lg font-black text-indigo-950 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" /> Capital vs Portfolio Analysis
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                <div>
                  <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest leading-none">Total Investment</p>
                  <p className="text-xl font-black text-emerald-900 dark:text-white mt-2">${(summary.totalValue || 0).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Net Dep.</p>
                  <p className="text-lg font-bold text-gray-500 mt-2">${(summary.depreciatedValue || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                <div>
                  <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest leading-none">Current Portfolio Value</p>
                  <p className="text-xl font-black text-indigo-900 dark:text-white mt-2">${portfolioValue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Utilization</p>
                  <p className="text-lg font-bold text-gray-500 mt-2">{summary.utilizationRate || 0}%</p>
                </div>
              </div>
              {/* Mini summary stats */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Active', value: summary.activeAssets, color: 'text-emerald-600' },
                  { label: 'Service', value: summary.maintenanceAssets, color: 'text-amber-600' },
                  { label: 'Repair', value: summary.inRepairAssets || 0, color: 'text-rose-600' },
                  { label: 'Disposed', value: summary.disposedAssets || 0, color: 'text-neutral-400' },
                ].map(s => (
                  <div key={s.label} className="text-center p-2 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                    <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-indigo-950 text-white rounded-3xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-black mb-6 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-400" /> System Insights
              </h3>
              <div className="space-y-4">
                <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
                  Your current fleet utilization is at <strong className="text-white">{summary.utilizationRate}%</strong>. 
                  {summary.maintenanceAssets > 0 ? ` There are ${summary.maintenanceAssets} assets currently in maintenance.` : ' All assets are currently operational.'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Dep. Rate</p>
                    <p className="text-lg font-black text-white mt-1">{depPercent}%</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Mnt. Spend</p>
                    <p className="text-lg font-black text-white mt-1">${((summary.totalMaintenanceSpend || 0) / 1000).toFixed(1)}k</p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleExportReport}
                className="mt-6 bg-white text-indigo-900 hover:bg-neutral-100 font-black uppercase tracking-widest text-[10px] h-11 px-8"
              >
                <Download className="h-3.5 w-3.5 mr-2" />
                Audit Report
              </Button>
            </div>
            {/* Background visual */}
            <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-indigo-600/20 rounded-full blur-3xl" />
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[250px] bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-700 animate-pulse" />
          <div className="h-[250px] bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-700 animate-pulse" />
        </div>
      )}

      {summary && <AssetCharts summary={summary} isLoading={isLoading} />}
    </div>
  );
}
