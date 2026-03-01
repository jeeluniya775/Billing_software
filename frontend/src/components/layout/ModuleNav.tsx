'use client';

import {
  Calculator,
  CreditCard,
  TrendingUp,
  Users,
  Megaphone,
  Wallet,
  UserCog,
  Clock,
  Building2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const modules = [
  { name: 'Accounting', path: '/accounting', icon: Calculator },
  { name: 'Expenses & Pay Bills', path: '/expenses', icon: CreditCard },
  { name: 'Sales & Get Paid', path: '/sales', icon: TrendingUp },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Marketing', path: '/marketing', icon: Megaphone },
  { name: 'Payroll', path: '/payroll', icon: Wallet },
  { name: 'Team', path: '/team', icon: UserCog },
  { name: 'Time', path: '/time', icon: Clock },
  { name: 'Assets', path: '/assets', icon: Building2 },
];

export function ModuleNav() {
  const pathname = usePathname();

  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 hide-scrollbar">
      <div className="flex items-center space-x-2 px-6">
        {modules.map((mod) => {
          const isActive = pathname === mod.path;
          const Icon = mod.icon;

          return (
            <Link
              key={mod.path}
              href={mod.path}
              className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? 'fill-emerald-600 text-white' : ''}`}
              />
              <span>{mod.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
