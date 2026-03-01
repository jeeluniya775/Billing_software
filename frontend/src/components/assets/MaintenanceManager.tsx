'use client';

import { 
  Wrench, Calendar, Clock, DollarSign, User, 
  MapPin, CheckCircle2, History, AlertTriangle, 
  Settings, ChevronRight, Play, MoreVertical, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { MOCK_MAINTENANCE_HISTORY } from '@/lib/mock-assets';

export function MaintenanceManager() {
  return (
    <div className="space-y-6">
      {/* Maintenance Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Service', value: '18', sub: 'Next 7 days', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/40' },
          { label: 'Pending Repairs', value: '04', sub: 'High urgency', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/40' },
          { label: 'In Shop Now', value: '06', sub: 'Across 3 vendors', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/40' },
          { label: 'YTD Mnt. Cost', value: '$84.2k', sub: '12% under budget', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/40' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm transition-all hover:shadow-md group">
             <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{stat.label}</p>
                <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
                   <Wrench className="h-3 w-3" />
                </div>
             </div>
             <h4 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h4>
             <p className="text-[10px] text-neutral-400 font-bold mt-1 uppercase italic">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active & Scheduled Maintenance List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2 px-1">
             <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock className="h-4 w-4" /> Schedule & Timeline
             </h3>
             <Button variant="ghost" className="text-[10px] font-black uppercase text-indigo-600 gap-1 h-8">
               Manage Recurring <ChevronRight className="h-3 w-3" />
             </Button>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
             {MOCK_MAINTENANCE_HISTORY.map((log) => (
                <div key={log.id} className="p-6 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                        log.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                         <Wrench className="h-6 w-6" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                            <h4 className="font-black text-indigo-950 dark:text-white leading-none">{log.type} Maintenance</h4>
                            <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-widest px-2 leading-none border shadow-none ${
                               log.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>{log.status}</Badge>
                         </div>
                         <p className="text-[11px] text-neutral-400 font-bold mt-1.5 uppercase tracking-widest truncate max-w-[300px]">Asset: {log.assetId} · {log.performer}</p>
                         <p className="text-xs text-neutral-500 mt-1 italic">{log.description}</p>
                      </div>
                   </div>
                   <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-sm font-black text-indigo-950 dark:text-white leading-none">${log.cost.toLocaleString()}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none italic">{log.date}</p>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
             ))}
          </div>

          <Button variant="outline" className="w-full h-14 border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-2xl flex items-center justify-center gap-2">
             <Plus className="h-4 w-4" /> Load Previous 10 Records
          </Button>
        </div>

        {/* Schedule & Setup Sidebar */}
        <div className="space-y-6">
           {/* Quick Action Setup */}
           <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-3xl overflow-hidden overflow-visible relative">
              <CardHeader>
                 <CardTitle className="text-lg font-black text-indigo-950 dark:text-white">New Service Call</CardTitle>
                 <CardDescription className="text-xs font-bold text-indigo-600 uppercase tracking-widest italic mt-1">Direct Vendor Booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Assign Asset</label>
                    <Select defaultValue="AST-003">
                       <SelectTrigger className="h-10 text-xs font-bold border-indigo-100 dark:border-indigo-900 shadow-none">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="AST-003">CNC Machine - Zone A</SelectItem>
                          <SelectItem value="AST-005">Ford F-150 Truck</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Service Type</label>
                    <Select defaultValue="Routine">
                       <SelectTrigger className="h-10 text-xs font-bold border-indigo-100 dark:border-indigo-900 shadow-none">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="Routine">Regular Routine</SelectItem>
                          <SelectItem value="Repair">Emergency Repair</SelectItem>
                          <SelectItem value="Upgrade">System Upgrade</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-1.5 pt-2">
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-indigo-50 dark:border-indigo-800/50 shadow-sm">
                       <Calendar className="h-4 w-4 text-indigo-400" />
                       <div>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Suggested Slot</p>
                          <p className="text-xs font-black text-indigo-600 mt-1 uppercase">Tue, 05 Mar 2026</p>
                       </div>
                    </div>
                 </div>
              </CardContent>
              <CardFooter>
                 <Button className="w-full bg-indigo-950 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 shadow-md">Book Technician</Button>
              </CardFooter>
           </Card>

           {/* Health Indicators Callout */}
           <div className="p-6 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 flex items-start gap-4">
                 <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle className="h-5 w-5" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest leading-none flex items-center gap-2">
                       Predictive Warning <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-500/80 mt-2 font-bold leading-relaxed">
                       CNC Milling Machine (AST-003) is showing increased vibration signatures. 
                       <span className="text-amber-600 underline underline-offset-2 ml-1 cursor-pointer">Expedite service?</span>
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
