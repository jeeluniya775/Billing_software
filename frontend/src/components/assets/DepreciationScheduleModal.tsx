import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Asset } from '@/types/asset';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip 
} from 'recharts';
import { Calculator, Info, Calendar } from 'lucide-react';

interface DepreciationScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  salvageValue: number;
  usefulLife: number;
}

export function DepreciationScheduleModal({ 
  isOpen, onOpenChange, asset, salvageValue, usefulLife 
}: DepreciationScheduleModalProps) {
  if (!asset) return null;

  const purchaseCost = asset.purchaseCost || 0;
  const annualDepreciation = Math.max(0, (purchaseCost - salvageValue) / usefulLife);
  
  const schedule = [];
  let currentValue = purchaseCost;
  let accumulatedDepreciation = 0;
  
  const startYear = new Date(asset.purchaseDate).getFullYear();

  for (let year = 0; year <= usefulLife; year++) {
    schedule.push({
      year: startYear + year,
      beginningValue: currentValue,
      depreciation: year === 0 ? 0 : annualDepreciation,
      accumulatedDepreciation: accumulatedDepreciation,
      endingValue: year === 0 ? purchaseCost : Math.max(salvageValue, purchaseCost - (annualDepreciation * year)),
      label: `Year ${year}`
    });
    
    if (year > 0) {
      accumulatedDepreciation += annualDepreciation;
      currentValue -= annualDepreciation;
    }
  }

  // Chart data
  const chartData = schedule.map(s => ({
    name: s.year.toString(),
    value: Math.round(s.endingValue),
    dep: Math.round(s.accumulatedDepreciation)
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-[32px] p-0 shadow-2xl">
        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Depreciation Schedule</DialogTitle>
              <DialogDescription className="text-sm font-bold text-neutral-400 uppercase tracking-widest mt-1">
                Straight Line Method Projection for {asset.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 pt-0 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Cost Basis</p>
              <p className="text-xl font-black text-neutral-900 dark:text-white">${purchaseCost.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Annual Expense</p>
              <p className="text-xl font-black text-indigo-600">${annualDepreciation.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Final Salvage</p>
              <p className="text-xl font-black text-emerald-600">${salvageValue.toLocaleString()}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[250px] w-full bg-neutral-50/50 dark:bg-neutral-900/50 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, 'Asset Value']}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-50 dark:bg-neutral-900">
                <TableRow className="border-none">
                  <TableHead className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Year</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-neutral-400 tracking-widest text-right">Beginning Value</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-neutral-400 tracking-widest text-right">Depreciation</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-neutral-400 tracking-widest text-right">Acc. Depreciation</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-neutral-400 tracking-widest text-right">Ending Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((row, i) => (
                  <TableRow key={i} className="border-neutral-50 dark:border-neutral-900 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                    <TableCell className="font-bold text-xs">{row.year}</TableCell>
                    <TableCell className="text-right font-medium text-xs">${row.beginningValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right font-black text-xs text-rose-500">-${row.depreciation.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right font-medium text-xs text-neutral-400">${row.accumulatedDepreciation.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right font-black text-xs text-indigo-600">${row.endingValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-start gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20">
            <Info className="h-5 w-5 text-indigo-600 mt-0.5" />
            <p className="text-[11px] font-medium text-indigo-900 dark:text-indigo-300 leading-relaxed">
              This schedule is for informational purposes only. Straight-line depreciation assumes the asset loses an equal amount of value every year until it reaches its salvage value. Actual tax depreciation may vary based on local regulations.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
