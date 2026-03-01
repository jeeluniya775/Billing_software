'use client';

import { 
  Calendar, Clock, CheckCircle2, XCircle, 
  ArrowRight, Filter, Download, User,
  CalendarCheck, Coffee, Sun, ShieldAlert,
  ArrowUpRight, History, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_LEAVE_REQUESTS, MOCK_TEAM_SUMMARY } from '@/lib/mock-team';

export function AttendanceLeave() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Attendance Overview Card */}
         <Card className="lg:col-span-2 border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden relative bg-white dark:bg-neutral-950 group">
            <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950 p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-800">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-105 transition-transform">
                        <CalendarCheck className="h-7 w-7" />
                     </div>
                     <div>
                        <CardTitle className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">Global Attendance</CardTitle>
                        <CardDescription className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1.5 italic">Real-time team presence tracking</CardDescription>
                     </div>
                  </div>
                  <div className="text-right">
                     <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 shadow-none font-black text-[10px] uppercase tracking-widest px-3 py-1.5 animate-pulse">
                        <History className="h-3 w-3 mr-2" /> Live Analytics
                     </Badge>
                     <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-2">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
               <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-14">
                  <div className="text-center group/stat">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 group-hover/stat:text-indigo-600 transition-colors">Presence Rate</p>
                     <h2 className="text-5xl font-black text-indigo-950 dark:text-white font-mono tracking-tighter">{MOCK_TEAM_SUMMARY.attendanceRate}%</h2>
                     <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-600 font-bold mt-2 uppercase italic">
                        <TrendingUp className="h-3 w-3" /> Industry Benchmark 92%
                     </div>
                  </div>
                  
                  <div className="h-16 w-[1px] bg-neutral-100 dark:bg-neutral-800 hidden md:block" />
                  <div className="md:hidden h-[1px] w-16 bg-neutral-100" />
                  
                  <div className="text-center">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">On Leave Today</p>
                     <h2 className="text-5xl font-black text-indigo-600 font-mono tracking-tighter">{MOCK_TEAM_SUMMARY.onLeaveToday}</h2>
                     <p className="text-[10px] text-neutral-400 font-bold mt-2 uppercase italic tracking-widest">Active Leave Requests</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button className="h-16 bg-indigo-950 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg rounded-2xl flex flex-col items-center justify-center gap-1">
                     <Clock className="h-5 w-5" /> Mark Present
                  </Button>
                  <Button variant="outline" className="h-16 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex flex-col items-center justify-center gap-1">
                     <Coffee className="h-5 w-5 text-amber-500" /> Request Break
                  </Button>
                  <Button variant="outline" className="h-16 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex flex-col items-center justify-center gap-1">
                     <Sun className="h-5 w-5 text-rose-500" /> Planned Leave
                  </Button>
                  <Button variant="ghost" className="h-16 hidden md:flex border border-dashed border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex-col items-center justify-center gap-1 text-neutral-400">
                     <Calendar className="h-5 w-5" /> Calendar View
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Leave Balance / Indicators */}
         <div className="space-y-6 flex flex-col h-full">
            <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-3xl overflow-hidden relative flex-grow transition-all hover:bg-indigo-50/40">
               <CardHeader className="bg-white dark:bg-neutral-900 border-b border-indigo-50 dark:border-indigo-900/50">
                  <CardTitle className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Your Leave Balance</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  {[
                    { type: 'Annual', used: 12, total: 20, color: 'bg-indigo-600' },
                    { type: 'Sick', used: 2, total: 10, color: 'bg-amber-500' },
                    { type: 'Unpaid', used: 0, total: 5, color: 'bg-neutral-400' }
                  ].map(leave => (
                    <div key={leave.type} className="space-y-2">
                       <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{leave.type} Leave</span>
                          <span className="text-[11px] font-black text-indigo-950 dark:text-white">{leave.used} / {leave.total} Days</span>
                       </div>
                       <div className="h-2 w-full bg-indigo-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                             className={`h-full rounded-full ${leave.color}`} 
                             style={{ width: `${(leave.used / leave.total) * 100}%` }}
                          />
                       </div>
                    </div>
                  ))}
               </CardContent>
               <div className="p-6 pt-0">
                  <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest border-indigo-100 text-indigo-600 bg-white rounded-xl h-11 flex items-center justify-center gap-2 group">
                     Detail Policy Log <ArrowUpRight className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
               </div>
            </Card>
            
            {/* Holiday Callout */}
            <div className="p-6 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-3xl relative overflow-hidden group">
               <Sun className="absolute -right-4 -bottom-4 h-24 w-24 text-amber-200 dark:text-amber-900/30 rotate-12" />
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest">Next Public Holiday</h4>
                  <p className="text-xl font-black text-amber-950 dark:text-amber-300 mt-2">Holi Festival</p>
                  <p className="text-[10px] font-bold text-amber-800/70 dark:text-amber-500/80 mt-1 uppercase italic tracking-widest">Tuesday · March 25, 2024</p>
               </div>
            </div>
         </div>
      </div>

      {/* Leave Approval Section */}
      <div className="space-y-4 pt-4">
         <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-2">
            <div>
               <h4 className="text-lg font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">Leave Management Portal</h4>
               <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest italic">Review and manage team time-off requests</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Button variant="outline" className="h-10 px-4 rounded-xl border-neutral-100 dark:border-neutral-800 font-bold text-xs gap-2 hover:bg-neutral-50">
                 <Filter className="h-3.5 w-3.5" /> Filter
              </Button>
              <Button variant="outline" className="h-10 px-4 rounded-xl border-neutral-100 dark:border-neutral-800 font-bold text-xs gap-2 hover:bg-neutral-50">
                 <Download className="h-3.5 w-3.5" /> Export Log
              </Button>
            </div>
         </div>

         <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
               <thead>
                  <tr className="bg-neutral-50/50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
                     <th className="px-6 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Employee</th>
                     <th className="px-6 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Duration & Type</th>
                     <th className="px-6 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Reason</th>
                     <th className="px-6 py-5 text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-6 py-5 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                  {MOCK_LEAVE_REQUESTS.map((req) => (
                     <tr key={req.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all group">
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-3">
                              <div className="h-9 w-9 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600">
                                 <User className="h-5 w-5" />
                              </div>
                              <h4 className="font-black text-indigo-950 dark:text-white leading-none text-xs">{req.employeeName}</h4>
                           </div>
                        </td>
                        <td className="px-6 py-6 font-bold text-neutral-400 text-xs uppercase tracking-widest italic">
                           <div className="flex flex-col gap-1.5">
                              <span className="font-black text-indigo-950 dark:text-neutral-300">{req.startDate} — {req.endDate}</span>
                              <Badge variant="outline" className="w-fit text-[8px] px-2 py-0.5 border-neutral-100 text-neutral-400 shadow-none uppercase">{req.type}</Badge>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <p className="text-[11px] text-neutral-500 font-bold italic truncate max-w-[200px] leading-relaxed">{req.reason}</p>
                        </td>
                        <td className="px-6 py-6 text-center">
                           <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 border shadow-none ${
                              req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                              req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                              'bg-rose-50 text-rose-700 border-rose-100'
                           }`}>
                             {req.status}
                           </Badge>
                        </td>
                        <td className="px-6 py-6 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="outline" className="h-8 rounded-lg border-rose-100 text-rose-600 hover:bg-rose-50 text-[10px] font-black uppercase"> Reject </Button>
                              <Button size="sm" className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase"> Approve </Button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
