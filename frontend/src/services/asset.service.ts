import { api } from './api';
import { Asset, AssetSummary, MaintenanceRecord, AssetTransferRecord } from '@/types/asset';

export const assetService = {
  // GET /assets
  async getAssets(): Promise<Asset[]> {
    const response = await api.get('/assets');
    return response.data;
  },

  // GET /assets/summary
  async getAssetAnalytics(): Promise<AssetSummary> {
    const response = await api.get('/assets/summary');
    return response.data;
  },

  // GET /assets/:id
  async getAssetById(id: string): Promise<Asset> {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },

  // POST /assets
  async createAsset(data: Partial<Asset>) {
    const response = await api.post('/assets', data);
    return response.data;
  },

  // PATCH /assets/:id
  async updateAsset(id: string, data: Partial<Asset>) {
    const response = await api.patch(`/assets/${id}`, data);
    return response.data;
  },

  // DELETE /assets/:id
  async deleteAsset(id: string) {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
  },

  // GET /assets/:id/maintenance (History)
  async getMaintenanceHistory(assetId?: string): Promise<MaintenanceRecord[]> {
    const response = await api.get('/assets/maintenance/history', {
      params: { assetId }
    });
    return response.data;
  },

  // POST /assign (Updating via asset update)
  async assignAsset(assetId: string, employeeName: string): Promise<Asset> {
    return this.updateAsset(assetId, { assignedTo: employeeName });
  },

  // GET /transfers (Placeholder - returns empty for now)
  async getAssetTransfers(assetId?: string): Promise<AssetTransferRecord[]> {
    const response = await api.get('/assets/transfers', {
      params: { assetId }
    });
    return response.data || [];
  }
};
