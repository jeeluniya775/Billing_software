'use client';

import Link from 'next/link';
import {
  MoreHorizontal, Phone, Mail, MapPin, Calendar, CheckCircle2, XCircle, Search,
  Download, Filter, ArrowUpDown, ChevronDown, User, Users2, Sparkles, LayoutDashboard,
  DollarSign, Copy, Pencil, Trash2, Eye, ShieldAlert, Users as UsersIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
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
import { CustomerModal } from '@/components/customers/CustomerModal';
import { useState, useEffect, useMemo } from 'react';
import { customersService } from '@/services/customers.service';
import { Customer } from '@/types/customer';
import { Badge } from '@/components/ui/badge';
import { CustomerKpiCards } from '@/components/customers/CustomerKpiCards';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'VIP': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    case 'High Risk': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    case 'Wholesale': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case 'Retail': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  }
};

// Columns definition moved inside component

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customersService.getCustomers();
      setCustomers(Array.isArray(data) ? data as unknown as Customer[] : []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      await customersService.deleteCustomer(customerToDelete.id);
      toast({
        title: 'Customer Deleted',
        description: `${customerToDelete.company} has been removed.`,
      });
      fetchCustomers();
      setCustomerToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete customer.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name & Company',
      cell: ({ row }: { row: import('@tanstack/react-table').Row<Customer> }) => {
        const customer = row.original;
        return (
          <div className="flex flex-col">
            <Link href={`/customers/${customer.id}`} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline transition-colors">
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
        const status = row.original.status || 'ACTIVE';
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
            status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
            : status === 'BLOCKED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            : status === 'ON_HOLD' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
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
        const tags = row.original.tags || [];
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
        const amount = row.original.currentBalance || 0;
        const limit = row.original.creditLimit || 0;
        const overLimit = amount > limit;

        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: row.original.currency === 'GBP' ? 'GBP' : 'USD',
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
        const score = row.original.paymentBehaviorScore || 100;
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
              <DropdownMenuItem onClick={() => setEditingCustomer(customer)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Customer
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 dark:text-red-400" 
                onClick={() => setCustomerToDelete(customer)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [toast]);

  const totalBalance = (customers || []).reduce((acc, curr) => acc + (curr.currentBalance || 0), 0);
  const activeCount = (customers || []).filter(c => c.status === 'ACTIVE').length;
  const highRiskCount = (customers || []).filter(c => ((c as any).tags || []).includes('High Risk') || c.status === 'BLOCKED').length;
  const totalCustomers = customers.length;

  return (
    <ProtectedRoute>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-indigo-950 dark:bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Users2 className="h-6 w-6" />
               </div>
               <h1 className="text-4xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Customers</h1>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] italic ml-1.5 flex items-center gap-2">
               Manage client relationships and communication history <Sparkles className="h-3 w-3 text-indigo-400" />
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
                <Download className="h-4 w-4" /> Export DB
            </Button>
            <CustomerModal onSuccess={fetchCustomers} />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-10">
          <div className="border-b border-neutral-100 dark:border-neutral-800 sticky top-0 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl z-30 -mx-4 md:-mx-8 px-4 md:px-8">
            <TabsList className="h-16 bg-transparent gap-8 p-0">
               <TabsTrigger 
                 value="overview" 
                 className="h-full border-b-4 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent rounded-none px-2 font-black uppercase tracking-widest text-[10px] text-neutral-400 data-[state=active]:text-indigo-950 dark:data-[state=active]:text-white transition-all gap-2"
               >
                 <LayoutDashboard className="h-4 w-4 mb-0.5" /> Overview
               </TabsTrigger>
               <TabsTrigger 
                 value="groups" 
                 className="h-full border-b-4 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent rounded-none px-2 font-black uppercase tracking-widest text-[10px] text-neutral-400 data-[state=active]:text-indigo-950 dark:data-[state=active]:text-white transition-all gap-2"
               >
                 <Users2 className="h-4 w-4 mb-0.5" /> Groups
               </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-10 outline-none">
            {/* KPI Cards */}
            <CustomerKpiCards 
              totalBalance={totalBalance}
              totalCustomers={totalCustomers}
              activeCount={activeCount}
              highRiskCount={highRiskCount}
            />

            <div className="space-y-6 pt-4">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                  <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Customer Directory</h2>
               </div>
               
               {/* Advanced DataTable */}
               <DataTable 
                 columns={columns} 
                 data={customers} 
                 searchKey="name" 
                 searchPlaceholder="Search customers..." 
                 isLoading={isLoading}
               />
            </div>
          </TabsContent>

          <TabsContent value="groups" className="outline-none">
             <div className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm p-20 text-center space-y-6">
                <Users2 className="h-12 w-12 text-neutral-200 mx-auto" />
                <h3 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Customer Segmentation</h3>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest italic leading-relaxed max-w-sm mx-auto">Dynamic grouping and mailing list management is being integrated.</p>
             </div>
          </TabsContent>
        </Tabs>

        {/* Edit Modal */}
        <CustomerModal 
          open={!!editingCustomer} 
          onOpenChange={(open) => !open && setEditingCustomer(null)}
          customer={editingCustomer || undefined}
          onSuccess={fetchCustomers}
        />

        {/* Delete Confirmation */}
        <Dialog open={!!customerToDelete} onOpenChange={(open) => !open && setCustomerToDelete(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Customer</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{customerToDelete?.company}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setCustomerToDelete(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete Customer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
