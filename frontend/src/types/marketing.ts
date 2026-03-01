export type CampaignChannel = 'Email' | 'SMS' | 'Social' | 'Ads' | 'Content' | 'Referral';
export type CampaignStatus = 'Draft' | 'Active' | 'Paused' | 'Completed';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
export type LeadSource = 'Organic' | 'Paid Ads' | 'Referral' | 'Email' | 'Social' | 'Event' | 'Direct';

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  budget: number;
  spend: number;
  leads: number;
  conversions: number;
  roi: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  notes?: string;
  tags: string[];
  createdBy: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  assignedTo: string;
  campaignId?: string;
  campaignName?: string;
  value: number;
  createdAt: string;
  lastContactedAt?: string;
  notes?: string;
  tags: string[];
  location: string;
}

export interface MarketingSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  totalLeads: number;
  totalConversions: number;
  conversionRate: number;
  totalBudget: number;
  totalSpend: number;
  costPerLead: number;
  averageROI: number;
  revenueAttributed: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percent: number;
  color: string;
}

export interface ChannelPerformance {
  channel: string;
  leads: number;
  conversions: number;
  spend: number;
  roi: number;
}

export interface LeadTrend {
  month: string;
  leads: number;
  conversions: number;
  spend: number;
}

export interface AudienceSegment {
  id: string;
  name: string;
  filters: string[];
  size: number;
  createdAt: string;
  tags: string[];
}
