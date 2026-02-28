export type AssetStatus = 'Active' | 'In Repair' | 'Disposed' | 'Maintenance' | 'Lost';
export type AssetCategory = 'IT Equipment' | 'Furniture' | 'Machinery' | 'Vehicles' | 'Infrastructure' | 'Other';
export type DepreciationMethod = 'Straight Line' | 'Double Declining Balance' | 'Sum of Years Digits' | 'No Depreciation';

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  date: string;
  type: 'Routine' | 'Repair' | 'Inspection' | 'Upgrade';
  description: string;
  cost: number;
  performer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  nextServiceDate?: string;
}

export interface DepreciationPoint {
  date: string;
  value: number;
  depreciation: number;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  location: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  depreciationMethod: DepreciationMethod;
  status: AssetStatus;
  assignedTo?: string; // Employee Name
  serialNumber?: string;
  department: string;
  warrantyExpiry?: string;
  insuranceExpiry?: string;
  notes?: string;
  lastMaintenanceDate?: string;
  riskFactor: 'Low' | 'Medium' | 'High';
  utilization: number; // 0-100 percentage
}

export interface AssetSummary {
  totalAssets: number;
  activeAssets: number;
  maintenanceAssets: number;
  totalValue: number;
  depreciatedValue: number;
  utilizationRate: number;
  monthlyValueTrend: { month: string; value: number }[];
  categoryDistribution: { category: string; count: number; value: number }[];
  maintenanceCosts: { month: string; cost: number }[];
}

export interface AssetTransferRecord {
  id: string;
  assetId: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  fromDepartment: string;
  toDepartment: string;
  transferBy: string;
}
