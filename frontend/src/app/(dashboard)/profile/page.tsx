'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, Mail, Shield, ShieldCheck, 
  Key, LogOut, CheckCircle2, UserCheck,
  ShieldAlert, Activity, ArrowRight, Sparkles
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authService.updateProfile({
        name: formData.name,
        email: formData.email,
      });
      toast({ description: "Identity verified and updated in the global ledger." });
    } catch (err) {
      toast({ 
        variant: "destructive", 
        title: "Update Failed", 
        description: "Could not synchronize identity changes." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword) return;
    
    setIsSubmitting(true);
    try {
      await authService.updateProfile({
        currentPassword: formData.currentPassword,
        password: formData.newPassword,
      });
      toast({ description: "Vault access keys rotated successfully." });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      toast({ 
        variant: "destructive", 
        title: "Security Rotation Failed", 
        description: "Current password validation failed." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <PageHeader 
        title="Account View"
        subtitle="Manage your identity and security vault"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Identity Snapshot */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
               <ShieldCheck className="h-24 w-24 text-emerald-600" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-3xl font-black text-emerald-700 mb-6 ring-8 ring-emerald-50/50 dark:ring-emerald-900/10">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'JU'}
              </div>
              
              <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter mb-1">{user?.name}</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">{user?.role} Access Level</p>
              
              <div className="w-full h-px bg-neutral-50 dark:bg-neutral-800 my-6" />
              
              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Status</p>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px]">Verified</Badge>
                 </div>
                 <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Logins</p>
                    <p className="text-xs font-bold text-neutral-900 dark:text-white uppercase">128</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer" onClick={() => authService.logout()}>
            <div className="absolute top-0 right-0 p-8 opacity-20">
               <LogOut className="h-12 w-12" />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-2">End of Shift</p>
               <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                 Terminate Session <ArrowRight className="h-5 w-5" />
               </h3>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Basic Identity */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] p-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="h-10 w-10 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-400">
                  <User className="h-5 w-5" />
               </div>
               <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Personal Identity</h3>
                  <p className="text-xs text-neutral-400 font-medium lowercase">Modify your public facing dashboard persona</p>
               </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Legal Name</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Vault Email</label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none font-bold text-sm" 
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button disabled={isSubmitting} type="submit" className="h-12 px-8 rounded-xl bg-neutral-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest transition-all">
                  Synchronize Identity
                </Button>
              </div>
            </form>
          </section>

          {/* Section: Security Keys */}
          <section className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800/50 rounded-[2.5rem] p-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="h-10 w-10 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                  <Key className="h-5 w-5" />
               </div>
               <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Vault Access Keys</h3>
                  <p className="text-xs text-neutral-400 font-medium lowercase">Rotate your security credentials regularly</p>
               </div>
               <Badge className="ml-auto bg-rose-50 text-rose-600 border-rose-100 text-[8px] px-2 py-0">High Security</Badge>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Current Access Key</label>
                  <Input 
                    type="password" 
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="••••••••" 
                    className="h-12 rounded-xl bg-white dark:bg-neutral-800 border-none font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">New Vault Key</label>
                  <Input 
                    type="password" 
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="••••••••" 
                    className="h-12 rounded-xl bg-white dark:bg-neutral-800 border-none font-bold text-sm" 
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button disabled={isSubmitting || !formData.newPassword} type="submit" className="h-12 px-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 active:scale-95 transition-all">
                  Rotate Access Keys
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
