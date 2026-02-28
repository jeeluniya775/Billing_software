'use client';

import { 
  CreditCard, DollarSign, Download, ExternalLink, 
  FileText, History, Info, PieChart, 
  Plus, Printer, Receipt, ShieldCheck,
  TrendingDown, TrendingUp, Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_PAYROLL } from '@/lib/mock-team';

export function PayrollPreview() {
  const payroll = MOCK_PAYROLL;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Summary */}
         <Card className="lg:col-span-2 border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-neutral-950 group">
            <CardHeader className="bg-indigo-950 text-white p-8 md:p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 h-full w-64 bg-white/5 -skew-x-12 translate-x-12" />
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-5">
                     <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl border border-indigo-400/30 transition-transform group-hover:scale-110">
                        <Wallet className="h-8 w-8 text-indigo-100" />
                     </div>
                     <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Net Compensation</h2>
                        <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mt-2 flex items-center gap-2 italic">
                           <ShieldCheck className="h-3 w-3" /> Secure Payroll Preview · March 2024
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                     <h3 className="text-5xl font-black font-mono tracking-tighter">${payroll.netPay.toLocaleString()}</h3>
                     <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2">{payroll.currency.toUpperCase()} · Disbursed on 28th</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 md:p-10 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4 p-6 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl group/item hover:scale-105 transition-transform">
                     <div className="flex items-center justify-between">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-emerald-700/60 dark:text-emerald-400/60 uppercase tracking-widest leading-none mb-1.5 font-mono">Total Earnings</p>
                        <h4 className="text-2xl font-black text-indigo-950 dark:text-white leading-none">${(payroll.baseSalary + payroll.allowances + payroll.overtime).toLocaleString()}</h4>
                     </div>
                  </div>
                  
                  <div className="space-y-4 p-6 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-2xl group/item hover:scale-105 transition-transform">
                     <div className="flex items-center justify-between">
                        <TrendingDown className="h-5 w-5 text-rose-600" />
                        <Info className="h-4 w-4 text-rose-600" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-rose-700/60 dark:text-rose-400/60 uppercase tracking-widest leading-none mb-1.5 font-mono">Total Deductions</p>
                        <h4 className="text-2xl font-black text-indigo-950 dark:text-white leading-none">${payroll.deductions.toLocaleString()}</h4>
                     </div>
                  </div>

                  <div className="space-y-4 p-6 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl group/item hover:scale-105 transition-transform">
                     <div className="flex items-center justify-between">
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                        <ArrowUpRight className="h-4 w-4 text-indigo-600" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-indigo-700/60 dark:text-indigo-400/60 uppercase tracking-widest leading-none mb-1.5 font-mono">Overtime (22h)</p>
                        <h4 className="text-2xl font-black text-indigo-950 dark:text-white leading-none">${payroll.overtime.toLocaleString()}</h4>
                     </div>
                  </div>
               </div>

               <div className="pt-4 space-y-4">
                  <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] px-2">Structure Breakdown</h4>
                  <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
                     {[
                       { label: 'Basic Base Salary', val: payroll.baseSalary, plus: true },
                       { label: 'House Rent Allowance (HRA)', val: 800, plus: true },
                       { label: 'Medical Reimbursement', val: 400, plus: true },
                       { label: 'Performance Bonus (H1)', val: 300, plus: true },
                       { label: 'Provident Fund (PF)', val: payroll.deductions - 200, plus: false },
                       { label: 'Income Tax (TDS)', val: 200, plus: false }
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center py-2 group/line">
                          <span className="text-xs font-bold text-neutral-500 group-hover/line:text-indigo-600 transition-colors uppercase tracking-widest">{item.label}</span>
                          <span className={`text-xs font-black font-mono ${item.plus ? 'text-indigo-950 dark:text-white' : 'text-rose-600'}`}>
                             {item.plus ? '+' : '-'}${item.val.toLocaleString()}
                          </span>
                       </div>
                     ))}
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Sidebar Controls */}
         <div className="space-y-6 flex flex-col">
            <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-neutral-950 p-6 space-y-6 flex-grow">
               <div className="space-y-2 mb-4">
                  <h3 className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Payslip Archive</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">Download history for FY 2023-24</p>
               </div>
               
               <div className="space-y-3">
                  {['February 2024', 'January 2024', 'December 2023'].map((month, i) => (
                    <div key={i} className="group p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex items-center justify-between hover:border-indigo-100 hover:bg-white transition-all cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-indigo-600 shadow-sm border border-neutral-100 dark:border-neutral-700">
                             <FileText className="h-4 w-4" />
                          </div>
                          <span className="text-[11px] font-black text-neutral-600 dark:text-neutral-300 uppercase tracking-tighter">{month}</span>
                       </div>
                       <Download className="h-3.5 w-3.5 text-neutral-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  ))}
               </div>

               <Button className="w-full h-12 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 mt-4 shadow-none">
                  <Printer className="h-4 w-4" /> Print Statement
               </Button>
            </Card>

            <div className="p-8 bg-emerald-600 text-white rounded-3xl relative overflow-hidden group shadow-xl">
               <Receipt className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10 rotate-12 transition-transform group-hover:scale-110" />
               <div className="relative z-10 flex flex-col h-full">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4">Tax Optimization</h4>
                  <p className="text-sm font-bold italic leading-relaxed text-emerald-50 max-w-[180px] mb-8">You can save up to <span className="text-white font-black">$400</span> this month by declaring Section 80C investments.</p>
                  <Button variant="outline" className="mt-auto h-10 w-fit px-6 bg-emerald-700/30 border-emerald-400 text-white hover:bg-emerald-500 rounded-xl font-black uppercase tracking-widest text-[9px]">
                     Declare Now
                  </Button>
               </div>
            </div>
         </div>
      </div>
      
      {/* Footer Info */}
      <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-100 dark:border-neutral-800 w-fit">
         <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
         <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Digitally Signed & Verified for Financial Audit Logs</span>
      </div>
    </div>
  );
}

function ArrowUpRight(props: any) {
   return (
     <svg
       {...props}
       xmlns="http://www.w3.org/2000/svg"
       width="24"
       height="24"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2"
       strokeLinecap="round"
       strokeLinejoin="round"
     >
       <path d="M7 7h10v10" />
       <path d="M7 17 17 7" />
     </svg>
   )
 }
