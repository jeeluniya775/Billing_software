'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
<<<<<<< HEAD:frontend/src/components/layout/PageHeader.tsx
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
=======
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-bold text-neutral-400 mt-2 uppercase tracking-widest italic leading-relaxed">
>>>>>>> origin/main:src/components/layout/PageHeader.tsx
            {subtitle}
          </p>
        )}
      </div>
<<<<<<< HEAD:frontend/src/components/layout/PageHeader.tsx
      {actions && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions}
=======
      {action && (
        <div className="flex items-center gap-3 w-full md:w-auto">
          {action}
>>>>>>> origin/main:src/components/layout/PageHeader.tsx
        </div>
      )}
    </div>
  );
}
