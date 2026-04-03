'use client';

import { useState } from 'react';
import { 
  Zap, Play, CheckCircle2, AlertCircle, 
  History, Settings, FileSearch, ShieldCheck,
  ChevronRight, ArrowRight, DollarSign, Wallet,
  Timer, CalendarX, Info, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Progress } from '@/components/team/PerformanceSection'; // Reusing the Progress component implemented earlier

export function PayrollProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  const startProcessing = () => {
    setIsProcessing(true);
    // Mock progression
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 2500);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(1);
    }, 4000);
  };

  return (
    <div className="space-y-8">
      {/* Active Cycle Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-3xl overflow-hidden relative group shadow-sm transition-all hover:bg-white dark:hover:bg-neutral-900">
            <CardHeader className="p-8">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-5">
                     <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform">
                        <Zap className="h-7 w-7" />
                     </div>
                     <div>
                        <CardTitle className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">March 2024 Payroll</CardTitle>
                        <CardDescription className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-2 flex items-center gap-2 italic">
                           <ShieldCheck className="h-3 w-3" /> System Ready for Batch Processing
                        </CardDescription>
                     </div>
                  </div>
                  <div className="text-right">
                     <Badge className="bg-amber-50 text-amber-700 border-amber-100 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 shadow-none">
                        Status: Draft Cycle
                     </Badge>
                     <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-2">Next Run: March 28, 2024</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 bg-white dark:bg-neutral-950 rounded-2xl border border-indigo-50 dark:border-neutral-800 shadow-sm space-y-3">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">Base Calculation</p>
                     <h4 className="text-xl font-black text-indigo-950 dark:text-white leading-none">$112,400</h4>
                     <p className="text-[9px] font-bold text-indigo-600 uppercase italic">42 Active Salaries</p>
                  </div>
                  <div className="p-5 bg-white dark:bg-neutral-950 rounded-2xl border border-rose-50 dark:border-rose-900/50 shadow-sm space-y-3">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">Adjustments</p>
                     <h4 className="text-xl font-black text-rose-600 leading-none">-$2,150</h4>
                     <p className="text-[9px] font-bold text-rose-400 uppercase italic">Leaves & Overtime</p>
                  </div>
                  <div className="p-5 bg-white dark:bg-neutral-950 rounded-2xl border border-emerald-50 dark:border-emerald-900/50 shadow-sm space-y-3">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">Final Est. Pay</p>
                     <h4 className="text-xl font-black text-indigo-950 dark:text-white leading-none">$110,250</h4>
                     <p className="text-[9px] font-bold text-emerald-600 uppercase italic">Net Disbursal</p>
                  </div>
               </div>

               <div className="flex gap-3">
                  <Dialog open={isProcessing}>
                     <DialogTrigger asChild>
                        <Button 
                           onClick={startProcessing}
                           className="h-14 flex-1 bg-indigo-950 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl gap-3 transition-all active:scale-95"
                        >
                           <Play className="h-5 w-5 fill-current" /> Initialize Batch Run
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[500px] border-none bg-indigo-950 text-white shadow-2xl p-10 overflow-hidden">
                        <div className="absolute top-0 right-0 h-full w-48 bg-white/5 -skew-x-12 translate-x-12" />
                        <div className="relative z-10 space-y-10 text-center">
                           <div className="space-y-3">
                              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Engine Active</h2>
                              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic flex items-center justify-center gap-2">
                                 <ShieldCheck className="h-3 w-3" /> Processing Financial Integrity Check
                              </p>
                           </div>
                           
                           <div className="space-y-6">
                              <div className="flex justify-between items-end px-2">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                                    {step === 1 ? 'Reading Salary Matrix...' : step === 2 ? 'Calculating Deductions...' : 'Finalizing Vouchers...'}
                                 </span>
                                 <span className="text-xs font-black font-mono">{step === 1 ? '34%' : step === 2 ? '78%' : '100%'}</span>
                              </div>
                              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-1 border border-white/5">
                                 <div 
                                    className="h-full bg-indigo-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(129,140,248,0.5)]" 
                                    style={{ width: `${step === 1 ? 34 : step === 2 ? 78 : 100}%` }}
                                 />
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="text-left p-4 bg-white/5 rounded-2xl border border-white/10">
                                 <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Records Parsed</p>
                                 <p className="text-lg font-black font-mono">284/284</p>
                              </div>
                              <div className="text-left p-4 bg-white/5 rounded-2xl border border-white/10">
                                 <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Errors Caught</p>
                                 <p className="text-lg font-black font-mono text-emerald-400">0</p>
                              </div>
                           </div>
                        </div>
                     </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="h-14 px-8 border-indigo-200 dark:border-neutral-800 font-bold uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
                     <History className="h-4 w-4" /> Audit Logs
                  </Button>
               </div>
            </CardContent>
         </Card>

         <div className="space-y-6 flex flex-col">
            <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-neutral-950 p-6 flex-grow flex flex-col transition-all hover:border-indigo-100">
               <div className="space-y-2 mb-8">
                  <h3 className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Cycle Controls</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic leading-relaxed">Adjustments applied globally</p>
               </div>
               
               <div className="space-y-4 flex-grow">
                  {[
                    { label: 'Overtime Engine', val: '$3,400', icon: Timer, color: 'text-indigo-600' },
                    { label: 'Unpaid Leave (LWP)', val: '-$1,250', icon: CalendarX, color: 'text-rose-600' },
                    { label: 'Bonus Provision', val: '$5,000', icon: DollarSign, color: 'text-emerald-600' }
                  ].map((ctrl, i) => (
                    <div key={i} className="group p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex items-center justify-between hover:bg-white hover:border-indigo-50 transition-all cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 group-hover:text-indigo-600 shadow-sm border border-neutral-100">
                             <ctrl.icon className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-black text-neutral-600 dark:text-neutral-400 uppercase tracking-tighter">{ctrl.label}</span>
                       </div>
                       <span className={`font-mono text-xs font-black ${ctrl.color}`}>{ctrl.val}</span>
                    </div>
                  ))}
               </div>

               <Button variant="ghost" className="w-full h-11 border border-dashed border-neutral-100 hover:bg-neutral-50 rounded-xl font-black uppercase tracking-widest text-[9px] text-neutral-400 mt-6 gap-2">
                  <Settings className="h-3.5 w-3.5" /> Reconfigure Logic
               </Button>
            </Card>
         </div>
      </div>

      {/* Verification Steps Section */}
      <div className="pt-4 px-2">
         <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Pre-Approval Checklist</h2>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Tax Compliance', desc: 'Slab validation & TDS checks', status: 'Verified' },
              { title: 'Attendance Sync', desc: 'Biometric & leave cross-check', status: 'Action Needed', warning: true },
              { title: 'Bank Connectivity', desc: 'Secure payment gateway link', status: 'Ready' },
              { title: 'Approval Matrix', desc: 'Department head sign-offs', status: 'Pending' }
            ].map((step, i) => (
               <div key={i} className={`p-6 bg-white dark:bg-neutral-950 rounded-3xl border shadow-sm flex flex-col gap-6 transition-all group hover:scale-[1.02] ${step.warning ? 'border-amber-100 bg-amber-50/10' : 'border-neutral-100 dark:border-neutral-800'}`}>
                  <div className="flex justify-between items-start">
                     <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${step.warning ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm'}`}>
                        {step.status === 'Verified' ? <CheckCircle2 className="h-5 w-5" /> : step.warning ? <AlertCircle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                     </div>
                     <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-[0.2em] h-5 border-none ${step.warning ? 'text-amber-600' : 'text-neutral-400'}`}>
                        0{i+1} STEP
                     </Badge>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none mb-2">{step.title}</h4>
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed italic">{step.desc}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4">
                     <span className={`text-[9px] font-black uppercase tracking-widest ${step.status === 'Verified' ? 'text-emerald-600' : step.warning ? 'text-amber-600 underline cursor-pointer' : 'text-neutral-400'}`}>
                        {step.status}
                     </span>
                     <ArrowRight className="h-3 w-3 text-neutral-300 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Approval Portal Callout */}
      <div className="bg-indigo-950 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden group">
         <div className="absolute top-0 right-0 h-full w-1/2 bg-white/5 -skew-x-12 translate-x-24 transition-transform group-hover:translate-x-12" />
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-6 max-w-xl text-center md:text-left">
               <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest leading-none">Global Ready Buffer</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Final Executive Approval</h2>
               <p className="text-sm font-bold text-indigo-300 italic leading-relaxed">
                  "Ensure all salaries are cross-referenced with the monthly performance ledger before locking this cycle for disbursement."
               </p>
            </div>
            <div className="flex flex-col gap-4 min-w-[240px]">
               <Button className="h-16 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-2xl gap-3 transition-transform active:scale-95">
                  <Send className="h-4 w-4" /> Transmit Payrun
               </Button>
               <Button variant="outline" className="h-16 w-full bg-white/5 border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl gap-3">
                  <FileSearch className="h-4 w-4" /> Run Stress Test
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
