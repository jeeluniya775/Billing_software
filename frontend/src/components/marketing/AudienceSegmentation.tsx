'use client';

import { useState } from 'react';
import { 
  Users, Filter, Plus, Search, Trash2, 
  ChevronRight, ArrowRight, UserPlus, FileJson, 
  Hash, Tag, MapPin, DollarSign, Calendar, TrendingUp
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
import { MOCK_AUDIENCE_SEGMENTS } from '@/lib/mock-marketing';

export function AudienceSegmentation() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Audience Segmentation
          </h2>
          <p className="text-sm text-neutral-500">Create granular customer segments for targeted campaigns.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-10 text-xs gap-2">
            <FileJson className="h-4 w-4" /> Export All
          </Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 md:flex-none h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-2">
                <Plus className="h-4 w-4" /> Define Segment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Define Audience Segment</DialogTitle>
                <DialogDescription>Use filters to precisely target the right customers.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Segment Name</label>
                  <Input placeholder="e.g. High-Value Inactive Leads" className="text-sm" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Segmentation Rules</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800">
                      <Select defaultValue="revenue">
                        <SelectTrigger className="w-[120px] h-8 text-xs shrink-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Total Revenue</SelectItem>
                          <SelectItem value="location">Location</SelectItem>
                          <SelectItem value="behavior">Behavior</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-xs text-neutral-400">is greater than</span>
                      <Input type="number" defaultValue="1000" className="h-8 text-xs" />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></Button>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800">
                      <Select defaultValue="status">
                        <SelectTrigger className="w-[120px] h-8 text-xs shrink-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="status">Lead Status</SelectItem>
                          <SelectItem value="tag">Has Tag</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-xs text-neutral-400">matches</span>
                      <Select defaultValue="qualified">
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></Button>
                    </div>

                    <Button variant="ghost" size="sm" className="text-[10px] text-indigo-600 gap-1 h-7 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10">
                      <Plus className="h-3 w-3" /> Add AND Rule
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-indigo-900/40 rounded-lg">
                      <Users className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Estimated Reach</p>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400">Refreshes dynamically as you edit rules.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-indigo-700 dark:text-indigo-200">1,248</p>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Profiles</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Segment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_AUDIENCE_SEGMENTS.map((segment) => (
          <div key={segment.id} className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 p-6 relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                  <Users className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-neutral-400">{segment.id}</Badge>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{segment.name}</h3>
              
              <div className="space-y-3 mb-6">
                {segment.filters.map((filter) => (
                  <div key={filter} className="flex items-center gap-2 text-xs text-neutral-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    <span>{filter}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {segment.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 rounded text-[10px] font-medium italic">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-50 dark:border-neutral-700/50 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Segment Size</p>
                <p className="text-lg font-black text-indigo-600">{segment.size.toLocaleString()}</p>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-neutral-400 hover:text-indigo-600">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Background decorative users icon */}
            <Users className="absolute -bottom-4 -right-4 h-24 w-24 text-neutral-50 dark:text-neutral-900 opacity-50 pointer-events-none group-hover:scale-110 transition-transform" />
          </div>
        ))}

        {/* Quick Insights Card */}
        <div className="bg-neutral-900 dark:bg-neutral-950 rounded-2xl p-6 text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" /> Growth Insight
            </h4>
            <h3 className="text-lg font-bold mb-4">Your "VIP" segment grew by 18% this month.</h3>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-xs">
              Consider running a specialized <strong>exclusive offer</strong> for this group to boost retention.
            </p>
          </div>
          
          <Button className="relative z-10 bg-indigo-600 hover:bg-indigo-700 text-white w-full gap-2 mt-8 py-5 text-xs font-bold">
            Target This Segment <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Abstract circles */}
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
        </div>
      </div>
    </div>
  );
}
