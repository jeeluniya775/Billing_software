'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Plus,
  Bookmark,
  LayoutDashboard,
  Rss,
  BarChart2,
  Grid2X2,
  Calculator,
  Receipt,
  ShoppingCart,
  Users,
  Megaphone,
  Wallet,
  UserSquare2,
  Clock,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from 'lucide-react';

// Top action items (icon only)
const topActions = [
  { id: 'create',    label: 'Create',    icon: Plus,           isCircle: true },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'feed',      label: 'Feed',      icon: Rss },
  { id: 'reports',   label: 'Reports',   icon: BarChart2 },
  { id: 'apps',      label: 'Apps',      icon: Grid2X2 },
];

// Pinned navigation items
const pinnedItems = [
  { label: 'Products',    icon: Package,       href: '/products' },
  { label: 'Accounting',  icon: Calculator,   href: '/accounting' },
  { label: 'Expenses',    icon: Receipt,       href: '/expenses' },
  { label: 'Sales',       icon: ShoppingCart,  href: '/sales' },
  { label: 'Customers',   icon: Users,         href: '/customers' },
  { label: 'Marketing',   icon: Megaphone,     href: '/marketing' },
  { label: 'Payroll',     icon: Wallet,        href: '/payroll' },
  { label: 'Team',        icon: UserSquare2,   href: '/team' },
  { label: 'Time',        icon: Clock,         href: '/time' },
  { label: 'Assets',      icon: Package,       href: '/assets' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href?: string) => href && pathname === href;

  const sidebarContent = (
    <div className={cn(
      'flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 transition-all duration-300 ease-in-out overflow-hidden',
      collapsed ? 'w-[60px]' : 'w-[200px]',
    )}>
      {/* Logo area */}
      <div className={cn(
        'flex items-center h-14 px-3 border-b border-neutral-100 dark:border-neutral-800 shrink-0',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <span className="text-sm font-bold text-emerald-600 tracking-tight">BillFast</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden md:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Top Icon Actions */}
      <div className="flex flex-col gap-1 px-2 pt-3 pb-2 shrink-0">
        {topActions.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const content = item.href ? (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl transition-all duration-150 group',
                collapsed ? 'justify-center w-9 h-9 mx-auto' : 'px-2.5 py-2 w-full',
                active
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200',
              )}
              title={collapsed ? item.label : undefined}
            >
              {item.isCircle ? (
                <span className={cn(
                  'flex items-center justify-center rounded-full shrink-0',
                  collapsed ? 'w-7 h-7' : 'w-6 h-6',
                  'bg-emerald-600 text-white shadow-sm',
                )}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
              ) : (
                <Icon className={cn('shrink-0', collapsed ? 'h-4.5 w-4.5' : 'h-4 w-4')} />
              )}
              {!collapsed && <span className="text-[13px] font-medium">{item.label}</span>}
            </Link>
          ) : (
            <button
              key={item.id}
              className={cn(
                'flex items-center gap-3 rounded-xl transition-all duration-150 group',
                collapsed ? 'justify-center w-9 h-9 mx-auto' : 'px-2.5 py-2 w-full',
                'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200',
              )}
              title={collapsed ? item.label : undefined}
            >
              {item.isCircle ? (
                <span className={cn(
                  'flex items-center justify-center rounded-full shrink-0',
                  collapsed ? 'w-7 h-7' : 'w-6 h-6',
                  'bg-emerald-600 text-white shadow-sm',
                )}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
              ) : (
                <Icon className="h-4 w-4 shrink-0" />
              )}
              {!collapsed && <span className="text-[13px] font-medium">{item.label}</span>}
            </button>
          );

          return item.href ? content : content;
        })}
      </div>

      {/* Divider + PINNED section */}
      <div className="shrink-0 px-3 py-1">
        <div className="border-t border-neutral-100 dark:border-neutral-800" />
      </div>

      {!collapsed && (
        <p className="px-4 pt-1 pb-1.5 text-[10px] font-semibold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
          Pinned
        </p>
      )}

      {/* Pinned nav items */}
      <nav className="flex flex-col gap-0.5 px-2 overflow-y-auto hide-scrollbar flex-1">
        {pinnedItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl transition-all duration-150 group',
                collapsed ? 'justify-center w-9 h-9 mx-auto' : 'px-2.5 py-2 w-full',
                active
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-white',
              )}
            >
              <span className={cn(
                'flex items-center justify-center rounded-lg shrink-0',
                collapsed ? 'w-7 h-7' : 'w-6 h-6',
                active
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 group-hover:text-neutral-700 dark:group-hover:text-neutral-200'
              )}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              {!collapsed && (
                <span className="text-[13px] truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Customize button at bottom */}
      <div className={cn(
        'shrink-0 border-t border-neutral-100 dark:border-neutral-800 px-2 py-2',
      )}>
        {!collapsed ? (
          <button className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
            <Grid2X2 className="h-4 w-4 shrink-0" />
            <span className="text-[13px] font-medium">Customize</span>
          </button>
        ) : (
          <button className="flex items-center justify-center w-9 h-9 mx-auto rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors" title="Customize">
            <Grid2X2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn('hidden md:flex flex-col h-full flex-shrink-0', className)}>
        {sidebarContent}
      </aside>

      {/* Mobile hamburger trigger */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-xl bg-white dark:bg-neutral-900 shadow-md border border-neutral-200 dark:border-neutral-700"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 flex flex-col h-full w-[220px] shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute -right-10 top-3 p-2 rounded-xl bg-white dark:bg-neutral-900 shadow-md"
              aria-label="Close menu"
            >
              <X className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
            </button>
            <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 w-[200px]">
              <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
                <span className="text-sm font-bold text-emerald-600 tracking-tight">BillFast</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 rounded text-neutral-400">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-1 px-2 pt-3 pb-2 shrink-0">
                {topActions.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return item.href ? (
                    <Link key={item.id} href={item.href} onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-2.5 py-2 w-full rounded-xl transition-all',
                        active ? 'bg-emerald-50 text-emerald-700' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700',
                      )}>
                      {item.isCircle
                        ? <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white"><Icon className="h-3.5 w-3.5" /></span>
                        : <Icon className="h-4 w-4 shrink-0" />}
                      <span className="text-[13px] font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <button key={item.id}
                      className="flex items-center gap-3 px-2.5 py-2 w-full rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-all">
                      {item.isCircle
                        ? <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white"><Icon className="h-3.5 w-3.5" /></span>
                        : <Icon className="h-4 w-4 shrink-0" />}
                      <span className="text-[13px] font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="px-3 py-1"><div className="border-t border-neutral-100 dark:border-neutral-800" /></div>
              <p className="px-4 pt-1 pb-1.5 text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">Pinned</p>
              <nav className="flex flex-col gap-0.5 px-2 overflow-y-auto hide-scrollbar flex-1">
                {pinnedItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-2.5 py-2 w-full rounded-xl transition-all',
                        active ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800',
                      )}>
                      <span className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-lg shrink-0',
                        active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500',
                      )}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[13px] truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
