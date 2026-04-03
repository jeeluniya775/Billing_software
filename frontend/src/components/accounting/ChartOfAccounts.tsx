'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_ACCOUNTS, ACCOUNT_TYPE_COLORS } from '@/lib/mock-accounting';
import type { Account, AccountType } from '@/types/accounting';

const ACCOUNT_TYPES: AccountType[] = ['Assets', 'Liabilities', 'Equity', 'Income', 'Expenses'];

function AccountRow({ account, level, isExpanded, onToggle, children }: {
  account: Account;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  const color = ACCOUNT_TYPE_COLORS[account.type] || '#6b7280';
  const hasChildren = !!children;

  return (
    <>
      <tr className={`border-b border-neutral-100 dark:border-neutral-700/50 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition-colors group ${account.isHeader ? 'bg-neutral-50/50 dark:bg-neutral-800/50' : ''}`}>
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-1" style={{ paddingLeft: `${level * 20}px` }}>
            {hasChildren ? (
              <button onClick={onToggle} className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 flex-shrink-0">
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-neutral-500" /> : <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />}
              </button>
            ) : (
              <span className="w-5 flex-shrink-0" />
            )}
            <span className={`text-xs font-mono text-neutral-400 dark:text-neutral-500 w-14 shrink-0`}>{account.code}</span>
            <span className={`text-sm ${account.isHeader ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
              {account.name}
            </span>
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
        <td className="px-4 py-2.5 text-right text-xs text-neutral-500">${account.openingBalance.toLocaleString()}</td>
        <td className="px-4 py-2.5">
          <span className={`text-xs px-2 py-0.5 rounded-full ${account.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-neutral-100 text-neutral-500'}`}>
            {account.status}
          </span>
        </td>
        <td className="px-4 py-2.5 text-right">
          <div className="opacity-0 group-hover:opacity-100 flex justify-end gap-1 transition-opacity">
            <button className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded">
              <Edit2 className="h-3.5 w-3.5 text-neutral-500" />
            </button>
            <button className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && children}
    </>
  );
}

export function ChartOfAccounts() {
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['a1', 'l1', 'e1', 'i1', 'x1']));
  const [activeType, setActiveType] = useState<AccountType | 'All'>('All');

  const toggle = (id: string) =>
    setExpandedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const rootAccounts = MOCK_ACCOUNTS.filter(a => !a.parentId).filter(a => activeType === 'All' || a.type === activeType);

  function renderTree(parent: Account, level = 0): React.ReactNode {
    const children = MOCK_ACCOUNTS.filter(a => a.parentId === parent.id).filter(a =>
      !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.code.includes(search)
    );
    const isExpanded = expandedIds.has(parent.id);
    const show = !search || parent.name.toLowerCase().includes(search.toLowerCase()) || parent.code.includes(search) || children.length > 0;
    if (!show) return null;

    return (
      <AccountRow
        key={parent.id}
        account={parent}
        level={level}
        isExpanded={isExpanded}
        onToggle={() => toggle(parent.id)}
      >
        {children.length > 0 && isExpanded ? children.map(c => renderTree(c, level + 1)) : null}
      </AccountRow>
    );
  }

  const summaryByType = ACCOUNT_TYPES.map(type => ({
    type,
    total: MOCK_ACCOUNTS.filter(a => a.type === type && !a.isHeader).reduce((s, a) => s + a.balance, 0),
    count: MOCK_ACCOUNTS.filter(a => a.type === type).length,
  }));

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
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-sm gap-2">
            <Plus className="h-4 w-4" /> Add Account
          </Button>
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
              {rootAccounts.map(a => renderTree(a, 0))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
