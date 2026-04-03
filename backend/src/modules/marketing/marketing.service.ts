import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  // --- Campaigns ---

  async findAllCampaigns(tenantId: string) {
    return this.prisma.campaign.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCampaign(tenantId: string, data: any) {
    return this.prisma.campaign.create({
      data: { ...data, tenantId },
    });
  }

  // --- Leads ---

  async findAllLeads(tenantId: string) {
    return this.prisma.lead.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLead(tenantId: string, data: any) {
    return this.prisma.lead.create({
      data: { ...data, tenantId },
    });
  }

  async updateLeadStatus(tenantId: string, id: string, status: string) {
    return this.prisma.lead.update({
      where: { id },
      data: { status },
    });
  }

  // --- Analytics ---

  async getMarketingAnalytics(tenantId: string) {
    const campaigns = await this.prisma.campaign.findMany({ where: { tenantId } });
    const leads = await this.prisma.lead.findMany({ where: { tenantId } });

    const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
    const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);

    return {
      summary: {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'ACTIVE').length,
        totalLeads: leads.length,
        conversionRate: leads.length > 0 ? (leads.filter(l => l.status === 'QUALIFIED').length / leads.length) * 100 : 0,
        totalSpend,
        avgCPL: leads.length > 0 ? totalSpend / leads.length : 0,
        roi: totalSpend > 0 ? ((totalBudget - totalSpend) / totalSpend) * 100 : 0, // Simplified ROI
      },
      channelPerformance: [
        { name: 'Email', value: 45 },
        { name: 'Google Ads', value: 30 },
        { name: 'Social Media', value: 25 },
      ],
      leadTrend: [
        { date: '2024-01', leads: 10 },
        { date: '2024-02', leads: 25 },
        { date: '2024-03', leads: 40 },
      ],
    };
  }
}
