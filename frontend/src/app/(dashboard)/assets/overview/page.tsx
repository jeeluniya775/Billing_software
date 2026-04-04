'use client';

import { useState, useEffect } from 'react';
import { AssetKpiCards } from '@/components/assets/AssetKpiCards';
import { AssetCharts } from '@/components/assets/AssetCharts';
import { assetService } from '@/services/asset.service';
import { AssetSummary } from '@/types/asset';

export default function AssetsOverviewPage() {
  const [summary, setSummary] = useState<AssetSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      try {
        const sumData = await assetService.getAssetAnalytics();
        setSummary(sumData || null);
      } catch (error) {
        console.error('Error fetching asset summary:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="space-y-8 slide-in-from-bottom-2 delay-150">
      {summary && <AssetKpiCards summary={summary} isLoading={isLoading} />}
      {summary && <AssetCharts summary={summary} isLoading={isLoading} />}
    </div>
  );
}
