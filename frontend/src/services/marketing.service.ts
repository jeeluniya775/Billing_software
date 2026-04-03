import { api } from './api';
import type { 
  Campaign, Lead, MarketingSummary, FunnelStage, ChannelPerformance, LeadTrend, AudienceSegment 
} from '@/types/marketing';

export const marketingService = {
  // GET /marketing/campaigns
  async getCampaigns(): Promise<Campaign[]> {
    const response = await api.get('/marketing/campaigns');
    return response.data;
  },

  // POST /marketing/campaigns
  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    const response = await api.post('/marketing/campaigns', data);
    return response.data;
  },

  // GET /marketing/leads
  async getLeads(): Promise<Lead[]> {
    const response = await api.get('/marketing/leads');
    return response.data;
  },

  // POST /marketing/leads
  async createLead(data: Partial<Lead>): Promise<Lead> {
    const response = await api.post('/marketing/leads', data);
    return response.data;
  },

  // PATCH /marketing/leads/:id/status
  async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead> {
    const response = await api.patch(`/marketing/leads/${id}/status`, { status });
    return response.data;
  },

  // GET /marketing/analytics
  async getMarketingAnalytics() {
    const response = await api.get('/marketing/analytics');
    return response.data;
  },

  // GET /marketing/funnel (Still partially mocked or derived from analytics)
  async getFunnelData(): Promise<FunnelStage[]> {
    // Derive funnel from summary for now or return standard set
    return [
      { stage: 'Awareness', count: 1000, color: 'bg-blue-500', percent: 100 },
      { stage: 'Interest', count: 450, color: 'bg-indigo-500', percent: 45 },
      { stage: 'Decision', count: 120, color: 'bg-violet-500', percent: 12 },
      { stage: 'Action', count: 45, color: 'bg-emerald-500', percent: 4.5 },
    ];
  },

  // GET /marketing/segments (Mocked for now as no separate model yet)
  async getSegments(): Promise<AudienceSegment[]> {
    return [
      { id: '1', name: 'High Value', size: 1200, createdAt: '2024-01-01', filters: {}, tags: ['Premium'] },
      { id: '2', name: 'Churn Risk', size: 450, createdAt: '2024-01-15', filters: {}, tags: ['At Risk'] },
    ];
  },

  async createSegment(data: Partial<AudienceSegment>): Promise<AudienceSegment> {
    const newSegment: AudienceSegment = {
      id: `s${Date.now()}`,
      name: data.name || 'New Segment',
      size: 0,
      createdAt: new Date().toISOString().split('T')[0],
      filters: {},
      tags: [],
    };
    return newSegment;
  },
};
