'use client';

import { 
  Network, User, Shield, Briefcase, 
  ChevronDown, ExternalLink, Zap, Target 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_EMPLOYEES } from '@/lib/mock-team';

export function OrgChartView() {
  // Simplified tree: Sarah (Manager) -> Others
  const manager = MOCK_EMPLOYEES.find(e => e.id === 'EMP-010') || MOCK_EMPLOYEES[0];
  const team = MOCK_EMPLOYEES.filter(e => e.reportingManagerId === manager.id || e.id === 'EMP-001');

  return (
    <div className="space-y-8 p-4 md:p-10 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden">
      {/* Background decoration */}
      <Network className="absolute -top-10 -right-10 h-64 w-64 text-indigo-50/50 dark:text-neutral-800/20 -rotate-12 pointer-events-none" />
      
      <div className="text-center relative z-10 space-y-2 mb-16">
         <h3 className="text-3xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Chain of Command</h3>
         <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest italic">Organizational hierarchy and reporting lines</p>
      </div>

      <div className="relative flex flex-col items-center">
         {/* Top Level - Head */}
         <div className="relative group">
            <div className="bg-indigo-950 text-white p-6 rounded-3xl shadow-xl w-64 border-4 border-indigo-600 relative z-20 transition-transform group-hover:scale-105">
               <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-16 w-16 bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                     <img src={`https://i.pravatar.cc/150?u=sarah`} alt="Head" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h4 className="font-black text-lg leading-none">Sarah Connor</h4>
                     <p className="text-[10px] font-bold text-indigo-300 uppercase mt-2 tracking-widest">VP of Engineering</p>
                  </div>
               </div>
               <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center border-2 border-indigo-600 shadow-md">
                  <ChevronDown className="h-3 w-3 text-indigo-600" />
               </div>
            </div>
            {/* Connecting line down */}
            <div className="w-1 h-12 bg-indigo-100 dark:bg-neutral-800 mx-auto" />
         </div>

         {/* Middle Layer Connector */}
         <div className="w-[80%] h-1 bg-indigo-100 dark:bg-neutral-800 rounded-full relative">
            <div className="absolute top-0 left-0 w-1 h-8 bg-indigo-100 dark:bg-neutral-800" />
            <div className="absolute top-0 right-0 w-1 h-8 bg-indigo-100 dark:bg-neutral-800" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-indigo-100 dark:bg-neutral-800" />
         </div>

         {/* Team Level */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full">
            {team.map((emp) => (
               <div key={emp.id} className="relative group">
                  <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm transition-all group-hover:border-indigo-200 group-hover:shadow-md relative overflow-hidden">
                     <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:scale-110" />
                     
                     <div className="flex items-center gap-4 relative z-10">
                        <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-sm border border-white dark:border-neutral-800">
                           <img src={emp.photoUrl} alt={emp.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <h4 className="font-black text-indigo-950 dark:text-white leading-none text-sm">{emp.name}</h4>
                           <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1.5 italic">{emp.role}</p>
                        </div>
                     </div>

                     <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <div className="p-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 text-center flex-1">
                           <p className="text-[8px] font-black text-neutral-300 uppercase tracking-tighter mb-1">Score</p>
                           <p className="text-xs font-black text-indigo-600">{emp.performanceScore}%</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 text-center flex-1">
                           <p className="text-[8px] font-black text-neutral-300 uppercase tracking-tighter mb-1">Status</p>
                           <p className={`text-[8px] font-black ${emp.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>{emp.status}</p>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Footer action */}
         <div className="mt-16 text-center">
            <Button variant="outline" className="h-11 px-8 rounded-2xl border-indigo-100 dark:border-neutral-800 font-black uppercase tracking-[0.2em] text-[10px] bg-white dark:bg-neutral-900 text-indigo-600 shadow-sm hover:bg-neutral-50 transition-all gap-2">
               <ExternalLink className="h-4 w-4" /> Expand Org Matrix
            </Button>
         </div>
      </div>
    </div>
  );
}
