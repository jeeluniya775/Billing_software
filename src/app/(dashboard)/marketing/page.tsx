'use client';

import { useEffect, useState } from 'react';
import { 
  Megaphone, Users, Zap, PieChart, Target, 
  Settings2, Download, Filter, Search, Plus,
  TrendingUp, BarChart3, Mail, MessageSquare, Layout, Sparkles, LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
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
    <ProtectedRoute>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-indigo-950 dark:bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Megaphone className="h-6 w-6" />
               </div>
               <h1 className="text-4xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Marketing</h1>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] italic ml-1.5 flex items-center gap-2">
               Campaign management & Lead intelligence center <Sparkles className="h-3 w-3 text-indigo-400" />
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 border-neutral-100 dark:border-neutral-800 font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 hover:bg-neutral-50 shadow-sm">
                <Download className="h-4 w-4" /> Reports
            </Button>
            <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 shadow-xl px-6 transition-all active:scale-95">
                <Plus className="h-4 w-4" /> Launch Campaign
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-10">
          <div className="border-b border-neutral-100 dark:border-neutral-800 sticky top-0 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl z-30 -mx-4 md:-mx-8 px-4 md:px-8">
            <TabsList className="h-16 bg-transparent gap-8 p-0">
               {[
                 { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                 { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
                 { id: 'leads', label: 'Leads', icon: Users },
                 { id: 'automation', label: 'Automation', icon: Zap },
                 { id: 'audience', label: 'Audience', icon: Target },
                 { id: 'analytics', label: 'Performance', icon: BarChart3 },
               ].map((tab) => (
                 <TabsTrigger 
                   key={tab.id} 
                   value={tab.id}
                   className="h-full border-b-4 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent rounded-none px-2 font-black uppercase tracking-widest text-[10px] text-neutral-400 data-[state=active]:text-indigo-950 dark:data-[state=active]:text-white transition-all gap-2"
                 >
                   <tab.icon className="h-4 w-4 mb-0.5" />
                   {tab.label}
                 </TabsTrigger>
               ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-10 outline-none">
            {summary && (
              <>
                <MarketingKpiCards summary={summary} isLoading={loading} />
                <div className="pt-4">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                      <h2 className="text-xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Conversion Funnel</h2>
                   </div>
                   <MarketingCharts 
                     trendData={trends} 
                     funnelData={funnel} 
                     channelData={channels} 
                     isLoading={loading} 
                   />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="campaigns" className="outline-none">
            <CampaignTable />
          </TabsContent>

          <TabsContent value="leads" className="outline-none">
            <LeadManagement />
          </TabsContent>

          <TabsContent value="automation" className="outline-none">
            <MarketingAutomation />
          </TabsContent>

          <TabsContent value="audience" className="outline-none">
            <AudienceSegmentation />
          </TabsContent>

          <TabsContent value="analytics" className="outline-none">
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
    </ProtectedRoute>
  );
}
