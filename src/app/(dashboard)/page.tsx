'use client';

import { useAuthStore } from '@/store/auth.store';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { ExpensePieChart } from '@/components/charts/ExpensePieChart';
import { ProfitLossChart } from '@/components/charts/ProfitLossChart';
import { mockData } from '@/lib/mock-data';
import { AddExpenseModal } from '@/components/forms/AddExpenseModal';
import { CreateInvoiceModal } from '@/components/forms/CreateInvoiceModal';

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
  Calculator
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
    <div className="space-y-8 pb-8">
      {/* 1. Greeting */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {greeting()}, {user?.name || 'User'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here&apos;s what&apos;s happening with your business today.
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
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center space-x-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm">
          <CreditCard className="h-4 w-4" />
          <span>Get Paid Online</span>
        </button>
        <CreateInvoiceModal />
        <button className="flex items-center space-x-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm">
          <DocumentText className="h-4 w-4" />
          <span>Create Check</span>
        </button>
        <button className="flex items-center space-x-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm">
          <Download className="h-4 w-4" />
          <span>Add Bank Deposit</span>
        </button>
        <AddExpenseModal />
      </div>

      {/* 4. Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Sales & Get Paid Funnel */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" /> 
              Sales & Get Paid
            </h2>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">View Details</button>
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
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bank Accounts</h2>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">Review</button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Balance</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              ${mockData.bankAccounts.reduce((acc, account) => acc + account.balance, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="space-y-4 flex-1">
            {mockData.bankAccounts.map((account) => (
              <div key={account.id} className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-neutral-700 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{account.name}</span>
                <span className={`text-sm font-semibold ${account.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
          
          <button className="mt-4 w-full py-2 bg-gray-50 dark:bg-neutral-900/50 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-neutral-700">
            Link New Account
          </button>
        </div>
      </div>

      {/* 5. Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly revenue for the last 6 months</p>
          </div>
          <RevenueChart />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Expenses Detail</h2>
            </div>
            <ExpensePieChart />
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profit & Loss</h2>
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
