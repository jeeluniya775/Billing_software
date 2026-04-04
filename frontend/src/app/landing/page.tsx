'use client';

import Link from 'next/link';
import { 
  ShoppingBag, 
  Store, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ChevronRight,
  Package,
  Layers,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function MarketplaceLanding() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-neutral-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
               <Layers className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">BillFast</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:text-emerald-600 transition-colors">Features</Link>
            <Link href="#marketplace" className="text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:text-emerald-600 transition-colors">Ecosystem</Link>
          </div>

          <div className="flex items-center gap-4">
             <Link href="/login">
                <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:text-emerald-600 h-10 px-6 rounded-xl">Portal Log In</Button>
             </Link>
             <Link href="/register">
                <Button className="bg-indigo-950 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] h-12 px-8 rounded-2xl shadow-xl shadow-indigo-950/20 transition-all">Join Marketplace</Button>
             </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 p-40 opacity-10 bg-emerald-500 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 p-40 opacity-5 bg-indigo-500 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="max-w-4xl space-y-10">
              <div className="space-y-4">
                 <Badge variant="outline" className="h-8 px-4 border-emerald-200 text-emerald-600 font-black text-[10px] uppercase tracking-widest gap-2 bg-emerald-50/50">
                    <Sparkles className="h-3 w-3" /> The Next-Gen Commerce Network
                 </Badge>
                 <h1 className="text-7xl md:text-8xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-[0.9]">
                   Trade Without <br /> 
                   <span className="text-emerald-600">Boundaries.</span>
                 </h1>
              </div>

              <p className="text-xl md:text-2xl text-neutral-500 font-medium max-w-2xl leading-relaxed">
                Connect with thousands of verified shops, manage your orders, and track your business growth in a single, unified marketplace ecosystem.
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                 <Link href="/portal">
                    <Button className="h-16 px-10 bg-indigo-950 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[12px] rounded-[2rem] gap-4 shadow-2xl shadow-indigo-950/40 transition-all hover:-translate-y-1 active:scale-95 group">
                      Explore Marketplace <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </Link>
                 <Link href="/register">
                    <Button variant="outline" className="h-16 px-10 border-2 border-neutral-200 dark:border-neutral-800 text-indigo-950 dark:text-white font-black uppercase tracking-widest text-[12px] rounded-[2rem] hover:bg-neutral-50 transition-all">
                      Become a Merchant
                    </Button>
                 </Link>
              </div>

              <div className="grid grid-cols-3 gap-12 pt-16 border-t border-neutral-100 dark:border-neutral-800 max-w-2xl">
                 <div className="space-y-1">
                    <p className="text-3xl font-black tracking-tighter">500+</p>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Active Shops</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-3xl font-black tracking-tighter">12K+</p>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Products</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-3xl font-black tracking-tighter">99.9%</p>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">SLA Uptime</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center space-y-4 mb-24">
              <h2 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] italic">Engineered for Scale</h2>
              <p className="text-5xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Hyper-Localized Commerce</p>
           </div>

           <div className="grid md:grid-cols-3 gap-10">
              {[
                { 
                  icon: ShieldCheck, 
                  title: 'Verified Shops', 
                  desc: 'Every merchant on our platform goes through a rigorous identity verification process to ensure trade safety.',
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50'
                },
                { 
                  icon: Zap, 
                  title: 'Instant Checkout', 
                  desc: 'One-tap ordering across multiple shops with our unified cart system and secure payment gateway.',
                  color: 'text-blue-600',
                  bg: 'bg-blue-50'
                },
                { 
                  icon: Globe, 
                  title: 'Global Reach', 
                  desc: 'Expand your customer base from local neighborhoods to international markets with zero infrastructure friction.',
                  color: 'text-purple-600',
                  bg: 'bg-purple-50'
                }
              ].map((feature, i) => (
                <div key={i} className="group p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-neutral-100 dark:border-neutral-800 hover:shadow-2xl hover:-translate-y-2 transition-all">
                   <div className={cn("inline-flex p-4 rounded-2xl mb-8 group-hover:scale-110 transition-transform", feature.bg, feature.color)}>
                      <feature.icon className="h-8 w-8" />
                   </div>
                   <h3 className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tight mb-4">{feature.title}</h3>
                   <p className="text-neutral-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section id="marketplace" className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 space-y-10">
                 <div className="space-y-4">
                    <h2 className="text-6xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-[0.9]">
                       A Unified <br /> Shopping <br /> <span className="text-indigo-600 italic">Interface.</span>
                    </h2>
                 </div>
                 <p className="text-xl text-neutral-500 font-medium leading-relaxed">
                    We've centralized product discovery while maintaining individual shop identities. Customers can filter by region, category, or specific business branch without losing the premium marketplace feel.
                 </p>
                 <div className="space-y-6">
                    {[
                      { icon: Search, label: 'Global Inventory Search' },
                      { icon: Store, label: 'Detailed Shop Profiles' },
                      { icon: ShoppingBag, label: 'Multi-Shop Orders' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                         <div className="h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center">
                            <ChevronRight className="h-3 w-3 text-indigo-600" />
                         </div>
                         <span className="text-[11px] font-black uppercase tracking-widest text-indigo-950 dark:text-white">{item.label}</span>
                      </div>
                    ))}
                 </div>
                 <Link href="/portal" className="block pt-6">
                    <Button className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-emerald-600/20">
                      Visit the Marketplace
                    </Button>
                 </Link>
              </div>

              <div className="lg:w-1/2 relative">
                 <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] rounded-full" />
                 <div className="relative bg-white dark:bg-neutral-900 rounded-[3rem] border border-neutral-100 dark:border-neutral-800 shadow-2xl p-8 space-y-6 transform lg:rotate-3 hover:rotate-0 transition-transform duration-700">
                    <div className="flex items-center justify-between pb-6 border-b border-neutral-50 dark:border-neutral-800">
                       <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Preview: Global Inventory</span>
                       <div className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-rose-400" />
                          <div className="h-2 w-2 rounded-full bg-amber-400" />
                          <div className="h-2 w-2 rounded-full bg-emerald-400" />
                       </div>
                    </div>
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white dark:bg-neutral-900 rounded-xl flex items-center justify-center shadow-sm">
                               <Package className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                               <p className="text-[13px] font-black uppercase tracking-tight text-indigo-950 dark:text-white">Premium Product {i+1}</p>
                               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Store Branch Alpha</p>
                            </div>
                         </div>
                         <p className="font-black text-indigo-950 dark:text-white">$49.99</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-emerald-600 rounded-lg flex items-center justify-center">
                 <Layers className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-tighter">BillFast Marketplace</span>
           </div>
           
           <div className="flex gap-10">
              <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-emerald-600">Privacy Policy</Link>
              <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-emerald-600">Merchant Terms</Link>
              <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-emerald-600">Contact</Link>
           </div>

           <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">© 2026 BillFast Ecosystem. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
