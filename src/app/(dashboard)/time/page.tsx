'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, Calendar, Briefcase, UserCheck, 
  Settings, Download, Plus, Filter, Search,
  ChevronRight, Timer, History, BarChart3, Lock, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeKpiCards } from '@/components/time/TimeKpiCards';
import { TimeCharts } from '@/components/time/TimeCharts';
import { TimeEntryTable } from '@/components/time/TimeEntryTable';
import { TimesheetView } from '@/components/time/TimesheetView';
import { ProjectTimeIntegration } from '@/components/time/ProjectTimeIntegration';
import { AttendanceIntegration } from '@/components/time/AttendanceIntegration';
import { getSummary } from '@/services/time.service';
import { TimeSummary } from '@/types/time';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

export default function TimeTrackingPage() {
  const [summary, setSummary] = useState<TimeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSummary();
        setSummary(data);
      } catch (error) {
        console.error('Failed to load time data', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-indigo-950 dark:bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Clock className="h-6 w-6" />
               </div>
               <h1 className="text-4xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Time Tracking</h1>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] italic ml-1.5 flex items-center gap-2">
               Precision Performance & Resource Analytics <Sparkles className="h-3 w-3 text-indigo-400" />
            </p>
          </div>
          
          <div className="flex gap-3">
             <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
                <Download className="h-4 w-4" /> Export Logs
             </Button>
             <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 shadow-xl px-6 transition-all active:scale-95">
                <Plus className="h-4 w-4" /> New Entry
             </Button>
          </div>
        </div>

        {summary && <TimeKpiCards summary={summary} isLoading={isLoading} />}

        <Tabs defaultValue="overview" className="space-y-10">
           <div className="border-b border-neutral-100 dark:border-neutral-800 sticky top-0 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl z-30 -mx-4 md:-mx-8 px-4 md:px-8">
              <TabsList className="h-16 bg-transparent gap-8 p-0">
                 {[
                   { id: 'overview', label: 'Overview', icon: BarChart3 },
                   { id: 'entries', label: 'Time Entries', icon: Timer },
                   { id: 'timesheets', label: 'Timesheets', icon: History },
                   { id: 'projects', label: 'Projects', icon: Briefcase },
                   { id: 'attendance', label: 'Attendance', icon: UserCheck }
                 ].map(tab => (
                   <TabsTrigger 
                     key={tab.id}
                     value={tab.id} 
                     className="h-full border-b-4 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent rounded-none px-2 font-black uppercase tracking-widest text-[10px] text-neutral-400 data-[state=active]:text-indigo-950 dark:data-[state=active]:text-white transition-all gap-2"
                   >
                     <tab.icon className="h-4 w-4 mb-0.5" /> {tab.label}
                   </TabsTrigger>
                 ))}
              </TabsList>
           </div>

           <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
              {summary && <TimeCharts summary={summary} isLoading={isLoading} />}
           </TabsContent>

           <TabsContent value="entries" className="animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
              <TimeEntryTable />
           </TabsContent>

           <TabsContent value="timesheets" className="animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
              <TimesheetView />
           </TabsContent>

           <TabsContent value="projects" className="animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
              <ProjectTimeIntegration />
           </TabsContent>

           <TabsContent value="attendance" className="animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
              <AttendanceIntegration />
           </TabsContent>
        </Tabs>

        {/* Floating Session Guard / Indicator */}
        <div className="fixed bottom-8 right-8 z-50 group">
           <div className="bg-indigo-950 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 border border-indigo-900/50 backdrop-blur-xl transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center animate-pulse">
                <Clock className="h-5 w-5" />
              </div>
              <div className="pr-4 border-r border-indigo-800">
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Total Today</p>
                 <p className="text-lg font-black">{summary?.totalHoursToday || '0.0'}h</p>
              </div>
              <ChevronRight className="h-4 w-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
           </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
