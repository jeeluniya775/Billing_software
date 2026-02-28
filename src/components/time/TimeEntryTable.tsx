'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, Square, Plus, Search, Filter, Download, 
  MoreVertical, Clock, Calendar, Briefcase, Tag,
  Trash2, Pencil, ExternalLink, ChevronRight, Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MOCK_TIME_ENTRIES } from '@/lib/mock-time';
import { TimeEntry } from '@/types/time';

export function TimeEntryTable() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filtered = MOCK_TIME_ENTRIES.filter(e => 
    e.projectName.toLowerCase().includes(search.toLowerCase()) || 
    e.taskName.toLowerCase().includes(search.toLowerCase()) ||
    e.notes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Live Timer Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col md:flex-row items-center p-6 gap-6 transition-all hover:border-indigo-100">
         <div className="flex-1 flex items-center gap-6">
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${isTimerRunning ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-indigo-50 text-indigo-600'} transition-all`}>
               {isTimerRunning ? <Square className="h-8 w-8" /> : <Play className="h-8 w-8 fill-current translate-x-0.5" />}
            </div>
            <div>
               <h3 className="text-sm font-black text-indigo-950 dark:text-white uppercase tracking-widest">Active Session Tracking</h3>
               <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase italic">{isTimerRunning ? 'Currently recording UI Dev - Component Library' : 'Ready to start a new project session'}</p>
            </div>
         </div>
         
         <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <div className="text-center md:text-right">
               <h2 className={`text-4xl font-black font-mono transition-all ${isTimerRunning ? 'text-rose-600' : 'text-indigo-950 dark:text-white'}`}>
                 {formatTime(timerSeconds)}
               </h2>
               <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mt-1 italic">Elapsed Session Time</p>
            </div>
            <div className="flex gap-2">
               <Button 
                 onClick={() => setIsTimerRunning(!isTimerRunning)}
                 className={`h-14 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg transition-all ${
                   isTimerRunning ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                 }`}
               >
                 {isTimerRunning ? 'STop Timer' : 'Start Timer'}
               </Button>
               {timerSeconds > 0 && !isTimerRunning && (
                 <Button 
                   variant="outline" 
                   onClick={() => setTimerSeconds(0)}
                   className="h-14 w-14 rounded-2xl border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-rose-600 transition-all"
                 >
                    <Trash2 className="h-5 w-5" />
                 </Button>
               )}
            </div>
         </div>
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
           <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input 
                 placeholder="Search entries, projects, or tasks..." 
                 className="h-12 pl-11 rounded-xl bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 shadow-sm focus:ring-1 ring-indigo-50 transition-all"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           
           <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Button variant="outline" className="h-12 px-5 min-w-[120px] rounded-xl border-neutral-100 dark:border-neutral-800 font-bold text-xs gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                 <Filter className="h-4 w-4" /> Filters
              </Button>
              <Button variant="outline" className="h-12 px-5 min-w-[120px] rounded-xl border-neutral-100 dark:border-neutral-800 font-bold text-xs gap-2 hover:bg-neutral-50">
                 <Download className="h-4 w-4" /> Export
              </Button>
              
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                   <Button className="h-12 px-6 rounded-xl bg-indigo-950 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Log Manual Time
                   </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] border-neutral-100 dark:border-neutral-800">
                   <DialogHeader>
                      <DialogTitle className="text-xl font-black text-indigo-950 dark:text-white">Manual Time Log</DialogTitle>
                      <DialogDescription className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1 italic">Enter duration and project details below</DialogDescription>
                   </DialogHeader>
                   <div className="grid gap-6 py-6 font-bold">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Project Selection</Label>
                           <Select defaultValue="PRJ-101">
                              <SelectTrigger className="h-10 text-xs">
                                 <SelectValue placeholder="Select Project" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="PRJ-101">E-commerce Platform Redesign</SelectItem>
                                 <SelectItem value="PRJ-102">Mobile App Backend</SelectItem>
                                 <SelectItem value="INTERNAL-01">Internal Admin Refactor</SelectItem>
                              </SelectContent>
                           </Select>
                         </div>
                         <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Duration (Hrs)</Label>
                           <Input type="number" step="0.5" placeholder="0.5" className="h-10 text-xs font-black" />
                         </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Task / Activity</Label>
                        <Input placeholder="What are you working on?" className="h-10 text-xs" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                         <div className="space-y-0.5">
                            <Label className="text-xs font-black text-indigo-950 dark:text-white uppercase tracking-widest">Billable Record</Label>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase italic">Include in client invoice</p>
                         </div>
                         <Switch defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Notes (Optional)</Label>
                        <Input placeholder="Additional context..." className="h-10 text-xs" />
                      </div>
                   </div>
                   <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="font-black text-xs uppercase tracking-widest text-neutral-400">Cancel</Button>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] h-12 px-8 rounded-xl shadow-md">Add Entry</Button>
                   </DialogFooter>
                </DialogContent>
              </Dialog>
           </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden overflow-x-auto">
           <table className="w-full text-sm">
              <thead>
                 <tr className="bg-neutral-50/50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
                    <th className="px-6 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Activity / Task</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Project & Client</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Type</th>
                    <th className="px-6 py-5 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Duration</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Date</th>
                    <th className="px-6 py-5 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                 {filtered.map((entry) => (
                    <tr key={entry.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-all cursor-pointer group">
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                <Tag className="h-5 w-5" />
                             </div>
                             <div>
                                <h4 className="font-black text-indigo-950 dark:text-white leading-none">{entry.taskName}</h4>
                                <p className="text-[11px] text-neutral-400 font-bold uppercase mt-1.5 truncate max-w-[200px] italic">{entry.notes}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex flex-col gap-1.5">
                             <div className="flex items-center gap-2 text-xs font-black text-gray-700 dark:text-neutral-300">
                                <Briefcase className="h-3.5 w-3.5 text-indigo-500" /> {entry.projectName}
                             </div>
                             <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-5">Client: {entry.clientName}</div>
                          </div>
                       </td>
                       <td className="px-6 py-6 text-center">
                          <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border shadow-none ${
                             entry.isBillable ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}>
                            {entry.isBillable ? 'Billable' : 'Internal'}
                          </Badge>
                       </td>
                       <td className="px-6 py-6 text-right">
                          <div className="flex flex-col gap-1">
                             <span className="font-black text-indigo-950 dark:text-white">{entry.duration.toFixed(1)}h</span>
                             {entry.isBillable && <span className="text-[10px] font-bold text-emerald-600 italic uppercase underline-offset-2 underline tracking-tighter">${(entry.duration * entry.billableRate).toFixed(0)}</span>}
                          </div>
                       </td>
                       <td className="px-6 py-6 text-center font-bold text-neutral-400 text-[10px] uppercase tracking-widest italic">
                          {entry.date}
                       </td>
                       <td className="px-6 py-6 text-right">
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <MoreVertical className="h-4 w-4" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Entry Actions</DropdownMenuLabel>
                                <DropdownMenuItem className="text-xs font-black gap-2 uppercase tracking-widest cursor-pointer">
                                   <Pencil className="h-3.5 w-3.5" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs font-black gap-2 uppercase tracking-widest cursor-pointer">
                                   <ExternalLink className="h-3.5 w-3.5" /> Project Info
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-xs font-black gap-2 text-rose-600 uppercase tracking-widest cursor-pointer">
                                   <Trash2 className="h-3.5 w-3.5" /> Delete
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        <div className="flex justify-between items-center px-4 py-2">
           <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Recent activity logs (Page 1 of 4)</p>
           <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full bg-neutral-100 dark:bg-neutral-800"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full bg-neutral-100 dark:bg-neutral-800"><ChevronRight className="h-4 w-4" /></Button>
           </div>
        </div>
      </div>
    </div>
  );
}
