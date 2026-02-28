'use client';

import { useState } from 'react';
import { 
  Search, Filter, Download, Plus, MoreVertical, 
  Mail, Phone, Calendar, Briefcase, Trash2, 
  Pencil, Shield, ExternalLink, ChevronRight,
  Upload, User, CreditCard, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { MOCK_EMPLOYEES } from '@/lib/mock-team';
import { Employee } from '@/types/team';

export function EmployeeTable() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = MOCK_EMPLOYEES.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
         <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
               placeholder="Search by name, email, or role..." 
               className="h-12 pl-11 rounded-xl bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 shadow-sm focus:ring-1 ring-indigo-50 transition-all font-bold"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         
         <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button variant="outline" className="h-12 px-5 min-w-[120px] rounded-xl border-neutral-100 dark:border-neutral-800 font-bold text-xs gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
               <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="outline" className="h-12 px-5 min-w-[120px] rounded-xl border-neutral-100 dark:border-neutral-800 font-bold text-xs gap-2 hover:bg-neutral-50">
               <Download className="h-4 w-4" /> Export
            </Button>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                 <Button className="h-12 px-6 rounded-xl bg-indigo-950 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Employee
                 </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] border-neutral-100 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
                 <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">New Employee Onboarding</DialogTitle>
                    <DialogDescription className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1 italic">Register a new team member to the organizational engine</DialogDescription>
                 </DialogHeader>
                 
                 <div className="grid gap-8 py-6">
                    {/* Section: Personal Info */}
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                          <User className="h-3 w-3" /> Personal Information
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Full Name</Label>
                             <Input placeholder="e.g. John Doe" className="h-10 text-xs font-bold" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Email Address</Label>
                             <Input type="email" placeholder="john@company.com" className="h-10 text-xs font-bold" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Phone Number</Label>
                             <Input placeholder="+1 (555) 000-0000" className="h-10 text-xs font-bold" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Profile Photo</Label>
                             <div className="h-10 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-center gap-2 text-[10px] font-black text-indigo-600 cursor-pointer hover:bg-indigo-50 transition-colors">
                                <Upload className="h-3 w-3" /> Upload JPG/PNG
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Section: Job Details */}
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Briefcase className="h-3 w-3" /> Professional Details
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Role / Designation</Label>
                             <Input placeholder="e.g. Product Designer" className="h-10 text-xs font-bold" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Department</Label>
                             <Select>
                                <SelectTrigger className="h-10 text-xs font-bold">
                                   <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="eng">Engineering</SelectItem>
                                   <SelectItem value="des">Design</SelectItem>
                                   <SelectItem value="hr">Human Resources</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Contract Type</Label>
                             <Select defaultValue="full-time">
                                <SelectTrigger className="h-10 text-xs font-bold">
                                   <SelectValue placeholder="Contract Type" />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="full-time">Full-time</SelectItem>
                                   <SelectItem value="part-time">Part-time</SelectItem>
                                   <SelectItem value="contract">Contract</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Reporting Manager</Label>
                             <Select>
                                <SelectTrigger className="h-10 text-xs font-bold">
                                   <SelectValue placeholder="Select Manager" />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="sarah">Sarah Connor</SelectItem>
                                   <SelectItem value="david">David Miller</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                       </div>
                    </div>

                    {/* Section: Payroll UI Placeholder */}
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                          <CreditCard className="h-3 w-3" /> Compensation (UI Only)
                       </h4>
                       <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-50 dark:border-indigo-800/50 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <Label className="text-[9px] font-black uppercase text-neutral-400">Base Annual Salary</Label>
                             <p className="text-xl font-black text-indigo-950 dark:text-white leading-none">$0.00</p>
                          </div>
                          <div className="space-y-1">
                             <Label className="text-[9px] font-black uppercase text-neutral-400">Tax Tier</Label>
                             <p className="text-xl font-black text-emerald-600 leading-none">Auto-calc</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <DialogFooter className="bg-neutral-50 dark:bg-neutral-900 -mx-6 -mb-6 p-6 border-t border-neutral-100 dark:border-neutral-800">
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="font-black text-xs uppercase tracking-widest text-neutral-400">Discard</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] h-12 px-8 rounded-xl shadow-md">Complete Onboarding</Button>
                 </DialogFooter>
              </DialogContent>
            </Dialog>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden overflow-x-auto">
         <table className="w-full text-sm">
            <thead>
               <tr className="bg-neutral-50/50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
                  <th className="px-6 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Employee Info</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Role & Dept</th>
                  <th className="px-6 py-5 text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Performance</th>
                  <th className="px-6 py-5 text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Join Date</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
               {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all cursor-pointer group">
                     <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900 rounded-xl overflow-hidden shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                              {emp.photoUrl ? <img src={emp.photoUrl} alt={emp.name} className="w-full h-full object-cover" /> : <User className="h-5 w-5" />}
                           </div>
                           <div>
                              <h4 className="font-black text-indigo-950 dark:text-white leading-none">{emp.name}</h4>
                              <p className="text-[11px] text-neutral-400 font-bold uppercase mt-1.5 flex items-center gap-1.5 italic">
                                 <Mail className="h-3 w-3" /> {emp.email}
                              </p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2 text-xs font-black text-gray-700 dark:text-neutral-300">
                              <Shield className="h-3.5 w-3.5 text-indigo-500" /> {emp.role}
                           </div>
                           <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-5 flex items-center gap-1.5">
                              <Building className="h-3 w-3" /> {emp.departmentName}
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-6 text-center">
                        <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border shadow-none ${
                           emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                           emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                           'bg-neutral-100 text-neutral-600 border-neutral-200'
                        }`}>
                          {emp.status}
                        </Badge>
                     </td>
                     <td className="px-6 py-6 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                           <span className={`text-xs font-black ${emp.performanceScore > 90 ? 'text-emerald-600' : 'text-indigo-600'}`}>{emp.performanceScore}%</span>
                           <div className="h-1 w-16 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                              <div 
                                 className={`h-full rounded-full ${emp.performanceScore > 90 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                                 style={{ width: `${emp.performanceScore}%` }} 
                              />
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-6 text-center font-bold text-neutral-400 text-[10px] uppercase tracking-widest italic font-mono">
                        {emp.joinDate}
                     </td>
                     <td className="px-6 py-6 text-right">
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <MoreVertical className="h-4 w-4" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Employee Actions</DropdownMenuLabel>
                              <DropdownMenuItem className="text-xs font-black gap-2 uppercase tracking-widest cursor-pointer">
                                 <ExternalLink className="h-3.5 w-3.5" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs font-black gap-2 uppercase tracking-widest cursor-pointer">
                                 <Pencil className="h-3.5 w-3.5" /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs font-black gap-2 uppercase tracking-widest cursor-pointer">
                                 <Calendar className="h-3.5 w-3.5" /> Leave History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs font-black gap-2 text-rose-600 uppercase tracking-widest cursor-pointer">
                                 <Trash2 className="h-3.5 w-3.5" /> Deactivate
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      <div className="flex justify-between items-center px-4 py-2">
         <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Global Team Registry (Page 1 of 5)</p>
         <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full bg-neutral-100 dark:bg-neutral-800"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full bg-neutral-100 dark:bg-neutral-800"><ChevronRight className="h-4 w-4" /></Button>
         </div>
      </div>
    </div>
  );
}
