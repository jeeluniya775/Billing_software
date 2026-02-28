'use client';

import { useState } from 'react';
import { MOCK_JOURNAL_ENTRIES } from '@/lib/mock-accounting';
import type { JournalEntry, JournalStatus } from '@/types/accounting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Search, Plus, ChevronDown, ChevronRight, Download, RotateCcw, FileText,
  CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight as ChevNextRight, Trash2,
} from 'lucide-react';

const STATUS_STYLE: Record<JournalStatus, string> = {
  Posted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Reversed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const PAGE_SIZE = 7;

export function JournalEntries() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = MOCK_JOURNAL_ENTRIES.filter(je => {
    const matchSearch = !search || je.description.toLowerCase().includes(search.toLowerCase()) || je.entryNo.toLowerCase().includes(search.toLowerCase()) || je.reference.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || je.status === statusFilter;
    const matchFrom = !dateFrom || je.date >= dateFrom;
    const matchTo = !dateTo || je.date <= dateTo;
    return matchSearch && matchStatus && matchFrom && matchTo;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleExpand = (id: string) =>
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const totals = {
    debit: filtered.reduce((s, je) => s + je.totalDebit, 0),
    credit: filtered.reduce((s, je) => s + je.totalCredit, 0),
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-700 flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input placeholder="Search entries..." className="pl-9 h-9 text-sm" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="h-9 w-[130px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Posted">Posted</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Reversed">Reversed</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="h-9 text-xs w-[130px]" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} />
            <Input type="date" className="h-9 text-xs w-[130px]" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} />
            <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>New Journal Entry</DialogTitle>
                  <DialogDescription>Add debits and credits. Entry will auto-validate balance.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="text-xs text-neutral-500 mb-1 block">Date</label><Input type="date" className="h-9 text-sm" defaultValue="2026-02-28" /></div>
                    <div><label className="text-xs text-neutral-500 mb-1 block">Reference</label><Input placeholder="INV-001" className="h-9 text-sm" /></div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Currency</label>
                      <Select defaultValue="USD">
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="INR">INR</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><label className="text-xs text-neutral-500 mb-1 block">Description</label><Input placeholder="Journal entry description..." className="h-9 text-sm" /></div>

                  {/* Debit/Credit Lines */}
                  <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-neutral-50 dark:bg-neutral-800">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-neutral-500">Account</th>
                          <th className="px-3 py-2 text-left font-medium text-neutral-500">Description</th>
                          <th className="px-3 py-2 text-right font-medium text-neutral-500">Debit</th>
                          <th className="px-3 py-2 text-right font-medium text-neutral-500">Credit</th>
                          <th className="px-3 py-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2].map(i => (
                          <tr key={i} className="border-t border-neutral-100 dark:border-neutral-700">
                            <td className="px-2 py-1.5"><Select><SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Account..." /></SelectTrigger><SelectContent><SelectItem value="ar">Accounts Receivable</SelectItem><SelectItem value="rev">Sales Revenue</SelectItem><SelectItem value="cash">Cash</SelectItem></SelectContent></Select></td>
                            <td className="px-2 py-1.5"><Input className="h-7 text-xs" placeholder="Description" /></td>
                            <td className="px-2 py-1.5"><Input type="number" className="h-7 text-xs text-right" placeholder="0.00" /></td>
                            <td className="px-2 py-1.5"><Input type="number" className="h-7 text-xs text-right" placeholder="0.00" /></td>
                            <td className="px-2 py-1.5"><button className="p-0.5 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-3 py-2 border-t border-neutral-100 dark:border-neutral-700">
                      <button className="text-xs text-emerald-600 hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Line</button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-1 text-xs">
                    <span className="text-neutral-500">Balance: <span className="font-semibold text-emerald-600">$0.00 ✓</span></span>
                    <div className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5">
                      <span className="text-neutral-500">Attach Receipt</span>
                      <span className="text-emerald-600 underline cursor-pointer">Browse</span>
                    </div>
                  </div>

                  <div><label className="text-xs text-neutral-500 mb-1 block">Notes</label><Input placeholder="Optional notes..." className="h-9 text-sm" /></div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button variant="outline" className="border-amber-300 text-amber-700">Save as Draft</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Post Entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-700">
                <th className="w-8 px-2 py-2.5" />
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">Entry No</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Reference</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Debit</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Credit</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">By</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(je => {
                const isExpanded = expanded.has(je.id);
                return (
                  <>
                    <tr
                      key={je.id}
                      className="border-b border-neutral-100 dark:border-neutral-700/50 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 cursor-pointer"
                      onClick={() => toggleExpand(je.id)}
                    >
                      <td className="px-2 py-2.5 text-center">
                        {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-neutral-400 mx-auto" /> : <ChevronRight className="h-3.5 w-3.5 text-neutral-400 mx-auto" />}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-neutral-500 whitespace-nowrap">{je.entryNo}</td>
                      <td className="px-4 py-2.5 text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{je.date}</td>
                      <td className="px-4 py-2.5 text-xs font-mono text-neutral-500">{je.reference}</td>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[200px] truncate">{je.description}</td>
                      <td className="px-4 py-2.5 text-right text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">${je.totalDebit.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">${je.totalCredit.toLocaleString()}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLE[je.status]}`}>{je.status}</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-neutral-500">{je.createdBy}</td>
                      <td className="px-4 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1 justify-end">
                          {je.status === 'Posted' && (
                            <button className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded" title="Reverse">
                              <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                            </button>
                          )}
                          <button className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded">
                            <FileText className="h-3.5 w-3.5 text-blue-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${je.id}-detail`} className="bg-neutral-50 dark:bg-neutral-800/60">
                        <td colSpan={10} className="px-6 py-3">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-neutral-400">
                                <th className="text-left py-1 font-medium">Account</th>
                                <th className="text-left py-1 font-medium">Description</th>
                                <th className="text-right py-1 font-medium">Debit</th>
                                <th className="text-right py-1 font-medium">Credit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {je.lines.map(line => (
                                <tr key={line.id} className="border-t border-neutral-100 dark:border-neutral-700/30">
                                  <td className="py-1.5 font-medium text-gray-700 dark:text-gray-300">{line.accountName}</td>
                                  <td className="py-1.5 text-neutral-500">{line.description}</td>
                                  <td className="py-1.5 text-right text-emerald-600 font-semibold">{line.debit > 0 ? `$${line.debit.toLocaleString()}` : '—'}</td>
                                  <td className="py-1.5 text-right text-red-500 font-semibold">{line.credit > 0 ? `$${line.credit.toLocaleString()}` : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {je.notes && <p className="text-xs text-neutral-400 mt-2 italic">Note: {je.notes}</p>}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-700">
                <td colSpan={5} className="px-4 py-2.5 text-xs font-medium text-neutral-500">Total ({filtered.length} entries)</td>
                <td className="px-4 py-2.5 text-right font-bold text-emerald-700 whitespace-nowrap">${totals.debit.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right font-bold text-emerald-700 whitespace-nowrap">${totals.credit.toLocaleString()}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between text-xs text-neutral-500">
          <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevNextRight className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
