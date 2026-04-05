'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { useTenantStore } from '@/store/tenant.store';

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
  const { selectedTenant } = useTenantStore();
  
  // Filter/Sort/Pagination State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [brand, setBrand] = useState('all');
  const [stockStatus, setStockStatus] = useState('all');
  const [status, setStatus] = useState('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // React Query Fetching
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', { 
      tenantId: selectedTenant?.id, 
      search, category, brand, stockStatus, status, minPrice, maxPrice, page, sortBy, sortOrder 
    }],
    queryFn: () => productsService.getAll({
      search,
      category: category === 'all' ? undefined : category,
      brand: brand === 'all' ? undefined : brand,
      stockStatus: stockStatus === 'all' ? undefined : stockStatus,
      isActive: status === 'all' ? undefined : status === 'active',
      page,
      limit: DEFAULT_PAGE_SIZE,
      sortBy,
      sortOrder,
    }),
    placeholderData: (previousData: any) => previousData,
  });

  const products = data?.items || [];
  const total = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;
  const stats = data?.meta?.stats || { total: 0, active: 0, lowStock: 0, totalValue: 0 };

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
      setTimeout(() => {
        refetch();
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
    setBrand('all');
    setStockStatus('all');
    setStatus('all');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    toast({
      description: "All filters reset to default.",
    });
  };

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

  const getStockBadge = (product: Product) => {
    if (product.stock <= 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-100', icon: XCircle };
    if (product.stock <= product.lowStockAlert) return { label: 'Low Stock', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: AlertTriangle };
    if (product.stock >= 100) return { label: 'Overstock', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Sparkles };
    return { label: 'Healthy', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle2 };
  };

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        title={selectedTenant ? `Catalog: ${selectedTenant.name}` : "Product Inventory"}
        subtitle="Manage your catalog, prices, and stock levels."
        actions={
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 rounded-xl border-neutral-200 dark:border-neutral-800 font-bold uppercase tracking-widest text-[10px] px-6 hover:bg-neutral-50 active:scale-95 transition-all">
              <Download className="h-4 w-4 mr-2" /> Export Data
            </Button>
            <ProductModal onSuccess={refetch} />
          </div>
        }
      />

      {/* KPI Cards */}
      <div id="slim-kpi-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: stats.total, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50/50', trend: 'Global catalog' },
          { label: 'Active Listings', value: stats.active, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50/50', trend: 'Live entries' },
          { label: 'Critical Assets', value: stats.lowStock, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50/50', trend: 'Restock req.' },
          { label: 'Inventory Value', value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50/50', trend: 'Total valuation' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className={cn("h-10 w-10 min-w-[2.5rem] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg)}>
                <kpi.icon className={cn("h-5 w-5", kpi.color)} />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 leading-none mb-1 truncate">{kpi.label}</p>
                <div className="flex items-baseline gap-1.5">
                   <p className={cn("text-lg font-bold tracking-tight text-neutral-900 dark:text-white truncate")}>{kpi.value}</p>
                   {i === 2 && kpi.value > 0 && <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 opacity-60" />}
                </div>
                <p className="text-[7px] font-medium text-neutral-300 uppercase tracking-tight truncate mt-0.5">{kpi.trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Table & Filters */}
      <div id="products-vault-container" className="bg-white dark:bg-zinc-950/50 rounded-[1.5rem] shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden">
        
        {/* Advanced Filters Header */}
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Universal Search (Name, SKU, Barcode...)"
                className="pl-11 h-12 text-xs rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm font-medium focus-visible:ring-emerald-500/20"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <div className="flex gap-3">
              <Button 
                variant={showFilters ? "default" : "outline"} 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "h-12 px-5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95",
                  showFilters ? "bg-black text-white" : "bg-white"
                )}
              >
                <Filter className="h-4 w-4 mr-2" /> {showFilters ? 'Hide Advanced' : 'Show Advanced'}
              </Button>
              <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="h-12 px-5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors"
              >
                <XCircle className="h-4 w-4 mr-2" /> Reset Sync
              </Button>
            </div>
          </div>

          {/* Expandable Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-white dark:bg-zinc-900/50 rounded-3xl border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Industry Category</label>
                 <Select value={category} onValueChange={v => { setCategory(v); setPage(1); }}>
                    <SelectTrigger className="h-12 rounded-xl border-none bg-neutral-50 dark:bg-neutral-800 shadow-inner text-[11px] font-bold">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="all">All Industries</SelectItem>
                      {['Electronics', 'Furniture', 'Clothing', 'Services', 'Others'].map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Brand Scope</label>
                 <Select value={brand} onValueChange={v => { setBrand(v); setPage(1); }}>
                    <SelectTrigger className="h-12 rounded-xl border-none bg-neutral-50 dark:bg-neutral-800 shadow-inner text-[11px] font-bold">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="all">Global Brands</SelectItem>
                      {/* In a real app, these would come from the API */}
                      {['Apple', 'Samsung', 'Sony', 'Nike', 'Generic'].map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Inventory Health</label>
                 <Select value={stockStatus} onValueChange={v => { setStockStatus(v); setPage(1); }}>
                    <SelectTrigger className="h-12 rounded-xl border-none bg-neutral-50 dark:bg-neutral-800 shadow-inner text-[11px] font-bold">
                      <SelectValue placeholder="Stock Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="all">Global Availability</SelectItem>
                      <SelectItem value="in_stock">Healthy (In Stock)</SelectItem>
                      <SelectItem value="low_stock">Critical (Low Stock)</SelectItem>
                      <SelectItem value="out_of_stock">Emergency (Out of Stock)</SelectItem>
                      <SelectItem value="overstock">Overstock (&gt;100 units)</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Market Status</label>
                 <Select value={status} onValueChange={v => { setStatus(v); setPage(1); }}>
                    <SelectTrigger className="h-12 rounded-xl border-none bg-neutral-50 dark:bg-neutral-800 shadow-inner text-[11px] font-bold">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="active">Active Listing</SelectItem>
                      <SelectItem value="hidden">Archived / Hidden</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">Valuation Range</label>
                 <div className="flex items-center gap-2">
                    <Input 
                      placeholder="MIN" 
                      className="h-12 rounded-xl border-none bg-neutral-50 dark:bg-neutral-800 shadow-inner text-xs font-bold"
                      value={minPrice}
                      onChange={e => { setMinPrice(e.target.value); setPage(1); }}
                    />
                    <span className="text-neutral-300 font-bold">-</span>
                    <Input 
                      placeholder="MAX" 
                      className="h-12 rounded-xl border-none bg-neutral-50 dark:bg-neutral-800 shadow-inner text-xs font-bold"
                      value={maxPrice}
                      onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
                    />
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="relative overflow-x-auto min-h-[500px]">
          {/* Background Sync Overlay */}
          {isLoading && products.length > 0 && (
            <div className="absolute inset-0 bg-white/[0.02] dark:bg-black/[0.02] backdrop-blur-[1px] z-20 flex items-start justify-center pt-20 pointer-events-none">
              <div className="bg-white dark:bg-zinc-900 shadow-2xl rounded-full px-6 py-3 flex items-center gap-3 border border-neutral-100 dark:border-neutral-800">
                <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500">Refreshing Vault...</span>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800 h-14">
                <TableHead className="w-[80px] pl-8 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Visual</TableHead>
                <TableHead 
                    className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                    onClick={() => handleSort('name')}
                >
                    <div className="flex items-center uppercase tracking-widest text-[9px] font-bold text-neutral-400 group-hover:text-emerald-600">Product Detail <SortIcon column="name" /></div>
                </TableHead>
                <TableHead className="uppercase tracking-widest text-[9px] font-bold text-neutral-400">Inventory Health</TableHead>
                <TableHead 
                    className="text-right cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group px-6"
                    onClick={() => handleSort('price')}
                >
                    <div className="flex items-center justify-end uppercase tracking-widest text-[9px] font-bold text-neutral-400 group-hover:text-emerald-600">Unit Price <SortIcon column="price" /></div>
                </TableHead>
                <TableHead 
                    className="text-right cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group px-6"
                    onClick={() => handleSort('stock')}
                >
                    <div className="flex items-center justify-end uppercase tracking-widest text-[9px] font-bold text-neutral-400 group-hover:text-emerald-600">Stock Level <SortIcon column="stock" /></div>
                </TableHead>
                <TableHead className="uppercase tracking-widest text-[9px] font-bold text-neutral-400">Market Status</TableHead>
                <TableHead className="text-right pr-8 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="relative min-h-[400px]">
              {/* Initial Load Spinner */}
              {isLoading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-neutral-400">
                      <div className="h-12 w-12 rounded-3xl bg-neutral-100 animate-spin border-4 border-emerald-500/20 border-t-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Establishing Secure Connection...</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* No Results Message */}
              {!isLoading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="h-20 w-20 rounded-full bg-neutral-50 flex items-center justify-center">
                        <Package className="h-10 w-10 text-neutral-200" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">The vault is currently empty for this query.</p>
                      <Button variant="outline" onClick={clearFilters} className="rounded-full h-10 px-8 font-black text-[9px] uppercase border-neutral-200">Reset Filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data Rows */}
              {products.map((product: Product) => {
                const stock = getStockBadge(product);
                return (
                  <TableRow 
                    key={product.id} 
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-all group h-20 border-b border-neutral-50 dark:border-neutral-900"
                  >
                    <TableCell className="pl-8">
                      <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden border border-neutral-100 dark:border-neutral-800 group-hover:scale-110 transition-transform shadow-sm">
                        {product.imageUrl && isValidUrl(product.imageUrl) ? (
                          <ProductImage src={product.imageUrl} alt={product.name} />
                        ) : (
                          <Package className="h-5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-bold text-neutral-900 dark:text-white text-sm tracking-tight leading-none truncate max-w-[200px]">{product.name}</p>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-tighter border border-indigo-100/50">{product.brand || 'No Brand'}</span>
                          <span className="text-[8px] text-neutral-400 bg-neutral-50 dark:bg-neutral-900 px-2 py-0.5 rounded-md font-mono uppercase tracking-tighter border border-neutral-100 dark:border-neutral-800">{product.sku}</span>
                          {product.barcode && <span className="text-[8px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-mono uppercase tracking-tighter border border-emerald-100/50">{product.barcode}</span>}
                        </div>
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                             {product.tags.slice(0, 3).map(tag => (
                               <span key={tag} className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest">#{tag}</span>
                             ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest", stock.color)}>
                         <stock.icon className="h-3 w-3" />
                         {stock.label}
                       </div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">${product.price.toLocaleString()}</p>
                        <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-widest mt-1 opacity-60">GP: {product.costPrice ? (((product.price - product.costPrice) / product.price) * 100).toFixed(0) : 0}% Margin</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex flex-col items-end">
                        <span className={cn(
                          "text-sm font-bold px-3 py-1 rounded-[1.25rem] shadow-sm border transition-all", 
                          product.stock <= product.lowStockAlert 
                            ? 'text-red-700 bg-red-50 border-red-200' 
                            : 'text-neutral-950 dark:text-white bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800'
                        )}>
                          {product.stock.toLocaleString()} <span className="text-[9px] ml-1 opacity-40 capitalize">{product.unit}s</span>
                        </span>
                        <div className="w-20 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-2 overflow-hidden">
                           <div 
                             className={cn("h-full rounded-full transition-all duration-1000", product.stock <= product.lowStockAlert ? 'bg-red-500' : 'bg-emerald-500')} 
                             style={{ width: `${Math.min((product.stock / (product.maxStockLevel || 100)) * 100, 100)}%` }}
                           />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full shadow-sm", product.isActive ? 'bg-emerald-500' : 'bg-neutral-300')} />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                          {product.isActive ? 'Listed' : 'Paused'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-200">
                            <MoreVertical className="h-4 w-4 text-neutral-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-3 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border-none bg-white dark:bg-neutral-900">
                          <DropdownMenuItem 
                            onSelect={() => handleEdit(product)} 
                            className="gap-3 p-3.5 rounded-2xl cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group transition-all"
                          >
                            <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Edit className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-[10px] uppercase tracking-widest">Update Asset</span>
                              <span className="text-[8px] text-neutral-400 font-bold uppercase">Modify details</span>
                            </div>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                              className="gap-3 p-3.5 rounded-2xl cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 group mt-1 transition-all" 
                              onClick={() => handleDelete(product.id, product.name)}
                          >
                            <div className="h-8 w-8 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-[10px] uppercase tracking-widest">Terminate</span>
                              <span className="text-[8px] text-red-400 font-bold uppercase">Hard delete entry</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
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
            refetch();
          }}
        />
      )}
    </div>
  );
}
