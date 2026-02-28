'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, Calendar, Briefcase, UserCheck, 
  Settings, Download, Plus, Filter, Search,
  ChevronRight, Timer, History, BarChart3, Lock
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
      <div className="p-4 md:p-8 space-y-8 bg-neutral-50/50 dark:bg-black min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
               <Clock className="h-3 w-3" /> Professional Time Engine
            </div>
            <h1 className="text-4xl font-black text-indigo-950 dark:text-white tracking-tighter">
              Time <span className="text-indigo-600 font-extrabold">&</span> Attendance
            </h1>
            <p className="text-sm font-bold text-neutral-400 italic">Track project hours, manage timesheets, and monitor team productivity.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="h-12 px-6 rounded-2xl border-neutral-200 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] bg-white dark:bg-neutral-900 shadow-sm transition-all hover:border-indigo-200">
              <Download className="h-4 w-4 mr-2" /> Export Logs
            </Button>
            <Button className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95">
              <Plus className="h-4 w-4 mr-2" /> New Entry
            </Button>
          </div>
        </div>

        {summary && <TimeKpiCards summary={summary} isLoading={isLoading} />}

        <Tabs defaultValue="overview" className="space-y-8">
           <div className="bg-white dark:bg-neutral-900 p-1.5 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm inline-flex w-full md:w-auto overflow-x-auto whitespace-nowrap scrollbar-hide">
              <TabsList className="bg-transparent h-12 gap-1">
                 <TabsTrigger value="overview" className="rounded-2xl px-6 h-full data-[state=active]:bg-indigo-950 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] transition-all">
                    <BarChart3 className="h-3.5 w-3.5 mr-2" /> Overview
                 </TabsTrigger>
                 <TabsTrigger value="entries" className="rounded-2xl px-6 h-full data-[state=active]:bg-indigo-950 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] transition-all">
                    <Timer className="h-3.5 w-3.5 mr-2" /> Time Entries
                 </TabsTrigger>
                 <TabsTrigger value="timesheets" className="rounded-2xl px-6 h-full data-[state=active]:bg-indigo-950 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] transition-all">
                    <History className="h-3.5 w-3.5 mr-2" /> Timesheets
                 </TabsTrigger>
                 <TabsTrigger value="projects" className="rounded-2xl px-6 h-full data-[state=active]:bg-indigo-950 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] transition-all">
                    <Briefcase className="h-3.5 w-3.5 mr-2" /> Projects
                 </TabsTrigger>
                 <TabsTrigger value="attendance" className="rounded-2xl px-6 h-full data-[state=active]:bg-indigo-950 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] transition-all">
                    <UserCheck className="h-3.5 w-3.5 mr-2" /> Attendance
                 </TabsTrigger>
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
