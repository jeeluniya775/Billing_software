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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTeamSummary();
        setSummary(data);
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
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-indigo-950 dark:bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Users2 className="h-6 w-6" />
               </div>
               <h1 className="text-4xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Team Control Center</h1>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] italic ml-1.5 flex items-center gap-2">
               Enterprise Human Capital & Growth Engine <Sparkles className="h-3 w-3 text-indigo-400" />
            </p>
          </div>
          
          <div className="flex gap-3">
             <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
                <Download className="h-4 w-4" /> Global Export
             </Button>
             <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 shadow-xl px-6 transition-all active:scale-95">
                <Settings className="h-4 w-4" /> HR Config
             </Button>
          </div>
        </div>

        {summary && (
          <Tabs defaultValue="overview" className="space-y-10">
            <div className="border-b border-neutral-100 dark:border-neutral-800 sticky top-0 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl z-30 -mx-4 md:-mx-8 px-4 md:px-8">
              <TabsList className="h-16 bg-transparent gap-8 p-0">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'employees', label: 'Personnel', icon: UserCircle },
                  { id: 'org', label: 'Org Chart', icon: Network },
                  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
                  { id: 'performance', label: 'Talent Growth', icon: BarChart3 },
                  { id: 'payroll', label: 'Payroll', icon: Wallet }
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
              <AttendanceLeave />
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
