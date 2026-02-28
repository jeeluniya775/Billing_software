'use client';

import { 
  Target, TrendingUp, Zap, BarChart3, 
  MessageSquare, Star, Award, History,
  ChevronRight, ArrowRight, ShieldCheck,
  CheckCircle2, Clock, MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_PERFORMANCE } from '@/lib/mock-team';

const Progress = ({ value, className }: { value: number, className?: string }) => (
  <div className={`h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden ${className}`}>
    <div className="h-full bg-indigo-600 transition-all" style={{ width: `${value}%` }} />
  </div>
);

export function PerformanceSection() {
  const perf = MOCK_PERFORMANCE;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Performance Matrix */}
         <Card className="lg:col-span-2 border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-3xl overflow-hidden relative transition-all hover:bg-indigo-50/40 group">
            <CardHeader className="bg-white dark:bg-neutral-900 border-b border-indigo-50 dark:border-indigo-900/50 p-6 md:p-8">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:rotate-6">
                        <Award className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">Elite Performance Score</CardTitle>
                        <CardDescription className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1.5 italic">H1 2024 Evaluation Period</CardDescription>
                     </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 shadow-none font-black text-[10px] uppercase tracking-widest px-3 py-1.5">
                     Rank: Top 5%
                  </Badge>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
               <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="relative h-48 w-48 flex items-center justify-center">
                     <div className="absolute inset-0 border-8 border-indigo-50 dark:border-neutral-800 rounded-full" />
                     <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent -rotate-12" style={{ clipPath: 'inset(0% 0% 0% 0%)' }} />
                     <div className="text-center group-hover:scale-110 transition-transform">
                        <h2 className="text-5xl font-black text-indigo-950 dark:text-white font-mono tracking-tighter">94</h2>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1 italic">Score Index</p>
                     </div>
                  </div>

                  <div className="flex-1 space-y-6 w-full">
                     {[
                       { label: 'Project Completion', score: perf.completionRate, color: 'bg-emerald-500', icon: Target },
                       { label: 'Focus & Productivity', score: perf.productivityScore, color: 'bg-indigo-500', icon: Zap },
                       { label: 'Peer Review Avg', score: 88, color: 'bg-violet-500', icon: Star }
                     ].map(metric => (
                       <div key={metric.label} className="space-y-3 p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-indigo-50 dark:border-indigo-800/50 shadow-sm transition-all hover:border-indigo-200">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white ${metric.color}`}>
                                   <metric.icon className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-black text-indigo-950 dark:text-white uppercase tracking-tighter">{metric.label}</span>
                             </div>
                             <span className="text-xs font-black text-neutral-400 font-mono">{metric.score}%</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-50 dark:bg-neutral-800 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full ${metric.color}`} 
                                style={{ width: `${metric.score}%` }}
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </CardContent>
            <CardFooter className="bg-indigo-950 text-white p-6 md:px-8 flex items-center justify-between overflow-hidden relative">
               <div className="absolute top-0 right-0 h-full w-48 bg-white/5 skew-x-12 translate-x-12" />
               <div className="relative z-10 space-y-1">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Next Milestone</p>
                  <p className="text-xs font-bold italic tracking-tighter">Annual Salary Review · May 15, 2024</p>
               </div>
               <Button className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-[9px] relative z-10 transition-transform active:scale-95">
                  Request Feedback
               </Button>
            </CardFooter>
         </Card>

         {/* Goals Tracking */}
         <div className="space-y-6">
            <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden h-full flex flex-col group transition-all hover:border-emerald-100">
               <CardHeader className="bg-emerald-50/30 dark:bg-emerald-950/20 border-b border-emerald-50 dark:border-emerald-900 p-6">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <TrendingUp className="h-5 w-5" />
                     </div>
                     <CardTitle className="text-lg font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">Active Goals</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-6 space-y-6 flex-grow">
                  {perf.goals.map((goal, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between items-start">
                          <div>
                             <p className="text-xs font-black text-indigo-950 dark:text-white tracking-widest leading-none mb-1">{goal.title}</p>
                             <p className="text-[9px] font-bold text-neutral-400 uppercase italic">Target: {goal.target}+</p>
                          </div>
                          <span className="text-[10px] font-black text-indigo-600">{((goal.current / goal.target) * 100).toFixed(0)}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-emerald-500 rounded-full" 
                             style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          />
                       </div>
                    </div>
                  ))}
               </CardContent>
               <CardFooter className="p-6 pt-2">
                  <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest border-emerald-100 dark:border-emerald-900/50 text-emerald-600 bg-emerald-50/20 rounded-xl h-11 flex items-center gap-2 group/btn">
                     Update Progress <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
               </CardFooter>
            </Card>
         </div>
      </div>

      {/* Activity Timeline Section */}
      <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
               <div>
                  <h4 className="text-lg font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">Professional Timeline</h4>
                  <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest italic">Key achievements and administrative logs</p>
               </div>
               <Button variant="ghost" className="h-10 text-[10px] font-black text-indigo-600 uppercase tracking-widest">Full History</Button>
            </div>

            <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-8 space-y-8 overflow-hidden relative">
               <div className="absolute top-8 left-[45px] bottom-8 w-[1px] bg-neutral-100 dark:bg-neutral-800" />
               
               {perf.activityTimeline.map((item: any, i: number) => (
                  <div key={i} className="flex gap-6 relative group transition-all">
                     <div className={`h-10 w-10 min-w-10 rounded-xl flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
                        item.category === 'Achievement' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                        item.category === 'Warning' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                        'bg-indigo-50 text-indigo-600 border border-indigo-100'
                     }`}>
                        {item.category === 'Achievement' ? <Award className="h-4 w-4" /> : item.category === 'Warning' ? <ShieldCheck className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                     </div>
                     <div className="flex-1 pb-8 group-last:pb-0">
                        <div className="flex justify-between items-center mb-1">
                           <h5 className="text-xs font-black text-indigo-950 dark:text-white uppercase tracking-tighter">{item.category} Unlocked</h5>
                           <span className="text-[10px] font-bold font-mono text-neutral-400 capitalize">{item.date}</span>
                        </div>
                        <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 leading-relaxed italic truncate lg:max-w-md">{item.action}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-6">
            <div className="p-6 bg-indigo-950 text-white rounded-3xl border border-indigo-900 shadow-xl relative overflow-hidden group">
               <BarChart3 className="absolute -right-6 -bottom-6 h-32 w-32 text-white/5 rotate-12" />
               <div className="relative z-10">
                  <h4 className="text-xs font-black uppercase tracking-widest">Growth Analytics</h4>
                  <p className="text-indigo-400 text-[10px] font-bold mt-1 uppercase italic mb-8">AI Career Prediction active</p>

                  <div className="space-y-6">
                     <div className="bg-indigo-900/40 p-5 rounded-2xl border border-indigo-800/50 flex items-center gap-4 group/box hover:bg-indigo-900/60 transition-all cursor-pointer">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover/box:scale-110 transition-transform">
                           <Zap className="h-5 w-5 text-indigo-300" />
                        </div>
                        <div>
                           <p className="text-xs font-black leading-none mb-1">Lead Readiness</p>
                           <p className="text-[11px] font-black text-emerald-400">82% Positive</p>
                        </div>
                     </div>
                     
                     <div className="bg-indigo-900/40 p-5 rounded-2xl border border-indigo-800/50 flex items-center gap-4 group/box hover:bg-indigo-900/60 transition-all cursor-pointer">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover/box:scale-110 transition-transform">
                           <MessageSquare className="h-5 w-5 text-indigo-300" />
                        </div>
                        <div>
                           <p className="text-xs font-black leading-none mb-1">Skill Gap Analysis</p>
                           <p className="text-[11px] font-black text-amber-400">2 Needs Identified</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
