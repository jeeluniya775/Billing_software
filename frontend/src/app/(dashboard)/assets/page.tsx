'use client';

import { useState, useEffect } from 'react';
import { 
  Package, LayoutDashboard, ListFilter, 
  Settings2, Activity, PieChart, 
  Download, Filter, Search, Plus, 
  ArrowRightLeft, Wrench, ShieldCheck, 
  DollarSign, TrendingUp, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetKpiCards } from '@/components/assets/AssetKpiCards';
import { AssetCharts } from '@/components/assets/AssetCharts';
import { AssetTable } from '@/components/assets/AssetTable';
import { AssetLifecycle } from '@/components/assets/AssetLifecycle';
import { MaintenanceManager } from '@/components/assets/MaintenanceManager';
import { assetService } from '@/services/asset.service';
import { Asset, AssetSummary } from '@/types/asset';

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState<AssetSummary | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sumData, assetData] = await Promise.all([
          assetService.getAssetAnalytics(),
          assetService.getAssets()
        ]);
        setSummary(sumData);
        setAssets(assetData);
      } catch (error) {
        console.error('Error fetching asset data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Asset Inventory', icon: Package },
    { id: 'lifecycle', label: 'Lifecycle & Transfers', icon: ArrowRightLeft },
    { id: 'maintenance', label: 'Maintenance Hub', icon: Wrench },
    { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Dynamic Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <Package className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Assets</h1>
          </div>
          <p className="text-neutral-500 font-medium max-w-xl">
            Enterprise Asset Management: Tracking lifecycle, depreciation, and service schedules across the organization.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-11 border-neutral-200 dark:border-neutral-800 font-bold px-6 shadow-sm">
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
          <Button className="flex-1 md:flex-none h-11 bg-indigo-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] px-8 shadow-xl">
             New Asset Entry
          </Button>
        </div>
      </div>

      {/* Main Tabbed Interface */}
      <Tabs defaultValue="overview" className="w-full space-y-8" onValueChange={setActiveTab}>
        <div className="sticky top-0 z-20 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md py-2 border-b border-neutral-200/50 dark:border-neutral-800 overflow-visible">
          <TabsList className="bg-white dark:bg-neutral-900 p-1.5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/40 dark:shadow-none flex flex-wrap h-auto md:h-14 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/40 dark:data-[state=active]:text-indigo-400 rounded-xl px-5 transition-all text-xs font-bold gap-2 h-9 md:h-11 flex-1 md:flex-none min-w-[120px]"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content Areas */}
        <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
           {summary && <AssetKpiCards summary={summary} isLoading={isLoading} />}
           {summary && <AssetCharts summary={summary} isLoading={isLoading} />}
        </TabsContent>

        <TabsContent value="inventory" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
           <AssetTable />
        </TabsContent>

        <TabsContent value="lifecycle" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
           <AssetLifecycle />
        </TabsContent>

        <TabsContent value="maintenance" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
           <MaintenanceManager />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
           {summary && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                   <h3 className="text-lg font-black text-indigo-950 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" /> Capital vs Expense Analysis
                   </h3>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                         <div>
                            <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest leading-none">Capital Assets</p>
                            <p className="text-xl font-black text-emerald-900 dark:text-white mt-2">$784,200</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">YTD Dep.</p>
                            <p className="text-lg font-bold text-gray-500 mt-2">$42,500</p>
                         </div>
                      </div>
                      <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                         <div>
                            <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest leading-none">Operational Expenses</p>
                            <p className="text-xl font-black text-indigo-900 dark:text-white mt-2">$62,100</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Mnt. Share</p>
                            <p className="text-lg font-bold text-gray-500 mt-2">14.8%</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-indigo-950 text-white rounded-3xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <h3 className="text-lg font-black mb-6 uppercase tracking-wider flex items-center gap-2">
                         <TrendingUp className="h-5 w-5 text-indigo-400" /> ROI & Utilization Matrix
                      </h3>
                      <p className="text-neutral-400 text-xs mb-8 leading-relaxed max-w-sm">
                         Your current fleet utilization is at <strong>78.5%</strong>. Optimizing machinery usage in Plant A could save <strong>$12k</strong> in annual maintenance costs.
                      </p>
                      <Button className="bg-white text-indigo-900 hover:bg-neutral-100 font-black uppercase tracking-widest text-[10px] h-11 px-8">Audit Report</Button>
                   </div>
                   {/* Background visual */}
                   <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-indigo-600/20 rounded-full blur-3xl" />
                </div>
             </div>
           )}
           {summary && <AssetCharts summary={summary} isLoading={isLoading} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
