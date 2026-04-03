'use client';

import { 
  ShieldCheck, Landmark, Scale, FileBarChart, 
  Settings, Download, Plus, AlertCircle,
  HelpCircle, ChevronRight, Calculator,
  PieChart, Briefcase, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_TAX_SLABS } from '@/lib/mock-payroll';

export function TaxCompliance() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h4 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">Tax & Compliance Hub</h4>
            <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest italic leading-relaxed">Regulatory configuration & reporting portal</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="h-11 px-6 rounded-xl border-neutral-100 dark:border-neutral-800 font-bold text-xs gap-2">
               <Calendar className="h-4 w-4" /> FY 2024-25
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2">
               <Download className="h-4 w-4" /> Compliance Report
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Tax Slab Configuration */}
         <Card className="lg:col-span-2 border-neutral-100 dark:border-neutral-800 shadow-sm rounded-[2rem] overflow-hidden bg-white dark:bg-neutral-950">
            <CardHeader className="p-8 border-b border-neutral-50 dark:border-neutral-900">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <Landmark className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">Income Tax Slabs</CardTitle>
                        <CardDescription className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1.5 italic">Current Tax Regime (Global Default)</CardDescription>
                     </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-9 font-black text-[10px] uppercase tracking-widest text-indigo-600 gap-2">
                     <Plus className="h-3.5 w-3.5" /> Add Slab
                  </Button>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                     <thead>
                        <tr className="bg-neutral-50/50 dark:bg-neutral-900 border-b border-neutral-50 dark:border-neutral-800">
                           <th className="px-8 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Slab Name</th>
                           <th className="px-8 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Income Range</th>
                           <th className="px-8 py-5 text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Tax Rate</th>
                           <th className="px-8 py-5 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                        {MOCK_TAX_SLABS.map((slab, i) => (
                           <tr key={i} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-all group">
                              <td className="px-8 py-6">
                                 <span className="font-black text-indigo-950 dark:text-white text-xs uppercase tracking-tighter">{slab.slabName}</span>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest font-mono italic">
                                    ${slab.minIncome.toLocaleString()} — {slab.maxIncome > 100000 ? 'No Limit' : `$${slab.maxIncome.toLocaleString()}`}
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-center">
                                 <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 shadow-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
                                    {slab.rate}%
                                 </Badge>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <Button variant="ghost" className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Settings className="h-4 w-4 text-neutral-400" />
                                 </Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </CardContent>
            <CardFooter className="p-8 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
               <AlertCircle className="h-4 w-4 text-amber-500" />
               <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">Note: Slab changes will only apply to the next payroll cycle generation.</p>
            </CardFooter>
         </Card>

         {/* Sidebar Compliance Modules */}
         <div className="space-y-8">
            <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-neutral-950 p-8 space-y-6 flex flex-col transition-all hover:border-indigo-100">
               <div className="space-y-1 mb-2">
                  <h3 className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Statutory Configs</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">PF, ESI, & Professional Tax</p>
               </div>
               
               <div className="space-y-4">
                  {[
                    { label: 'Provident Fund (PF)', val: '12%', sub: 'Employer Split' },
                    { label: 'ESI / Insurance', val: '0.75%', sub: 'Employee Share' },
                    { label: 'Professional Tax', val: 'Fixed', sub: '$200/Year' }
                  ].map((item, i) => (
                    <div key={i} className="group p-5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex items-center justify-between hover:bg-white hover:border-indigo-50 transition-all cursor-pointer">
                       <div>
                          <p className="text-[11px] font-black text-neutral-600 dark:text-neutral-400 uppercase tracking-tighter">{item.label}</p>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase italic mt-1">{item.sub}</p>
                       </div>
                       <span className="font-black text-xs text-indigo-600">{item.val}</span>
                    </div>
                  ))}
               </div>

               <Button variant="outline" className="w-full h-11 border-indigo-50 dark:border-neutral-800 text-indigo-600 hover:bg-indigo-50 rounded-xl font-black uppercase tracking-widest text-[9px] mt-2 gap-2 shadow-none">
                  <Calculator className="h-3.5 w-3.5" /> Simulation Tool
               </Button>
            </Card>

            {/* AI Compliance Check */}
            <div className="p-8 bg-indigo-950 text-white rounded-3xl relative overflow-hidden group shadow-xl">
               <ShieldCheck className="absolute -right-6 -bottom-6 h-32 w-32 text-indigo-600/20 rotate-12 transition-transform group-hover:scale-110" />
               <div className="relative z-10 flex flex-col h-full">
                  <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg">
                     <Briefcase className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4">Integrity Monitor</h4>
                  <p className="text-sm font-bold italic leading-relaxed text-indigo-300 max-w-[200px] mb-8">
                     Your current payroll setup aligns with <span className="text-emerald-400 font-black">98.4%</span> of regional tax regulations. 
                  </p>
                  <Button variant="outline" className="mt-auto h-10 w-fit px-6 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl font-black uppercase tracking-widest text-[9px]">
                     Run Detailed Audit
                  </Button>
               </div>
            </div>
         </div>
      </div>

      {/* Compliance Calendar / Timeline */}
      <div className="pt-4 px-2">
         <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Compliance Timeline</h2>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { date: '15 Mar', title: 'TDS Remittance', desc: 'Monthly payment for Feb 24', status: 'Upcoming' },
              { date: '10 Apr', title: 'PF Filing', desc: 'Quarterly contribution period', status: 'Pending' },
              { date: '30 Apr', title: 'ESI E-Return', desc: 'Half-yearly compliance check', status: 'Ready' },
              { date: '15 May', title: 'Form 16/16A', desc: 'Annual certificates for FY 23', status: 'Scheduled' }
            ].map((ev, i) => (
               <div key={i} className="group p-6 bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-6 transition-all hover:scale-[1.02] hover:border-indigo-100">
                  <div className="text-center min-w-[60px] p-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl group-hover:bg-indigo-50 transition-all">
                     <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400">{ev.date.split(' ')[1]}</p>
                     <p className="text-lg font-black text-indigo-950 dark:text-indigo-200 mt-1 leading-none group-hover:text-indigo-600">{ev.date.split(' ')[0]}</p>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none mb-1.5">{ev.title}</h4>
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">{ev.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
