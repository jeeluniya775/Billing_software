'use client';

import { useState, Suspense } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  password: z.string().min(6, { message: 'Password must be at least 4 characters.' }),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill email from URL if present
  const defaultEmail = searchParams?.get('email') || 'admin@demo.com';

  const form = useRHForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: defaultEmail,
      password: 'admin123',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.login({
        email: values.email,
        password: values.password,
      });
      setIsLoading(false);
      router.push('/');
    } catch (error: any) {
      setIsLoading(false);
      alert(error.message || 'Login failed');
    }
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
                  <Input placeholder="admin@demo.com" {...field} className="rounded-lg" autoComplete="email" />
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
        <p className="font-semibold mb-2">Demo Credentials:</p>
        <p>Email: <span className="font-mono text-emerald-600 dark:text-emerald-400">admin@demo.com</span></p>
        <p>Password: <span className="font-mono text-emerald-600 dark:text-emerald-400">admin123</span></p>
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
