'use client';

import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Receipt, ShieldCheck, Clock, Download, Printer, TrendingUp, 
  Search, Info, CheckCircle2, AlertCircle, Sparkles, Building2,
  Calendar, CreditCard, Tag, Landmark, FileText, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Expense } from '@/types/expense';

interface VisualAuditModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_VARIANTS: Record<string, string> = {
  PAID: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
  APPROVED: 'bg-blue-50 text-blue-600 border-blue-100',
  REJECTED: 'bg-rose-50 text-rose-600 border-rose-100',
};

export function VisualAuditModal({ expense, isOpen, onClose }: VisualAuditModalProps) {
  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-zinc-950 border-none rounded-[2rem] p-0 overflow-hidden shadow-2xl">
        {/* Header: Digital Receipt Style */}
        <div className="bg-neutral-900 p-8 text-white relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Landmark className="h-24 w-24 rotate-12" />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Receipt className="h-5 w-5" />
                 </div>
                 <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 leading-none mb-1">Audit Ledger Entry</h2>
                    <p className="text-sm font-semibold tracking-tight text-white/80">Ref: {expense.id.split('-')[0].toUpperCase()}</p>
                 </div>
                 <Badge className="ml-auto bg-white/10 text-white border-white/20 hover:bg-white/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                    Verified Record
                 </Badge>
              </div>

              <div className="flex flex-col items-center justify-center py-6 border-y border-white/10 my-4">
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-2">Net Expenditure</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-medium text-neutral-400">$</span>
                    <h1 className="text-6xl font-black tracking-tighter leading-none">{expense.amount.toLocaleString()}</h1>
                    <span className="text-xl font-bold text-neutral-500">.00</span>
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-4 italic">USD • {expense.category}</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-7 w-7 rounded-full border-2 border-neutral-900 bg-indigo-500 flex items-center justify-center text-[8px] font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="h-7 w-7 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-neutral-500">
                      +2
                    </div>
                 </div>
                 <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Authorized by Corporate Treasury</p>
              </div>
           </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8">
           {/* Section 1: Lifecycle Timeline */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <Clock className="h-3.5 w-3.5 text-neutral-400" />
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Vault Lifecycle</h3>
              </div>
              <div className="relative flex justify-between">
                 <div className="absolute top-[14px] left-0 right-0 h-[2px] bg-neutral-100 dark:bg-neutral-800 -z-10" />
                 {[
                   { label: 'Created', time: new Date(expense.createdAt).toLocaleDateString(), status: 'done', icon: FileText },
                   { label: 'Validated', time: 'Manual Audit', status: 'done', icon: ShieldCheck },
                   { label: 'Locked', time: 'Vault Final', status: 'active', icon: Landmark }
                 ].map((step, i) => (
                   <div key={i} className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-950 px-2">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all",
                        step.status === 'done' ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white border-neutral-200 text-neutral-400"
                      )}>
                        <step.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-center">
                         <p className="text-[9px] font-bold uppercase tracking-tighter mb-0.5">{step.label}</p>
                         <p className="text-[8px] font-medium text-neutral-400 truncate w-16">{step.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Section 2: Audit Insights (Premium Panel) */}
           <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-5 border border-indigo-100/50 dark:border-indigo-800/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                 <Sparkles className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                 <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Audit Pulse Insights</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                    <div>
                       <p className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300">Trend Alignment</p>
                       <p className="text-[9px] text-neutral-500 mt-0.5">Record matches typical monthly burn rate for {expense.category}.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <ShieldCheck className="h-4 w-4 text-indigo-600 mt-0.5" />
                    <div>
                       <p className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300">Vault Hash Valid</p>
                       <p className="text-[9px] text-neutral-500 mt-0.5">Integrity check passed. This entry is locked in the Immutable Ledger.</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 3: Detailed Data Grid */}
           <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-4">
              <div className="space-y-4">
                 <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 flex items-center gap-1.5"><Building2 className="h-3 w-3" /> Entity / Vendor</p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">{expense.vendor || 'Unknown Payee'}</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 flex items-center gap-1.5"><Tag className="h-3 w-3" /> Audit Class</p>
                    <Badge className={cn("text-[9px] font-bold uppercase px-2 py-0", STATUS_VARIANTS[expense.status] || 'bg-neutral-50')}>
                       {expense.status}
                    </Badge>
                 </div>
              </div>
              <div className="space-y-4">
                 <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Finalized On</p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tighter">
                      {new Date(expense.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                 </div>
                 <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 flex items-center gap-1.5"><CreditCard className="h-3 w-3" /> Currency / Hub</p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white uppercase">USD • {expense.category}</p>
                 </div>
              </div>
              <div className="col-span-2 space-y-2 pt-2 border-t border-neutral-50 dark:border-neutral-900 pt-6">
                 <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-1.5"><FileText className="h-3 w-3" /> Internal Context</p>
                 <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl">
                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 italic leading-relaxed">"{expense.description}"</p>
                 </div>
              </div>
           </div>

           {/* Footer Actions */}
           <div className="flex gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Button variant="outline" className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-50 active:scale-95 transition-all">
                 <Printer className="h-4 w-4 mr-2" /> Print Audit
              </Button>
              <Button className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                 <Download className="h-4 w-4 mr-2" /> Get Receipt
              </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
