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
import { PlusCircle, UploadCloud, CheckCircle2, Tag, SplitSquareVertical, AlertCircle, Sparkles, Receipt, RefreshCw } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '@/lib/mock-expenses';
import { expensesService } from '@/services/expenses.service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const expenseFormSchema = z.object({
  vendor: z.string().min(1, 'Vendor is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be positive'),
  status: z.enum(['PAID', 'PENDING', 'APPROVED', 'REJECTED']),
  date: z.string().min(1, 'Date is required'),
  currency: z.string().default('USD'),
  isRecurring: z.boolean().default(false),
  recurringPeriod: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface AddExpenseModalProps {
  onExpenseAdded?: () => void;
}

export function AddExpenseModal({ onExpenseAdded }: AddExpenseModalProps) {
  const [open, setOpen] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useRHForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema) as unknown as Resolver<ExpenseFormValues>,
    defaultValues: {
      vendor: '',
      category: '',
      description: '',
      amount: 0,
      status: 'PENDING',
      date: new Date().toISOString().slice(0, 10),
      currency: 'USD',
      isRecurring: false,
      recurringPeriod: 'MONTHLY',
    },
  });

  async function onSubmit(values: ExpenseFormValues) {
    setIsSubmitting(true);
    try {
      const finalCategory = showCustomCategory ? customCategory : values.category;
      if (!finalCategory) {
        toast({ variant: "destructive", description: "Please provide a classification." });
        return;
      }

      await expensesService.createExpense({
        ...values,
        category: finalCategory,
        date: new Date(values.date).toISOString(),
      });
      toast({ description: "Expense record finalized and locked in vault." });
      setOpen(false);
      form.reset();
      onExpenseAdded?.();
    } catch (err) {
      toast({ 
        variant: "destructive", 
        title: "Vault Lock Failed", 
        description: "Could not persist expense data. Please check your network." 
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none font-bold uppercase tracking-widest text-[10px] px-6 active:scale-95 transition-all">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-white dark:bg-zinc-950 border-none rounded-[2rem] p-0 overflow-hidden shadow-2xl">
        <div className="bg-indigo-600 p-8 text-white relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Receipt className="h-24 w-24 rotate-12" />
           </div>
           <DialogHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                 <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="h-4 w-4" />
                 </div>
                 <Badge className="bg-white/20 text-white border-none text-[9px] font-bold uppercase tracking-widest">Vault Record</Badge>
              </div>
              <DialogTitle className="text-3xl font-bold tracking-tight">Record New Expense</DialogTitle>
              <DialogDescription className="text-indigo-100 text-xs font-medium uppercase tracking-widest opacity-80">Finalize business expenditure for audit log.</DialogDescription>
           </DialogHeader>
        </div>

        <div className="p-8">
          <Form {...form}>
            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e); }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="vendor" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Vendor / Payee</FormLabel>
                    <FormControl><Input placeholder="e.g. AWS, Apple, Uber..." className="h-12 rounded-xl bg-neutral-50 border-none font-bold text-sm" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Expense Classification</FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        if (val === 'CUSTOM') {
                          setShowCustomCategory(true);
                          field.onChange('');
                        } else {
                          setShowCustomCategory(false);
                          field.onChange(val);
                        }
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl><SelectTrigger className="h-12 rounded-xl bg-neutral-50 border-none font-bold text-sm"><SelectValue placeholder="Select Hub" /></SelectTrigger></FormControl>
                      <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                        {EXPENSE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat} className="rounded-xl p-3 font-medium">{cat}</SelectItem>)}
                        <div className="h-px bg-neutral-100 my-2" />
                        <SelectItem value="CUSTOM" className="rounded-xl p-3 font-bold text-indigo-600 bg-indigo-50/50">Add New Classification +</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {showCustomCategory && (
                      <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Input 
                          placeholder="Type manual classification..." 
                          className="h-12 rounded-xl bg-indigo-50/30 border-2 border-indigo-100 font-bold text-sm text-indigo-600 placeholder:text-indigo-300"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Audit Description</FormLabel>
                  <FormControl><Textarea placeholder="Details of the expenditure..." className="resize-none h-24 rounded-xl bg-neutral-50 border-none font-semibold text-sm" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Net Amount ($)</FormLabel>
                    <FormControl><Input type="number" step="0.01" className="h-12 rounded-xl bg-neutral-50 border-none font-black text-lg text-indigo-600" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Flow Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-12 rounded-xl bg-neutral-50 border-none font-bold text-sm"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="PAID">PAID</SelectItem>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="APPROVED">APPROVED</SelectItem>
                        <SelectItem value="REJECTED">REJECTED</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Timestamp</FormLabel>
                    <FormControl><Input type="date" className="h-12 rounded-xl bg-neutral-50 border-none font-bold text-sm" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Recurrence Hub */}
              <div id="recurrence-smart-hub" className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100 flex items-center justify-between gap-6 transition-all animate-in fade-in slide-in-from-top-1">
                <FormField control={form.control} name="isRecurring" render={({ field }) => (
                  <FormItem className="flex items-center gap-4 space-y-0">
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="flex flex-col">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">Recurring Expenditure</FormLabel>
                      <p className="text-[9px] text-neutral-400 font-medium">Auto-track as business overhead</p>
                    </div>
                  </FormItem>
                )} />

                {form.watch('isRecurring') && (
                  <FormField control={form.control} name="recurringPeriod" render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <Select onValueChange={field.onChange} defaultValue={field.value || 'MONTHLY'}>
                        <FormControl><SelectTrigger className="h-10 rounded-xl bg-white border-neutral-100 font-bold text-[10px] uppercase tracking-widest"><SelectValue placeholder="Period" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                          <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                )}
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-neutral-100 mt-8">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] text-neutral-400 hover:bg-neutral-50 transition-all">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                  {isSubmitting ? 'Finalizing...' : <><CheckCircle2 className="mr-2 h-4 w-4" /> Lock Vault Entry</>}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
