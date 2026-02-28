'use client';

import { useState, Suspense } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// UI Components
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

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill email from URL if present
  const defaultEmail = searchParams?.get('email') || 'admin@billfast.com';

  const form = useRHForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: defaultEmail,
      password: 'password123',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock user routing logic based on email prefix for easy testing
      let role: 'admin' | 'accountant' | 'staff' = 'admin';
      if (values.email.includes('accountant')) role = 'accountant';
      if (values.email.includes('staff')) role = 'staff';

      login(
        {
          id: 'u1',
          name: values.email.split('@')[0].charAt(0).toUpperCase() + values.email.split('@')[0].slice(1),
          email: values.email,
          role: role,
        },
        'mock-jwt-token-123'
      );
      
      setIsLoading(false);
      router.push('/');
    }, 800);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sign in to your account</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="admin@billfast.com" {...field} className="rounded-lg" autoComplete="email" />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} className="rounded-lg" autoComplete="current-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>

      <div className="text-sm text-center">
        <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
          Don&apos;t have an account? Register
        </Link>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center space-y-1 bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg border border-gray-100 dark:border-neutral-700">
        <p className="font-semibold mb-2">Test Accounts (Mock):</p>
        <p>Admin: <span className="font-mono text-emerald-600 dark:text-emerald-400">admin@billfast.com</span></p>
        <p>Accountant: <span className="font-mono text-emerald-600 dark:text-emerald-400">accountant@billfast.com</span></p>
        <p>Staff: <span className="font-mono text-emerald-600 dark:text-emerald-400">staff@billfast.com</span></p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
