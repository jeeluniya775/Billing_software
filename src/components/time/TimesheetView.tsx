'use client';

import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  CheckCircle2, XCircle, Clock, Send, 
  MoreVertical, Download, Lock, Unlock, BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { MOCK_TIMESHEETS } from '@/lib/mock-time';

export function TimesheetView() {
  const ts = MOCK_TIMESHEETS[0];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Dummy hours per day for the week
  const hoursPerDay = [8.5, 9.0, 8.0, 8.5, 8.5, 0, 0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h3 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Weekly Timesheet</h3>
            <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest italic">Period: {ts.startDate} — {ts.endDate}</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="h-10 rounded-xl border-neutral-100 dark:border-neutral-800 font-bold text-xs gap-2">
               <Download className="h-4 w-4" /> Download PDF
            </Button>
            {ts.status === 'Draft' ? (
              <Button className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2">
                 <Send className="h-4 w-4" /> Submit for Approval
              </Button>
            ) : (
              <Badge className={`h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-none ${
                ts.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                 {ts.status === 'Approved' ? <BadgeCheck className="h-4 w-4 mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
                 {ts.status}
              </Badge>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Main Calendar View */}
         <Card className="lg:col-span-3 border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden divide-y divide-neutral-50 dark:divide-neutral-900">
            <div className="p-6 bg-neutral-50/50 dark:bg-neutral-900/50 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full border border-neutral-100"><ChevronLeft className="h-4 w-4" /></Button>
                  <span className="text-xs font-black uppercase tracking-widest">Feb 26 — Mar 03</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full border border-neutral-100"><ChevronRight className="h-4 w-4" /></Button>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">Weekly Total</p>
                  <p className="text-xl font-black text-indigo-950 dark:text-white mt-1">{ts.totalHours} Hours</p>
               </div>
            </div>

            <div className="grid grid-cols-7 divide-x divide-neutral-50 dark:divide-neutral-800">
               {days.map((day, idx) => (
                 <div key={day} className={`p-6 min-h-[160px] flex flex-col items-center justify-between group transition-all ${idx >= 5 ? 'bg-neutral-50/30' : 'hover:bg-neutral-50/50 cursor-pointer'}`}>
                    <div className="text-center">
                       <p className={`text-[10px] font-black uppercase tracking-widest ${idx >= 5 ? 'text-neutral-300' : 'text-neutral-400 group-hover:text-indigo-600'}`}>{day}</p>
                       <p className="text-lg font-black text-indigo-950 dark:text-white mt-1">{idx + 26}</p>
                    </div>
                    
                    <div className="w-full text-center">
                       {hoursPerDay[idx] > 0 ? (
                         <div className="space-y-1">
                            <p className="text-sm font-black text-indigo-600">{hoursPerDay[idx]}h</p>
                            <div className="h-1 w-8 bg-indigo-100 dark:bg-indigo-900 mx-auto rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-600" style={{ width: '80%' }} />
                            </div>
                         </div>
                       ) : (
                         <p className="text-[10px] font-bold text-neutral-300 uppercase italic">Empty</p>
                       )}
                    </div>
                    
                    {idx < 5 && hoursPerDay[idx] > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1 justify-center">
                         <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                         <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </div>
                    )}
                 </div>
               ))}
            </div>

            <div className="p-8">
               <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Daily Task Breakdown</h4>
                  <Button variant="ghost" className="h-8 text-[10px] font-black text-indigo-600 uppercase tracking-widest">Detail View</Button>
               </div>
               
               <div className="space-y-4">
                  {[
                    { prj: 'E-commerce Platform', task: 'Layout Dev', hrs: 4.5, type: 'Billable' },
                    { prj: 'E-commerce Platform', task: 'API Integration', hrs: 3.5, type: 'Billable' },
                    { prj: 'Internal Training', task: 'Mentorship', hrs: 0.5, type: 'Internal' }
                  ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-indigo-100 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="h-2 w-2 rounded-full bg-indigo-500" />
                          <div>
                             <p className="text-xs font-black text-indigo-950 dark:text-white">{task.prj}</p>
                             <p className="text-[10px] font-bold text-neutral-400 uppercase mt-0.5">{task.task}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <Badge variant="outline" className={`text-[9px] uppercase font-black px-2 shadow-none ${task.type === 'Billable' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-neutral-400 bg-neutral-50'}`}>{task.type}</Badge>
                          <span className="text-sm font-black text-indigo-600 w-12 text-right">{task.hrs}h</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </Card>

         {/* Approval sidebar */}
         <div className="space-y-6">
            <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-3xl overflow-hidden relative">
               <CardHeader>
                  <CardTitle className="text-lg font-black text-indigo-950 dark:text-white">Admin Hub</CardTitle>
                  <CardDescription className="text-xs font-bold text-indigo-600 uppercase tracking-widest italic mt-1">Timesheet Operations</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6 pt-2">
                  <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-indigo-50 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Billable Accuracy</p>
                        <p className="text-xs font-black text-emerald-600">92%</p>
                     </div>
                     <div className="h-2 w-full bg-indigo-50 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: '92%' }} />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">Actions</p>
                     <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] shadow-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Approve Sheet
                     </Button>
                     <Button variant="outline" className="w-full h-11 border-rose-200 dark:border-rose-900 text-rose-600 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 dark:hover:bg-rose-900/40 flex items-center gap-2">
                        <XCircle className="h-4 w-4" /> Send Back
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <div className="p-6 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-3xl relative overflow-hidden group">
               <Lock className="absolute -right-4 -bottom-4 h-24 w-24 text-amber-200 dark:text-amber-900/30 rotate-12" />
               <div className="relative z-10">
                  <h4 className="text-xs font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest">Submission Policy</h4>
                  <p className="text-[11px] font-bold text-amber-800/70 dark:text-amber-500/80 mt-2 leading-relaxed italic">
                    Once submitted, this timesheet will be locked and sent to HR for payroll auditing. 
                    Ensure all billable hours are captured accurately.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
