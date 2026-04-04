'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { productsService, Product } from '@/services/products.service';
import { ProductModal } from '@/components/products/ProductModal';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search, Filter, Download, MoreVertical, Trash2, Edit, 
  Package, AlertTriangle, CheckCircle2, DollarSign, BarChart3, ChevronLeft, ChevronRight,
  ArrowUpDown, ArrowUp, ArrowDown, XCircle, Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_PAGE_SIZE = 10;

// Internal component to handle per-image error states in the table
function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  // Smart transformation logic for the table
  const transformUrl = (url: string) => {
    if (!url) return '';
    // Local Uploads (Proxy-compatible)
    if (url.startsWith('/uploads/')) {
      return url; 
    }
    // External Transformations
    if (url.includes('drive.google.com')) {
      const id = url.match(/\/d\/([^\/]+)/)?.[1] || url.match(/[?&]id=([^&]+)/)?.[1];
      if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    if (url.includes('dropbox.com')) {
      return url.replace('dl=0', 'dl=1');
    }
    return url;
  };

  if (error || !src) {
    return <Package className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-300" />;
  }

  return (
    <Image 
      src={transformUrl(src)} 
      alt={alt} 
      fill 
      className="object-cover"
      onError={() => setError(true)}
    />
  );
}

export default function ProductsPage() {
  const { toast } = useToast();
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter/Sort/Pagination State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // KPIS
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    lowStock: 0,
    totalValue: 0,
  });

  const fetchProducts = useCallback(async () => {
    // Only show full loading the very first time (when list is empty)
    if (products.length === 0) setIsLoading(true);
    
    try {
      const response = await productsService.getAll({
        search,
        category: category === 'all' ? undefined : category,
        isActive: status === 'all' ? undefined : status === 'active',
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page,
        limit: DEFAULT_PAGE_SIZE,
        sortBy,
        sortOrder,
      });

      // Use React 18 Transitions for the background update.
      // This is the GOLDEN RULE for fixing 'removeChild' errors: 
      // Defer state-driven data updates until more urgent UI tasks (like modal closings) are handled.
      startTransition(() => {
        setProducts(response.items);
        setTotal(response.meta.total);
        setTotalPages(response.meta.totalPages);
        
        if (response.meta.stats) {
          setStats(response.meta.stats);
        }
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Connection Error",
        description: "Could not sync with the inventory server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, category, status, minPrice, maxPrice, page, sortBy, sortOrder, toast, products.length]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await productsService.delete(id);
      toast({
        title: "Product Removed",
        description: `${name} has been deleted from your catalog.`,
      });
      // Extended Safety Delay: Wait for Radix portals to be 100% unmounted.
      setTimeout(() => {
        fetchProducts();
      }, 300);
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "You may not have permission to delete this asset.",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    toast({
      description: "All filters reset to default.",
    });
  };

  // Next.js Image component safety check
  const isValidUrl = (url: string) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />;
    return sortOrder === 'asc' ? <ArrowUp className="ml-2 h-3 w-3 text-emerald-600" /> : <ArrowDown className="ml-2 h-3 w-3 text-emerald-600" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader 
        title="Product Inventory"
        subtitle="Manage your catalog, prices, and stock levels."
        actions={
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 rounded-xl border-neutral-200 dark:border-neutral-800 font-bold uppercase tracking-widest text-[10px] px-6 hover:bg-neutral-50">
              <Download className="h-4 w-4 mr-2" /> Export Data
            </Button>
            <ProductModal onSuccess={fetchProducts} />
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: stats.total, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50/50', trend: 'Items in your catalog' },
          { label: 'Active Listings', value: stats.active, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50/50', trend: 'Available on the market' },
          { label: 'Low Stock Alerts', value: stats.lowStock, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50/50', trend: 'Items requiring restock' },
          { label: 'Inventory Value', value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50/50', trend: 'Total inventory valuation' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900/50 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden group">
            <div className="flex items-center gap-5 relative z-10">
              <div className={cn("h-16 w-16 rounded-[1.75rem] flex items-center justify-center transition-transform duration-500 group-hover:scale-110", kpi.bg)}>
                <kpi.icon className={cn("h-8 w-8", kpi.color)} />
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-neutral-400 mb-0.5">{kpi.label}</p>
                <p className={cn("text-3xl font-black tracking-tighter", kpi.color)}>{kpi.value}</p>
                <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-tight">{kpi.trend}</p>
              </div>
            </div>
            
            {/* Subtle background decoration */}
            <div className={cn("absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700", kpi.bg)} />
          </div>
        ))}
      </div>

      {/* Advanced Table & Filters */}
      <div className="bg-white dark:bg-zinc-950/50 rounded-[2.5rem] shadow-2xl shadow-neutral-200/50 dark:shadow-none border border-neutral-100 dark:border-neutral-800 overflow-hidden">
        
        {/* Advanced Filters */}
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 grid grid-cols-1 xl:grid-cols-5 gap-6 bg-neutral-50/30 dark:bg-neutral-900/20">
          <div className="relative col-span-1 xl:col-span-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search assets..."
              className="pl-11 h-14 text-sm rounded-2xl bg-white dark:bg-zinc-900 border-none shadow-sm font-medium"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 col-span-1 xl:col-span-4 justify-end">
            <Select value={category} onValueChange={v => { setCategory(v); setPage(1); }}>
              <SelectTrigger className="h-14 w-[180px] text-[10px] font-black uppercase tracking-widest rounded-2xl border-none shadow-sm bg-white dark:bg-zinc-900">
                <Filter className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all">All Categories</SelectItem>
                {['Electronics', 'Furniture', 'Clothing', 'Services', 'Others'].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={v => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="h-14 w-[160px] text-[10px] font-black uppercase tracking-widest rounded-2xl border-none shadow-sm bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", status === 'active' ? 'bg-emerald-500' : status === 'hidden' ? 'bg-red-400' : 'bg-neutral-300')} />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all">Market Status</SelectItem>
                <SelectItem value="active">Active Entry</SelectItem>
                <SelectItem value="hidden">Archived Item</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl h-14 px-4 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Valuation</span>
              <Input 
                type="number" 
                placeholder="0" 
                className="w-16 h-8 text-xs font-bold border-none bg-neutral-50 dark:bg-neutral-800 rounded-lg text-center"
                value={minPrice}
                onChange={e => { setMinPrice(e.target.value); setPage(1); }}
              />
              <span className="text-neutral-200">/</span>
              <Input 
                type="number" 
                placeholder="MAX" 
                className="w-16 h-8 text-xs font-bold border-none bg-neutral-50 dark:bg-neutral-800 rounded-lg text-center"
                value={maxPrice}
                onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
              />
            </div>

            <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="h-14 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors"
            >
              <XCircle className="h-4 w-4 mr-2" /> Reset Sync
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="relative overflow-x-auto min-h-[500px]">
          {/* Background Sync Overlay (Safely outside the table hierarchy) */}
          {(isLoading || isPending) && products.length > 0 && (
            <div className="absolute inset-0 bg-white/[0.02] dark:bg-black/[0.02] backdrop-blur-[1px] z-20 flex items-start justify-center pt-20 pointer-events-none">
              <div className="bg-white dark:bg-zinc-900 shadow-2xl rounded-full px-6 py-3 flex items-center gap-3 border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500">Updating Catalog...</span>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800 h-16">
                <TableHead className="w-[100px] pl-8">Visual</TableHead>
                <TableHead 
                    className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                    onClick={() => handleSort('name')}
                >
                    <div className="flex items-center uppercase tracking-[0.2em] text-[10px] font-black text-neutral-400 group-hover:text-emerald-600">Product <SortIcon column="name" /></div>
                </TableHead>
                <TableHead className="uppercase tracking-[0.2em] text-[10px] font-black text-neutral-400">Category</TableHead>
                <TableHead 
                    className="text-right cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group px-6"
                    onClick={() => handleSort('price')}
                >
                    <div className="flex items-center justify-end uppercase tracking-[0.2em] text-[10px] font-black text-neutral-400 group-hover:text-emerald-600">Unit Price <SortIcon column="price" /></div>
                </TableHead>
                <TableHead 
                    className="text-right cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group px-6"
                    onClick={() => handleSort('stock')}
                >
                    <div className="flex items-center justify-end uppercase tracking-[0.2em] text-[10px] font-black text-neutral-400 group-hover:text-emerald-600">Stock Level <SortIcon column="stock" /></div>
                </TableHead>
                <TableHead className="uppercase tracking-[0.2em] text-[10px] font-black text-neutral-400">Status</TableHead>
                <TableHead className="text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="relative min-h-[400px]">
              {/* Initial Load Spinner */}
              {isLoading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-neutral-400">
                      <div className="h-12 w-12 rounded-3xl bg-neutral-100 animate-spin border-4 border-emerald-500/20 border-t-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Global Data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* No Results Message */}
              {!isLoading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Package className="h-16 w-16 text-neutral-100" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">No matching assets found in the vault.</p>
                      <Button variant="outline" onClick={clearFilters} className="rounded-full h-10 px-6 font-black text-[9px] uppercase">Reset Filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data Rows */}
              {products.map((product) => (
                <TableRow 
                  key={product.id} 
                  className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-all group h-24"
                >
                  <TableCell className="pl-8">
                    <div className="h-16 w-16 rounded-[1.25rem] bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden border border-neutral-100 dark:border-neutral-800 group-hover:scale-110 transition-transform duration-500">
                      {product.imageUrl && isValidUrl(product.imageUrl) ? (
                        <ProductImage src={product.imageUrl} alt={product.name} />
                      ) : (
                        <Package className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-300" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white text-base tracking-tight">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Listed</span>
                        <span className="text-[9px] text-neutral-400 font-mono uppercase tracking-tighter">{product.sku}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <p className="text-lg font-black text-neutral-900 dark:text-white tracking-tight">${product.price.toLocaleString()}</p>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-tighter mt-1">Unit Cost: ${product.costPrice?.toLocaleString() || 0}</p>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex flex-col items-end">
                      <span className={cn("text-base font-black px-3 py-1 rounded-xl", product.stock <= product.lowStockAlert ? 'text-red-600 bg-red-50 animate-pulse' : 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800')}>
                        {product.stock} {product.unit}s
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full animate-pulse", product.isActive ? 'bg-emerald-500' : 'bg-red-400')} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                        {product.isActive ? 'Active' : 'Archived'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-200">
                          <MoreVertical className="h-5 w-5 text-neutral-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-none">
                        <DropdownMenuItem 
                          onSelect={() => handleEdit(product)} 
                          className="gap-3 p-3.5 rounded-2xl cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group"
                        >
                          <Edit className="h-4 w-4 text-emerald-500 transition-transform group-hover:scale-110" /> <span className="font-bold text-[10px] uppercase tracking-widest">Update Product</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="gap-3 p-3.5 rounded-2xl cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 group" 
                            onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" /> <span className="font-bold text-[10px] uppercase tracking-widest">Delete Product</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 bg-neutral-50/20 dark:bg-neutral-900/10">
          <div>
             <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Sync Metrics</p>
             <p className="text-sm font-bold text-neutral-900 dark:text-white mt-1">Showing {total > 0 ? (page - 1) * DEFAULT_PAGE_SIZE + 1 : 0} to {Math.min(page * DEFAULT_PAGE_SIZE, total)} of {total} total items</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
                variant="outline" 
                disabled={page <= 1} 
                onClick={() => setPage((p: number) => p - 1)} 
                className="h-14 w-14 p-0 rounded-2xl border-none shadow-sm active:scale-90 transition-all bg-white dark:bg-zinc-900 hover:bg-neutral-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 h-14 px-8 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
               <span className="text-[14px] font-black text-neutral-900 dark:text-white">{page}</span>
               <span className="text-[14px] font-black text-neutral-200">/</span>
               <span className="text-[14px] font-black text-neutral-400">{totalPages || 1}</span>
            </div>

            <Button 
                variant="outline" 
                disabled={page >= totalPages} 
                onClick={() => setPage((p: number) => p + 1)} 
                className="h-14 w-14 p-0 rounded-2xl border-none shadow-sm active:scale-90 transition-all bg-white dark:bg-zinc-900 hover:bg-neutral-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Global Edit Modal - Moved outside table to prevent unmount crashes */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
