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
  FileText, ChevronLeft, ChevronRight, TrendingUp, BarChart3, Receipt, X, Tag, Send,
} from 'lucide-react';

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Track, categorize, and manage all business expenses.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowAnalytics(v => !v)}>
            <BarChart3 className="h-4 w-4" />
            {showAnalytics ? 'Hide Analytics' : 'Analytics'}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <AddExpenseModal onExpenseAdded={handleRefresh} />
        </div>
      </div>

      {/* KPIs */}
      <ExpenseKpiCards summary={MOCK_EXPENSE_SUMMARY} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyBurnChart data={MOCK_EXPENSE_ANALYTICS.monthlyTrend} />
        <ExpenseCategoryChart data={MOCK_EXPENSE_ANALYTICS.categoryDistribution} />
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" /> Expense Analytics
          </h2>
          <ExpenseAnalyticsPanel analytics={MOCK_EXPENSE_ANALYTICS} />
        </div>
      )}

      {/* Advanced Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
        {/* Table Header */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-700 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search vendor, category, ID..."
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters(v => !v)}>
              <Filter className="h-3.5 w-3.5" /> Filters
              {hasActiveFilters && <span className="ml-1 h-1.5 w-1.5 bg-emerald-500 rounded-full" />}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="gap-2 text-red-500" onClick={clearFilters}>
                <X className="h-3.5 w-3.5" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filter Row */}
        {showFilters && (
          <div className="px-4 pb-3 pt-2 border-b border-neutral-100 dark:border-neutral-700 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {['Paid', 'Pending', 'Reimbursable', 'Approved', 'Rejected'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={v => { setMethodFilter(v); setPage(1); }}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Payment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" className="h-8 text-xs" placeholder="From" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} />
            <Input type="date" className="h-8 text-xs" placeholder="To" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} />
          </div>
        )}

        {/* Bulk Actions */}
        {selected.size > 0 && (
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800 flex items-center gap-3 text-sm">
            <span className="font-medium text-emerald-700 dark:text-emerald-400">{selected.size} selected</span>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={handleBulkMarkPaid}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Paid
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-600 border-red-200" onClick={handleBulkDelete}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900/50">
                <TableHead className="w-10">
                  <input type="checkbox" className="rounded" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} />
                </TableHead>
                <TableHead className="cursor-pointer hover:text-emerald-600 whitespace-nowrap" onClick={() => handleSort('expenseNo')}>
                  Expense ID <SortIcon field="expenseNo" />
                </TableHead>
                <TableHead className="cursor-pointer hover:text-emerald-600" onClick={() => handleSort('vendor')}>
                  Vendor <SortIcon field="vendor" />
                </TableHead>
                <TableHead className="cursor-pointer hover:text-emerald-600" onClick={() => handleSort('category')}>
                  Category <SortIcon field="category" />
                </TableHead>
                <TableHead className="cursor-pointer hover:text-emerald-600 text-right" onClick={() => handleSort('amount')}>
                  Amount <SortIcon field="amount" />
                </TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="cursor-pointer hover:text-emerald-600" onClick={() => handleSort('paymentMethod')}>
                  Method <SortIcon field="paymentMethod" />
                </TableHead>
                <TableHead className="cursor-pointer hover:text-emerald-600" onClick={() => handleSort('status')}>
                  Status <SortIcon field="status" />
                </TableHead>
                <TableHead className="cursor-pointer hover:text-emerald-600" onClick={() => handleSort('date')}>
                  Date <SortIcon field="date" />
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-40 text-center text-neutral-400">
                    No expenses found matching your filters.
                  </TableCell>
                </TableRow>
              ) : paginated.map((expense) => (
                <TableRow
                  key={expense.id}
                  className={`hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors ${selected.has(expense.id) ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}
                >
                  <TableCell>
                    <input type="checkbox" className="rounded" checked={selected.has(expense.id)} onChange={() => toggleSelect(expense.id)} />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {expense.expenseNo}
                      {expense.isRecurring && <RefreshCw className="h-3 w-3 text-indigo-400" aria-label="Recurring" />}
                      {expense.isReimbursable && <Receipt className="h-3 w-3 text-amber-400" aria-label="Reimbursable" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm whitespace-nowrap">{expense.vendor}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[160px]">{expense.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {expense.category}
                    </span>
                    {expense.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {expense.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="flex items-center gap-0.5 text-xs text-neutral-400">
                            <Tag className="h-2.5 w-2.5" />{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    ${expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-xs text-neutral-500 whitespace-nowrap">
                    ${expense.tax.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                    {expense.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLE[expense.status]}`}>
                      {expense.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-500 whitespace-nowrap">{expense.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Send className="h-3.5 w-3.5 text-indigo-600" /> Request Approval
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <FileText className="h-3.5 w-3.5 text-blue-500" /> Download Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <RefreshCw className="h-3.5 w-3.5 text-amber-500" /> Convert to Reimbursement
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
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
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-neutral-500">
          <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} expenses</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2).map(p => (
              <Button key={p} variant={p === page ? 'default' : 'outline'} size="icon" className={`h-7 w-7 text-xs ${p === page ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white' : ''}`} onClick={() => setPage(p)}>
                {p}
              </Button>
            ))}
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 rounded-b-xl flex flex-wrap gap-6 text-xs">
          {['Paid', 'Pending', 'Reimbursable'].map(status => {
            const amount = filtered.filter(e => e.status === status).reduce((s, e) => s + e.totalAmount, 0);
            return (
              <div key={status} className="flex items-center gap-1.5">
                {status === 'Paid' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : status === 'Pending' ? <Clock className="h-3.5 w-3.5 text-amber-500" /> : <Receipt className="h-3.5 w-3.5 text-indigo-400" />}
                <span className="text-neutral-500">{status}:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
