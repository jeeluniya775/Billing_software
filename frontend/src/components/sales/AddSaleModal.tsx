'use client';

import { useState, useMemo } from 'react';
import { useForm as useRHForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import { MOCK_CUSTOMERS } from '@/lib/mock-customers';

// Define schema with recursive calculation capabilities mimicking ERP
const lineItemSchema = z.object({
  description: z.string().min(1, 'Required'),
  quantity: z.coerce.number().min(1, 'Min 1'),
  rate: z.coerce.number().min(0, 'Min 0'),
});

const saleFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  salesperson: z.string().min(1, "Salesperson is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(['Draft', 'Paid', 'Partial', 'Overdue']),
  taxRate: z.coerce.number().min(0).max(100).default(10), // Percentage
  discount: z.coerce.number().min(0).default(0), // Flat amount here for simplicity
  isRecurring: z.boolean().default(false),
  notes: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, "At least one item is required"),
});

type SaleFormValues = z.infer<typeof saleFormSchema>;

export function AddSaleModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useRHForm<SaleFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(saleFormSchema) as any,
    defaultValues: {
      customerId: '',
      salesperson: 'Alice Smith', // Default mock user
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Net 30 default
      status: 'Draft',
      taxRate: 10,
      discount: 0,
      isRecurring: false,
      notes: '',
      lineItems: [{ description: '', quantity: 1, rate: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "lineItems",
    control: form.control,
  });

  // Watch for dynamic calculation
  const lineItemsWatch = form.watch('lineItems');
  const taxRateWatch = form.watch('taxRate') || 0;
  const discountWatch = form.watch('discount') || 0;
  const customerIdWatch = form.watch('customerId');

  // Compute Subtotal, Tax, and Total
  const subtotal = useMemo(() => {
    return lineItemsWatch.reduce((acc, current) => {
      const q = Number(current.quantity) || 0;
      const r = Number(current.rate) || 0;
      return acc + (q * r);
    }, 0);
  }, [lineItemsWatch]);

  const taxAmount = (subtotal * taxRateWatch) / 100;
  const totalAmount = subtotal + taxAmount - discountWatch;

  // Mock Credit Limit check (In real app, fetch customer limit API)
  const isOverCreditLimit = useMemo(() => {
    if (!customerIdWatch || totalAmount <= 0) return false;
    const mockLimit = 15000; // Arbitrary mock limit
    return totalAmount > mockLimit;
  }, [totalAmount, customerIdWatch]);

  async function onSubmit(values: SaleFormValues) {
    setIsSubmitting(true);
    // Simulate API Create Sale
    await new Promise((r) => setTimeout(r, 800));
    console.log("SALE CREATED:", { ...values, totalAmount, subtotal, taxAmount });
    setIsSubmitting(false);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm">
          <PlusCircle className="mr-2 h-4 w-4" /> New Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full md:p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl">Create New Sale</DialogTitle>
          <DialogDescription>
            Record a new invoice or direct sale. Auto-calculates tax and totals.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e); }} className="space-y-8">
            
            {/* Top Details Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_CUSTOMERS.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name} ({c.company})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft (Not Sent)</SelectItem>
                        <SelectItem value="Paid">Paid in Full</SelectItem>
                        <SelectItem value="Partial">Awaiting Payment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Line Items Section */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Itemized Products / Services</h3>
              </div>
              
              <div className="space-y-3">
                {/* Desktop Header Row */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-1 text-right">Amount</div>
                  <div className="col-span-1 border-emerald-400"></div>
                </div>

                {fields.map((field, index) => {
                  const q = lineItemsWatch[index]?.quantity || 0;
                  const r = lineItemsWatch[index]?.rate || 0;
                  const lineTotal = q * r;

                  return (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 md:border-transparent md:bg-transparent md:p-0 md:rounded-none">
                      <div className="md:col-span-6 text-emerald-400">
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.description`}
                          render={({ field: dField }) => (
                            <FormItem className="space-y-1">
                              <span className="md:hidden text-xs font-semibold text-neutral-500 mb-1 block">Description</span>
                              <FormControl>
                                <Input placeholder="e.g. Software License, Consulting Hrs..." {...dField} className="bg-white dark:bg-neutral-800" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.quantity`}
                          render={({ field: qField }) => (
                            <FormItem className="space-y-1">
                              <span className="md:hidden text-xs font-semibold text-neutral-500 mb-1 block">Qty</span>
                              <FormControl>
                                <Input type="number" min="1" {...qField} className="text-right bg-white dark:bg-neutral-800" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.rate`}
                          render={({ field: rField }) => (
                            <FormItem className="space-y-1">
                              <span className="md:hidden text-xs font-semibold text-neutral-500 mb-1 block">Price</span>
                              <FormControl>
                                <Input type="number" step="0.01" min="0" {...rField} className="text-right bg-white dark:bg-neutral-800" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-1 flex items-center justify-end h-10">
                        <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">
                          ${lineTotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="md:col-span-1 flex items-center justify-end h-10">
                         {fields.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-4 border-dashed"
                onClick={() => append({ description: '', quantity: 1, rate: 0 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Line Box Item
              </Button>
            </div>

            {/* Financial Details Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Notes / Memo</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Thank you for your business..." className="resize-none h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Recurring Sale</FormLabel>
                        <p className="text-xs text-neutral-500">Automatically generate this next month.</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Simulated Document Upload UI */}
                <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 text-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer">
                  <UploadCloud className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-300">Attach files or purchase orders</p>
                  <p className="text-xs text-neutral-500 mt-1">PDF, JPG up to 10MB</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 h-fit space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs">Discount ($)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} className="h-8 text-right" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                   </div>
                   <div className="w-1/2">
                      <FormField
                        control={form.control}
                        name="taxRate"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs">Tax Rate (%)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" {...field} className="h-8 text-right" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                   </div>
                </div>

                <div className="flex justify-between items-center text-sm text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span>Calculated Tax</span>
                  <span>+ ${(taxAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-neutral-500">
                  <span>Discount Applied</span>
                  <span>- ${(discountWatch).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${Math.max(0, totalAmount).toFixed(2)}
                  </span>
                </div>

                {isOverCreditLimit && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-2 border border-red-100 dark:border-red-900/50">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">Credit Limit Warning</p>
                      <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">Sale exceeds customer&apos;s nominal credit limit ($15k). Requires managerial approval to post as Unpaid.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Processing..."
                ) : (
                  <><CheckCircle2 className="mr-2 h-4 w-4" /> Save Sale Invoice</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
