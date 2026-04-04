'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useTenantStore } from '@/store/tenant.store';
import { api } from '@/services/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Shield, 
  Mail, 
  Key, 
  User, 
  Store,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const { user } = useAuthStore();
  const { selectedTenant } = useTenantStore();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF'
  });

  useEffect(() => {
    if (selectedTenant?.id) {
       loadUsers();
    }
  }, [selectedTenant?.id]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/tenants/${selectedTenant?.id}/users`);
      setUsers(response.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/tenants/${selectedTenant?.id}/users`, {
        ...formData,
        tenantId: selectedTenant?.id
      });
      toast.success('User created successfully');
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '', role: 'STAFF' });
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  if (user?.role !== 'OWNER') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <Shield className="h-16 w-16 text-neutral-200 mb-4" />
        <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">Access Restricted</h2>
        <p className="text-neutral-500 max-w-xs mx-auto mt-2">Only business owners can manage shop personnel and security settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Access & Security"
        subtitle={`Managing personnel for ${selectedTenant?.name}`}
        actions={
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-xl shadow-emerald-500/20"
          >
            <UserPlus className="h-4 w-4" />
            Add Shop Staff
          </Button>
        }
      />

      {showAddForm && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-2xl shadow-neutral-200/50 dark:shadow-none animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 mb-8">
             <div className="h-1 w-12 bg-emerald-600 rounded-full" />
             <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">Onboard New Member</h3>
          </div>
          
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 ml-1">Full Identity</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  placeholder="e.g. John Manager"
                  className="pl-10 h-12 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  type="email"
                  placeholder="manager@shop.com"
                  className="pl-10 h-12 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 ml-1">Secure Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 ml-1">Operational Role</label>
              <select 
                className="w-full h-12 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-emerald-500"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="ADMIN">Shop Manager (Full Access)</option>
                <option value="ACCOUNTANT">Accountant (Financial Only)</option>
                <option value="STAFF">Standard Staff (Sales Only)</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white rounded-xl px-8 h-12 font-bold uppercase text-[10px] tracking-widest">
                Authorize Access
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-neutral-50 dark:border-neutral-800 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Shield className="h-5 w-5 text-emerald-600" />
               <h4 className="text-sm font-black uppercase tracking-widest">Authorized Personnel</h4>
             </div>
             <Badge variant="outline" className="text-[8px] font-black uppercase">{users.length} Active</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50/50 dark:bg-neutral-800/50">
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase text-neutral-400 tracking-widest">Member</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase text-neutral-400 tracking-widest">Access Level</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase text-neutral-400 tracking-widest">Shop Context</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase text-neutral-400 tracking-widest">Authorized On</th>
                  <th className="text-right py-4 px-6 text-[10px] font-black uppercase text-neutral-400 tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="py-8 px-6 bg-neutral-50/20 dark:bg-neutral-800/20" />
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <AlertCircle className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
                       <p className="text-sm font-medium text-neutral-400 italic">No additional staff members authorized for this shop yet.</p>
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                           <div className="h-9 w-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-black text-neutral-500 uppercase">
                              {u.name.charAt(0)}{u.name.charAt(u.name.indexOf(' ') + 1)}
                           </div>
                           <div>
                             <p className="text-sm font-bold text-neutral-900 dark:text-white leading-none mb-1">{u.name}</p>
                             <p className="text-[10px] text-neutral-500 font-medium">{u.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={cn(
                          "text-[10px] font-black uppercase border-none",
                          u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700' :
                          u.role === 'ACCOUNTANT' ? 'bg-amber-50 text-amber-700' :
                          'bg-neutral-100 text-neutral-600'
                        )}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium uppercase tracking-tight">
                           <Store className="h-3 w-3" />
                           {selectedTenant?.name}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-neutral-500 font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Info Card */}
        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
           <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
           <div className="relative h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="h-8 w-8" />
           </div>
           <div className="space-y-2 relative z-10 text-center md:text-left">
              <h4 className="text-lg font-black uppercase tracking-tighter">Enterprise-Grade Isolation</h4>
              <p className="text-indigo-100 text-sm max-w-xl">Every staff member added here is cryptographically locked to this shop. They cannot view data from your other locations or access global administrative tools unless you explicitly grant them dual-role permissions.</p>
           </div>
           <div className="ml-auto relative z-10 shrink-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase italic">
                 <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                 Active Security Protocol
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
