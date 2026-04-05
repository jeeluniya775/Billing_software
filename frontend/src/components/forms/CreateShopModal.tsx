'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, Store, Sparkles, Building2, Globe, CreditCard, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Shop name must be at least 2 characters'),
  description: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  businessType: z.string().optional(),
  taxNumber: z.string().optional(),
  currency: z.string().min(1, 'Please select a currency'),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateShopModalProps {
  onSuccess?: () => void;
}

export function CreateShopModal({ onSuccess }: CreateShopModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      email: '',
      phone: '',
      businessType: '',
      taxNumber: '',
      currency: 'USD',
      street: '',
      city: '',
      state: '',
      country: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await api.post('/tenants', values);
      toast({
        title: "Shop Created!",
        description: `${values.name} has been added to your ecosystem.`,
      });
      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "There was an error creating the shop.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6 gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
          <Plus className="h-4 w-4" /> Launch New Shop
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-0 p-0 overflow-hidden bg-white dark:bg-neutral-900 shadow-2xl">
        <div className="bg-emerald-600 p-8 text-white relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Building2 className="h-24 w-24" />
           </div>
           <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Store className="h-5 w-5 text-white" />
                 </div>
                 <DialogTitle className="text-2xl font-black uppercase tracking-tighter">New Business Unit</DialogTitle>
              </div>
              <DialogDescription className="text-emerald-100 font-bold uppercase tracking-widest text-[10px] opacity-80">
                Expand your empire by adding a new shop location
              </DialogDescription>
           </DialogHeader>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Shop Identity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Phoenix Branch" {...field} className="h-12 rounded-xl focus:ring-emerald-500 border-neutral-100 dark:border-neutral-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Business Narrative</FormLabel>
                    <FormControl>
                      <Input placeholder="Short description of what makes this shop unique..." {...field} className="h-12 rounded-xl focus:ring-emerald-500 border-neutral-100 dark:border-neutral-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Official Email</FormLabel>
                      <FormControl>
                        <Input placeholder="shop@example.com" {...field} className="h-12 rounded-xl focus:ring-emerald-500 border-neutral-100 dark:border-neutral-800" />
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
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Contact Line</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234..." {...field} className="h-12 rounded-xl focus:ring-emerald-500 border-neutral-100 dark:border-neutral-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="taxNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                        <CreditCard className="h-3 w-3" /> Tax Identifier
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="VAT/GST/EIN..." {...field} className="h-12 rounded-xl focus:ring-emerald-500 border-neutral-100 dark:border-neutral-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                        <Globe className="h-3 w-3" /> Base Currency
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl focus:ring-emerald-500 border-neutral-100 dark:border-neutral-800">
                            <SelectValue placeholder="Select Currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="AUD">AUD (A$)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-2">
                 <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-neutral-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Headquarters Location</span>
                 </div>
                 
                 <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Street Address" {...field} className="h-11 rounded-xl focus:ring-emerald-500 border-neutral-100 dark:border-neutral-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                 />

                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="City" {...field} className="h-11 rounded-xl focus:ring-emerald-500 border-neutral-100 dark:border-neutral-800" />
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
                          <FormControl>
                            <Input placeholder="State / Province" {...field} className="h-11 rounded-xl focus:ring-emerald-500 border-neutral-100 dark:border-neutral-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>

                 <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Country" {...field} className="h-11 rounded-xl focus:ring-emerald-500 border-neutral-100 dark:border-neutral-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                 />
              </div>

              <div className="pt-4 sticky bottom-0 bg-white dark:bg-neutral-900 pb-2">
                 <Button 
                   type="submit" 
                   className="w-full h-14 bg-indigo-950 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-indigo-950/20 transition-all gap-2"
                   disabled={isLoading}
                 >
                   {isLoading ? (
                     <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <Sparkles className="h-4 w-4" />
                   )}
                   Initialize Shop
                 </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
