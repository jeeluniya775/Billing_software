'use client';

import { useState } from 'react';
import { 
  FileText, Download, Mail, Eye, 
  Printer, History, Calendar, User,
  Building, CreditCard, ShieldCheck,
  CheckCircle2, ArrowUpRight, Search,
  X, ExternalLink, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MOCK_SALARY_RECORDS } from '@/lib/mock-payroll';
import { SalaryRecord } from '@/types/payroll';

export function PayslipManager() {
  const [search, setSearch] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<SalaryRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const filtered = MOCK_SALARY_RECORDS.filter(r => 
    r.employeeName.toLowerCase().includes(search.toLowerCase()) || 
    r.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const handlePreview = (record: SalaryRecord) => {
    setSelectedPayslip(record);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
         <div>
            <h4 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">Payslip Archive</h4>
            <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest italic">Management & dissemination portal</p>
         </div>
         <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
               placeholder="Search by Employee ID/Name..." 
               className="h-11 pl-11 rounded-xl bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 shadow-sm focus:ring-1 ring-indigo-50 font-bold"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      {/* Payslip Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filtered.map((record) => (
           <Card key={record.id} className="border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden group hover:border-indigo-100 transition-all">
              <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 p-6 flex flex-row justify-between border-b border-neutral-100 dark:border-neutral-800">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
                       <FileText className="h-5 w-5" />
                    </div>
                    <div>
                       <CardTitle className="text-sm font-black text-indigo-950 dark:text-white leading-none">{record.employeeName}</CardTitle>
                       <CardDescription className="text-[9px] font-bold text-neutral-400 mt-1 uppercase tracking-widest leading-none flex items-center gap-1.5">
                          {record.employeeId} · <Calendar className="h-3 w-3" /> Feb 2024
                       </CardDescription>
                    </div>
                 </div>
                 <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[8px] font-black uppercase shadow-none h-6 px-2">Disbursed</Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase text-neutral-400">Net Pay</p>
                       <p className="text-lg font-black text-indigo-950 dark:text-white leading-none">${record.netSalary.toLocaleString()}</p>
                    </div>
                    <div className="text-right space-y-1">
                       <p className="text-[9px] font-black uppercase text-neutral-400">Method</p>
                       <p className="text-xs font-black text-neutral-600 dark:text-neutral-400 flex items-center justify-end gap-1.5 leading-none">
                          <CreditCard className="h-3 w-3 text-indigo-500" /> Bank Transfer
                       </p>
                    </div>
                 </div>

                 <div className="pt-2 flex gap-2">
                    <Button 
                       onClick={() => handlePreview(record)}
                       className="flex-1 h-10 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 font-black uppercase tracking-widest text-[9px] rounded-xl gap-2 shadow-none"
                    >
                       <Eye className="h-3.5 w-3.5" /> Preview
                    </Button>
                    <Button variant="ghost" className="h-10 w-10 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-indigo-600">
                       <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="h-10 w-10 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-indigo-600">
                       <Mail className="h-4 w-4" />
                    </Button>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {/* Payslip Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
         <DialogContent className="sm:max-w-[850px] border-neutral-100 dark:border-neutral-800 p-0 overflow-hidden">
            <div className="bg-indigo-950 text-white p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 h-full w-64 bg-white/5 -skew-x-12 translate-x-12" />
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-6">
                     <div className="h-20 w-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl border border-indigo-400/30">
                        <Building className="h-10 w-10 text-indigo-100" />
                     </div>
                     <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Official Payslip</h2>
                        <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mt-2 flex items-center gap-2 italic">
                           <ShieldCheck className="h-3 w-3" /> Secure Financial Record · Feb 2024
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                     <h3 className="text-5xl font-black font-mono tracking-tighter">${selectedPayslip?.netSalary.toLocaleString()}</h3>
                     <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2 leading-none">Verified Net Disbursement</p>
                  </div>
               </div>
            </div>

            <div className="p-10 space-y-12 bg-white dark:bg-neutral-950">
               {/* Personnel Data */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-100 dark:border-neutral-800">
                  <div>
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Employee Name</p>
                     <p className="font-black text-indigo-950 dark:text-white uppercase tracking-tighter">{selectedPayslip?.employeeName}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Employee ID</p>
                     <p className="font-black text-indigo-950 dark:text-white uppercase tracking-tighter">{selectedPayslip?.employeeId}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Department</p>
                     <p className="font-black text-indigo-950 dark:text-white uppercase tracking-tighter">{selectedPayslip?.department}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Payment Mode</p>
                     <p className="font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Bank Transfer</p>
                  </div>
               </div>

               {/* Earnings vs Deductions */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Earnings column */}
                  <div className="space-y-6">
                     <h4 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Earnings Breakdown
                     </h4>
                     <div className="space-y-4">
                        {[
                          { label: 'Basic Salary', val: selectedPayslip?.structure.basic },
                          { label: 'House Rent Allowance (HRA)', val: selectedPayslip?.structure.hra },
                          { label: 'Other Allowances', val: selectedPayslip?.structure.allowances },
                          { label: 'Performance Bonus', val: selectedPayslip?.structure.bonus }
                        ].map((e, i) => (
                           <div key={i} className="flex justify-between items-center py-2 border-b border-neutral-50 dark:border-neutral-900 last:border-0">
                              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{e.label}</span>
                              <span className="text-xs font-black text-indigo-950 dark:text-white font-mono">+${e.val?.toLocaleString()}</span>
                           </div>
                        ))}
                        <div className="pt-2 flex justify-between items-center text-emerald-600">
                           <span className="text-[11px] font-black uppercase tracking-widest">Total Earnings</span>
                           <span className="text-sm font-black font-mono">${((selectedPayslip?.structure.basic || 0) + (selectedPayslip?.structure.hra || 0) + (selectedPayslip?.structure.allowances || 0) + (selectedPayslip?.structure.bonus || 0)).toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  {/* Deductions column */}
                  <div className="space-y-6">
                     <h4 className="text-sm font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <X className="h-4 w-4" /> Deductions & Compliance
                     </h4>
                     <div className="space-y-4">
                        {[
                          { label: 'Income Tax (TDS)', val: selectedPayslip?.structure.tax },
                          { label: 'Provident Fund (PF)', val: selectedPayslip?.structure.pf },
                          { label: 'ESI / Insurance', val: selectedPayslip?.structure.esi },
                          { label: 'Other Deductions', val: selectedPayslip?.structure.otherDeductions }
                        ].map((d, i) => (
                           <div key={i} className="flex justify-between items-center py-2 border-b border-neutral-50 dark:border-neutral-900 last:border-0">
                              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{d.label}</span>
                              <span className="text-xs font-black text-rose-600 font-mono">-${d.val?.toLocaleString()}</span>
                           </div>
                        ))}
                        <div className="pt-2 flex justify-between items-center text-rose-600">
                           <span className="text-[11px] font-black uppercase tracking-widest">Total Deductions</span>
                           <span className="text-sm font-black font-mono">-${((selectedPayslip?.structure.tax || 0) + (selectedPayslip?.structure.pf || 0) + (selectedPayslip?.structure.esi || 0) + (selectedPayslip?.structure.otherDeductions || 0)).toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Summary Card */}
               <div className="p-8 bg-neutral-900 text-white rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-full w-full bg-indigo-500/10 pointer-events-none" />
                  <div>
                     <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <ArrowUpRight className="h-3.5 w-3.5" /> Calculated Net Compensation
                     </p>
                     <h3 className="text-4xl font-black font-mono tracking-tighter">${selectedPayslip?.netSalary.toLocaleString()}</h3>
                     <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2 italic">Currency: USD · Pay Cycle: Monthly</p>
                  </div>
                  <div className="text-right space-y-4 w-full md:w-auto">
                     <div className="flex flex-col gap-1 items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Status: Disbursed</span>
                        <span className="text-[9px] font-bold text-neutral-500 italic">March 28, 2024 · 10:42 AM</span>
                     </div>
                     <div className="flex gap-2 justify-end">
                        <Button className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[9px] rounded-xl px-6">Generate PDF</Button>
                        <Button variant="outline" className="h-10 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl px-6 font-black uppercase tracking-widest text-[9px]">Send Copy</Button>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-100 dark:border-neutral-800 w-fit">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Digitally Signed & Verified for Financial Audit Logs</span>
               </div>
            </div>

            <DialogFooter className="bg-neutral-50 dark:bg-neutral-900 p-6 border-t border-neutral-100 dark:border-neutral-800">
               <Button onClick={() => setIsPreviewOpen(false)} variant="ghost" className="font-black text-xs uppercase tracking-widest text-neutral-400">Close Preview</Button>
               <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] h-11 px-8 rounded-xl shadow-md gap-2">
                  <Printer className="h-4 w-4" /> Export Report
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}
