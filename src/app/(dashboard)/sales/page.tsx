'use client';

import { useState, useEffect } from 'react';
import { SalesKpiCards } from '@/components/sales/SalesKpiCards';
import { RevenueTrendChart } from '@/components/sales/RevenueTrendChart';
import { SalesByStatusPie } from '@/components/sales/SalesByStatusPie';
import { SalesAnalyticsPanel } from '@/components/sales/SalesAnalyticsPanel';
import { AddSaleModal } from '@/components/sales/AddSaleModal';
import { SalesFiltersBar } from '@/components/sales/SalesFiltersBar';
import { DataTable } from '@/components/tables/DataTable';
import { Sale, SalesSummaryKPIs } from '@/types/sale';
import { salesService } from '@/services/sales.service';
import Link from 'next/link';
import { MoreHorizontal, FileText, CheckCircle2, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define Table Columns inline
const columns = [
  {
    accessorKey: 'invoiceNo',
    header: 'Invoice No',
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Sale> }) => (
      <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
        {row.original.invoiceNo}
      </span>
    )
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Sale> }) => (
      <Link href={`/customers/${row.original.customerId}`} className="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline">
        {row.original.customerName}
      </Link>
    )
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Sale> }) => (
      <div className="text-right font-medium text-gray-900 dark:text-white">
        ${row.original.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    )
  },
  {
    accessorKey: 'due',
    header: () => <div className="text-right">Balance Due</div>,
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Sale> }) => {
      const due = row.original.due;
      return (
        <div className={`text-right font-medium ${due > 0 ? (row.original.status === 'Overdue' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400') : 'text-neutral-500'}`}>
          ${due.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Sale> }) => {
      const status = row.original.status;
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
          status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
          : status === 'Overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          : status === 'Partial' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          : 'bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-400'
        }`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Sale> }) => (
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        {new Date(row.original.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    )
  },
  {
    id: 'actions',
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Sale> }) => {
      const sale = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" /> Generate PDF
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Mail className="mr-2 h-4 w-4" /> Email Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {sale.status !== 'Paid' && (
              <>
                <DropdownMenuItem className="cursor-pointer text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Paid
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-amber-600 dark:text-amber-400">
                  <Send className="mr-2 h-4 w-4" /> Send Reminder
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState<SalesSummaryKPIs | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trendData, setTrendData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pieData, setPieData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [salesRes, summaryRes, analyticsRes] = await Promise.all([
          salesService.getSales({ status: statusFilter }),
          salesService.getSummary(),
          salesService.getAnalytics()
        ]);
        setSales(salesRes);
        setSummary(summaryRes);
        setTrendData(analyticsRes.revenueTrend);
        setPieData(analyticsRes.salesByStatus);
      } catch (err) {
        console.error("Failed to load sales dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Sales & Revenue</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Comprehensive dashboard for managing invoices and revenue tracking.</p>
        </div>
        <AddSaleModal />
      </div>

      {/* KPI Top Row */}
      {summary ? (
        <SalesKpiCards summary={summary} isLoading={isLoading} />
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <SalesKpiCards summary={{} as any} isLoading={true} />
      )}

      {/* Middle Row: Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-2 xl:col-span-2">
          <RevenueTrendChart data={trendData} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1 xl:col-span-1">
          <SalesByStatusPie data={pieData} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-3 xl:col-span-1 h-full">
          <SalesAnalyticsPanel />
        </div>
      </div>

      {/* Filter Bar */}
      <SalesFiltersBar currentStatus={statusFilter} onSearch={setStatusFilter} />

      {/* Advanced DataTable */}
      <DataTable 
        columns={columns} 
        data={sales} 
        searchKey="customerName" 
        searchPlaceholder="Find in local table..." 
      />
    </div>
  );
}
