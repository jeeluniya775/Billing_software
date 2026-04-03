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
import { PageHeader } from '@/components/layout/PageHeader';
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
        setSummary(data || null);
      } catch (error) {
        console.error('Failed to load time data', error);
        setSummary(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <PageHeader 
          title="Time & Attendance"
          subtitle="Track project hours, manage timesheets, and monitor team productivity."
          actions={
            <>
              <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
                <Download className="h-4 w-4" /> Export Logs
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-9 text-xs">
                <Plus className="h-4 w-4" /> New Entry
              </Button>
            </>
          }
        />

        {summary && <TimeKpiCards summary={summary} isLoading={isLoading} />}

        <Tabs defaultValue="overview" className="space-y-8">
           <div className="flex items-center justify-between">
              <TabsList className="h-10">
                 <TabsTrigger value="overview">Overview</TabsTrigger>
                 <TabsTrigger value="entries">Time Entries</TabsTrigger>
                 <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
                 <TabsTrigger value="projects">Projects</TabsTrigger>
                 <TabsTrigger value="attendance">Attendance</TabsTrigger>
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
