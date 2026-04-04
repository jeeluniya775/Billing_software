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
  Plus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTenantStore } from '@/store/tenant.store';
import { CreateShopModal } from '@/components/forms/CreateShopModal';
import { AddManagerModal } from '@/components/forms/AddManagerModal';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface ShopBreakdown {
  id: string;
  name: string;
  totalRevenue: number;
  paidAmount: number;
  unpaidAmount: number;
  invoiceCount: number;
}

interface ConsolidatedStats {
  shopCount: number;
  totalRevenue: number;
  paidAmount: number;
  unpaidAmount: number;
  totalInvoices: number;
  shops: ShopBreakdown[];
}

export default function ConsolidatedDashboard() {
  const [stats, setStats] = useState<ConsolidatedStats | null>(null);
  const [globalProducts, setGlobalProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { switchTenant } = useTenantStore();
  const router = useRouter();

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSwitchToShop = (shop: any) => {
    switchTenant({ id: shop.id, name: shop.name });
    router.push('/');
  };

  const filteredProducts = globalProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.tenant.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <div className="text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">Syncing portfolio data...</div>
    </div>
  );

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="space-y-1">
           <div className="h-full space-y-8">
              <div className="h-2 w-16 bg-emerald-600 rounded-full" />
              <h1 className="text-4xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Global Ecosystem</h1>
           </div>
           <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em] flex items-center gap-2">
             Aggregated portfolio analytics across {stats?.shopCount} business units <TrendingUp className="h-3 w-3 text-emerald-500" />
           </p>
        </div>
        <div className="flex items-center gap-3">
          <CreateShopModal onSuccess={fetchData} />
          <Button variant="outline" className="rounded-xl border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest h-10 px-4">Export Full Portfolio</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-8 space-y-4 rounded-[2.5rem] border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
             <TrendingUp className="h-20 w-20 text-emerald-600" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
               <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total Valuation</span>
          </div>
          <div className="text-4xl font-black text-indigo-950 dark:text-white tracking-tighter">{formatCurrency(stats?.totalRevenue || 0)}</div>
          <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-0 font-black text-[9px] uppercase tracking-widest">
            +14.2% MOM
          </Badge>
        </Card>

        <Card className="p-8 space-y-4 rounded-[2.5rem] border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
             <Wallet className="h-20 w-20 text-blue-600" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
               <Wallet className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Cleared Cash</span>
          </div>
          <div className="text-4xl font-black text-indigo-950 dark:text-white tracking-tighter">{formatCurrency(stats?.paidAmount || 0)}</div>
          <p className="text-[9px] text-neutral-400 font-black uppercase tracking-widest italic opacity-70">Reconciled in bank</p>
        </Card>

        <Card className="p-8 space-y-4 rounded-[2.5rem] border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
             <BarChart3 className="h-20 w-20 text-amber-600" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
               <BarChart3 className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Outstanding</span>
          </div>
          <div className="text-4xl font-black text-indigo-950 dark:text-white tracking-tighter">{formatCurrency(stats?.unpaidAmount || 0)}</div>
          <p className="text-[9px] text-neutral-400 font-black uppercase tracking-widest italic opacity-70">Active receivables</p>
        </Card>

        <Card className="p-8 space-y-4 rounded-[2.5rem] border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
             <ShoppingBag className="h-20 w-20 text-indigo-600" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
               <ShoppingBag className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Order Volume</span>
          </div>
          <div className="text-4xl font-black text-indigo-950 dark:text-white tracking-tighter">{stats?.totalInvoices}</div>
          <p className="text-[9px] text-neutral-400 font-black uppercase tracking-widest italic opacity-70">Total sales across network</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shop Performance Breakdown */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Business Units</h2>
             <Badge variant="outline" className="h-7 px-3 border-emerald-200 text-emerald-600 font-black text-[10px] uppercase">Active Portfolio</Badge>
           </div>
           
           <div className="grid gap-6 md:grid-cols-2">
             {stats?.shops.map(shop => (
               <Card key={shop.id} className="p-8 rounded-[2.5rem] border-neutral-100 dark:border-neutral-800 hover:shadow-2xl hover:-translate-y-1 transition-all group bg-white dark:bg-neutral-900">
                 <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <Store className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-indigo-950 dark:text-white uppercase tracking-tight text-xl">{shop.name}</h3>
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Local Branch</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => handleSwitchToShop(shop)}
                    title="Enter Control Center"
                    className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-90"
                   >
                     <ExternalLink className="h-5 w-5" />
                   </button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 my-8 pb-8 border-b border-neutral-50 dark:border-neutral-800">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1 italic">Gross Revenue</p>
                      <p className="text-2xl font-black text-emerald-600 tracking-tighter">{formatCurrency(shop.totalRevenue)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1 italic">Total Sales</p>
                      <p className="text-2xl font-black text-indigo-950 dark:text-white tracking-tighter">{shop.invoiceCount}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <AddManagerModal tenantId={shop.id} shopName={shop.name} />
                    <span className="text-[13px] font-black text-emerald-600">{Math.round((shop.paidAmount / (shop.totalRevenue || 1)) * 100)}%</span>
                 </div>
               </Card>
             ))}
           </div>
        </div>

        {/* Global Inventory Search */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-2">
             <LayoutGrid className="h-5 w-5 text-indigo-600" />
             <h2 className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Inventory Hub</h2>
           </div>

           <Card className="p-8 rounded-[3rem] border-neutral-100 dark:border-neutral-800 space-y-8 bg-neutral-50 dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                 <Input 
                   placeholder="Search across all shops..."
                   className="pl-12 h-14 rounded-2xl border-0 shadow-sm focus:ring-emerald-500 bg-white dark:bg-neutral-800 font-medium"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
              </div>

              <div className="space-y-4">
                 {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <div key={product.id} className="p-4 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-between border border-neutral-100 dark:border-neutral-800 group hover:shadow-md transition-all">
                         <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-xl group-hover:text-emerald-600 transition-colors">
                               <Package className="h-5 w-5" />
                            </div>
                            <div>
                               <h4 className="text-[13px] font-black text-indigo-950 dark:text-white uppercase tracking-tight">{product.name}</h4>
                               <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{product.tenant.name}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[13px] font-black text-slate-900 dark:text-white">{formatCurrency(product.price)}</p>
                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{product.stock} in stock</p>
                         </div>
                      </div>
                    ))
                 ) : (
                    <div className="text-center py-10 space-y-4">
                       <Package className="h-10 w-10 text-neutral-200 mx-auto" />
                       <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">No products matched </p>
                    </div>
                 )}
              </div>

              <Button variant="ghost" className="w-full text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:bg-neutral-100 h-12 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
                Generate Full Inventory Report
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}
