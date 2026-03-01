'use client';

import { useState } from 'react';
import { 
  Search, Filter, Download, MoreVertical, 
  Pencil, Trash2, Eye, FileText, 
  CreditCard, DollarSign, Building, 
  Calendar, ArrowUpRight, Plus, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { MOCK_SALARY_RECORDS } from '@/lib/mock-payroll';
import { SalaryRecord } from '@/types/payroll';

export function SalaryTable() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);

  const filtered = MOCK_SALARY_RECORDS.filter(r => 
    r.employeeName.toLowerCase().includes(search.toLowerCase()) || 
    r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (record: SalaryRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
         <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
               placeholder="Search by name, ID or department..." 
               className="h-12 pl-11 rounded-xl bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 shadow-sm focus:ring-1 ring-indigo-50 transition-all font-bold"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         
         <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="h-12 px-5 rounded-xl border-neutral-100 dark:border-neutral-800 font-bold text-xs gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 shadow-sm">
               <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="outline" className="h-12 px-5 rounded-xl border-neutral-100 dark:border-neutral-800 font-bold text-xs gap-2 hover:bg-neutral-50 shadow-sm">
               <Download className="h-4 w-4" /> Export
            </Button>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden overflow-x-auto">
         <table className="w-full text-sm">
            <thead>
               <tr className="bg-neutral-50/50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
                  <th className="px-6 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Employee Info</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Salary Breakdown</th>
                  <th className="px-6 py-5 text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Net Salary</th>
                  <th className="px-6 py-5 text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Pay Date</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
               {filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all cursor-pointer group">
                     <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                              <Building className="h-5 w-5" />
                           </div>
                           <div>
                              <h4 className="font-black text-indigo-950 dark:text-white leading-none">{record.employeeName}</h4>
                              <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1.5 flex items-center gap-1.5 italic">
                                 {record.employeeId} · {record.department}
                              </p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-6 font-bold text-neutral-400 text-[10px] uppercase tracking-widest italic">
                        <div className="flex flex-col gap-1.5">
                           <div className="flex justify-between w-32">
                              <span>Basic</span>
                              <span className="text-indigo-950 dark:text-neutral-300 font-black">${record.structure.basic.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between w-32">
                              <span>Deductions</span>
                              <span className="text-rose-600 font-black">-${(record.structure.tax + record.structure.pf + record.structure.esi).toLocaleString()}</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-6 text-center">
                        <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border shadow-none ${
                           record.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                           record.status === 'Processed' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                           'bg-neutral-100 text-neutral-600 border-neutral-200'
                        }`}>
                          {record.status}
                        </Badge>
                     </td>
                     <td className="px-6 py-6 text-right">
                        <div className="flex flex-col items-end gap-1">
                           <span className="text-sm font-black text-indigo-950 dark:text-white">${record.netSalary.toLocaleString()}</span>
                           <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Verified</span>
                        </div>
                     </td>
                     <td className="px-6 py-6 text-center font-bold text-neutral-400 text-[10px] uppercase tracking-widest italic font-mono">
                        {record.paymentDate || '—'}
                     </td>
                     <td className="px-6 py-6 text-right">
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <MoreVertical className="h-4 w-4" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Payroll Actions</DropdownMenuLabel>
                              <DropdownMenuItem 
                                 className="text-xs font-black gap-2 uppercase tracking-widest cursor-pointer"
                                 onClick={() => handleEdit(record)}
                              >
                                 <Pencil className="h-3.5 w-3.5 text-indigo-600" /> Edit Structure
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs font-black gap-2 uppercase tracking-widest cursor-pointer">
                                 <Eye className="h-3.5 w-3.5" /> View Timeline
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs font-black gap-2 uppercase tracking-widest cursor-pointer">
                                 <FileText className="h-3.5 w-3.5" /> Process Manually
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs font-black gap-2 text-rose-600 uppercase tracking-widest cursor-pointer">
                                 <Trash2 className="h-3.5 w-3.5" /> Remove Record
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Salary Structure Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent className="sm:max-w-[700px] border-neutral-100 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Edit Salary Structure</DialogTitle>
               <DialogDescription className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1 italic">
                  Modify base pay, allowances and deductions for {selectedRecord?.employeeName}
               </DialogDescription>
            </DialogHeader>

            <div className="grid gap-8 py-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Earnings */}
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <DollarSign className="h-3 w-3" /> Earnings
                     </h4>
                     <div className="space-y-4 p-5 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50">
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Basic Salary</Label>
                           <Input type="number" defaultValue={selectedRecord?.structure.basic} className="h-10 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">House Rent Allowance (HRA)</Label>
                           <Input type="number" defaultValue={selectedRecord?.structure.hra} className="h-10 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Other Allowances</Label>
                           <Input type="number" defaultValue={selectedRecord?.structure.allowances} className="h-10 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Performance Bonus</Label>
                           <Input type="number" defaultValue={selectedRecord?.structure.bonus} className="h-10 text-xs font-bold" />
                        </div>
                     </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <CreditCard className="h-3 w-3" /> Deductions
                     </h4>
                     <div className="space-y-4 p-5 bg-rose-50/30 dark:bg-rose-900/10 rounded-2xl border border-rose-100/50">
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Income Tax (TDS)</Label>
                           <Input type="number" defaultValue={selectedRecord?.structure.tax} className="h-10 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">PF Contribution</Label>
                           <Input type="number" defaultValue={selectedRecord?.structure.pf} className="h-10 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">ESI / Health Insurance</Label>
                           <Input type="number" defaultValue={selectedRecord?.structure.esi} className="h-10 text-xs font-bold" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Other Deductions</Label>
                           <Input type="number" defaultValue={selectedRecord?.structure.otherDeductions} className="h-10 text-xs font-bold" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Summary Preview */}
               <div className="p-6 bg-neutral-900 text-white rounded-3xl relative overflow-hidden group">
                  <ArrowUpRight className="absolute -right-6 -bottom-6 h-32 w-32 text-white/5 rotate-12 transition-transform group-hover:scale-110" />
                  <div className="relative z-10 flex justify-between items-center">
                     <div>
                        <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Calculated Net Pay</p>
                        <h3 className="text-3xl font-black font-mono tracking-tighter">${selectedRecord?.netSalary.toLocaleString()}</h3>
                     </div>
                     <div className="text-right">
                        <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase px-2 py-0.5 mb-2">Auto-Synced</Badge>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase italic">Next Disbursement: 28th Mar</p>
                     </div>
                  </div>
               </div>
            </div>

            <DialogFooter className="bg-neutral-50 dark:bg-neutral-900 -mx-6 -mb-6 p-6 border-t border-neutral-100 dark:border-neutral-800">
               <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="font-black text-xs uppercase tracking-widest text-neutral-400">Discard Changes</Button>
               <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] h-12 px-8 rounded-xl shadow-md transition-all active:scale-95">Update Salary Matrix</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}
