'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  Package, LayoutDashboard, 
  Download, Plus, 
  ArrowRightLeft, Wrench, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetFormModal } from '@/components/assets/AssetFormModal';
import { useState, useCallback } from 'react';
import { assetService } from '@/services/asset.service';

export default function AssetsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine active tab from pathname
  const activeTab = pathname.split('/').pop() || 'overview';

  const handleTabChange = (value: string) => {
    router.push(`/assets/${value}`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Asset Inventory', icon: Package },
    { id: 'lifecycle', label: 'Lifecycle & Transfers', icon: ArrowRightLeft },
    { id: 'maintenance', label: 'Maintenance Hub', icon: Wrench },
    { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Assets"
        subtitle="Tracking lifecycle, depreciation, and service schedules."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
              <Download className="h-4 w-4" /> Export Report
            </Button>
            <Button 
               size="sm" 
               className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-9 text-xs"
               onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4" /> New Asset Entry
            </Button>
          </>
        }
      />

      <AssetFormModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSuccess={() => window.location.reload()} // Simplest way to refresh cross-page if needed, or use a context
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="h-10">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {children}
      </Tabs>
    </div>
  );
}
