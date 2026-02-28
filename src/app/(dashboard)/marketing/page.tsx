'use client';

import { useEffect, useState } from 'react';
import { 
  Megaphone, Users, Zap, PieChart, Target, 
  Settings2, Download, Filter, Search, Plus,
  TrendingUp, BarChart3, Mail, MessageSquare, Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        setSummary(analytics.summary);
        setTrends(analytics.leadTrend);
        setChannels(analytics.channelPerformance);
        setFunnel(funnelData);
      } catch (error) {
        console.error('Failed to load marketing data', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Marketing <span className="text-indigo-600">Intelligence</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Manage campaigns, track leads, and optimize ROI from a single command center.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-11 px-4 gap-2 text-xs font-bold border-neutral-200 dark:border-neutral-700">
            <Download className="h-4 w-4" /> Reports
          </Button>
          <Button className="flex-1 md:flex-none h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> Launch Campaign
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between bg-white dark:bg-neutral-800 p-1.5 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm sticky top-0 z-30">
          <TabsList className="bg-transparent border-none h-12 gap-1 overflow-x-auto justify-start no-scrollbar">
            {[
              { id: 'overview', label: 'Dashboard', icon: Layout },
              { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
              { id: 'leads', label: 'Leads', icon: Users },
              { id: 'automation', label: 'Automation', icon: Zap },
              { id: 'audience', label: 'Audience', icon: Target },
              { id: 'analytics', label: 'Performance', icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900/40 dark:data-[state=active]:text-indigo-400 rounded-xl px-5 transition-all text-xs font-bold gap-2 h-9"
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="hidden lg:flex items-center gap-3 px-4 border-l border-neutral-100 dark:border-neutral-700 ml-4">
             <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Global Status</span>
               <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                 <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 All Systems Live
               </span>
             </div>
             <div className="h-8 w-8 rounded-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
               <Settings2 className="h-4 w-4 text-neutral-400" />
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
