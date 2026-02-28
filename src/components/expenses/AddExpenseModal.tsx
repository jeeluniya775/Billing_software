'use client';

import { useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, UploadCloud, CheckCircle2, Tag, SplitSquareVertical, AlertCircle } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '@/lib/mock-expenses';
import { EXPENSE_BUDGET_MONTHLY } from '@/lib/mock-expenses';
import { MOCK_EXPENSE_SUMMARY } from '@/lib/mock-expenses';

const expenseFormSchema = z.object({
  vendor: z.string().min(1, 'Vendor is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be positive'),
  taxRate: z.coerce.number().min(0).max(50).default(18),
  paymentMethod: z.enum(['Cash', 'Bank Transfer', 'Credit Card', 'Cheque', 'UPI']),
  status: z.enum(['Paid', 'Pending', 'Reimbursable']),
  date: z.string().min(1, 'Date is required'),
  dueDate: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringPeriod: z.enum(['Monthly', 'Quarterly', 'Yearly']).optional(),
  isReimbursable: z.boolean().default(false),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface AddExpenseModalProps {
  onExpenseAdded?: () => void;
}

export function AddExpenseModal({ onExpenseAdded }: AddExpenseModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useRHForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema) as unknown as Resolver<ExpenseFormValues>,
    defaultValues: {
      vendor: '',
      category: '',
      description: '',
      amount: 0,
      taxRate: 18,
      paymentMethod: 'Bank Transfer',
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
      isRecurring: false,
      isReimbursable: false,
      tags: '',
      notes: '',
    },
  });

  const amountWatch = form.watch('amount') || 0;
  const taxRateWatch = form.watch('taxRate') || 0;
  const isRecurring = form.watch('isRecurring');
  const isReimbursable = form.watch('isReimbursable');
  const taxAmount = (amountWatch * taxRateWatch) / 100;
  const total = amountWatch + taxAmount;

  const projectedMonthly = MOCK_EXPENSE_SUMMARY.totalThisMonth + amountWatch;
  const wouldExceedBudget = projectedMonthly > EXPENSE_BUDGET_MONTHLY;

  async function onSubmit(values: ExpenseFormValues) {
    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 800));
    console.log('POST /api/expenses', values);
    setIsSubmitting(false);
    setOpen(false);
    form.reset();
    onExpenseAdded?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl">Record New Expense</DialogTitle>
          <DialogDescription>Add a business expense with category, tax, and attachment support.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e); }} className="space-y-6">

            {/* Budget Warning */}
            {wouldExceedBudget && amountWatch > 0 && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-700 dark:text-red-300">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>This expense would push monthly spend to <strong>${projectedMonthly.toLocaleString()}</strong>, exceeding your budget of <strong>${EXPENSE_BUDGET_MONTHLY.toLocaleString()}</strong>.</span>
              </div>
            )}

            {/* Section 1: Vendor & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="vendor" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor / Payee</FormLabel>
                  <FormControl><Input placeholder="e.g. AWS, WeWork..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl><Input placeholder="Brief description of the expense..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 2: Amounts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl><Input type="number" step="0.01" min="0" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="taxRate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Rate (%)</FormLabel>
                  <FormControl><Input type="number" step="0.5" min="0" max="50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex flex-col justify-end pb-1">
                <p className="text-xs text-neutral-500 mb-1">Total (incl. tax)</p>
                <p className="text-xl font-bold text-emerald-600">${total.toFixed(2)}</p>
                <p className="text-xs text-neutral-400">Tax: ${taxAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Section 3: Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['Cash', 'Bank Transfer', 'Credit Card', 'Cheque', 'UPI'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Reimbursable">Reimbursable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 4: Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="isRecurring" render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">Recurring Expense</FormLabel>
                    <p className="text-xs text-neutral-500">Auto-repeat each billing cycle</p>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="isReimbursable" render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">Reimbursable</FormLabel>
                    <p className="text-xs text-neutral-500">Will be reimbursed by employee/dept</p>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>

            {/* Section 4b: Recurring Period */}
            {isRecurring && (
              <FormField control={form.control} name="recurringPeriod" render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurring Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* Section 5: Tags & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Tags</FormLabel>
                  <FormControl><Input placeholder="Cloud, Marketing, Q1 (comma separated)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes</FormLabel>
                  <FormControl><Textarea placeholder="Any additional notes..." className="resize-none h-10" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 6: Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Approval workflow UI */}
              {isReimbursable && (
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg text-sm text-indigo-700 dark:text-indigo-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>This expense will be sent for <strong>Admin Approval</strong> before reimbursement is processed.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Receipt Upload UI */}
            <div className="border border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 text-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer">
              <UploadCloud className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Bill / Receipt</p>
              <p className="text-xs text-neutral-500 mt-1">PDF, JPG, PNG up to 5MB</p>
            </div>

            {/* Split Expense Link */}
            <button type="button" className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              <SplitSquareVertical className="h-3.5 w-3.5" />
              Split this expense with another department or person
            </button>

            <DialogFooter className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : <><CheckCircle2 className="mr-2 h-4 w-4" /> Save Expense</>}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
