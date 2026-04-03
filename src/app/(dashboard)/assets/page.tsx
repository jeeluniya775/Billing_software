'use client';

import { useState, useEffect } from 'react';
import { 
  Package, LayoutDashboard, ListFilter, 
  Settings2, Activity, PieChart, 
  Download, Filter, Search, Plus, 
  ArrowRightLeft, Wrench, ShieldCheck, 
  DollarSign, TrendingUp, BarChart3, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
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
    <ProtectedRoute>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-indigo-950 dark:bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Package className="h-6 w-6" />
               </div>
               <h1 className="text-4xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Assets</h1>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] italic ml-1.5 flex items-center gap-2">
               Enterprise Asset Management & Lifecycle Intelligence <Sparkles className="h-3 w-3 text-indigo-400" />
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
                <Download className="h-4 w-4" /> Export Report
            </Button>
            <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 shadow-xl px-6 transition-all active:scale-95">
                <Plus className="h-4 w-4" /> New Asset Entry
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-10" onValueChange={setActiveTab}>
          <div className="border-b border-neutral-100 dark:border-neutral-800 sticky top-0 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl z-30 -mx-4 md:-mx-8 px-4 md:px-8">
            <TabsList className="h-16 bg-transparent gap-8 p-0">
               {tabs.map((tab) => (
                 <TabsTrigger 
                   key={tab.id} 
                   value={tab.id}
                   className="h-full border-b-4 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent rounded-none px-2 font-black uppercase tracking-widest text-[10px] text-neutral-400 data-[state=active]:text-indigo-950 dark:data-[state=active]:text-white transition-all gap-2"
                 >
                   <tab.icon className="h-4 w-4 mb-0.5" />
                   {tab.label}
                 </TabsTrigger>
               ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-10 outline-none">
            {summary && (
              <>
                <AssetKpiCards summary={summary} isLoading={isLoading} />
                <div className="pt-4">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                      <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Value Distribution</h2>
                   </div>
                   <AssetCharts summary={summary} isLoading={isLoading} />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="outline-none">
            <div className="space-y-6">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                  <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Fleet Directory</h2>
               </div>
               <AssetTable />
            </div>
          </TabsContent>

          <TabsContent value="lifecycle" className="outline-none">
            <AssetLifecycle />
          </TabsContent>

          <TabsContent value="maintenance" className="outline-none">
            <MaintenanceManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-10 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-10 bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="h-1 w-12 bg-emerald-600 rounded-full" />
                     <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Capital Intelligence</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100/50 dark:border-emerald-800/30 transition-all hover:scale-[1.01]">
                       <div>
                          <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none mb-2">Capital Assets</p>
                          <p className="text-3xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">$784,200</p>
                       </div>
                    </div>
                    <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-100/50 dark:border-indigo-800/30 transition-all hover:scale-[1.01]">
                       <div>
                          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none mb-2">Operational Expenses</p>
                          <p className="text-3xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">$62,100</p>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="p-10 bg-indigo-950 text-white rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-indigo-950/20">
                  <div className="relative z-10">
                     <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 border border-white/20">
                        <TrendingUp className="h-6 w-6" />
                     </div>
                     <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Utilization Matrix</h3>
                     <p className="text-indigo-200/60 text-xs font-bold uppercase tracking-widest italic mb-10 leading-relaxed max-w-xs">
                        Fleet efficiency is currently at <span className="text-white">78.5%</span>. Strategic optimization could reduce annual costs by <span className="text-white">$12,000</span>.
                     </p>
                     <Button className="bg-white text-indigo-950 hover:bg-neutral-100 font-black uppercase tracking-widest text-[10px] h-12 px-10 rounded-2xl shadow-xl transition-all active:scale-95">
                        Download Audit
                     </Button>
                  </div>
                  {/* Visual flourish */}
                  <div className="absolute top-0 right-0 p-8">
                     <Sparkles className="h-12 w-12 text-white/5" />
                  </div>
                  <div className="absolute -bottom-20 -right-20 h-80 w-80 bg-indigo-600/30 rounded-full blur-[100px]" />
               </div>
            </div>
            {summary && <AssetCharts summary={summary} isLoading={isLoading} />}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
