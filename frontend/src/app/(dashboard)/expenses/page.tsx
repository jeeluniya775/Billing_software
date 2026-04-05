'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EXPENSE_CATEGORIES } from '@/lib/mock-expenses';
import type { Expense, PaymentMethod } from '@/types/expense';
import { expensesService } from '@/services/expenses.service';
import { AddExpenseModal } from '@/components/expenses/AddExpenseModal';
import { VisualAuditModal } from '@/components/expenses/VisualAuditModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search, Filter, Download, MoreVertical, CheckCircle2, Clock, RefreshCw, Trash2,
  FileText, ChevronLeft, ChevronRight, TrendingUp, Receipt, X, ShieldCheck, AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useTenantStore } from '@/store/tenant.store';
import { useAuthStore } from '@/store/auth.store';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const STATUS_STYLE: Record<string, string> = {
  PAID: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  PENDING: 'text-amber-600 bg-amber-50 border-amber-100',
  APPROVED: 'text-blue-600 bg-blue-50 border-blue-100',
  REJECTED: 'text-rose-600 bg-rose-50 border-rose-100',
};

export default function ExpensesPage() {
  const { selectedTenant } = useTenantStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Table state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [auditExpense, setAuditExpense] = useState<Expense | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['expenses', { tenantId: selectedTenant?.id, page, search, statusFilter, categoryFilter, sortBy, sortOrder }],
    queryFn: async () => {
      const res = await expensesService.getExpenses({
        page,
        limit: 10,
        search,
        status: statusFilter === 'all' ? undefined : statusFilter,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        sortBy,
        sortOrder
      });
      return res;
    },
  });

  const { data: summaryData } = useQuery({
    queryKey: ['expense-summary', { tenantId: selectedTenant?.id }],
    queryFn: () => expensesService.getExpenseSummary(),
  });

  const expenses = data?.items || [];
  const meta = data?.meta || { totalPages: 1, total: 0 };

  const approveMutation = useMutation({
    mutationFn: (id: string) => expensesService.approveExpense(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['expenses'] });
      const previousExpenses = queryClient.getQueryData(['expenses']);
      
      queryClient.setQueriesData({ queryKey: ['expenses'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item: any) => 
            item.id === id ? { ...item, status: 'APPROVED' } : item
          )
        };
      });
      return { previousExpenses };
    },
    onSuccess: () => {
      toast({ 
        title: "Entry Authorized",
        description: "The expenditure has been verified and locked into the ledger." 
      });
    },
    onError: (err, id, context: any) => {
      queryClient.setQueryData(['expenses'], context.previousExpenses);
      toast({ 
        variant: "destructive",
        title: "Authorization Failed",
        description: "An error occurred while verifying the record." 
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-summary'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => expensesService.rejectExpense(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['expenses'] });
      const previousExpenses = queryClient.getQueryData(['expenses']);
      
      queryClient.setQueriesData({ queryKey: ['expenses'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item: any) => 
            item.id === id ? { ...item, status: 'REJECTED' } : item
          )
        };
      });
      return { previousExpenses };
    },
    onSuccess: () => {
      toast({ 
        variant: "destructive",
        title: "Entry Rejected",
        description: "The expenditure has been flagged as invalid and rejected." 
      });
    },
    onError: (err, id, context: any) => {
      queryClient.setQueryData(['expenses'], context.previousExpenses);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-summary'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => expensesService.deleteExpense(id),
    onSuccess: () => {
      toast({ description: "Expense record purged successfully." });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-summary'] });
    }
  });

  const handleSort = (field: string) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <RefreshCw className="ml-2 h-3 w-3 opacity-20" />;
    return sortOrder === 'asc' ? <TrendingUp className="ml-2 h-3 w-3 text-indigo-600 rotate-90" /> : <TrendingUp className="ml-2 h-3 w-3 text-indigo-600 -rotate-90" />;
  };

  const clearFilters = () => {
    setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); setPage(1);
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8 pb-20">
        <PageHeader 
          title="Expense Command Center"
          subtitle="Track, categorize, and verify all business expenditures."
          actions={
            <div className="flex gap-3">
              <Button variant="outline" className="h-12 rounded-xl border-neutral-200 font-bold uppercase tracking-widest text-[10px] px-6 hover:bg-neutral-50 active:scale-95 transition-all">
                <Download className="h-4 w-4 mr-2" /> Export Audit
              </Button>
              <AddExpenseModal onExpenseAdded={() => { 
                setSearch('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setPage(1);
                queryClient.invalidateQueries({ queryKey: ['expenses'] }); 
                queryClient.invalidateQueries({ queryKey: ['expense-summary'] }); 
              }} />
            </div>
          }
        />

        {/* Slim KPI Cards */}
        <div id="expenses-slim-kpis" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Spends (MoM)', value: `$${(summaryData?.totalThisMonth || 0).toLocaleString()}`, icon: Receipt, color: 'text-indigo-600', bg: 'bg-indigo-50/50', trend: `Growth: ${summaryData?.growthPercent.toFixed(1)}%` },
            { label: 'Cleared Today', value: `$${(summaryData?.totalToday || 0).toLocaleString()}`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50/50', trend: 'Daily ledger sync' },
            { label: 'Pending Approval', value: `$${(summaryData?.pendingAmount || 0).toLocaleString()}`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50/50', trend: 'Items in pipeline' },
            { label: 'Monthly Fixed', value: `$${(summaryData?.recurringMonthly || 0).toLocaleString()}`, icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50/50', trend: 'Projected overhead' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
               <div className="flex items-center gap-4">
                  <div className={cn("h-10 w-10 min-w-[2.5rem] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg)}>
                    <kpi.icon className={cn("h-5 w-5", kpi.color)} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 leading-none mb-1 truncate">{kpi.label}</p>
                    <div className="flex items-baseline gap-1.5">
                       <p className={cn("text-lg font-bold tracking-tight text-neutral-900 dark:text-white truncate")}>{kpi.value}</p>
                    </div>
                    <p className="text-[7px] font-medium text-neutral-300 uppercase tracking-tight truncate mt-0.5">{kpi.trend}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Main Ledger Section */}
        <div id="expenses-vault-container" className="bg-white dark:bg-zinc-950/50 rounded-[1.5rem] shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden">
           {/* Controls Header */}
           <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-6">
                 <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      placeholder="Search Vault (Vendor, Category, description...)"
                      className="pl-11 h-12 text-xs rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm font-medium focus-visible:ring-indigo-500/20"
                      value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                 </div>

                 <div className="flex gap-2">
                    <Button 
                      variant={showFilters ? "default" : "outline"} 
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        "h-12 px-5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95",
                        showFilters ? "bg-black text-white" : "bg-white"
                      )}
                    >
                      <Filter className="h-4 w-4 mr-2" /> {showFilters ? 'Hide Selective' : 'Show Selective'}
                    </Button>
                    {(search || statusFilter !== 'all' || categoryFilter !== 'all') && (
                      <Button 
                          variant="ghost" 
                          onClick={clearFilters}
                          className="h-12 px-5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" /> Reset Sync
                      </Button>
                    )}
                 </div>
              </div>

              {showFilters && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
                    <SelectTrigger className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-xl bg-white border-neutral-100 shadow-sm"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Flows</SelectItem>
                      {['PAID', 'PENDING', 'APPROVED', 'REJECTED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
                    <SelectTrigger className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-xl bg-white border-neutral-100 shadow-sm"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hubs</SelectItem>
                      {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
           </div>

           {/* Table View */}
           <Table>
              <TableHeader>
                 <TableRow className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800 h-14">
                    <TableHead className="w-[80px] pl-8 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Status</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                      onClick={() => handleSort('category')}
                    >
                       <div className="flex items-center uppercase tracking-widest text-[9px] font-bold text-neutral-400 group-hover:text-indigo-600">Classification <SortIcon column="category" /></div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                      onClick={() => handleSort('description')}
                    >
                       <div className="flex items-center uppercase tracking-widest text-[9px] font-bold text-neutral-400 group-hover:text-indigo-600">Audit Description <SortIcon column="description" /></div>
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group px-6"
                      onClick={() => handleSort('date')}
                    >
                       <div className="flex items-center justify-end uppercase tracking-widest text-[9px] font-bold text-neutral-400 group-hover:text-indigo-600">Timestamp <SortIcon column="date" /></div>
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group px-6"
                      onClick={() => handleSort('amount')}
                    >
                       <div className="flex items-center justify-end uppercase tracking-widest text-[9px] font-bold text-neutral-400 group-hover:text-indigo-600">Net Flow <SortIcon column="amount" /></div>
                    </TableHead>
                    <TableHead className="text-right pr-8 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Management</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                 {isLoading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                     <TableRow key={i} className="h-20 animate-pulse">
                        <TableCell colSpan={6}><div className="h-4 bg-neutral-50 rounded mx-8" /></TableCell>
                     </TableRow>
                   ))
                 ) : expenses.length === 0 ? (
                    <TableRow>
                       <TableCell colSpan={6} className="h-80 text-center">
                          <div className="flex flex-col items-center justify-center gap-4 text-neutral-300">
                             <Receipt className="h-12 w-12 opacity-20" />
                             <p className="text-[10px] font-bold uppercase tracking-widest">The vault is currently empty for this query.</p>
                          </div>
                       </TableCell>
                    </TableRow>
                 ) : expenses.map((expense: Expense) => (
                    <TableRow key={expense.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-all group h-20 border-b border-neutral-50 dark:border-neutral-900">
                       <TableCell className="pl-8">
                          <Badge className={cn("text-[8px] font-bold uppercase px-2 py-0.5 rounded-md border text-center whitespace-nowrap", STATUS_STYLE[expense.status] || 'bg-neutral-50')}>
                             {expense.status}
                          </Badge>
                       </TableCell>
                       <TableCell>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-tighter">
                             {expense.category}
                          </span>
                       </TableCell>
                       <TableCell>
                          <div className="flex flex-col">
                             <p className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight truncate max-w-[250px]">{expense.description}</p>
                             <p className="text-[9px] text-neutral-400 uppercase font-medium tracking-widest mt-0.5">Asset Ref: {expense.id.split('-')[0]}</p>
                          </div>
                       </TableCell>
                       <TableCell className="text-right px-6">
                           <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                             {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </span>
                       </TableCell>
                       <TableCell className="text-right px-6">
                           <p className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">${expense.amount.toLocaleString()}</p>
                       </TableCell>
                       <TableCell className="text-right pr-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-neutral-100 transition-all border border-transparent">
                                <MoreVertical className="h-4 w-4 text-neutral-400" />
                              </Button>
                            </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-56 p-3 rounded-2xl shadow-2xl border-none bg-white dark:bg-zinc-900">
                               {user?.role === 'OWNER' && (
                                 <>
                                   {(expense.status === 'PENDING' || expense.status === 'REJECTED') && (
                                     <DropdownMenuItem 
                                       className="gap-3 p-3.5 rounded-xl cursor-pointer hover:bg-emerald-50 group text-[10px] font-bold uppercase tracking-widest text-emerald-600"
                                       onSelect={() => approveMutation.mutate(expense.id)}
                                     >
                                        <ShieldCheck className="h-4 w-4 text-emerald-400 group-hover:text-emerald-600" /> Authorize Entry
                                     </DropdownMenuItem>
                                   )}
                                   {(expense.status === 'PENDING' || expense.status === 'APPROVED') && (
                                     <DropdownMenuItem 
                                       className="gap-3 p-3.5 rounded-xl cursor-pointer hover:bg-rose-50 group text-[10px] font-bold uppercase tracking-widest text-rose-600"
                                       onSelect={() => rejectMutation.mutate(expense.id)}
                                     >
                                        <AlertCircle className="h-4 w-4 text-rose-400 group-hover:text-rose-600" /> Reject Entry
                                     </DropdownMenuItem>
                                   )}
                                   {(expense.status === 'PENDING' || expense.status === 'REJECTED' || expense.status === 'APPROVED') && (
                                     <div className="h-px bg-neutral-100 my-2" />
                                   )}
                                 </>
                               )}
                               <DropdownMenuItem 
                                 className="gap-3 p-3.5 rounded-xl cursor-pointer hover:bg-indigo-50 group text-[10px] font-bold uppercase tracking-widest"
                                 onSelect={() => setAuditExpense(expense)}
                                >
                                  <FileText className="h-4 w-4 text-neutral-400 group-hover:text-indigo-600" /> Visual Audit
                               </DropdownMenuItem>
                               <DropdownMenuItem 
                                 className="gap-3 p-3.5 rounded-xl cursor-pointer hover:bg-rose-50 group text-rose-600 text-[10px] font-bold uppercase tracking-widest"
                                 onSelect={() => deleteMutation.mutate(expense.id)}
                               >
                                  <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" /> Void Record
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </TableCell>
                    </TableRow>
                 ))}
              </TableBody>
           </Table>

           {/* Pagination Footer */}
           <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 italic">Audit Log: {meta.total} Entires Locked</span>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-neutral-100 shadow-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                 </Button>
                 {Array.from({ length: meta.totalPages || 1 }, (_, i) => i + 1).map(p => (
                   <Button key={p} variant={p === page ? 'default' : 'outline'} className={cn("h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", p === page ? 'bg-indigo-600 text-white' : 'border-neutral-100 text-neutral-400')} onClick={() => setPage(p)}>
                      {p}
                   </Button>
                 ))}
                 <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-neutral-100 shadow-sm" disabled={page >= (meta.totalPages || 1)} onClick={() => setPage(p => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                 </Button>
              </div>
           </div>
        </div>
      </div>
      <VisualAuditModal 
        expense={auditExpense} 
        isOpen={!!auditExpense} 
        onClose={() => setAuditExpense(null)} 
      />
    </ProtectedRoute>
  );
}
