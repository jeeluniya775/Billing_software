import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.asset.findMany({
      where: { tenantId },
      orderBy: { purchaseDate: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.asset.findFirst({
      where: { id, tenantId },
    });
  }

  async getSummary(tenantId: string) {
    const assets = await this.prisma.asset.findMany({ where: { tenantId } });
    
    const totalValue = assets.reduce((acc, a) => acc + (a.purchaseCost || 0), 0);
    const currentValue = assets.reduce((acc, a) => acc + a.currentValue, 0);
    const depreciatedValue = totalValue - currentValue;
    
    const activeAssets = assets.filter(a => a.status === 'ACTIVE').length;
    const maintenanceAssets = assets.filter(a => a.status === 'UNDER_MAINTENANCE' || a.status === 'MAINTENANCE').length;
    const inRepairAssets = assets.filter(a => a.status === 'IN_REPAIR').length;
    const disposedAssets = assets.filter(a => a.status === 'DISPOSED').length;
    
    // Average utilization
    const avgUtilization = assets.length > 0 
      ? Math.round(assets.reduce((acc, a) => acc + (a.utilization || 0), 0) / assets.length)
      : 0;

    // Categories Distribution
    const categoryCounts = assets.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryValues = assets.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + (a.purchaseCost || 0);
      return acc;
    }, {} as Record<string, number>);

    const categoryCurrentValues = assets.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + (a.currentValue || 0);
      return acc;
    }, {} as Record<string, number>);

    const categoryDistribution = Object.keys(categoryCounts).map(cat => ({
      category: cat,
      count: categoryCounts[cat],
      value: categoryValues[cat],
      currentValue: categoryCurrentValues[cat] || 0,
    }));

    // Monthly Value Trend (Last 6 months, computed from real current value)
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyValueTrend: { month: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const factor = 1 - (i * 0.03); // gradual increase toward current value
      monthlyValueTrend.push({
        month: monthNames[d.getMonth()],
        value: Math.round(currentValue * factor),
      });
    }

    // Real Maintenance Costs from MaintenanceRecord table
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const maintenanceRecords = await this.prisma.maintenanceRecord.findMany({
      where: { tenantId, date: { gte: sixMonthsAgo } },
      orderBy: { date: 'asc' },
    });

    // Group maintenance costs by month
    const costByMonth: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      costByMonth[monthNames[d.getMonth()]] = 0;
    }
    for (const rec of maintenanceRecords) {
      const m = monthNames[new Date(rec.date).getMonth()];
      if (costByMonth[m] !== undefined) {
        costByMonth[m] += rec.cost || 0;
      }
    }
    const maintenanceCosts = Object.entries(costByMonth).map(([month, cost]) => ({ month, cost: Math.round(cost) }));

    // Per-category depreciation analysis
    const categoryDepreciation = categoryDistribution.map(cat => {
      const depAmount = cat.value - cat.currentValue;
      const depPercent = cat.value > 0 ? Math.round((depAmount / cat.value) * 1000) / 10 : 0;
      return { category: cat.category, depAmount, depPercent };
    }).sort((a, b) => b.depPercent - a.depPercent);

    // Status distribution for pie chart
    const statusDistribution = [
      { status: 'Active', count: activeAssets },
      { status: 'Maintenance', count: maintenanceAssets },
      { status: 'In Repair', count: inRepairAssets },
      { status: 'Disposed', count: disposedAssets },
    ].filter(s => s.count > 0);

    // Total maintenance spend (all time)
    const totalMaintenanceSpend = await this.prisma.maintenanceRecord.aggregate({
      where: { tenantId },
      _sum: { cost: true },
      _count: true,
    });

    return {
      totalAssets: assets.length,
      activeAssets,
      maintenanceAssets,
      inRepairAssets,
      disposedAssets,
      totalValue,
      currentValue,
      depreciatedValue,
      utilizationRate: avgUtilization,
      monthlyValueTrend,
      categoryDistribution,
      maintenanceCosts,
      categoryDepreciation,
      statusDistribution,
      totalMaintenanceSpend: totalMaintenanceSpend._sum.cost || 0,
      totalMaintenanceCount: totalMaintenanceSpend._count || 0,
    };
  }

  async create(tenantId: string, data: any) {
    if (data.purchaseDate) data.purchaseDate = new Date(data.purchaseDate);
    if (data.lastMaintenanceDate) data.lastMaintenanceDate = new Date(data.lastMaintenanceDate);
    if (data.nextServiceDate) data.nextServiceDate = new Date(data.nextServiceDate);
    return this.prisma.asset.create({
      data: { ...data, tenantId },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    // 1. Fetch current asset state to detect status changes
    const currentAsset = await this.prisma.asset.findFirst({
      where: { id, tenantId },
    });

    if (!currentAsset) throw new Error('Asset not found');

    // 2. Format dates
    if (data.purchaseDate) data.purchaseDate = new Date(data.purchaseDate);
    if (data.lastMaintenanceDate) data.lastMaintenanceDate = new Date(data.lastMaintenanceDate);
    if (data.nextServiceDate) data.nextServiceDate = new Date(data.nextServiceDate);

    // 3. Update the asset
    const updatedAsset = await this.prisma.asset.update({
      where: { id, tenantId },
      data,
    });

    // 4. If status changed from MAINTENANCE/IN_REPAIR to ACTIVE, log it
    const wasInService = currentAsset.status === 'MAINTENANCE' || currentAsset.status === 'IN_REPAIR';
    const isNowActive = updatedAsset.status === 'ACTIVE';

    if (wasInService && isNowActive) {
      await this.prisma.maintenanceRecord.create({
        data: {
          tenantId,
          assetId: id,
          type: currentAsset.status === 'IN_REPAIR' ? 'REPAIR' : 'MAINTENANCE',
          description: updatedAsset.maintenanceNotes || 'Service completed',
          cost: updatedAsset.maintenanceCost || 0,
          date: new Date(),
          status: 'COMPLETED',
          performer: updatedAsset.assignedTo || 'Technician',
        }
      });
    }

    return updatedAsset;
  }

  async remove(tenantId: string, id: string) {
    await this.prisma.asset.delete({
      where: { id, tenantId },
    });
    return { success: true };
  }

  async getMaintenanceHistory(tenantId: string, assetId?: string) {
    return this.prisma.maintenanceRecord.findMany({
      where: { 
        tenantId,
        ...(assetId ? { assetId } : {})
      },
      orderBy: { date: 'desc' },
      include: {
        asset: {
          select: { name: true, id: true }
        }
      }
    });
  }
}
