'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Users2, Database, ShieldAlert, 
  Settings, Download, Share2, Filter,
  LayoutDashboard, UserCircle, Network,
  CalendarCheck, BarChart3, Wallet, Sparkles
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/PageHeader';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

// Components
import { TeamKpiCards } from '@/components/team/TeamKpiCards';
import { TeamCharts } from '@/components/team/TeamCharts';
import { EmployeeTable } from '@/components/team/EmployeeTable';
import { DepartmentManager } from '@/components/team/DepartmentManager';
import { OrgChartView } from '@/components/team/OrgChartView';
import { AttendanceLeave } from '@/components/team/AttendanceLeave';
import { PerformanceSection } from '@/components/team/PerformanceSection';
import { PayrollPreview } from '@/components/team/PayrollPreview';

// Services/Types
import { getTeamSummary } from '@/services/team.service';
import { TeamSummary } from '@/types/team';

export default function TeamManagementPage() {
  const [summary, setSummary] = useState<TeamSummary | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [summaryData, leaves] = await Promise.all([
          getTeamSummary(),
          // getLeaveRequests() // Assume this is available or implement
          Promise.resolve([]) 
        ]);
        setSummary(summaryData);
        setLeaveRequests(leaves);
      } catch (err) {
        console.error('Failed to load team metrics', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <PageHeader 
          title="Team Control Center"
          subtitle="Enterprise Human Capital & Growth Engine"
          actions={
            <>
              <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
                <Download className="h-4 w-4" /> Global Export
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-9 text-xs">
                <Settings className="h-4 w-4" /> HR Config
              </Button>
            </>
          }
        />

        {summary && (
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="h-10">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="employees">Personnel</TabsTrigger>
                <TabsTrigger value="org">Org Chart</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="performance">Talent Growth</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-10 outline-none">
              <TeamKpiCards summary={summary} isLoading={isLoading} />
              <div className="pt-4 px-2">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                    <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Growth Analytics</h2>
                 </div>
                 <TeamCharts summary={summary} isLoading={isLoading} />
              </div>
            </TabsContent>

            {/* Personnel Tab */}
            <TabsContent value="employees" className="outline-none">
              <EmployeeTable />
            </TabsContent>

            {/* Org Chart & Depts Tab */}
            <TabsContent value="org" className="space-y-12 outline-none">
               <DepartmentManager />
               <div className="pt-8">
                  <OrgChartView />
               </div>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="outline-none">
              <AttendanceLeave summary={summary} leaveRequests={leaveRequests} />
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="outline-none">
              <PerformanceSection />
            </TabsContent>

            {/* Payroll Tab */}
            <TabsContent value="payroll" className="outline-none">
              <PayrollPreview />
            </TabsContent>
          </Tabs>
        )}

        {/* Floating AI Insights Badge */}
        <div className="fixed bottom-8 right-8 z-50">
           <div className="p-4 bg-white dark:bg-neutral-800 rounded-3xl border border-indigo-100 dark:border-neutral-700 shadow-2xl flex items-center gap-4 group cursor-pointer hover:border-indigo-400 transition-all">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900 rounded-2xl flex items-center justify-center text-indigo-600 animate-bounce">
                 <Sparkles className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-indigo-950 dark:text-white leading-none mb-1">Team Health</p>
                 <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] font-black uppercase p-0 px-2 h-4">Optimal</Badge>
              </div>
           </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
