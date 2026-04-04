'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
import { Plus, Pencil, Building2, User, Mail, Phone, Globe, CreditCard, MapPin, Receipt, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { customersService } from '@/services/customers.service';
import { Customer } from '@/types/customer';

const customerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  company: z.string().min(2, { message: 'Company is required.' }),
  email: z.string().email({ message: 'Valid email required.' }),
  phone: z.string().optional(),
  website: z.string().optional(),
  
  // Tax & Financial
  taxNumber: z.string().optional(),
  paymentTerms: z.string().default('NET_30'),
  creditLimit: z.coerce.number().min(0).default(0),
  
  // Address
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default('USA'),
});

interface CustomerModalProps {
  customer?: Customer; // If provided, we are in Edit mode
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function CustomerModal({ customer, onSuccess, open: externalOpen, onOpenChange: setExternalOpen, trigger }: CustomerModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen;
  
  const { toast } = useToast();
  const isEdit = !!customer;

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      taxNumber: '',
      paymentTerms: 'NET_30',
      creditLimit: 0,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
  });

  // Reset form when customer changes or modal opens
  useEffect(() => {
    if (customer && open) {
      form.reset({
        name: customer.name,
        company: customer.company,
        email: customer.email,
        phone: customer.phone || '',
        website: customer.website || '',
        taxNumber: customer.taxNumber || '',
        paymentTerms: customer.paymentTerms || 'NET_30',
        creditLimit: customer.creditLimit || 0,
        street: customer.billingAddress?.street || '',
        city: customer.billingAddress?.city || '',
        state: customer.billingAddress?.state || '',
        zipCode: customer.billingAddress?.zipCode || '',
        country: customer.billingAddress?.country || 'USA',
      });
    } else if (!isEdit && open) {
      form.reset({
        name: '',
        company: '',
        email: '',
        phone: '',
        website: '',
        taxNumber: '',
        paymentTerms: 'NET_30',
        creditLimit: 0,
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      });
    }
  }, [customer, open, form, isEdit]);

  async function onSubmit(values: z.infer<typeof customerSchema>) {
    try {
      const { street, city, state, zipCode, country, ...rest } = values;
      
      const apiData: any = {
        ...rest,
        billingAddress: {
          street,
          city,
          state,
          zipCode,
          country,
        },
        shippingAddress: {
          street,
          city,
          state,
          zipCode,
          country,
        },
      };

      if (isEdit && customer) {
        await customersService.updateCustomer(customer.id, apiData);
        toast({
          title: 'Customer Updated',
          description: `${values.company} has been updated successfully.`,
        });
      } else {
        await customersService.createCustomer(apiData);
        toast({
          title: 'Customer Created',
          description: `${values.company} has been created successfully.`,
        });
      }
      
      setOpen(false);
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEdit ? 'update' : 'create'} customer. Please try again.`,
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && !externalOpen && (
        <DialogTrigger asChild>
           <Button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 overflow-hidden flex flex-col rounded-3xl border-none shadow-2xl">
        <div className="p-8 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                {isEdit ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {isEdit ? 'Update Profile' : 'New Customer'}
                </DialogTitle>
                <DialogDescription className="text-neutral-500">
                  {isEdit 
                    ? 'Modify administrative and financial details for this client.' 
                    : 'Onboard a new corporate or individual client to your ecosystem.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
            <div className="space-y-8 pb-8">
              
              {/* section: primary details */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
                  <User className="h-3.5 w-3.5" />
                  Primary Identity
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">Legal Entity / Company *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                            <Input placeholder="Global Industries Inc" {...field} className="pl-10 h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">Primary Decision Maker *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                            <Input placeholder="Marcus Aurelius" {...field} className="pl-10 h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">Billing Email *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                            <Input type="email" placeholder="finance@global.com" {...field} className="pl-10 h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">Contact Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                            <Input type="tel" placeholder="+1 (800) 123-4567" {...field} className="pl-10 h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* section: financial */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-500">
                  <Receipt className="h-3.5 w-3.5" />
                  Financial & Governance
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="taxNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">VAT / Tax ID</FormLabel>
                        <FormControl>
                          <Input placeholder="EU123456789" {...field} className="h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">Payment Protocol</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                              <SelectValue placeholder="Select protocol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-neutral-200 dark:border-neutral-800 shadow-xl">
                            <SelectItem value="DUE_ON_RECEIPT">Immediate (Receipt)</SelectItem>
                            <SelectItem value="NET_7">Net 7 Days</SelectItem>
                            <SelectItem value="NET_15">Net 15 Days</SelectItem>
                            <SelectItem value="NET_30">Net 30 Days</SelectItem>
                            <SelectItem value="CUSTOM">Custom Terms</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="creditLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">Authorized Credit ($)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                            <Input type="number" placeholder="50,000" {...field} className="pl-10 h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* section: geography */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500">
                  <MapPin className="h-3.5 w-3.5" />
                  Headquarters / Billing Location
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className="md:col-span-4">
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">Operations Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Level 45, Salesforce Tower, 415 Mission St" {...field} className="h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">City</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco" {...field} className="h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">State / Prov.</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} className="h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-600 dark:text-neutral-400 font-medium">ZIP</FormLabel>
                        <FormControl>
                          <Input placeholder="94105" {...field} className="h-11 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 py-6 border-t border-neutral-100 dark:border-neutral-800 mt-2 bg-white/80 dark:bg-neutral-950/80 backdrop-blur sticky bottom-0 z-10 -mx-8 px-8">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl h-11 px-6">
                Discard
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-11 px-8 shadow-lg shadow-indigo-200 dark:shadow-none min-w-[160px]">
                {isEdit ? 'Save Changes' : 'Initialize Customer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
