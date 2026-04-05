'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Wallet, 
  Store, 
  ArrowRight, 
  LayoutGrid, 
  CheckCircle2, 
  Search,
  Package,
  ExternalLink,
  Plus,
  Bell,
  Clock,
  AlertTriangle,
  FileText,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTenantStore } from '@/store/tenant.store';
import { CreateShopModal } from '@/components/forms/CreateShopModal';
import { AddManagerModal } from '@/components/forms/AddManagerModal';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/layout/PageHeader';

interface ShopBreakdown {
  id: string;
  name: string;
  totalRevenue: number;
  paidAmount: number;
  unpaidAmount: number;
  invoiceCount: number;
  currency: string;
  city: string;
}

interface ConsolidatedStats {
  shopCount: number;
  totalRevenue: number;
  paidAmount: number;
  unpaidAmount: number;
  totalInvoices: number;
  unpaidInvoiceCount: number;
  recentInvoices: any[];
  lowStockProducts: any[];
  revenueTrend: { date: string; amount: number }[];
  shops: ShopBreakdown[];
}

export default function ConsolidatedDashboard() {
  const [stats, setStats] = useState<ConsolidatedStats | null>(null);
  const [globalProducts, setGlobalProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { switchTenant } = useTenantStore();
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, prodRes] = await Promise.all([
        api.get('/sales/consolidated-analytics'),
        api.get('/products/global')
      ]);
      setStats(statsRes.data);
      setGlobalProducts(prodRes.data);
    } catch (error) {
      console.error('Failed to fetch consolidated data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleSwitchToShop = (shop: any) => {
    switchTenant({ id: shop.id, name: shop.name });
    router.push('/');
  };

  const filteredProducts = globalProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.tenant.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="h-14 w-14 rounded-3xl bg-neutral-100 animate-spin border-4 border-emerald-500/20 border-t-emerald-500" />
      <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Portfolio Vault...</span>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 overflow-x-hidden">
      <PageHeader 
        title="Global Portfolio Ecosystem"
        subtitle={`Aggregated analytics across ${stats?.shopCount} business units in real-time.`}
        actions={
          <div className="flex gap-3">
             <Button variant="outline" className="h-12 rounded-xl border-neutral-200 dark:border-neutral-800 font-bold uppercase tracking-widest text-[10px] px-6 hover:bg-neutral-50 active:scale-95 transition-all">
              <Download className="h-4 w-4 mr-2" /> Export Portfolio
            </Button>
            <CreateShopModal onSuccess={fetchData} />
          </div>
        }
      />

      {/* KPI Cards */}
      <div id="slim-portfolio-kpis" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Valuation', value: formatCurrency(stats?.totalRevenue || 0), icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50/50', trend: '+14% MoM' },
          { label: 'Cleared Cash', value: formatCurrency(stats?.paidAmount || 0), icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50/50', trend: 'Reconciled' },
          { label: 'Outstanding', value: formatCurrency(stats?.unpaidAmount || 0), icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50/50', trend: 'Receivables' },
          { label: 'Network Volume', value: stats?.totalInvoices, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50/50', trend: 'Global Orders' },
          { label: 'Action Items', value: stats?.unpaidInvoiceCount, icon: Clock, color: 'text-rose-500', bg: 'bg-rose-50/50', trend: 'Pending' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 min-w-[2.5rem] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg)}>
                <kpi.icon className={cn("h-5 w-5", kpi.color)} />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 leading-none mb-1 truncate">{kpi.label}</p>
                <div className="flex items-baseline gap-1">
                   <p className={cn("text-lg font-bold tracking-tight truncate", kpi.color)}>{kpi.value}</p>
                </div>
                <p className="text-[7px] font-bold text-neutral-300 uppercase tracking-tight truncate mt-0.5">{kpi.trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Revenue Trend Chart */}
         <div id="revenue-trend-index" className="lg:col-span-2 bg-white dark:bg-zinc-950/50 p-8 rounded-[1.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] italic text-neutral-900 dark:text-white">Portfolio Revenue Index</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Global 7-day performance curve</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                     <span className="text-[9px] font-bold text-neutral-300 uppercase">Gross Yield</span>
                  </div>
               </div>
            </div>
            <div className="h-[320px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.revenueTrend}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.3} />
                     <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fill: '#9ca3af', fontWeight: 800}}
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', {weekday: 'short'}).toUpperCase()}
                     />
                     <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fill: '#9ca3af', fontWeight: 800}}
                        tickFormatter={(val) => `$${val}`}
                     />
                     <Tooltip 
                        contentStyle={{
                          borderRadius: '1.5rem', 
                          border: 'none', 
                          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          padding: '12px 16px'
                        }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                        labelStyle={{fontSize: '9px', fontWeight: 'black', textTransform: 'uppercase', marginBottom: '4px', color: '#6b7280'}}
                     />
                     <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Global Low Stock Alerts */}
         <div id="supply-chain-alerts" className="bg-rose-50/30 dark:bg-rose-950/10 p-8 rounded-[1.5rem] border border-rose-100 dark:border-rose-900 overflow-hidden space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] italic text-rose-900 dark:text-rose-200">Critical Supply</h3>
               </div>
               <Badge className="bg-rose-500 text-white border-0 text-[8px] font-bold uppercase px-2 h-5 rounded-full animate-pulse">Action Req.</Badge>
            </div>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
               {stats?.lowStockProducts.length ? stats.lowStockProducts.map(product => (
                  <div key={product.id} className="p-4 bg-white dark:bg-zinc-900 rounded-[1.5rem] flex items-center justify-between border border-rose-100/50 shadow-sm group hover:-translate-x-1 transition-transform">
                     <div className="space-y-1">
                        <h4 className="text-xs font-black text-rose-950 dark:text-rose-100 uppercase tracking-tight truncate max-w-[140px]">{product.name}</h4>
                        <div className="flex items-center gap-2">
                           <Store className="h-2.5 w-2.5 text-neutral-400" />
                           <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">{product.tenant.name}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-rose-600 tracking-tighter">{product.stock} Units</p>
                        <p className="text-[7px] font-black text-rose-400 uppercase tracking-[0.2em]">Depleted</p>
                     </div>
                  </div>
               )) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                     <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
                       <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                     </div>
                     <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Ecosystem Supply Optimal</p>
                  </div>
               )}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Shop Performance Breakdown */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-4">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Store className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-[0.2em] italic">Network Nodes</h2>
               </div>
               <Badge className="h-6 px-3 rounded-full bg-emerald-50 text-emerald-600 font-black text-[9px] uppercase tracking-widest border border-emerald-100">Verified Units</Badge>
            </div>
           
           <div className="grid gap-6 md:grid-cols-2">
             {stats?.shops.map(shop => (
               <div key={shop.id} className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-950/50 border border-neutral-100 dark:border-neutral-800 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all group relative overflow-hidden">
                 <div className="flex items-center justify-between mb-8 relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                        <Store className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-indigo-950 dark:text-white uppercase tracking-tighter text-xl leading-none">{shop.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-emerald-100">{shop.city} NODE</span>
                        </div>
                      </div>
                   </div>
                   <button 
                    onClick={() => handleSwitchToShop(shop)}
                    className="h-10 w-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 flex items-center justify-center shadow-sm"
                   >
                     <ExternalLink className="h-4 w-4" />
                   </button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 mb-8 relative z-10">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-neutral-300 uppercase tracking-widest mb-1 italic">Total Revenue</p>
                      <p className="text-2xl font-black text-emerald-600 tracking-tighter">{formatCurrency(shop.totalRevenue, shop.currency)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-neutral-300 uppercase tracking-widest mb-1 italic">Transaction Count</p>
                      <p className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter">{shop.invoiceCount}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-between border-t border-neutral-50 dark:border-neutral-900 pt-6 relative z-10">
                    <AddManagerModal tenantId={shop.id} shopName={shop.name} />
                    <div className="flex items-center gap-2">
                       <div className="h-1.5 w-16 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${Math.round((shop.paidAmount / (shop.totalRevenue || 1)) * 100)}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-emerald-600 italic tracking-widest">{Math.round((shop.paidAmount / (shop.totalRevenue || 1)) * 100)}%</span>
                    </div>
                 </div>
                 <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-indigo-50/50 dark:bg-indigo-900/5 rounded-full blur-3xl group-hover:scale-150 transition-transform pointer-events-none" />
               </div>
             ))}
           </div>
         </div>

         {/* Global Inventory Search & Recent Activity */}
         <div className="space-y-8">
            {/* Recent Activity Feed */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 px-4">
                 <Clock className="h-4 w-4 text-emerald-600" />
                 <h2 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-[0.2em] italic">Live Audit Feed</h2>
               </div>

               <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-950/50 border border-neutral-100 dark:border-neutral-800 space-y-6 shadow-sm">
                  {stats?.recentInvoices.length ? stats.recentInvoices.map((invoice, idx) => (
                     <div key={invoice.id} className="relative pl-8 pb-8 last:pb-0">
                        {idx !== (stats?.recentInvoices.length - 1) && (
                           <div className="absolute left-[3px] top-6 bottom-0 w-[1px] bg-neutral-100 dark:bg-neutral-800" />
                        )}
                        <div className="absolute left-0 top-1 h-2 w-2 rounded-full ring-4 ring-emerald-50/50 bg-emerald-500 z-10" />
                        <div className="flex items-start justify-between group cursor-pointer hover:translate-x-2 transition-all">
                           <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                 <span className="text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-tight leading-none">{invoice.customer.name}</span>
                                 <Badge className="text-[8px] font-black border-none bg-neutral-50 text-neutral-400 uppercase h-4 px-1.5">{invoice.invoiceNo}</Badge>
                              </div>
                              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 italic">
                                 <Store className="h-2.5 w-2.5" /> {invoice.tenant.name} • {new Date(invoice.date).toLocaleDateString()}
                              </p>
                           </div>
                           <div className="text-right flex flex-col items-end">
                              <p className="text-sm font-black text-emerald-600 tracking-tighter">{formatCurrency(invoice.total)}</p>
                              <div className={cn(
                                "flex h-1.5 w-1.5 rounded-full mt-1",
                                invoice.status === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500'
                              )} />
                           </div>
                        </div>
                     </div>
                  )) : (
                     <div className="text-center py-16 space-y-4">
                        <Clock className="h-10 w-10 text-neutral-100 mx-auto" />
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">No global activity</p>
                     </div>
                  )}
                  <Button variant="ghost" className="w-full text-indigo-600 font-black uppercase tracking-widest text-[9px] hover:bg-neutral-50 h-12 rounded-xl border border-dashed border-neutral-100 dark:border-neutral-800 shadow-sm">
                     Access Full Security Audit
                  </Button>
               </div>
            </div>

            {/* Inventory Hub Search */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 px-4">
                 <LayoutGrid className="h-4 w-4 text-indigo-600" />
                 <h2 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-[0.2em] italic">Asset Hub Search</h2>
               </div>

               <div className="p-8 rounded-[2.5rem] bg-indigo-50/20 dark:bg-zinc-950 border border-neutral-100 dark:border-neutral-800 space-y-6 shadow-sm">
                  <div className="relative group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                     <Input 
                       placeholder="Scour ecosystem vault..."
                       className="pl-11 h-14 rounded-2xl border-none shadow-inner bg-white dark:bg-neutral-900 font-bold text-xs"
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                     />
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                     {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                          <div key={product.id} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-between border border-neutral-100 dark:border-neutral-800 group hover:translate-x-1 transition-all shadow-sm">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-neutral-50 dark:bg-neutral-950 rounded-xl flex items-center justify-center group-hover:text-emerald-600 transition-colors">
                                   <Package className="h-5 w-5" />
                                </div>
                                <div>
                                   <h4 className="text-[11px] font-black text-indigo-950 dark:text-white uppercase tracking-tight truncate max-w-[100px]">{product.name}</h4>
                                   <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">{product.tenant.name}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-xs font-black text-neutral-900 dark:text-white tracking-tighter">{formatCurrency(product.price)}</p>
                                <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-[0.1em]">{product.stock} Units</p>
                             </div>
                          </div>
                        ))
                     ) : (
                        <div className="text-center py-12 space-y-4">
                           <Package className="h-10 w-10 text-neutral-200 mx-auto" />
                           <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest opacity-60 italic">No assets detected</p>
                        </div>
                     )}
                  </div>

                  <Button variant="ghost" className="w-full text-indigo-600 font-black uppercase tracking-widest text-[9px] hover:bg-neutral-50 h-12 rounded-xl border border-dashed border-neutral-100 dark:border-neutral-800 shadow-sm">
                    Global Resource Report
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
