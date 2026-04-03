'use client';

import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, MoreHorizontal, 
  Trash2, Pencil, ExternalLink, MapPin, User, 
  ChevronLeft, ChevronRight, LayoutGrid, List, AlertCircle, 
  ArrowUpRight, QrCode, Tag as TagIcon
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
import { Asset, AssetStatus, AssetCategory } from '@/types/asset';
import { assetService } from '@/services/asset.service';
import { AssetDetailDrawer } from './AssetDetailDrawer';

import { AssetFormModal } from './AssetFormModal';
import { AssetTagModal } from './AssetTagModal';

const STATUS_STYLE: Record<string, string> = {
  'Active': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200',
  'ACTIVE': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200',
  'In Repair': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200',
  'IN_REPAIR': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200',
  'Maintenance': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200',
  'MAINTENANCE': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200',
  'Disposed': 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200',
  'DISPOSED': 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200',
  'Lost': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200',
  'LOST': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200',
};

const CATEGORY_ICONS: Record<string, any> = {
  'IT Equipment': LayoutGrid,
  Machinery: AlertCircle,
  Furniture: List,
  Vehicles: LayoutGrid,
  Infrastructure: LayoutGrid,
  Other: LayoutGrid,
};

interface AssetTableProps {
  assets: Asset[];
  onRefresh?: () => void;
}

export function AssetTable({ assets, onRefresh }: AssetTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedAssetForTag, setSelectedAssetForTag] = useState<Asset | null>(null);

  const filtered = assets.filter(a => {
    const nameMatch = a.name?.toLowerCase().includes(search.toLowerCase());
    const idMatch = a.id?.toLowerCase().includes(search.toLowerCase());
    const snMatch = a.serialNumber?.toLowerCase().includes(search.toLowerCase());
    const matchSearch = !search || nameMatch || idMatch || snMatch;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || a.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const handleDeleteAsset = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to dispose of this asset?')) {
      try {
        await assetService.deleteAsset(id);
        onRefresh?.();
      } catch (error) {
        console.error('Failed to delete asset:', error);
      }
    }
  };

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDrawerOpen(true);
  };

  const handleEditAsset = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAsset(asset);
    setIsEditModalOpen(true);
  };

  const handleGenerateTag = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAssetForTag(asset);
    setIsTagModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input 
            placeholder="Search asset name, ID, or SN..." 
            className="pl-9 h-11 text-sm bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] h-11 text-xs font-semibold">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="IT Equipment">IT Equipment</SelectItem>
              <SelectItem value="Machinery">Machinery</SelectItem>
              <SelectItem value="Vehicles">Vehicles</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-11 text-xs font-semibold">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="In Repair">In Repair</SelectItem>
              <SelectItem value="Disposed">Disposed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="h-11 text-xs gap-2 font-bold px-4 hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <Download className="h-4 w-4" /> Export
          </Button>

          <Button 
            className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-2 font-bold px-5"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Asset
          </Button>

          <AssetFormModal 
            isOpen={isModalOpen} 
            onOpenChange={setIsModalOpen} 
            onSuccess={onRefresh} 
          />

          <AssetFormModal 
            isOpen={isEditModalOpen} 
            onOpenChange={setIsEditModalOpen} 
            onSuccess={onRefresh}
            asset={editingAsset}
          />
        </div>
      </div>

      {/* Actual Data Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
              <th className="px-6 py-5 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Asset Information</th>
              <th className="px-6 py-5 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Details</th>
              <th className="px-6 py-5 text-right text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Purchase Value</th>
              <th className="px-6 py-5 text-right text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Current Value</th>
              <th className="px-6 py-5 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-5 text-right text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.map((asset) => (
              <tr key={asset.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-all cursor-pointer group" onClick={() => handleViewDetails(asset)}>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                     <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                        <LayoutGrid className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="font-bold text-gray-900 dark:text-white leading-tight underline-offset-4 group-hover:underline">{asset.name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-1 font-bold">ID: {asset.id}</p>
                     </div>
                   </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                   <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                        <MapPin className="h-3.5 w-3.5" /> {asset.location || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                        <User className="h-3.5 w-3.5" /> {asset.assignedTo || 'Unassigned'}
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5 text-right font-bold text-neutral-500">
                   ${(asset.purchaseCost || 0).toLocaleString()}
                </td>
                <td className="px-6 py-5 text-right">
                   <p className="font-black text-gray-900 dark:text-white">${(asset.currentValue || 0).toLocaleString()}</p>
                   {asset.purchaseCost && asset.purchaseCost > 0 && (
                     (() => {
                        const diff = asset.currentValue - asset.purchaseCost;
                        const percent = (Math.abs(diff) / asset.purchaseCost) * 100;
                        if (diff > 0) {
                          return <p className="text-[10px] text-emerald-500 font-bold">+{percent.toFixed(1)}% app.</p>;
                        } else if (diff < 0) {
                          return <p className="text-[10px] text-rose-500 font-bold">-{percent.toFixed(1)}% dep.</p>;
                        } else {
                          return <p className="text-[10px] text-neutral-400 font-bold">0% change</p>;
                        }
                     })()
                   )}
                </td>
                <td className="px-6 py-5 text-center">
                   <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border shadow-sm ${STATUS_STYLE[asset.status] || 'bg-neutral-100'}`}>
                     {asset.status}
                   </Badge>
                </td>
                <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800">
                      <DropdownMenuLabel className="text-[10px] uppercase font-bold text-neutral-400">Asset Options</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2 cursor-pointer font-bold text-xs" onClick={() => handleViewDetails(asset)}>
                        <ExternalLink className="h-3.5 w-3.5" /> View Lifecycle
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 cursor-pointer font-bold text-xs"
                        onClick={(e) => handleGenerateTag(asset, e as any)}
                       >
                        <QrCode className="h-3.5 w-3.5" /> Generate Tag
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 cursor-pointer font-bold text-xs"
                        onClick={(e) => handleEditAsset(asset, e as any)}
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit Asset
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="gap-2 text-rose-600 cursor-pointer font-bold text-xs"
                        onClick={(e) => handleDeleteAsset(asset.id, e as any)}
                       >
                        <Trash2 className="h-3.5 w-3.5" /> Dispose Asset
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between px-2 text-xs text-neutral-400 font-bold uppercase tracking-widest py-2">
         <p>Showing {filtered.length} Assets</p>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 shadow-sm">Previous</Button>
            <Button variant="outline" size="sm" className="h-8 shadow-sm bg-neutral-50 dark:bg-neutral-800 text-indigo-600 border-indigo-200">1</Button>
            <Button variant="outline" size="sm" className="h-8 shadow-sm">Next</Button>
         </div>
      </div>

      <AssetDetailDrawer 
        asset={selectedAsset!} 
        isOpen={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
        onRefresh={onRefresh}
      />

      <AssetTagModal
        isOpen={isTagModalOpen}
        onOpenChange={(open) => {
          setIsTagModalOpen(open);
          if (!open) setSelectedAssetForTag(null);
        }}
        asset={selectedAssetForTag}
      />
    </div>
  );
}
