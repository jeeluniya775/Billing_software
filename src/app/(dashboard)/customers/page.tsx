'use client';

import Link from 'next/link';
import { DollarSign, MoreHorizontal, Copy, Pencil, Trash2, Eye, ShieldAlert, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/tables/DataTable';
import { AddCustomerModal } from '@/components/forms/AddCustomerModal';
import { Customer } from '@/types/customer';
import { MOCK_CUSTOMERS } from '@/lib/mock-customers';

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'VIP': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    case 'High Risk': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    case 'Wholesale': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case 'Retail': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  }
};

const columns = [
  {
    accessorKey: 'name',
    header: 'Name & Company',
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Customer> }) => {
      const customer = row.original;
      return (
        <div className="flex flex-col">
          <Link href={`/customers/${customer.id}`} className="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline">
            {customer.name}
          </Link>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">{customer.company}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Customer> }) => {
      const status = row.original.status;
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
          status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
          : status === 'Blocked' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          : status === 'On Hold' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          : 'bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-400'
        }`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Customer> }) => {
      const tags = row.original.tags;
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <span key={tag} className={`px-2 py-0.5 border text-[10px] font-medium rounded-md ${getTagColor(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
      );
    }
  },
  {
    accessorKey: 'currentBalance',
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Customer> }) => {
      const amount = row.original.currentBalance;
      const limit = row.original.creditLimit;
      const overLimit = amount > limit;
      
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: row.original.currency === 'GBP' ? 'GBP' : 'USD', // simplistic mapping
      }).format(amount);
      
      return (
        <div className="flex flex-col items-end">
          <span className={`font-medium ${overLimit ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {formatted}
          </span>
          <span className="text-[10px] text-neutral-500">Limit: ${limit / 1000}k</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'paymentBehaviorScore',
    header: () => <div className="text-center">Trust Score</div>,
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Customer> }) => {
      const score = row.original.paymentBehaviorScore;
      return (
        <div className="flex items-center justify-center gap-2">
          <div className="w-16 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div 
              className={`h-full rounded-full ${score > 80 ? 'bg-emerald-500' : score > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }} 
            />
          </div>
          <span className="text-xs font-mono text-neutral-500">{score}</span>
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }: { row: import('@tanstack/react-table').Row<Customer> }) => {
      const customer = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/customers/${customer.id}`} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" /> View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>
              <Copy className="mr-2 h-4 w-4" /> Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit Customer</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 dark:text-red-400"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function CustomersPage() {
  const totalBalance = MOCK_CUSTOMERS.reduce((acc, curr) => acc + curr.currentBalance, 0);
  const activeCount = MOCK_CUSTOMERS.filter(c => c.status === 'Active').length;
  const highRiskCount = MOCK_CUSTOMERS.filter(c => c.tags.includes('High Risk') || c.status === 'Blocked').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your comprehensive client CRM and track financial ledgers.</p>
        </div>
        <AddCustomerModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total A/R Balance</h3>
            <span className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg"><DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /></span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Customers</h3>
            <span className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg"><UsersIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" /></span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{MOCK_CUSTOMERS.length}</div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Active Contacts</h3>
            <span className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg"><UsersIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /></span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{activeCount}</div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">At Risk / Blocked</h3>
            <span className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg"><ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" /></span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{highRiskCount}</div>
        </div>
      </div>

      {/* Advanced Data Table Implementation */}
      <DataTable columns={columns} data={MOCK_CUSTOMERS} searchKey="name" searchPlaceholder="Search by customer name..." />
    </div>
  );
}
