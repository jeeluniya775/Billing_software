'use client';

import { 
  Briefcase, TrendingUp, AlertTriangle, CheckCircle2, 
  BarChart3, Settings, UserPlus, DollarSign, 
  Target, Zap, Clock, ShieldAlert, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';

const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden ${className}`}>
    <div 
      className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
import { MOCK_PROJECT_STATS } from '@/lib/mock-time';

export function ProjectTimeIntegration() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {MOCK_PROJECT_STATS.map((prj) => {
           const isOverBudget = prj.actualHours > prj.budgetedHours;
           const percentUsed = (prj.actualHours / prj.budgetedHours) * 100;
           
           return (
             <Card key={prj.projectId} className={`border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden relative group hover:border-indigo-100 transition-all ${isOverBudget ? 'bg-rose-50/10 dark:bg-rose-900/5' : 'bg-white dark:bg-neutral-950'}`}>
                {isOverBudget && (
                  <div className="absolute top-4 right-4 text-rose-600 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/40 px-3 py-1.5 rounded-xl border border-rose-100 dark:border-rose-800 shadow-sm z-10 animate-pulse">
                     <AlertTriangle className="h-4 w-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Over Budget</span>
                  </div>
                )}
                
                <CardHeader>
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                         <Briefcase className="h-6 w-6" />
                      </div>
                      <div>
                         <CardTitle className="text-lg font-black text-indigo-950 dark:text-white leading-none">{prj.projectName}</CardTitle>
                         <CardDescription className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1.5 italic">ID: {prj.projectId}</CardDescription>
                      </div>
                   </div>
                </CardHeader>

                <CardContent className="space-y-6">
                   <div className="grid grid-cols-3 gap-2">
                      <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-center">
                         <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">Budgeted</p>
                         <p className="text-lg font-black text-indigo-950 dark:text-white mt-2">{prj.budgetedHours}h</p>
                      </div>
                      <div className="p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 text-center shadow-sm">
                         <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">Actual</p>
                         <p className={`text-lg font-black mt-2 ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>{prj.actualHours}h</p>
                      </div>
                      <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-center">
                         <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">Utilization</p>
                         <p className="text-lg font-black text-indigo-950 dark:text-white mt-2">{prj.utilization}%</p>
                      </div>
                   </div>

                   <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-end mb-1">
                         <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Hours Consumption</span>
                         <span className={`text-[11px] font-black ${percentUsed > 90 ? 'text-rose-600' : 'text-indigo-600'}`}>{percentUsed.toFixed(0)}% Used</span>
                      </div>
                      <Progress 
                        value={percentUsed > 100 ? 100 : percentUsed} 
                        className={`h-2.5 rounded-full overflow-hidden ${isOverBudget ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-neutral-100 dark:bg-neutral-800'}`} 
                      />
                   </div>

                   <div className="space-y-4 pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-800">
                      <div className="flex justify-between items-center">
                         <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">Task Breakdown</h4>
                         <Badge variant="outline" className="text-[9px] font-black uppercase text-indigo-600 hover:bg-transparent px-0 border-none shadow-none">{prj.tasks.length} Active</Badge>
                      </div>
                      <div className="space-y-2">
                         {prj.tasks.map(task => (
                           <div key={task.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-black/20 rounded-xl border border-neutral-100 dark:border-neutral-800 transition-all hover:border-indigo-100">
                              <div className="flex items-center gap-3">
                                 {task.status === 'Completed' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Zap className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />}
                                 <span className="text-xs font-black text-indigo-950 dark:text-white">{task.name}</span>
                              </div>
                              <span className="text-[11px] font-mono font-black text-neutral-400">{task.hours}h</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </CardContent>

                <CardFooter className="bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 p-0 h-14">
                   <Button variant="ghost" className="h-full rounded-none font-black uppercase tracking-widest text-[9px] flex items-center gap-2 border-r border-neutral-100 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800">
                      <UserPlus className="h-3.5 w-3.5" /> Assign Team
                   </Button>
                   <Button variant="ghost" className="h-full rounded-none font-black uppercase tracking-widest text-[9px] flex items-center gap-2 text-indigo-600 hover:bg-white dark:hover:bg-neutral-800">
                      <BarChart3 className="h-3.5 w-3.5" /> Full Analytics
                   </Button>
                </CardFooter>
             </Card>
           );
         })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Billable Rate Settings Sidebar */}
         <Card className="lg:col-span-2 border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-3xl overflow-hidden relative">
            <CardHeader className="bg-white dark:bg-neutral-900 border-b border-indigo-50 dark:border-indigo-900/50">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600">
                     <Settings className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Finance & Billing Ready</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign className="h-3 w-3" /> Average Billable Rate
                     </p>
                     <div className="p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-indigo-50 shadow-sm relative overflow-hidden group">
                        <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-emerald-500 opacity-50 group-hover:scale-125 transition-all" />
                        <h4 className="text-4xl font-black text-indigo-950 dark:text-white">$165<span className="text-base text-neutral-400">/hr</span></h4>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-2">+12% vs last quarter</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                        <Target className="h-3 w-3" /> Revenue Projection
                     </p>
                     <div className="p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-indigo-50 shadow-sm relative overflow-hidden group">
                        <h4 className="text-4xl font-black text-emerald-600">$10,420</h4>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-2">Unbilled for active tasks</p>
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-indigo-950 text-white rounded-3xl relative overflow-hidden group">
                  <div className="relative z-10">
                     <h4 className="text-lg font-black mb-1">Overtime & Rule Setup</h4>
                     <p className="text-neutral-400 text-xs font-bold leading-relaxed mb-6 italic uppercase tracking-tighter">Current: 1.5x after 40h standard week</p>
                     
                     <div className="flex gap-3">
                        <Button className="bg-white text-indigo-950 hover:bg-neutral-100 font-black h-11 px-8 rounded-xl shadow-lg text-[10px] uppercase tracking-widest">Configure Rules</Button>
                        <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 font-black h-11 px-8 rounded-xl text-[10px] uppercase tracking-widest">Preview Payroll Integration</Button>
                     </div>
                  </div>
                  
                  {/* Background pattern */}
                  <div className="absolute top-0 right-0 h-full w-48 bg-white/5 skew-x-12 translate-x-12" />
               </div>
            </CardContent>
         </Card>

         {/* Warnings / Callouts sidebar */}
         <div className="space-y-6">
            <div className="p-6 bg-rose-50/50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-3xl relative overflow-hidden group">
               <ShieldAlert className="absolute -right-4 -bottom-4 h-24 w-24 text-rose-200 dark:text-rose-900/30 rotate-12" />
               <div className="relative z-10">
                  <h4 className="text-xs font-black text-rose-900 dark:text-rose-400 uppercase tracking-widest flex items-center gap-2">
                    Critical Alert <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  </h4>
                  <p className="text-[11px] font-bold text-rose-800/80 dark:text-rose-500/80 mt-3 leading-relaxed">
                     Mobile App Backend (PRJ-102) has exceeded budgeted hours by 10h. 
                     Profitability is dropping. <span className="underline underline-offset-2 cursor-pointer font-black ml-1">Review Resource Allocation?</span>
                  </p>
               </div>
            </div>

            <div className="p-6 bg-neutral-900 text-white rounded-3xl border border-neutral-800 relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4">
                     <Clock className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Productivity AI</h4>
                  <p className="text-neutral-500 text-[10px] font-bold mt-1 uppercase italic mb-6">Idle time detection active</p>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-400 font-bold uppercase tracking-widest text-[9px]">Calculated Idle Time</span>
                        <span className="font-black text-rose-400">1.2h</span>
                     </div>
                     <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '15%' }} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
