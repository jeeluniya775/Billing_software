'use client';

import { 
  X, MapPin, User, Calendar, DollarSign, Activity, 
  ShieldCheck, ShieldAlert, FileText, Tag, History,
  ExternalLink, TrendingDown, ClipboardCheck, ArrowRight,
  QrCode, UserPlus, Info, AlertTriangle
} from 'lucide-react';
import { 
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Asset, MaintenanceRecord } from '@/types/asset';
import { MOCK_MAINTENANCE_HISTORY } from '@/lib/mock-assets';

interface AssetDetailDrawerProps {
  asset: Asset;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssetDetailDrawer({ asset, isOpen, onOpenChange }: AssetDetailDrawerProps) {
  if (!asset) return null;

  const maintenance = MOCK_MAINTENANCE_HISTORY.filter(m => m.assetId === asset.id);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[550px] overflow-y-auto p-0 border-l-0 dark:bg-neutral-900">
        <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <Tag className="h-5 w-5" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none">Asset Lifecycle</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">ID: {asset.id}</p>
               </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => onOpenChange(false)}>
               <X className="h-4 w-4" />
            </Button>
        </div>

        <div className="p-8 space-y-10">
          {/* Main Info Section */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
               <div>
                  <h1 className="text-2xl font-black text-indigo-950 dark:text-white leading-tight">{asset.name}</h1>
                  <p className="text-neutral-500 font-medium">{asset.category} · {asset.department}</p>
               </div>
               <Badge className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border shadow-sm ${
                 asset.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
               }`}>
                 {asset.status}
               </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700/50">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Primary Location</p>
                  <div className="flex items-center gap-2 text-indigo-950 dark:text-white font-bold">
                     <MapPin className="h-4 w-4 text-indigo-600" />
                     {asset.location}
                  </div>
               </div>
               <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700/50">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Currently Assigned</p>
                  <div className="flex items-center gap-2 text-indigo-950 dark:text-white font-bold">
                     <User className="h-4 w-4 text-indigo-600" />
                     {asset.assignedTo || 'Unassigned'}
                     {!asset.assignedTo && <Button size="sm" variant="ghost" className="h-6 px-1.5 text-[10px] text-indigo-600 hover:bg-indigo-50"><UserPlus className="h-3 w-3" /></Button>}
                  </div>
               </div>
            </div>
          </section>

          {/* Financials Overview */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <DollarSign className="h-4 w-4" /> Financial Valuation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
               <div className="p-5 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-l-2xl">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Initial Cost</p>
                  <p className="text-lg font-black mt-1">${asset.purchaseCost.toLocaleString()}</p>
               </div>
               <div className="p-5 bg-indigo-50 dark:bg-indigo-900 border-y md:border-y-0 md:border-x border-indigo-100 dark:border-indigo-800">
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Current Market</p>
                  <p className="text-lg font-black text-indigo-950 dark:text-white mt-1">${asset.currentValue.toLocaleString()}</p>
               </div>
               <div className="p-5 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-r-2xl">
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Total Dep.</p>
                  <p className="text-lg font-black text-rose-600 mt-1">-${(asset.purchaseCost - asset.currentValue).toLocaleString()}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-neutral-500 mt-2">
               <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Acquired {asset.purchaseDate}</span>
               <span className="flex items-center gap-1 font-mono uppercase bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded italic">Method: {asset.depreciationMethod}</span>
            </div>
          </section>

          {/* Maintenance Hub */}
          <section className="space-y-4 pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center justify-between">
               <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> Service Records</span>
               <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{maintenance.length} Logs</span>
            </h3>
            <div className="space-y-3">
               {maintenance.length > 0 ? maintenance.map(m => (
                 <div key={m.id} className="p-4 bg-white dark:bg-neutral-800 border bg-indigo-50/10 border-neutral-100 dark:border-neutral-700 rounded-2xl flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 bg-neutral-50 dark:bg-neutral-900 rounded-full flex items-center justify-center text-emerald-600">
                          <ClipboardCheck className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{m.type} Service</p>
                          <p className="text-[11px] text-neutral-400 mt-1.5">{m.performer} · {m.date}</p>
                       </div>
                    </div>
                    <p className="text-xs font-black text-neutral-600 dark:text-neutral-400">${m.cost}</p>
                 </div>
               )) : (
                 <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
                    <History className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">No service history found</p>
                 </div>
               )}
            </div>
            <Button variant="outline" className="w-full h-10 text-[11px] font-black uppercase tracking-widest border-indigo-100 dark:border-indigo-900/50 text-indigo-600 bg-indigo-50/50">Schedule Next Service</Button>
          </section>

          {/* Insurance & Protection Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-5 bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                   <ShieldCheck className="h-4 w-4 text-emerald-600" />
                   <h4 className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">Warranty Status</h4>
                </div>
                <p className="text-lg font-black text-emerald-950 dark:text-white leading-none">Valid</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2">Expires {asset.warrantyExpiry || 'N/A'}</p>
             </div>
             <div className="p-5 bg-rose-50/50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                   <ShieldAlert className="h-4 w-4 text-rose-600" />
                   <h4 className="text-[11px] font-black text-rose-800 dark:text-rose-400 uppercase tracking-widest">Insurance Policy</h4>
                </div>
                <p className="text-lg font-black text-rose-950 dark:text-white leading-none">{asset.insuranceExpiry ? 'Active' : 'Missing'}</p>
                <p className="text-[10px] text-rose-600 font-bold uppercase mt-2">{asset.insuranceExpiry ? `Exp: ${asset.insuranceExpiry}` : 'Policy input required'}</p>
             </div>
          </section>

          {/* Quick Actions Footer */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-neutral-100 dark:border-neutral-800">
             <Button className="bg-indigo-950 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 shadow-lg">
                <QrCode className="h-4 w-4 mr-2" /> Print Tag
             </Button>
             <Button variant="outline" className="border-neutral-200 dark:border-neutral-700 h-12 h-12 font-black uppercase tracking-[0.2em] text-[10px] text-neutral-600">
                <FileText className="h-4 w-4 mr-2" /> PDF Report
             </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
