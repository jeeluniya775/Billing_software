'use client';

import { 
  Building, Users, Shield, Plus, MoreVertical, 
  ChevronRight, Pencil, Trash2, Key, UserCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_DEPARTMENTS } from '@/lib/mock-team';

export function DepartmentManager() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <div>
            <h3 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Business Units</h3>
            <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest italic">Manage departments, roles, and access boundaries</p>
         </div>
         <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Department
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {MOCK_DEPARTMENTS.map((dept) => (
           <Card key={dept.id} className="border-neutral-100 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden group hover:border-indigo-100 transition-all">
              <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 p-6 flex flex-row justify-between border-b border-neutral-100 dark:border-neutral-800">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
                       <Building className="h-5 w-5" />
                    </div>
                    <div>
                       <CardTitle className="text-sm font-black text-indigo-950 dark:text-white leading-none">{dept.name}</CardTitle>
                       <CardDescription className="text-[9px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">{dept.id}</CardDescription>
                    </div>
                 </div>
                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4 text-neutral-400" />
                 </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <p className="text-[11px] text-neutral-500 font-bold leading-relaxed italic">{dept.description}</p>
                 
                 <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                       <Users className="h-3.5 w-3.5 text-indigo-500" />
                       <span className="text-[10px] font-black uppercase text-indigo-950 dark:text-white">{dept.employeeCount} Personnel</span>
                    </div>
                    <ChevronRight className="h-3 w-3 text-neutral-400" />
                 </div>

                 <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center gap-2">
                       <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                       <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest leading-none">Head: <span className="text-indigo-950 dark:text-white">{dept.managerName}</span></span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                       <Badge variant="outline" className="text-[8px] font-black uppercase px-2 py-0.5 border-neutral-100 dark:border-neutral-800 shadow-none text-neutral-400">Engineering</Badge>
                       <Badge variant="outline" className="text-[8px] font-black uppercase px-2 py-0.5 border-neutral-100 dark:border-neutral-800 shadow-none text-neutral-400">Cloud</Badge>
                       <Badge variant="outline" className="text-[8px] font-black uppercase px-2 py-0.5 border-indigo-100 dark:border-indigo-900 shadow-none text-indigo-600 bg-indigo-50/50">+3 Roles</Badge>
                    </div>
                 </div>
              </CardContent>
              <div className="bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2">
                 <Button variant="ghost" className="h-10 rounded-none text-[9px] font-black uppercase tracking-widest border-r border-neutral-100 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800">
                    <Pencil className="h-3 w-3 mr-2" /> Settings
                 </Button>
                 <Button variant="ghost" className="h-10 rounded-none text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-white dark:hover:bg-neutral-800">
                    <Key className="h-3 w-3 mr-2" /> Permissions
                 </Button>
              </div>
           </Card>
         ))}
      </div>
    </div>
  );
}
