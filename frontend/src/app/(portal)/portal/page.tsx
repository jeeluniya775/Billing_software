'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/card';
import { 
  Receipt, 
  Clock, 
  ChevronRight, 
  LayoutGrid, 
  ShoppingBag, 
  Store, 
  Search,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  Filter,
  Tag,
  ArrowRightCircle,
  PackageCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function CustomerPortalPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ [id: string]: { product: any, quantity: number } }>({});
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const [invRes, prodRes] = await Promise.all([
          api.get('/sales/portal/invoices'),
          api.get('/products/global')
        ]);
        setInvoices(invRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        console.error('Failed to fetch portal data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const addToCart = (product: any) => {
    setCart(prev => ({
      ...prev,
      [product.id]: {
        product,
        quantity: (prev[product.id]?.quantity || 0) + 1
      }
    }));
    
    if (!cart[product.id]) {
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added.`,
        duration: 2000,
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId].quantity > 1) {
        newCart[productId].quantity -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const handleCheckout = async (tenantId: string) => {
    const items = Object.values(cart)
      .filter(item => item.product.tenantId === tenantId)
      .map(item => ({
        productId: item.product.id,
        description: item.product.name,
        quantity: item.quantity,
        rate: item.product.price
      }));

    if (items.length === 0) return;

    try {
      await api.post('/sales/portal/orders', { tenantId, items });
      toast({
        title: "Order Placed!",
        description: "Your order has been sent to the shop successfully.",
      });
      // Clear items from cart for this shop
      setCart(prev => {
        const newCart = { ...prev };
        Object.keys(newCart).forEach(id => {
          if (newCart[id].product.tenantId === tenantId) delete newCart[id];
        });
        return newCart;
      });
      // Refresh invoices
      const invRes = await api.get('/sales/portal/invoices');
      setInvoices(invRes.data);
    } catch (e) {
      toast({
        title: "Checkout Failed",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Unique tenants and categories for filters
  const tenants = Array.from(new Set(products.map(p => JSON.stringify({ id: p.tenantId, name: p.tenant.name }))))
    .map(t => JSON.parse(t));
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.tenant.name.toLowerCase().includes(search.toLowerCase());
    const matchesTenant = !selectedTenant || p.tenantId === selectedTenant;
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesTenant && matchesCategory;
  });

  // Group cart items by tenant for checkout
  const cartTenants = Array.from(new Set(Object.values(cart).map(i => i.product.tenantId)));

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <div className="text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">Syncing with Marketplace...</div>
    </div>
  );

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="h-2 w-16 bg-emerald-600 rounded-full" />
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Marketplace Hub</h1>
           </div>
           <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em] flex items-center gap-2">
             Premium products from trusted local shops <ArrowRightCircle className="h-3 w-3 text-emerald-500" />
           </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input 
                placeholder="Find anything..." 
                className="pl-12 h-14 w-[300px] rounded-2xl border-neutral-200 dark:border-neutral-800 focus:ring-emerald-500 shadow-sm bg-white dark:bg-neutral-900 transition-all focus:w-[400px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <TabsList className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-1 h-14 self-start">
            <TabsTrigger value="store" className="rounded-xl h-12 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-md px-8 gap-3">
               <LayoutGrid className="h-4 w-4" />
               <span className="font-black uppercase tracking-widest text-[10px]">The Store</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl h-12 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-md px-8 gap-3">
               <ShoppingBag className="h-4 w-4" />
               <span className="font-black uppercase tracking-widest text-[10px]">My Purchases</span>
            </TabsTrigger>
          </TabsList>

          {/* Cart Status Indicator (Mobile Only) */}
          <div className="md:hidden">
            <Badge variant="secondary" className="h-10 px-4 rounded-xl flex items-center gap-2 bg-emerald-50 text-emerald-700">
               <ShoppingCart className="h-4 w-4" />
               <span className="font-black">{Object.values(cart).reduce((s, i) => s + i.quantity, 0)} Items</span>
            </Badge>
          </div>
        </div>

        <TabsContent value="store" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Filters */}
           <div className="lg:col-span-1 space-y-8 animate-in slide-in-from-left-4 duration-700">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-4 w-4 text-emerald-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Shop Filter</h4>
                 </div>
                 <div className="flex flex-wrap gap-2 lg:flex-col">
                    <button 
                      onClick={() => setSelectedTenant(null)}
                      className={cn(
                        "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-left",
                        !selectedTenant ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:bg-neutral-200"
                      )}
                    >
                      All Shops
                    </button>
                    {tenants.map(tenant => (
                      <button 
                        key={tenant.id}
                        onClick={() => setSelectedTenant(tenant.id)}
                        className={cn(
                          "px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-left flex items-center justify-between group",
                          selectedTenant === tenant.id ? "bg-indigo-950 text-white shadow-lg" : "bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:bg-neutral-200"
                        )}
                      >
                        <span className="truncate">{tenant.name}</span>
                        <Store className={cn("h-3 w-3 ml-2 shrink-0 group-hover:scale-110 transition-transform", selectedTenant === tenant.id ? "text-emerald-400" : "text-neutral-400")} />
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-emerald-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Categories</h4>
                 </div>
                 <div className="flex flex-wrap gap-2 lg:flex-col">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-left",
                        !selectedCategory ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:bg-neutral-200"
                      )}
                    >
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-left",
                          selectedCategory === cat ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:bg-neutral-200"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Product Grid Area */}
        <div className="flex-1 space-y-8">
          {/* Shop Profile Header (When filtered) */}
          {selectedTenant && (
            <Card className="p-8 rounded-[3rem] border-0 bg-indigo-950 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 -mr-16 -mt-16 p-24 opacity-10 bg-emerald-500 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                  <div className="h-24 w-24 rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl overflow-hidden shrink-0">
                    {products.find(p => p.tenant.id === selectedTenant)?.tenant.logoUrl ? (
                      <img src={products.find(p => p.tenant.id === selectedTenant)?.tenant.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Store className="h-10 w-10 text-emerald-400" />
                    )}
                  </div>
                  <div className="space-y-3">
                     <h2 className="text-4xl font-black uppercase tracking-tighter">
                        {products.find(p => p.tenant.id === selectedTenant)?.tenant.name || 'Shop Profile'}
                     </h2>
                     <p className="text-indigo-200 font-medium max-w-2xl leading-relaxed">
                        {products.find(p => p.tenant.id === selectedTenant)?.tenant.description || 'Welcome to our official marketplace. We are committed to providing you with the best products and service.'}
                     </p>
                     <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-0 font-black text-[10px] uppercase tracking-widest px-4 h-7">
                           Verified Merchant
                        </Badge>
                        <Badge className="bg-white/10 text-white hover:bg-white/20 border-0 font-black text-[10px] uppercase tracking-widest px-4 h-7">
                           {filteredProducts.length} Items Available
                        </Badge>
                     </div>
                  </div>
               </div>
            </Card>
          )}

          {/* Search and Sort Refinements */}
          <div className="flex flex-wrap items-center justify-between gap-4">
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Showing {filteredProducts.length} Results</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                 {filteredProducts.map((product) => (
                   <Card key={product.id} className="group relative bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                      <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300">
                             <LayoutGrid className="h-12 w-12 opacity-10" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                           <Badge className="bg-white/90 dark:bg-neutral-900/90 text-indigo-950 dark:text-white backdrop-blur shadow-sm border-0 font-black uppercase text-[9px] tracking-widest px-3 h-8 rounded-full">
                             {product.tenant.name}
                           </Badge>
                        </div>
                      </div>

                      <div className="p-8 space-y-6">
                         <div className="space-y-2">
                            <div className="flex items-center gap-1.5 font-black uppercase tracking-[0.2em] text-[8px] text-emerald-600">
                               <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                               {product.category || 'Product'}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-neutral-400 font-medium line-clamp-2 leading-relaxed">{product.description || 'Premium selection from our local catalog.'}</p>
                         </div>
                         
                         <div className="flex items-center justify-between pt-2">
                            <div className="space-y-1">
                               <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Market Price</p>
                               <div className="text-2xl font-black text-emerald-600">{formatCurrency(product.price)}</div>
                            </div>

                            {cart[product.id] ? (
                              <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                                <button onClick={() => removeFromCart(product.id)} className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded-lg text-emerald-600 transition-colors"><Minus className="h-4 w-4" /></button>
                                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 min-w-[20px] text-center">{cart[product.id].quantity}</span>
                                <button onClick={() => addToCart(product)} className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded-lg text-emerald-600 transition-colors"><Plus className="h-4 w-4" /></button>
                              </div>
                            ) : (
                              <Button 
                               onClick={() => addToCart(product)}
                               className="bg-indigo-950 hover:bg-emerald-600 text-white rounded-2xl h-12 w-12 p-0 transition-all duration-300 hover:w-[130px] group/btn whitespace-nowrap overflow-hidden shadow-lg shadow-indigo-950/20"
                              >
                                <Plus className="h-5 w-5 shrink-0" />
                                <span className="opacity-0 group-hover/btn:opacity-100 font-black uppercase tracking-widest text-[9px] ml-2 transition-opacity duration-300">Buy Now</span>
                              </Button>
                            )}
                         </div>
                      </div>
                   </Card>
                 ))}
              </div>
           </div>

           {/* Floating Cart Panel (Sticky on right in grid) */}
           {Object.keys(cart).length > 0 && (
             <div className="fixed bottom-10 right-10 z-50 animate-in slide-in-from-right-10 duration-500">
                <Card className="w-[380px] rounded-[3.5rem] shadow-2xl border-emerald-100 dark:border-emerald-900 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-10 ring-1 ring-emerald-500/10">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/30">
                           <ShoppingCart className="h-6 w-6 text-white" />
                         </div>
                         <div>
                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-2xl">Your Hub</h4>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Order from multiple shops</p>
                         </div>
                      </div>
                      <Badge variant="outline" className="h-8 px-3 rounded-full border-emerald-200 text-emerald-600 font-black font-mono">
                         {Object.values(cart).reduce((s, i) => s + i.quantity, 0)}
                      </Badge>
                   </div>
                   
                   <div className="space-y-8 max-h-[400px] overflow-y-auto mb-8 pr-2 scrollbar-thin">
                      {cartTenants.map(tenantId => {
                        const shopItems = Object.values(cart).filter(i => i.product.tenantId === tenantId);
                        const shopName = shopItems[0].product.tenant.name;
                        const shopTotal = shopItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
                        
                        return (
                          <div key={tenantId} className="space-y-4 p-4 rounded-[2rem] bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                             <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                   <Store className="h-4 w-4 text-emerald-600" />
                                   <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">{shopName}</span>
                                </div>
                                <span className="text-sm font-black text-emerald-600">{formatCurrency(shopTotal)}</span>
                             </div>
                             
                             <div className="space-y-2 px-2">
                                {shopItems.map(item => (
                                  <div key={item.product.id} className="flex justify-between items-center text-[11px] text-neutral-500 font-medium">
                                     <span className="truncate max-w-[120px]">{item.product.name} × {item.quantity}</span>
                                     <span className="font-bold">{formatCurrency(item.product.price * item.quantity)}</span>
                                  </div>
                                ))}
                             </div>

                             <Button 
                              onClick={() => handleCheckout(tenantId)}
                              className="w-full bg-indigo-950 hover:bg-emerald-600 text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-950/10 transition-all active:scale-95"
                             >
                               Finalize Order
                             </Button>
                          </div>
                        )
                      })}
                   </div>
                   
                   <div className="flex items-center justify-between px-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total Value</span>
                      <span className="text-2xl font-black text-indigo-950 dark:text-white">
                        {formatCurrency(Object.values(cart).reduce((acc, i) => acc + (i.product.price * i.quantity), 0))}
                      </span>
                   </div>
                </Card>
             </div>
           )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-8 animate-in slide-in-from-right-4 duration-700">
           <div className="grid gap-8 max-w-4xl">
            {invoices.length === 0 ? (
              <div className="p-20 text-center bg-white dark:bg-neutral-900 border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[3rem]">
                 <div className="p-6 h-20 w-20 bg-neutral-50 dark:bg-neutral-800 rounded-[2rem] mx-auto mb-6 flex items-center justify-center">
                    <Receipt className="h-8 w-8 text-neutral-300" />
                 </div>
                 <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">No Order History</h4>
                 <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] italic">Time to start your first shopping spree</p>
                 <Button 
                  onClick={() => {
                    const storeTab = document.querySelector('[value="store"]') as HTMLElement;
                    storeTab?.click();
                  }}
                  className="mt-8 bg-emerald-600 hover:bg-indigo-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8"
                 >
                   Back to Store
                 </Button>
              </div>
            ) : (
              invoices.map((invoice) => (
                <Card key={invoice.id} className="p-10 hover:shadow-2xl transition-all group border-neutral-100 dark:border-neutral-800 rounded-[3.5rem] overflow-hidden relative bg-white dark:bg-neutral-900 ring-1 ring-neutral-50 dark:ring-neutral-800">
                   <div className={cn(
                    "absolute top-0 right-0 px-10 py-3 text-[10px] font-black uppercase tracking-[0.3em] rounded-bl-[2rem]",
                    invoice.status === 'PAID' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                  )}>
                    {invoice.status}
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="flex items-start gap-8">
                      <div className="p-6 rounded-[2rem] bg-neutral-50 dark:bg-neutral-800 text-indigo-950 dark:text-neutral-500 shadow-inner group-hover:bg-indigo-950 group-hover:text-white transition-all duration-500">
                        <PackageCheck className="h-8 w-8" />
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{invoice.tenant?.name || 'Authorized Store'}</p>
                           <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{invoice.invoiceNo}</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-6">
                           <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-black uppercase tracking-widest">
                             <Clock className="h-4 w-4 text-neutral-300" />
                             {new Date(invoice.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                           </div>
                           <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-black uppercase tracking-widest">
                             <Tag className="h-4 w-4 text-neutral-300" />
                             {invoice.items?.length || 0} Products
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-12 border-t md:border-t-0 pt-8 md:pt-0">
                      <div className="text-right space-y-1">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black italic">Final Valuation</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{formatCurrency(invoice.total)}</p>
                      </div>
                      <button className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-[2rem] hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95">
                         <ChevronRight className="h-8 w-8" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
