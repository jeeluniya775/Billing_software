'use client';

import { useState, useEffect } from 'react';
import { AssetLifecycle } from '@/components/assets/AssetLifecycle';
import { assetService } from '@/services/asset.service';
import { Asset } from '@/types/asset';

export default function AssetsLifecyclePage() {
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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <AssetLifecycle 
        assets={assets} 
        onRefresh={fetchAssets}
      />
    </div>
  );
}
