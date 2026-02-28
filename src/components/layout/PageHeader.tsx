'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
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
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3 w-full md:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}
