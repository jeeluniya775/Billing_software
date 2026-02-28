import type { 
  Campaign, Lead, MarketingSummary, FunnelStage, ChannelPerformance, LeadTrend, AudienceSegment 
} from '@/types/marketing';
import { 
  MOCK_CAMPAIGNS, MOCK_LEADS, MOCK_MARKETING_SUMMARY, 
  MOCK_FUNNEL_DATA, MOCK_CHANNEL_PERFORMANCE, MOCK_LEAD_TREND, MOCK_AUDIENCE_SEGMENTS 
} from '@/lib/mock-marketing';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const marketingService = {
  // GET /api/campaigns
  async getCampaigns(): Promise<Campaign[]> {
    await delay();
    return MOCK_CAMPAIGNS;
  },

  // POST /api/campaigns
  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    await delay(800);
    const newCampaign = {
      ...MOCK_CAMPAIGNS[0],
      ...data,
      id: `c${Date.now()}`,
      status: 'Draft',
      spend: 0,
      leads: 0,
      conversions: 0,
      roi: 0,
    } as Campaign;
    console.log('POST /api/campaigns', newCampaign);
    return newCampaign;
  },

  // GET /api/leads
  async getLeads(): Promise<Lead[]> {
    await delay();
    return MOCK_LEADS;
  },

  // POST /api/leads
  async createLead(data: Partial<Lead>): Promise<Lead> {
    await delay(600);
    const newLead = {
      ...MOCK_LEADS[0],
      ...data,
      id: `l${Date.now()}`,
      score: Math.floor(Math.random() * 50) + 20,
      createdAt: new Date().toISOString(),
    } as Lead;
    console.log('POST /api/leads', newLead);
    return newLead;
  },

  // PUT /api/leads/:id/status
  async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead> {
    await delay();
    const lead = MOCK_LEADS.find(l => l.id === id) || MOCK_LEADS[0];
    console.log(`PUT /api/leads/${id}/status`, status);
    return { ...lead, status };
  },

  // GET /api/marketing/analytics
  async getMarketingAnalytics() {
    await delay();
    return {
      summary: MOCK_MARKETING_SUMMARY,
      channelPerformance: MOCK_CHANNEL_PERFORMANCE,
      leadTrend: MOCK_LEAD_TREND,
    };
  },

  // GET /api/marketing/funnel
  async getFunnelData(): Promise<FunnelStage[]> {
    await delay();
    return MOCK_FUNNEL_DATA;
  },

  // GET /api/marketing/segments
  async getSegments(): Promise<AudienceSegment[]> {
    await delay();
    return MOCK_AUDIENCE_SEGMENTS;
  },

  // POST /api/marketing/segments
  async createSegment(data: Partial<AudienceSegment>): Promise<AudienceSegment> {
    await delay(700);
    const newSegment = {
      ...MOCK_AUDIENCE_SEGMENTS[0],
      ...data,
      id: `s${Date.now()}`,
      size: Math.floor(Math.random() * 1000) + 50,
      createdAt: new Date().toISOString().split('T')[0],
    } as AudienceSegment;
    console.log('POST /api/marketing/segments', newSegment);
    return newSegment;
  },
};
