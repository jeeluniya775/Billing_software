'use client';

import { 
  LogIn, LogOut, Coffee, Timer, AlertCircle, 
  MapPin, Clock, Calendar, CheckCircle2, User,
  ShieldCheck, ArrowRight, Activity, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { MOCK_ATTENDANCE } from '@/lib/mock-time';

export function AttendanceIntegration() {
  const att = MOCK_ATTENDANCE[0];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Clock-In/Out Dashboard */}
         <Card className="lg:col-span-2 border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden relative bg-white dark:bg-neutral-950 group">
            <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950 p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-800">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-105 transition-transform">
                        <User className="h-7 w-7" />
                     </div>
                     <div>
                        <CardTitle className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">Jeel Uniya</CardTitle>
                        <CardDescription className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1.5 italic">Front-end Engineeer · ID: EMP-005</CardDescription>
                     </div>
                  </div>
                  <div className="text-right">
                     <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 shadow-none font-black text-[10px] uppercase tracking-widest px-3 py-1.5 animate-pulse">
                        <Activity className="h-3 w-3 mr-2" /> Currently In
                     </Badge>
                     <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-2">{att.date}</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
               <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-14">
                  <div className="text-center group/time">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 group-hover/time:text-indigo-600 transition-colors">Start Session</p>
                     <h2 className="text-5xl font-black text-indigo-950 dark:text-white font-mono tracking-tighter">{att.clockIn}</h2>
                     <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-600 font-bold mt-2 uppercase italic">
                        <CheckCircle2 className="h-3 w-3" /> Ontime Mark
                     </div>
                  </div>
                  
                  <div className="h-16 w-[1px] bg-neutral-100 dark:bg-neutral-800 hidden md:block" />
                  <div className="md:hidden h-[1px] w-16 bg-neutral-100" />
                  
                  <div className="text-center">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Today's Duration</p>
                     <h2 className="text-5xl font-black text-indigo-600 font-mono tracking-tighter">{att.totalWorkHours}h</h2>
                     <p className="text-[10px] text-neutral-400 font-bold mt-2 uppercase italic tracking-widest">Active Focus Time</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Button className="h-16 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg rounded-2xl flex flex-col items-center justify-center gap-1 group/btn">
                     <LogOut className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" /> Clock Out
                  </Button>
                  <Button variant="outline" className="h-16 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex flex-col items-center justify-center gap-1">
                     <Coffee className="h-5 w-5 text-amber-500" /> Start Break
                  </Button>
                  <Button variant="ghost" className="h-16 hidden md:flex border border-dashed border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex-col items-center justify-center gap-1 text-neutral-400">
                     <MapPin className="h-5 w-5" /> Visit Client
                  </Button>
               </div>
            </CardContent>
            
            <CardFooter className="bg-neutral-50/50 dark:bg-neutral-950 p-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-bold text-neutral-500">
               <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Shift: Morning Tech (09:00 - 18:00)</span>
                  <span className="h-3 w-[1px] bg-neutral-200" />
                  <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Biometric Verified</span>
               </div>
               <p className="uppercase tracking-widest text-[9px] font-black underline underline-offset-4 cursor-pointer hover:text-indigo-600">History Log</p>
            </CardFooter>
         </Card>

         {/* Weekly Overview Sidebar */}
         <div className="space-y-6">
            <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden relative bg-white dark:bg-neutral-950 h-full flex flex-col">
               <CardHeader className="p-6">
                  <CardTitle className="text-lg font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Attendance Metrics</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Current Work Week</CardDescription>
               </CardHeader>
               <CardContent className="px-6 space-y-6 flex-grow">
                  <div className="space-y-5">
                     {[
                       { day: 'Mon', status: 'Present', hrs: '8.5h', color: 'bg-emerald-500' },
                       { day: 'Tue', status: 'Present', hrs: '9.0h', color: 'bg-emerald-500' },
                       { day: 'Wed', status: 'Late', hrs: '7.8h', color: 'bg-amber-500' },
                       { day: 'Thu', status: 'Present', hrs: '8.2h', color: 'bg-emerald-500' },
                       { day: 'Fri', status: 'Present', hrs: '8.5h', color: 'bg-indigo-500' }
                     ].map(item => (
                       <div key={item.day} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className={`h-2 w-2 rounded-full ${item.color}`} />
                             <span className="text-xs font-black text-indigo-950 dark:text-white w-8">{item.day}</span>
                          </div>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none bg-neutral-50 dark:bg-black px-2 py-1 rounded-lg border border-neutral-100 dark:border-neutral-800">{item.status}</p>
                          <span className="text-xs font-black text-indigo-950 dark:text-white w-10 text-right font-mono">{item.hrs}</span>
                       </div>
                     ))}
                  </div>

                  <div className="pt-6 border-t border-dashed border-neutral-100 dark:border-neutral-800 space-y-4">
                     <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-50 dark:border-indigo-800/50">
                        <div>
                           <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] leading-none mb-1">Weekly Avg</p>
                           <p className="text-lg font-black text-indigo-950 dark:text-white">8.4 Hours</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg text-emerald-500 shadow-sm border border-emerald-50 dark:border-emerald-900/40">
                           <TrendingUp className="h-4 w-4" />
                        </div>
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="p-6">
                  <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest border-indigo-100 dark:border-indigo-900/50 text-indigo-600 bg-indigo-50/20 rounded-xl h-11 flex items-center gap-2 group">
                     Schedule & Shift Detail <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </CardFooter>
            </Card>
         </div>
      </div>
    </div>
  );
}
