'use client';

import { useEffect, useState } from 'react';
import { 
  Megaphone, Users, Zap, PieChart, Target, 
  Settings2, Download, Filter, Search, Plus,
  TrendingUp, BarChart3, Mail, MessageSquare, Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketingKpiCards } from '@/components/marketing/MarketingKpiCards';
import { MarketingCharts } from '@/components/marketing/MarketingCharts';
import { CampaignTable } from '@/components/marketing/CampaignTable';
import { LeadManagement } from '@/components/marketing/LeadManagement';
import { MarketingAutomation } from '@/components/marketing/MarketingAutomation';
import { AudienceSegmentation } from '@/components/marketing/AudienceSegmentation';
import { MarketingAnalytics } from '@/components/marketing/MarketingAnalytics';
import { marketingService } from '@/services/marketing.service';
import type { MarketingSummary, FunnelStage, LeadTrend, ChannelPerformance } from '@/types/marketing';

export default function MarketingPage() {
  const [summary, setSummary] = useState<MarketingSummary | null>(null);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [trends, setTrends] = useState<LeadTrend[]>([]);
  const [channels, setChannels] = useState<ChannelPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [analytics, funnelData] = await Promise.all([
          marketingService.getMarketingAnalytics(),
          marketingService.getFunnelData()
        ]);
        setSummary(analytics?.summary || null);
        setTrends(Array.isArray(analytics?.leadTrend) ? analytics.leadTrend : []);
        setChannels(Array.isArray(analytics?.channelPerformance) ? analytics.channelPerformance : []);
        setFunnel(Array.isArray(funnelData) ? funnelData : []);
      } catch (error) {
        console.error('Failed to load marketing data', error);
        setSummary(null);
        setTrends([]);
        setChannels([]);
        setFunnel([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Marketing Intelligence"
        subtitle="Manage campaigns, track leads, and optimize ROI."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
              <Download className="h-4 w-4" /> Reports
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-9 text-xs">
              <Plus className="h-4 w-4" /> Launch Campaign
            </Button>
          </>
        }
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="analytics">Performance</TabsTrigger>
          </TabsList>

          <div className="hidden lg:flex items-center gap-3 px-4 ml-4">
             <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Global Status</span>
               <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                 <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 All Systems Live
               </span>
             </div>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
          {summary && (
            <>
              <MarketingKpiCards summary={summary} isLoading={loading} />
              <MarketingCharts 
                trendData={trends} 
                funnelData={funnel} 
                channelData={channels} 
                isLoading={loading} 
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="focus-visible:outline-none">
          <CampaignTable />
        </TabsContent>

        <TabsContent value="leads" className="focus-visible:outline-none">
          <LeadManagement />
        </TabsContent>

        <TabsContent value="automation" className="focus-visible:outline-none">
          <MarketingAutomation />
        </TabsContent>

        <TabsContent value="audience" className="focus-visible:outline-none">
          <AudienceSegmentation />
        </TabsContent>

        <TabsContent value="analytics" className="focus-visible:outline-none">
          {summary && (
            <MarketingAnalytics 
              summary={summary} 
              channelData={channels} 
              trendData={trends} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
