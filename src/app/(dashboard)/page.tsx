'use client';

import { useAuthStore } from '@/store/auth.store';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { ExpensePieChart } from '@/components/charts/ExpensePieChart';
import { ProfitLossChart } from '@/components/charts/ProfitLossChart';
import { mockData } from '@/lib/mock-data';
import { AddExpenseModal } from '@/components/forms/AddExpenseModal';
import { CreateInvoiceModal } from '@/components/forms/CreateInvoiceModal';
import { Button } from '@/components/ui/button';

// Icons
import {
  FileText,
  CreditCard,
  Send,
  Download,
  ArrowRight,
  Clock,
  CheckCircle2,
  DollarSign,
  Briefcase,
  PieChart as PieChartIcon,
  Calculator,
  Sparkles,
  RefreshCw,
  LayoutDashboard,
  FileDigit
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* 1. Greeting */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">
          {greeting()}, {user?.name || 'User'}
        </h1>
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] italic ml-1.5 flex items-center gap-2">
          Here&apos;s what&apos;s happening with your business today <Sparkles className="h-3 w-3 text-indigo-400" />
        </p>
      </div>

      {/* 2. Business Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 transition-all hover:shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <Calculator className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Accounting Agent</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            You have 3 uncategorized transactions waiting for review.
          </p>
          <button className="text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center hover:text-emerald-700 dark:hover:text-emerald-300">
            Review transactions <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 transition-all hover:shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Payments Agent</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            2 invoices are overdue. Total outstanding: $4,500.
          </p>
          <button className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center hover:text-blue-700 dark:hover:text-blue-300">
            Send reminders <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 transition-all hover:shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <PieChartIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Finance Agent</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Your revenue is up 12% compared to last month. Great job!
          </p>
          <button className="text-purple-600 dark:text-purple-400 font-medium text-sm flex items-center hover:text-purple-700 dark:hover:text-purple-300">
            View full report <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* 3. Create Actions */}
      <div className="flex flex-wrap gap-4 pt-4">
        <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
          <CreditCard className="h-4 w-4" /> Get Paid Online
        </Button>
        <CreateInvoiceModal />
        <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
          <FileDigit className="h-4 w-4" /> Create Check
        </Button>
        <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
          <Download className="h-4 w-4" /> Add Bank Deposit
        </Button>
        <AddExpenseModal />
      </div>

      {/* 4. Two Column Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Sales & Get Paid Funnel */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-[2rem] shadow-sm border border-neutral-100 dark:border-neutral-800 p-10 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
               <div className="flex items-center gap-3 mb-2">
                  <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                  <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-indigo-600" /> Sales & Revenue
                  </h2>
               </div>
               <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-14">Invoice flow & payment tracking</p>
            </div>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-neutral-50 px-4 h-10 rounded-xl">View Details</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-lg p-4 border border-gray-100 dark:border-neutral-800 flex flex-col justify-center text-center group hover:border-emerald-200 transition-colors cursor-pointer">
              <div className="mx-auto bg-white dark:bg-neutral-800 p-3 rounded-full mb-3 shadow-sm group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30">
                <FileText className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Create New Payment</span>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4 border border-orange-100 dark:border-orange-900/30 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">$4,500</div>
              <span className="text-sm font-medium text-orange-800 dark:text-orange-300 flex justify-center items-center">
                <Clock className="w-4 h-4 mr-1" /> Not Paid
              </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-4 border border-emerald-100 dark:border-emerald-900/30 text-center relative overflow-hidden">
              {/* Connector line from previous box */}
              <div className="absolute top-1/2 -left-3 w-6 border-t-2 border-emerald-200 dark:border-emerald-800 z-0 hidden md:block" />
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 z-10 relative">$12,400</div>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300 flex justify-center items-center z-10 relative">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Paid
              </span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30 text-center relative overflow-hidden">
              <div className="absolute top-1/2 -left-3 w-6 border-t-2 border-blue-200 dark:border-blue-800 z-0 hidden md:block" />
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1 z-10 relative">$11,200</div>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300 flex justify-center items-center z-10 relative">
                <Briefcase className="w-4 h-4 mr-1" /> Deposited
              </span>
            </div>
          </div>
        </div>

        {/* Right: Bank Accounts */}
        <div className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-sm border border-neutral-100 dark:border-neutral-800 p-10 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div className="space-y-1">
               <div className="flex items-center gap-3 mb-2">
                  <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                  <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Liquid Capital</h2>
               </div>
               <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-15">Real-time banking data</p>
            </div>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl">
               <RefreshCw className="h-4 w-4 text-neutral-300" />
            </Button>
          </div>
          
          <div className="mb-10">
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Total Net Position</p>
            <h3 className="text-4xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">
              ${mockData.bankAccounts.reduce((acc, account) => acc + account.balance, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="space-y-6 flex-1">
            {mockData.bankAccounts.map((account) => (
              <div key={account.id} className="flex justify-between items-center pb-6 border-b border-neutral-50 dark:border-neutral-800 last:border-0 last:pb-0">
                <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest truncate max-w-[140px]">{account.name}</span>
                <span className={`text-[13px] font-black tracking-tighter ${account.balance < 0 ? 'text-rose-600' : 'text-indigo-950 dark:text-white'}`}>
                  ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
          
          <Button className="mt-8 w-full h-12 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 transition-all border border-neutral-200 dark:border-neutral-700">
            Link Financial Account
          </Button>
        </div>
      </div>

      {/* 5. Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 p-8 shadow-sm">
          <div className="mb-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Performance Tracking</h2>
             </div>
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-15 italic">Monthly revenue analytics</p>
          </div>
          <RevenueChart />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 p-8 shadow-sm">
             <div className="mb-8 text-center">
                <div className="h-1 w-12 bg-indigo-600 rounded-full mx-auto mb-2" />
                <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Expenditure</h2>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic mt-1">Allocation breakdown</p>
             </div>
             <ExpensePieChart />
          </div>
          
          <div className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 p-8 shadow-sm">
             <div className="mb-8">
                <div className="h-1 w-12 bg-indigo-600 rounded-full mb-2" />
                <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Bottom Line</h2>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic mt-1">P&L Overview</p>
             </div>
             <ProfitLossChart />
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom icon for DocumentText since it's not in standard lucide-react exports
function DocumentText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
