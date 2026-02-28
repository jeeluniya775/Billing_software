'use client';

import { useState } from 'react';
import { 
  ArrowRightLeft, Trash2, Calculator, QrCode, Tag, 
  MapPin, User, Building, ArrowDownRight, Info,
  ShieldCheck, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';

export function AssetLifecycle() {
  const [activeStep, setActiveStep] = useState('transfer');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Asset Tool */}
        <Card className="lg:col-span-2 border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden overflow-visible relative">
           <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600">
                    <ArrowRightLeft className="h-5 w-5" />
                 </div>
                 <div>
                    <CardTitle className="text-lg">Inter-Departmental Transfer</CardTitle>
                    <CardDescription>Move assets between physical locations or departments.</CardDescription>
                 </div>
              </div>
           </CardHeader>
           <CardContent className="pt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Source Details</p>
                    <div className="space-y-3 p-4 bg-neutral-50 dark:bg-black rounded-2xl border border-neutral-100 dark:border-neutral-800">
                       <Select defaultValue="AST-001">
                          <SelectTrigger className="h-10 text-xs font-bold bg-white dark:bg-neutral-900">
                             <SelectValue placeholder="Select Asset" />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="AST-001">MacBook Pro - Engineering</SelectItem>
                             <SelectItem value="AST-003">CNC Milling - Operations</SelectItem>
                          </SelectContent>
                       </Select>
                       <div className="flex items-center gap-2 text-xs text-neutral-500 italic">
                          <MapPin className="h-3.5 w-3.5" /> Currently at: Corporate Office L4
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Destination</p>
                    <div className="grid grid-cols-1 gap-3">
                       <Select defaultValue="HQ">
                          <SelectTrigger className="h-10 text-xs font-bold">
                             <SelectValue placeholder="To Location" />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="HQ">Corporate HQ - NY</SelectItem>
                             <SelectItem value="W1">Warehouse 01 - TX</SelectItem>
                          </SelectContent>
                       </Select>
                       <Select defaultValue="IT">
                          <SelectTrigger className="h-10 text-xs font-bold">
                             <SelectValue placeholder="To Department" />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="IT">Information Technology</SelectItem>
                             <SelectItem value="FIN">Finance & Accounts</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Ownership Change Preview</span>
                    <Badge variant="outline" className="text-[9px] uppercase font-bold text-indigo-500">Auto-Update Enabled</Badge>
                 </div>
                 <div className="flex items-center justify-center gap-8 py-2">
                    <div className="text-center">
                       <p className="text-xs font-black text-indigo-950 dark:text-white">Engineering</p>
                       <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1 italic">Old Owner</p>
                    </div>
                    <ArrowRightLeft className="h-6 w-6 text-indigo-400 opacity-50" />
                    <div className="text-center">
                       <p className="text-xs font-black text-emerald-600">Information Tech</p>
                       <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1 italic">New Owner</p>
                    </div>
                 </div>
              </div>
           </CardContent>
           <CardFooter className="bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex justify-between">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Logs will be generated automatically</p>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-8 rounded-lg shadow-lg">Confirm Transfer</Button>
           </CardFooter>
        </Card>

        {/* Depreciation Calculator */}
        <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col">
           <CardHeader>
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-600">
                    <Calculator className="h-5 w-5" />
                 </div>
                 <CardTitle className="text-lg">Value Calculator</CardTitle>
              </div>
           </CardHeader>
           <CardContent className="flex-grow space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Original Cost</label>
                 <Input type="number" defaultValue="45000" className="font-black text-lg h-12" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Salvage Value</label>
                 <Input type="number" defaultValue="5000" className="font-bold h-10" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Useful Life (Years)</label>
                 <Input type="number" defaultValue="5" className="font-bold h-10" />
              </div>
              
              <div className="pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-800">
                 <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold text-neutral-500">Annual Allocation</span>
                    <span className="text-xl font-black text-indigo-600">$8,000.00</span>
                 </div>
                 <p className="text-[10px] text-neutral-400 font-bold italic uppercase tracking-widest">Based on Straight Line Method</p>
              </div>
           </CardContent>
           <CardFooter>
              <Button variant="outline" className="w-full text-[11px] font-black uppercase tracking-widest border-emerald-100 dark:border-emerald-900/40 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">Simulate Schedule</Button>
           </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Asset Disposal Process */}
         <div className="p-8 bg-black text-white rounded-3xl relative overflow-hidden group">
            <div className="relative z-10">
               <div className="h-12 w-12 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                  <Trash2 className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-black mb-2">Asset Disposal Workflow</h3>
               <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">Safety initiate the disposal of end-of-life assets. Handles accounting write-offs and e-waste certificates.</p>
               
               <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-neutral-300">
                     <div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Verify Depreciation Limit
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-neutral-300">
                     <div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Generate Disposal Form
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-neutral-300 text-emerald-400">
                     <CheckCircle2 className="h-4 w-4" /> Ready for Accounting Sync
                  </div>
               </div>

               <Button className="mt-8 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-[0.2em] text-[10px] h-11 px-8">Process Disposal</Button>
            </div>
            
            {/* Background pattern */}
            <div className="absolute -bottom-16 -right-16 h-64 w-64 bg-rose-600/10 rounded-full blur-3xl" />
         </div>

         {/* Identification & Tagging */}
         <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl flex flex-col justify-between">
            <div>
               <div className="flex items-center justify-between mb-8">
                  <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600">
                     <QrCode className="h-6 w-6" />
                  </div>
                  <Badge className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 border shadow-none font-black text-[9px] uppercase tracking-widest">Production Ready</Badge>
               </div>
               <h3 className="text-xl font-black text-indigo-950 dark:text-white mb-2">Smart Tagging System</h3>
               <p className="text-neutral-500 text-sm leading-relaxed">Integrated QR and Barcode generation for physical asset scanning and quick auditing.</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <QrCode className="h-8 w-8 text-neutral-400" />
                  <div>
                     <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest leading-none">Standard</p>
                     <p className="text-xs font-black text-indigo-600 mt-1 uppercase">QR Label</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <Tag className="h-8 w-8 text-neutral-400" />
                  <div>
                     <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest leading-none">Thermal</p>
                     <p className="text-xs font-black text-indigo-600 mt-1 uppercase">Sticker XL</p>
                  </div>
               </div>
            </div>

            <Button variant="outline" className="mt-8 border-indigo-100 dark:border-indigo-900/50 text-indigo-600 font-black uppercase tracking-widest text-[11px] h-11 w-full bg-indigo-50/20">Configure Tag Templates</Button>
         </div>
      </div>
    </div>
  );
}
