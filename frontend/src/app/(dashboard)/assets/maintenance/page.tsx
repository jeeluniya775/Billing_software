'use client';

import { useState, useEffect } from 'react';
import { MaintenanceManager } from '@/components/assets/MaintenanceManager';
import { assetService } from '@/services/asset.service';
import { Asset } from '@/types/asset';

export default function AssetsMaintenancePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const assetData = await assetService.getAssets();
      setAssets(Array.isArray(assetData) ? assetData : []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <MaintenanceManager 
        assets={assets} 
        onRefresh={fetchAssets}
      />
    </div>
  );
}
