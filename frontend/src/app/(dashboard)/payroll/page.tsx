'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, Wallet, CreditCard, ShieldCheck, 
  Download, Settings, Filter, Sparkles,
  LayoutDashboard, Users, Zap, FileText, 
  Landmark, History, SlidersHorizontal
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/PageHeader';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

// Components
import { PayrollKpiCards } from '@/components/payroll/PayrollKpiCards';
import { PayrollCharts } from '@/components/payroll/PayrollCharts';
import { SalaryTable } from '@/components/payroll/SalaryTable';
import { PayrollProcessing } from '@/components/payroll/PayrollProcessing';
import { PayslipManager } from '@/components/payroll/PayslipManager';
import { TaxCompliance } from '@/components/payroll/TaxCompliance';

// Services/Types
import { getPayrollSummary } from '@/services/payroll.service';
import { PayrollSummary } from '@/types/payroll';

export default function PayrollPage() {
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPayrollSummary();
        setSummary(data || null);
      } catch (err) {
        console.error('Failed to load payroll summary', err);
        setSummary(null);
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
          title="Payroll command"
          subtitle="Enterprise Disbursement & Compliance Engine"
          actions={
            <>
              <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
                <Download className="h-4 w-4" /> Export Batch
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-9 text-xs">
                <Settings className="h-4 w-4" /> Global Logic
              </Button>
            </>
          }
        />

        {summary && (
          <Tabs defaultValue="overview" className="space-y-10">
            <div className="flex items-center justify-between">
              <TabsList className="h-10">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="salary">Management</TabsTrigger>
                <TabsTrigger value="process">Processing</TabsTrigger>
                <TabsTrigger value="payslips">Payslips</TabsTrigger>
                <TabsTrigger value="tax">Compliance</TabsTrigger>
                <TabsTrigger value="settings">Advanced</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-10 outline-none">
              <PayrollKpiCards summary={summary} isLoading={isLoading} />
              <div className="pt-4 px-2">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                    <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Expenditure Analytics</h2>
                 </div>
                 <PayrollCharts summary={summary} isLoading={isLoading} />
              </div>
            </TabsContent>

            {/* Salary Management Tab */}
            <TabsContent value="salary" className="outline-none">
               <SalaryTable />
            </TabsContent>

            {/* Payroll Processing Tab */}
            <TabsContent value="process" className="outline-none">
               <PayrollProcessing />
            </TabsContent>

            {/* Payslips Tab */}
            <TabsContent value="payslips" className="outline-none">
               <PayslipManager />
            </TabsContent>

            {/* Tax & Compliance Tab */}
            <TabsContent value="tax" className="outline-none">
               <TaxCompliance />
            </TabsContent>

            {/* Advanced Settings (Placeholder for now) */}
            <TabsContent value="settings" className="outline-none">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="p-10 bg-neutral-100 dark:bg-neutral-900 rounded-[2.5rem] border border-dashed border-neutral-300 dark:border-neutral-800 space-y-6">
                     <div className="h-12 w-12 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400 shadow-sm">
                        <History className="h-6 w-6" />
                     </div>
                     <h4 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Revision History</h4>
                     <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest leading-relaxed italic">
                        Access detailed logs of all salary changes, bonuses, and reimbursement approvals. This feature is being populated with audit data.
                     </p>
                     <Button variant="outline" className="h-11 rounded-xl font-black uppercase tracking-widest text-[9px] gap-2">
                        View Audit Trail
                     </Button>
                  </div>
                  <div className="p-10 bg-white dark:bg-neutral-950 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6 flex flex-col justify-between">
                     <div className="space-y-6">
                        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                           <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h4 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Role-Based Access</h4>
                        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest leading-relaxed italic">
                           Configure which managers can view, edit, or approve payroll batches for specific teams.
                        </p>
                     </div>
                     <Button className="h-11 rounded-xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[9px] gap-2">
                        Manage Access Matrix
                     </Button>
                  </div>
               </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Floating Contextual Info */}
        <div className="fixed bottom-8 right-8 z-50">
           <div className="p-4 bg-white dark:bg-neutral-800 rounded-3xl border border-indigo-100 dark:border-neutral-700 shadow-2xl flex items-center gap-4 group cursor-pointer hover:border-indigo-400 transition-all">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900 rounded-2xl flex items-center justify-center text-indigo-600 animate-bounce">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-indigo-950 dark:text-white leading-none mb-1">Audit Shield</p>
                 <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] font-black uppercase p-0 px-2 h-4">Active</Badge>
              </div>
           </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
