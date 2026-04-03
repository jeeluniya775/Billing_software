'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const invoiceItemSchema = z.object({
  description: z.string().min(1, { message: 'Required' }),
  qty: z.string().min(1, { message: 'Required' }),
  rate: z.string().min(1, { message: 'Required' }),
});

const invoiceSchema = z.object({
  customerName: z.string().min(2, { message: 'Customer name is required.' }),
  customerEmail: z.string().email({ message: 'Valid email required.' }),
  invoiceDate: z.string().min(1, { message: 'Date is required.' }),
  dueDate: z.string().min(1, { message: 'Due date is required.' }),
  items: z.array(invoiceItemSchema).min(1, { message: 'At least one item required.' }),
});

export function CreateInvoiceModal() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', qty: '1', rate: '0.00' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(values: z.infer<typeof invoiceSchema>) {
    const total = values.items.reduce((acc, item) => acc + (Number(item.qty) * Number(item.rate)), 0);
    
    toast({
      title: 'Invoice Created',
      description: `Invoice for ${values.customerName} totaling $${total.toFixed(2)} has been saved.`,
      variant: 'default',
    });
    setOpen(false);
    form.reset();
  }

  const calculateTotal = () => {
    const items = form.watch('items');
    return items.reduce((acc, item) => {
      const qty = Number(item.qty) || 0;
      const rate = Number(item.rate) || 0;
      return acc + (qty * rate);
    }, 0).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Bill your customers. Fill out the details below to generate an invoice.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-900 border-b pb-2">Customer Details</h4>
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="billing@acme.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-900 border-b pb-2">Invoice Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
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
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="font-semibold text-sm text-gray-900 border-b pb-2 flex justify-between items-center">
                <span>Line Items</span>
              </h4>
              
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase px-2 hidden sm:grid">
                <div className="col-span-6 md:col-span-7">Description</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-3 md:col-span-2">Rate</div>
                <div className="col-span-1 text-right">Amt</div>
              </div>

              {fields.map((field, index) => {
                // We use watch specifically for this row to calculate the row total
                const qty = Number(form.watch(`items.${index}.qty`)) || 0;
                const rate = Number(form.watch(`items.${index}.rate`)) || 0;
                const amt = (qty * rate).toFixed(2);

                return (
                  <div key={field.id} className="grid grid-cols-12 gap-2 sm:gap-4 items-start relative px-1 sm:px-2 py-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="col-span-12 sm:col-span-6 md:col-span-7">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <span className="sm:hidden text-xs font-medium mb-1 block">Description</span>
                            <FormControl>
                              <Input placeholder="Service description" {...field} className="bg-white" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="col-span-4 sm:col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.qty`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <span className="sm:hidden text-xs font-medium mb-1 block">Qty</span>
                            <FormControl>
                              <Input type="number" step="1" {...field} className="bg-white" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="col-span-5 sm:col-span-3 md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.rate`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <span className="sm:hidden text-xs font-medium mb-1 block">Rate ($)</span>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} className="bg-white" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="col-span-3 sm:col-span-1 flex items-center justify-end sm:justify-between h-10 mt-6 sm:mt-0">
                      <span className="font-medium text-sm mr-2 hidden md:inline-block">${amt}</span>
                      {fields.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                onClick={() => append({ description: '', qty: '1', rate: '0.00' })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <div className="w-full md:w-1/3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Save & Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
