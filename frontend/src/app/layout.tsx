import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BillFast | Modern SaaS Billing',
  description: 'Multi-tenant Billing & Business Management Software',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-white dark:bg-neutral-900 overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
