'use client';

import { useState, useEffect, useMemo } from 'react';
import { productsService, Product } from '@/services/products.service';
import { ProductModal } from '@/components/products/ProductModal';
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
  Package, AlertTriangle, CheckCircle2, DollarSign, BarChart3, ChevronLeft, ChevronRight
} from 'lucide-react';
import Image from 'next/image';

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsService.getAll(search, categoryFilter === 'all' ? undefined : categoryFilter);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter]);

  const filtered = useMemo(() => products, [products]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsService.delete(id);
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  // KPI Calculations
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    lowStock: products.filter(p => p.stock <= p.lowStockAlert).length,
    totalValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products & Inventory</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your product catalog, pricing, and stock levels.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <ProductModal onSuccess={fetchProducts} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Items', value: stats.active, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Inventory Value', value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <BarChart3 className="h-4 w-4 text-neutral-300" />
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Advanced Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-700 flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search by name or SKU..."
              className="pl-9 h-9 text-sm rounded-lg"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
              <SelectTrigger className="h-9 w-[150px] text-sm rounded-lg">
                <Filter className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {['Electronics', 'Furniture', 'Clothing', 'Services', 'Others'].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900/50">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Info</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="h-40 text-center text-neutral-400">Loading products...</TableCell></TableRow>
              ) : paginated.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-40 text-center text-neutral-400">No products found.</TableCell></TableRow>
              ) : paginated.map((product) => (
                <TableRow key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
                  <TableCell>
                    <div className="h-12 w-12 rounded-lg bg-neutral-100 dark:bg-neutral-700 relative overflow-hidden border border-neutral-200 dark:border-neutral-600">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <Package className="h-5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{product.name}</p>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">{product.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-gray-900 dark:text-white">
                    ${product.price.toLocaleString()}
                    <p className="text-[10px] text-neutral-400 font-normal">Cost: ${product.costPrice?.toLocaleString() || 0}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-semibold ${product.stock <= product.lowStockAlert ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                        {product.stock} {product.unit}s
                      </span>
                      {product.stock <= product.lowStockAlert && (
                        <span className="text-[10px] text-red-500 flex items-center gap-0.5">
                          <AlertTriangle className="h-2.5 w-2.5" /> Low Stock
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       {product.isActive ? (
                         <span className="h-2 w-2 rounded-full bg-emerald-500" />
                       ) : (
                         <span className="h-2 w-2 rounded-full bg-red-400" />
                       )}
                       <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                         {product.isActive ? 'Active' : 'Hidden'}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <ProductModal 
                          product={product} 
                          onSuccess={fetchProducts}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2">
                              <Edit className="h-3.5 w-3.5 text-blue-500" /> Edit Details
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete Product
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
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between text-sm text-neutral-500">
          <span>Showing {paginated.length} of {filtered.length} products</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-neutral-900 dark:text-white font-medium">Page {page} of {totalPages || 1}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
