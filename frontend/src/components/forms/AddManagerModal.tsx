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
import { UserPlus, ShieldCheck, Key, Mail, User } from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddManagerModalProps {
  tenantId: string;
  shopName: string;
}

export function AddManagerModal({ tenantId, shopName }: AddManagerModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'SHOP_MANAGER',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      await api.post(`/tenants/${tenantId}/users`, values);
      toast({
        title: "Access Granted!",
        description: `Manager account created for ${shopName}.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Delegation Failed",
        description: "There was an error creating the manager account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-9 px-3 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all gap-2">
          <UserPlus className="h-3.5 w-3.5" /> Delegate Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-0 p-0 overflow-hidden bg-white dark:bg-neutral-900 shadow-2xl">
        <div className="bg-indigo-950 p-8 text-white relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="h-24 w-24" />
           </div>
           <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <UserPlus className="h-5 w-5 text-white" />
                 </div>
                 <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Delegate Admin Access</DialogTitle>
              </div>
              <DialogDescription className="text-indigo-200 font-bold uppercase tracking-widest text-[10px] opacity-80">
                Grant management privileges for {shopName}
              </DialogDescription>
           </DialogHeader>
        </div>

        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input placeholder="John Doe" {...field} className="pl-12 h-12 rounded-xl focus:ring-indigo-500 border-neutral-100 dark:border-neutral-800" />
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
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Login Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input placeholder="manager@branch.com" {...field} className="pl-12 h-12 rounded-xl focus:ring-indigo-500 border-neutral-100 dark:border-neutral-800" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Secure Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input type="password" placeholder="••••••••" {...field} className="pl-12 h-12 rounded-xl focus:ring-indigo-500 border-neutral-100 dark:border-neutral-800" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                 <Button 
                   type="submit" 
                   className="w-full h-14 bg-indigo-950 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-indigo-950/20 transition-all gap-2"
                   disabled={isLoading}
                 >
                   {isLoading ? (
                     <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <ShieldCheck className="h-4 w-4" />
                   )}
                   Confirm Delegation
                 </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
