'use client';

import { useState, useMemo } from 'react';
import { MOCK_EXPENSES, MOCK_EXPENSE_SUMMARY, MOCK_EXPENSE_ANALYTICS, EXPENSE_CATEGORIES } from '@/lib/mock-expenses';
import type { Expense, ExpenseStatus, PaymentMethod } from '@/types/expense';
import { ExpenseKpiCards } from '@/components/expenses/ExpenseKpiCards';
import { ExpenseCategoryChart } from '@/components/expenses/ExpenseCategoryChart';
import { MonthlyBurnChart } from '@/components/expenses/MonthlyBurnChart';
import { ExpenseAnalyticsPanel } from '@/components/expenses/ExpenseAnalyticsPanel';
import { AddExpenseModal } from '@/components/expenses/AddExpenseModal';
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
  FileText, ChevronLeft, ChevronRight, TrendingUp, BarChart3, Receipt, X, Tag, Send, Sparkles, LayoutDashboard
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

const STATUS_STYLE: Record<string, string> = {
  Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Reimbursable: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Credit Card', 'Cheque', 'UPI'];

const PAGE_SIZE = 8;

export default function ExpensesPage() {
  // Table state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof Expense | null>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);

  const handleRefresh = () => setExpenses([...MOCK_EXPENSES]);

  const filtered = useMemo(() => {
    let list = [...expenses];
    if (search) list = list.filter(e => e.vendor.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()) || e.expenseNo.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') list = list.filter(e => e.status === statusFilter);
    if (categoryFilter !== 'all') list = list.filter(e => e.category === categoryFilter);
    if (methodFilter !== 'all') list = list.filter(e => e.paymentMethod === methodFilter);
    if (dateFrom) list = list.filter(e => e.date >= dateFrom);
    if (dateTo) list = list.filter(e => e.date <= dateTo);
    if (sortField) {
      list.sort((a, b) => {
        const av = a[sortField];
        const bv = b[sortField];
        const dir = sortDir === 'asc' ? 1 : -1;
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
        return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
      });
    }
    return list;
  }, [expenses, search, statusFilter, categoryFilter, methodFilter, dateFrom, dateTo, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(prev => prev.size === paginated.length ? new Set() : new Set(paginated.map(e => e.id)));

  const handleSort = (field: keyof Expense) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleBulkMarkPaid = () => {
    setExpenses(prev => prev.map(e => selected.has(e.id) ? { ...e, status: 'Paid' as ExpenseStatus } : e));
    setSelected(new Set());
  };

  const handleBulkDelete = () => {
    setExpenses(prev => prev.filter(e => !selected.has(e.id)));
    setSelected(new Set());
  };

  const SortIcon = ({ field }: { field: keyof Expense }) => (
    <span className="ml-1 text-neutral-400">
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const clearFilters = () => {
    setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); setMethodFilter('all');
    setDateFrom(''); setDateTo(''); setPage(1);
  };

  const hasActiveFilters = search || statusFilter !== 'all' || categoryFilter !== 'all' || methodFilter !== 'all' || dateFrom || dateTo;

  return (
    <ProtectedRoute>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-indigo-950 dark:bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Receipt className="h-6 w-6" />
               </div>
               <h1 className="text-4xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Expenses</h1>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] italic ml-1.5 flex items-center gap-2">
               Track, categorize, and manage all business expenses <Sparkles className="h-3 w-3 text-indigo-400" />
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm" onClick={() => setShowAnalytics(v => !v)}>
              <BarChart3 className="h-4 w-4" /> {showAnalytics ? 'Hide Analytics' : 'Visual Insights'}
            </Button>
            <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
              <Download className="h-4 w-4" /> Export Batch
            </Button>
            <AddExpenseModal onExpenseAdded={handleRefresh} />
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
                 value="categories" 
                 className="h-full border-b-4 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent rounded-none px-2 font-black uppercase tracking-widest text-[10px] text-neutral-400 data-[state=active]:text-indigo-950 dark:data-[state=active]:text-white transition-all gap-2"
               >
                 <Tag className="h-4 w-4 mb-0.5" /> Categories
               </TabsTrigger>
               <TabsTrigger 
                 value="recurring" 
                 className="h-full border-b-4 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent rounded-none px-2 font-black uppercase tracking-widest text-[10px] text-neutral-400 data-[state=active]:text-indigo-950 dark:data-[state=active]:text-white transition-all gap-2"
               >
                 <RefreshCw className="h-4 w-4 mb-0.5" /> Recurring
               </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-10 outline-none">
            {/* KPIs */}
            <ExpenseKpiCards summary={MOCK_EXPENSE_SUMMARY} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              <MonthlyBurnChart data={MOCK_EXPENSE_ANALYTICS.monthlyTrend} />
              <ExpenseCategoryChart data={MOCK_EXPENSE_ANALYTICS.categoryDistribution} />
            </div>

            {/* Analytics Panel */}
            {showAnalytics && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                  <h2 className="text-base font-black text-indigo-950 dark:text-white uppercase tracking-tighter">AI Visual Insights</h2>
                </div>
                <ExpenseAnalyticsPanel analytics={MOCK_EXPENSE_ANALYTICS} />
              </div>
            )}

            {/* Advanced Table */}
            <div className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                <h2 className="text-base font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Expense Ledger</h2>
              </div>
              
              <div className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                {/* Table Header */}
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      placeholder="Search vendor, category, ID..."
                      className="pl-11 h-11 text-xs font-bold uppercase tracking-widest rounded-xl border-neutral-100 bg-neutral-50"
                      value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-11 rounded-xl px-4 font-black uppercase tracking-widest text-[9px] gap-2" onClick={() => setShowFilters(v => !v)}>
                      <Filter className="h-3.5 w-3.5" /> Filters
                      {hasActiveFilters && <span className="ml-1 h-1.5 w-1.5 bg-emerald-500 rounded-full" />}
                    </Button>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" className="h-11 rounded-xl px-4 font-black uppercase tracking-widest text-[9px] gap-2 text-red-500 hover:bg-red-50" onClick={clearFilters}>
                        <X className="h-3.5 w-3.5" /> Clear
                      </Button>
                    )}
                  </div>
                </div>

                {/* Filter Row */}
                {showFilters && (
                  <div className="px-6 pb-6 pt-2 border-b border-neutral-100 dark:border-neutral-800 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in slide-in-from-top-2 duration-300">
                    <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
                      <SelectTrigger className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-xl border-neutral-100 bg-neutral-50"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {['Paid', 'Pending', 'Reimbursable', 'Approved', 'Rejected'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {/* ... other selects ... */}
                    <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
                      <SelectTrigger className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-xl border-neutral-100 bg-neutral-50"><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={methodFilter} onValueChange={v => { setMethodFilter(v); setPage(1); }}>
                      <SelectTrigger className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-xl border-neutral-100 bg-neutral-50"><SelectValue placeholder="Payment" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        {PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input type="date" className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-xl border-neutral-100 bg-neutral-50" placeholder="From" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} />
                    <Input type="date" className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-xl border-neutral-100 bg-neutral-50" placeholder="To" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} />
                  </div>
                )}

                {/* Bulk Actions */}
                {selected.size > 0 && (
                  <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800 flex items-center gap-4 text-xs">
                    <span className="font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">{selected.size} selected items</span>
                    <Button size="sm" variant="outline" className="h-8 rounded-lg font-black uppercase tracking-widest text-[8px] gap-2 bg-white" onClick={handleBulkMarkPaid}>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Execute Batch Payment
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 rounded-lg font-black uppercase tracking-widest text-[8px] gap-2 text-red-600 border-red-200 bg-white" onClick={handleBulkDelete}>
                      <Trash2 className="h-3.5 w-3.5" /> Purge Records
                    </Button>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50">
                        <TableHead className="w-12 px-6">
                          <input type="checkbox" className="rounded-md border-neutral-300 text-emerald-600 focus:ring-emerald-500" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} />
                        </TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600" onClick={() => handleSort('expenseNo')}>
                          Trace ID <SortIcon field="expenseNo" />
                        </TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600" onClick={() => handleSort('vendor')}>
                          Entity <SortIcon field="vendor" />
                        </TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600" onClick={() => handleSort('category')}>
                          Category <SortIcon field="category" />
                        </TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right cursor-pointer hover:text-indigo-600" onClick={() => handleSort('amount')}>
                          Net Amount <SortIcon field="amount" />
                        </TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Tax</TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600" onClick={() => handleSort('status')}>
                          Flow Status <SortIcon field="status" />
                        </TableHead>
                        <TableHead className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600" onClick={() => handleSort('date')}>
                          Timestamp <SortIcon field="date" />
                        </TableHead>
                        <TableHead className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginated.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="h-60 text-center">
                            <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
                              <Receipt className="h-10 w-10 text-neutral-300" />
                              <p className="text-xs font-black uppercase tracking-widest">Null audit results</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : paginated.map((expense) => (
                        <TableRow
                          key={expense.id}
                          className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0 ${selected.has(expense.id) ? 'bg-indigo-50/30' : ''}`}
                        >
                          <TableCell className="px-6">
                            <input type="checkbox" className="rounded-md border-neutral-300 text-emerald-600 focus:ring-emerald-500" checked={selected.has(expense.id)} onChange={() => toggleSelect(expense.id)} />
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-black text-neutral-400 uppercase tracking-widest">{expense.expenseNo}</span>
                              {expense.isRecurring && <RefreshCw className="h-3 w-3 text-indigo-400" />}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                             <p className="font-black text-indigo-950 dark:text-white uppercase tracking-tighter text-[13px]">{expense.vendor}</p>
                             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1 italic truncate max-w-[150px]">{expense.description}</p>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest h-6 rounded-lg bg-neutral-50">
                              {expense.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-right">
                             <p className="font-black text-indigo-950 dark:text-white uppercase tracking-tighter text-[15px]">${expense.amount.toLocaleString()}</p>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-right">
                             <p className="text-[10px] font-black text-neutral-400">${expense.tax.toFixed(2)}</p>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <Badge className={`text-[9px] font-black uppercase tracking-widest h-6 rounded-lg ${STATUS_STYLE[expense.status]}`}>
                              {expense.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                             <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-neutral-100 rounded-xl">
                                  <MoreVertical className="h-4 w-4 text-neutral-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-neutral-100 dark:border-neutral-800 shadow-2xl">
                                <DropdownMenuItem className="rounded-xl gap-3 font-bold uppercase tracking-[0.1em] text-[10px] p-3 transition-all hover:bg-emerald-50 hover:text-emerald-700">
                                  <CheckCircle2 className="h-4 w-4" /> Finalize Audit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl gap-3 font-bold uppercase tracking-[0.1em] text-[10px] p-3 transition-all hover:bg-indigo-50 hover:text-indigo-700">
                                  <Send className="h-4 w-4" /> Move to Approval
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl gap-3 font-bold uppercase tracking-[0.1em] text-[10px] p-3 transition-all">
                                  <FileText className="h-4 w-4" /> Visual Recap
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl gap-3 font-bold uppercase tracking-[0.1em] text-[10px] p-3 transition-all text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                  <Trash2 className="h-4 w-4" /> Void Ledger
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 italic">Audit Log: Page {page} of {totalPages}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-neutral-100 shadow-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 1).map(p => (
                      <Button key={p} variant={p === page ? 'default' : 'outline'} className={`h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${p === page ? 'bg-indigo-600 text-white shadow-xl scale-110' : 'border-neutral-100 text-neutral-400'}`} onClick={() => setPage(p)}>
                        {p}
                      </Button>
                    ))}
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-neutral-100 shadow-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="outline-none">
             <div className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm p-20 text-center space-y-6">
                <Tag className="h-12 w-12 text-neutral-200 mx-auto" />
                <h3 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Category Architecture</h3>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest italic leading-relaxed max-w-sm mx-auto">Advanced spending categorization and budget ceiling config is being provisioned.</p>
             </div>
          </TabsContent>
          
          <TabsContent value="recurring" className="outline-none">
             <div className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm p-20 text-center space-y-6">
                <RefreshCw className="h-12 w-12 text-neutral-200 mx-auto animate-spin-slow" />
                <h3 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Subscription Cycles</h3>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest italic leading-relaxed max-w-sm mx-auto">Automated recurring billing detection and maintenance logs are pending dataset linkage.</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
