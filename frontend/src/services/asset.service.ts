import { Asset, AssetSummary, MaintenanceRecord, AssetTransferRecord } from '@/types/asset';
import { MOCK_ASSETS, MOCK_ASSET_SUMMARY, MOCK_MAINTENANCE_HISTORY, MOCK_ASSET_TRANSFERS } from '@/lib/mock-assets';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const assetService = {
  // GET /api/assets
  async getAssets(): Promise<Asset[]> {
    await delay();
    return MOCK_ASSETS;
  },

  // POST /api/assets
  async createAsset(asset: Partial<Asset>): Promise<Asset> {
    await delay(800);
    const newAsset: Asset = {
      ...MOCK_ASSETS[0],
      ...asset,
      id: `AST-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      purchaseDate: asset.purchaseDate || new Date().toISOString().split('T')[0],
      currentValue: asset.purchaseCost || 0,
      status: 'Active' as const,
      utilization: 100,
      riskFactor: 'Low' as const,
    };
    console.log('API POST /api/assets', newAsset);
    return newAsset;
  },

  // PUT /api/assets/:id
  async updateAsset(id: string, asset: Partial<Asset>): Promise<Asset> {
    await delay(600);
    const existing = MOCK_ASSETS.find(a => a.id === id) || MOCK_ASSETS[0];
    const updated = { ...existing, ...asset };
    console.log(`API PUT /api/assets/${id}`, updated);
    return updated;
  },

  // DELETE /api/assets/:id
  async deleteAsset(id: string): Promise<boolean> {
    await delay(1000);
    console.log(`API DELETE /api/assets/${id}`);
    return true;
  },

  // GET /api/assets/analytics
  async getAssetAnalytics(): Promise<AssetSummary> {
    await delay();
    return MOCK_ASSET_SUMMARY;
  },

  // GET /api/assets/maintenance
  async getMaintenanceHistory(assetId?: string): Promise<MaintenanceRecord[]> {
    await delay();
    if (assetId) {
      return MOCK_MAINTENANCE_HISTORY.filter(m => m.assetId === assetId);
    }
    return MOCK_MAINTENANCE_HISTORY;
  },

  // POST /api/assets/assign
  async assignAsset(assetId: string, employeeName: string): Promise<Asset> {
    await delay(700);
    console.log(`API POST /api/assets/assign`, { assetId, employeeName });
    const asset = MOCK_ASSETS.find(a => a.id === assetId) || MOCK_ASSETS[0];
    return { ...asset, assignedTo: employeeName, status: 'Active' };
  },

  // GET /api/assets/transfers
  async getAssetTransfers(assetId?: string): Promise<AssetTransferRecord[]> {
    await delay();
    if (assetId) {
      return MOCK_ASSET_TRANSFERS.filter(t => t.assetId === assetId);
    }
    return MOCK_ASSET_TRANSFERS;
  }
};
