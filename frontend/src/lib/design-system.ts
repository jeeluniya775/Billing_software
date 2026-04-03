/**
 * Centralized design system constants for consistent Tailwind classes.
 * These are used across all modules to ensure a unified visual language.
 */

export const ds = {
  // Card styles
  card: 'bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden',
  cardHeader: 'p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center',
  cardTitle: 'text-base font-semibold text-neutral-900 dark:text-white',
  cardContent: 'p-6',

  // Table styles
  table: {
    wrapper: 'overflow-x-auto',
    container: 'w-full text-left border-collapse',
    header: 'bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800',
    headerCell: 'px-4 py-3 text-[11px] font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest',
    row: 'group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0',
    cell: 'px-4 py-3.5 text-sm text-neutral-700 dark:text-neutral-300',
  },

  // Badge variants (mapping to Shadcn Badge if possible, but providing these as helpers for custom elements)
  badge: {
    base: 'px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-transparent transition-all',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    danger: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    info: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
  },

  // Interactive elements
  hover: 'hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-all active:scale-[0.98]',
  focus: 'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all',

  // Layout spacing
  page: 'space-y-8 pb-8',
};

export type DesignSystem = typeof ds;
