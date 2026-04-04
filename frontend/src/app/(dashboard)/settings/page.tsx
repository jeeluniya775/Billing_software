'use client';

import { 
  Users, 
  Store, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Palette,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useTenantStore } from '@/store/tenant.store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';

export default function SettingsHubPage() {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();

  const settingsCategories = [
    {
      id: 'users',
      title: 'Shop Staff & Security',
      description: 'Manage shop managers, staff permissions and access keys.',
      icon: ShieldCheck,
      href: '/settings/users',
      role: 'OWNER',
      status: 'Active'
    },
    {
      id: 'business',
      title: 'Business Profile',
      description: 'Update shop email, phone, location and tax details.',
      icon: Store,
      href: '#',
      role: 'OWNER',
      status: 'Coming Soon'
    },
    {
      id: 'notifications',
      title: 'Communication',
      description: 'Configure email alerts, receipts and customer updates.',
      icon: Bell,
      href: '#',
      role: 'ADMIN',
      status: 'Coming Soon'
    },
    {
      id: 'branding',
      title: 'Interface & Branding',
      description: 'Customize shop logos, invoice themes and color palettes.',
      icon: Palette,
      href: '#',
      role: 'OWNER',
      status: 'Coming Soon'
    }
  ];

  const allowedCategories = settingsCategories.filter(cat => {
    // Basic role check
    if (cat.role === 'OWNER' && user?.role !== 'OWNER') return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Settings Hub"
        subtitle="Configure your shop operational core"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allowedCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = cat.status === 'Active';
          
          const CardContent = (
            <div className={`
              group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-8 rounded-[2rem] 
              transition-all duration-300 overflow-hidden
              ${isActive ? 'hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/5' : 'opacity-60 cursor-not-allowed'}
            `}>
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' : 'bg-neutral-100 text-neutral-400'}`}>
                  <Icon className="h-6 w-6" />
                </div>
                {isActive ? (
                  <div className="h-10 w-10 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0 text-neutral-400">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                ) : (
                  <Badge variant="outline" className="text-[8px] font-black uppercase text-neutral-400 tracking-widest">{cat.status}</Badge>
                ) }
              </div>

              <div className="mt-8 space-y-2">
                <h3 className="text-xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase">{cat.title}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {isActive && (
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 tracking-widest group-hover:gap-3 transition-all">
                  Configure Now <ArrowRight className="h-3 w-3" />
                </div>
              )}
            </div>
          );

          if (isActive) {
            return (
              <Link key={cat.id} href={cat.href}>
                {CardContent}
              </Link>
            );
          }

          return <div key={cat.id}>{CardContent}</div>;
        })}
      </div>

      {/* Experimental Features / Global Area */}
      <div className="bg-neutral-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <Globe className="h-32 w-32" />
        </div>
        <div className="relative z-10 max-w-lg space-y-4">
           <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-emerald-500 rounded-full" />
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Enterprise Scale</p>
           </div>
           <h4 className="text-2xl font-black uppercase tracking-tighter">Multi-Shop Engine</h4>
           <p className="text-neutral-400 text-sm leading-relaxed">
             You are currently configuring <span className="text-white font-bold">{selectedTenant?.name}</span>. 
             Remember that staff and branding settings are isolated per shop to ensure maximum operational security.
           </p>
        </div>
      </div>
    </div>
  );
}
