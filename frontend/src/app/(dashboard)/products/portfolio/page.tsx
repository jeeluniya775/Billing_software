'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Store, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PageHeader } from '@/components/layout/PageHeader';

export default function PortfolioCatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchGlobalProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/products/global');
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch portfolio catalog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.tenant.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <div className="text-center text-muted-foreground font-black uppercase tracking-widest text-[10px]">Loading Master Catalog...</div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-8 animate-in fade-in duration-1000">
      <PageHeader 
        title="Portfolio Catalog"
        subtitle="Unified inventory database across all business units."
        actions={
          <div className="flex items-center gap-3">
             <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-0 font-black text-[10px] uppercase tracking-widest px-4 h-10 flex items-center gap-2">
                <Globe className="h-4 w-4" /> Global View
             </Badge>
             <Button variant="outline" className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest border-neutral-200">Export Master List</Button>
          </div>
        }
      />

      {/* Search and Filters */}
      <Card className="p-6 rounded-[2.5rem] border-neutral-100 dark:border-neutral-800 shadow-sm bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            placeholder="Search products or shops..."
            className="pl-12 h-14 rounded-2xl border-0 shadow-sm focus:ring-emerald-500 bg-white dark:bg-neutral-800 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Catalog Table */}
      <div className="bg-white dark:bg-neutral-950 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800 h-16">
              <TableHead className="pl-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Shop Source</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Product Detail</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Category</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-neutral-400">Unit Price</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-neutral-400">Inventory</TableHead>
              <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-widest text-neutral-400">Active Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors h-24">
                <TableCell className="pl-8">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-indigo-950 dark:text-white uppercase tracking-tight">{product.tenant.name}</p>
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic">Origin Branch</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <h4 className="text-[14px] font-black text-indigo-950 dark:text-white uppercase tracking-tight">{product.name}</h4>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">{product.sku}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-800">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-black text-indigo-950 dark:text-white text-[15px]">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-right">
                  <p className="text-[14px] font-black text-indigo-950 dark:text-white">{product.stock} Units</p>
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-0.5 italic">Stock Level</p>
                </TableCell>
                <TableCell className="pr-8 text-right">
                  <div className="flex items-center justify-end gap-2 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">In Catalog</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <Package className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
                  <h3 className="text-[13px] font-black text-indigo-950 dark:text-white uppercase tracking-widest">No matching products found</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2">{search ? `No results for "${search}"` : "Try adding products to your shops."}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Summary */}
      <div className="flex items-center justify-between px-8 py-6 bg-indigo-950 dark:bg-emerald-900 rounded-[2rem] text-white">
        <div className="flex items-center gap-6">
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total SKU Portfolio</p>
              <h3 className="text-2xl font-black">{filteredProducts.length}</h3>
           </div>
           <div className="w-px h-10 bg-white/10" />
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cross-Shop Valuation</p>
              <h3 className="text-2xl font-black">{formatCurrency(filteredProducts.reduce((acc, p) => acc + (p.price * p.stock), 0))}</h3>
           </div>
        </div>
        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-[10px] font-black uppercase tracking-widest rounded-xl h-12 px-8">
           Sync All Inventory
        </Button>
      </div>
    </div>
  );
}
