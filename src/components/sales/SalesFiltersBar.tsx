'use client';

import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileDown, Search, Filter } from 'lucide-react';

interface SalesFiltersBarProps {
  onSearch: (status: string) => void;
  currentStatus: string;
}

export function SalesFiltersBar({ onSearch, currentStatus }: SalesFiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-sm mt-8 mb-6">
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input 
            type="text" 
            placeholder="Search invoice or customer..." 
            className="pl-9 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
          />
        </div>

        <Select value={currentStatus} onValueChange={onSearch}>
          <SelectTrigger className="w-[140px] bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
            <Filter className="w-3.5 h-3.5 mr-2 text-neutral-500" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button variant="outline" className="hidden lg:flex" disabled>
          Date Range (Mock)
        </Button>
        <Button variant="outline" className="text-gray-700 dark:text-gray-300">
          <FileDown className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
      
    </div>
  );
}
