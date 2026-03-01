'use client';

import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, ChevronLeft, ChevronRight, 
  MoreVertical, Edit2, Copy, Pause, Play, Trash2, Calendar, 
  BarChart2, Megaphone, CheckCircle2, AlertCircle, X, ChevronDown, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import type { Campaign, CampaignChannel, CampaignStatus } from '@/types/marketing';
import { MOCK_CAMPAIGNS } from '@/lib/mock-marketing';

const CHANNEL_ICONS: Record<CampaignChannel, any> = {
  Email: Megaphone,
  SMS: Megaphone,
  Social: Megaphone,
  Ads: BarChart2,
  Content: Megaphone,
  Referral: Users,
};

const STATUS_STYLE: Record<CampaignStatus, string> = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Draft: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  Paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Completed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
};

const PAGE_SIZE = 8;

export function CampaignTable() {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = MOCK_CAMPAIGNS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    const matchChannel = channelFilter === 'all' || c.channel === channelFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchChannel && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Table Header Controls */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-9 h-10 text-sm" 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[130px] h-10 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={channelFilter} onValueChange={(v) => { setChannelFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[130px] h-10 text-xs">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Ads">Paid Ads</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-10 text-xs gap-2">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-2">
                  <Plus className="h-3.5 w-3.5" /> Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create Marketing Campaign</DialogTitle>
                  <DialogDescription>Setup your new campaign details to start tracking results.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Campaign Name</label>
                      <Input placeholder="e.g. Summer Refresh 2026" className="text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Channel</label>
                      <Select defaultValue="Email">
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Email">Email Marketing</SelectItem>
                          <SelectItem value="SMS">SMS Campaign</SelectItem>
                          <SelectItem value="Social">Social Media</SelectItem>
                          <SelectItem value="Ads">Paid Search Ads</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Budget (USD)</label>
                      <Input type="number" placeholder="5000" className="text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Target Audience</label>
                      <Input placeholder="e.g. Early adopters" className="text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Start Date</label>
                      <Input type="date" className="text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">End Date</label>
                      <Input type="date" className="text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Campaign Note</label>
                    <textarea 
                      className="w-full min-h-[80px] rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Objectives, goals, etc."
                    />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                    <AlertCircle className="h-5 w-5 text-indigo-600 shrink-0" />
                    <div className="text-xs text-indigo-700 dark:text-indigo-400">
                      <p className="font-bold">Pro Tip</p>
                      <p>Setting an end date helps us calculate <strong>expected ROI</strong> and budget pacing automatically.</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Campaign</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-700">
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Campaign</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Budget vs Spend</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Leads</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Conversions</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">ROI</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-neutral-400">No campaigns found matching your filters.</td>
                </tr>
              ) : (
                paginated.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg group-hover:scale-110 transition-transform">
                          <Megaphone className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white leading-tight">{campaign.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] py-0.5 px-1.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-500 rounded">{campaign.channel}</span>
                            <span className="text-[10px] text-neutral-400 font-mono italic">Ends {campaign.endDate}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="space-y-1.5 min-w-[140px]">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-500">${campaign.spend.toLocaleString()}</span>
                          <span className="text-neutral-400 text-[10px]">${campaign.budget.toLocaleString()} bud.</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${campaign.spend > campaign.budget * 0.9 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                            style={{ width: `${Math.min(100, (campaign.spend / campaign.budget) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-gray-700 dark:text-gray-300">
                      {campaign.leads.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-gray-900 dark:text-white">{campaign.conversions.toLocaleString()}</span>
                      <p className="text-[10px] text-emerald-500">{(campaign.conversions / campaign.leads * 100).toFixed(1)}% rate</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{campaign.roi}%</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_STYLE[campaign.status]}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Edit2 className="h-3.5 w-3.5" /> Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Copy className="h-3.5 w-3.5" /> Duplicate
                          </DropdownMenuItem>
                          {campaign.status === 'Active' ? (
                            <DropdownMenuItem className="gap-2 text-amber-600 cursor-pointer">
                              <Pause className="h-3.5 w-3.5" /> Pause Campaign
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="gap-2 text-emerald-600 cursor-pointer">
                              <Play className="h-3.5 w-3.5" /> Resume Campaign
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-rose-600 cursor-pointer font-medium">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-5 py-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Showing <span className="font-semibold">{(page - 1) * PAGE_SIZE + 1}</span> to <span className="font-semibold">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-semibold">{filtered.length}</span> campaigns
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0" 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-indigo-200 text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30"
            >
              {page}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0" 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
