'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { accountingService } from '@/services/accounting.service';
import type { Account, AccountType } from '@/types/accounting';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const ACCOUNT_TYPES: AccountType[] = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];
const ACCOUNT_TYPE_COLORS: Record<AccountType, string> = {
  ASSET: '#10b981',
  LIABILITY: '#ef4444',
  EQUITY: '#6366f1',
  REVENUE: '#14b8a6',
  EXPENSE: '#f59e0b',
};

export function ChartOfAccounts() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<AccountType | 'All'>('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState({
    name: '',
    code: '',
    type: 'ASSET' as AccountType,
    description: '',
  });
  const queryClient = useQueryClient();

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounting-accounts'],
    queryFn: accountingService.getAccounts,
  });
  const createMutation = useMutation({
    mutationFn: (payload: typeof form) => accountingService.createAccount(payload),
    onSuccess: () => {
      toast.success('Account created');
      setIsCreateOpen(false);
      setForm({ name: '', code: '', type: 'ASSET', description: '' });
      queryClient.invalidateQueries({ queryKey: ['accounting-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to create account'),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Account> }) => accountingService.updateAccount(id, payload),
    onSuccess: () => {
      toast.success('Account updated');
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ['accounting-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-overview'] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to update account'),
  });

  const summaryByType = ACCOUNT_TYPES.map((type) => ({
    type,
    total: accounts.filter((a) => a.type === type).reduce((s, a) => s + a.balance, 0),
    count: accounts.filter((a) => a.type === type).length,
  }));
  const filteredAccounts = accounts
    .filter((a) => activeType === 'All' || a.type === activeType)
    .filter((a) => {
      if (!search) return true;
      const haystack = `${a.code} ${a.name} ${a.type}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });

  return (
    <div className="space-y-4">
      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        {summaryByType.map(s => (
          <button
            key={s.type}
            onClick={() => setActiveType(prev => prev === s.type ? 'All' : s.type)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeType === s.type ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-emerald-400'}`}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCOUNT_TYPE_COLORS[s.type] }} />
            {s.type}: ${(s.total / 1000).toFixed(0)}k ({s.count})
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-700 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input placeholder="Search accounts..." className="pl-9 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-sm gap-2">
                <Plus className="h-4 w-4" /> Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create account</DialogTitle>
                <DialogDescription>Add a new chart of accounts entry for this shop.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Account name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                <Input placeholder="Code (e.g. 1100)" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
                <select
                  className="w-full h-10 rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 text-sm"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AccountType }))}
                >
                  {ACCOUNT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button
                  onClick={() => createMutation.mutate(form)}
                  disabled={!form.name || !form.code || createMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-700">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Account Name</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Balance</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Opening</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => {
                const color = ACCOUNT_TYPE_COLORS[account.type] || '#6b7280';
                return (
                  <tr key={account.id} className="border-b border-neutral-100 dark:border-neutral-700/50 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition-colors group">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 w-14 shrink-0">{account.code}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{account.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: color + '20', color }}>
                        {account.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-sm font-medium text-gray-800 dark:text-gray-200">
                      <span className={account.balance < 0 ? 'text-red-600' : ''}>
                        ${Math.abs(account.balance).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs text-neutral-500">-</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${account.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-neutral-100 text-neutral-500'}`}>
                        {account.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="opacity-0 group-hover:opacity-100 flex justify-end gap-1 transition-opacity">
                        <button
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded"
                          onClick={() => {
                            setEditing(account);
                            setForm({
                              name: account.name,
                              code: account.code,
                              type: account.type,
                              description: account.description || '',
                            });
                          }}
                        >
                          <Edit2 className="h-3.5 w-3.5 text-neutral-500" />
                        </button>
                        <button
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          onClick={() => updateMutation.mutate({ id: account.id, payload: { isActive: !account.isActive } as any })}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit account</DialogTitle>
            <DialogDescription>Update chart of accounts details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Account name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Code (e.g. 1100)" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
            <select
              className="w-full h-10 rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 text-sm"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AccountType }))}
            >
              {ACCOUNT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <Input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!editing) return;
                updateMutation.mutate({
                  id: editing.id,
                  payload: {
                    name: form.name,
                    code: form.code,
                    type: form.type,
                    description: form.description || undefined,
                  },
                });
              }}
              disabled={!form.name || !form.code || updateMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
