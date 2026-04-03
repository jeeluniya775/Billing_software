'use client';

import { useState } from 'react';
import { 
  Search, Filter, UserPlus, Phone, Mail, MoreHorizontal, 
  ChevronLeft, ChevronRight, UserCheck, Trash2, MapPin, 
  ExternalLink, Calendar, Star, TrendingUp, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import type { Lead, LeadStatus, LeadSource } from '@/types/marketing';
import { MOCK_LEADS } from '@/lib/mock-marketing';

const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; text: string }> = {
  New: { label: 'New', bg: 'bg-blue-50', text: 'text-blue-700' },
  Contacted: { label: 'Contacted', bg: 'bg-amber-50', text: 'text-amber-700' },
  Qualified: { label: 'Qualified', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Converted: { label: 'Converted', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  Lost: { label: 'Lost', bg: 'bg-rose-50', text: 'text-rose-700' },
};

const SOURCE_COLORS: Record<LeadSource, string> = {
  Organic: 'text-emerald-600',
  'Paid Ads': 'text-indigo-600',
  Referral: 'text-violet-600',
  Email: 'text-sky-600',
  Social: 'text-rose-600',
  Event: 'text-amber-600',
  Direct: 'text-neutral-500',
};

export function LeadManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filtered = MOCK_LEADS.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Lead Analytics Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'New Leads', value: 12, sub: 'Last 24 hours', color: 'text-blue-600' },
          { label: 'Qualified', value: 34, sub: 'Active pipeline', color: 'text-emerald-600' },
          { label: 'Avg. Score', value: 72, sub: '+5 from last week', color: 'text-indigo-600' },
          { label: 'Conversion', value: '14.2%', sub: 'Target: 18%', color: 'text-amber-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
            <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">{item.label}</p>
            <div className="flex items-end justify-between mt-1">
              <h4 className={`text-xl font-extrabold ${item.color}`}>{item.value}</h4>
              <span className="text-[10px] text-neutral-400 italic mb-0.5">{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-700 flex flex-col md:flex-row gap-4 justify-between md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search leads..." 
              className="pl-9 h-10 text-sm" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-10 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leads</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-10 text-xs gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-2">
              <UserPlus className="h-4 w-4" /> Add Lead
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-700">
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Lead Details</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Source & Score</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white leading-tight">{lead.name}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{lead.company} · {lead.location}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <a href={`mailto:${lead.email}`} className="text-neutral-400 hover:text-indigo-600"><Mail className="h-3 w-3" /></a>
                          <a href={`tel:${lead.phone}`} className="text-neutral-400 hover:text-indigo-600"><Phone className="h-3 w-3" /></a>
                          <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1 rounded">ID: {lead.id}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase ${SOURCE_COLORS[lead.source]}`}>{lead.source}</span>
                        {lead.campaignName && (
                          <span className="text-[10px] text-neutral-400 border-l pl-2 border-neutral-200">{lead.campaignName}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreColor(lead.score)}`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{lead.score}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${STATUS_CONFIG[lead.status].bg} ${STATUS_CONFIG[lead.status].text}`}>
                      {STATUS_CONFIG[lead.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-neutral-100 rounded-full" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{lead.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {lead.status === 'Qualified' && (
                        <Button 
                          size="sm" 
                          className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-2"
                          onClick={() => { setSelectedLead(lead); setIsConvertModalOpen(true); }}
                        >
                          <UserCheck className="h-3 w-3" /> Convert
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 cursor-pointer"><Star className="h-4 w-4" /> Qualify Lead</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer"><ExternalLink className="h-4 w-4" /> View Details</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600 font-medium"><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Convert to Customer Modal */}
      <Dialog open={isConvertModalOpen} onOpenChange={setIsConvertModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-600" />
              Convert to Customer
            </DialogTitle>
            <DialogDescription>
              This will create a new customer record for <strong>{selectedLead?.name}</strong> and link all marketing history.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-700 dark:text-emerald-400">Projected Value</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  {selectedLead ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedLead.value) : '$0'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-700 dark:text-emerald-400">Marketing ROI Contribution</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">+24.5%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Business Type</label>
                <Select defaultValue="B2B">
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B">B2B - Business to Business</SelectItem>
                    <SelectItem value="B2C">B2C - Business to Consumer</SelectItem>
                    <SelectItem value="GOV">GOV - Government Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="contract" className="rounded" defaultChecked />
                <label htmlFor="contract" className="text-xs text-neutral-600">Auto-generate service contract draft</label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConvertModalOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Confirm Conversion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
