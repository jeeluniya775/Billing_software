'use client';

import { useState } from 'react';
import { 
  Zap, Mail, MessageSquare, Clock, Plus, Settings, 
  Play, Pause, BarChart3, ChevronRight, Split, Send, 
  Settings2, MoreVertical, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';

export function MarketingAutomation() {
  const [activeTab, setActiveTab] = useState('workflows');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
            Marketing Automation
          </h2>
          <p className="text-sm text-neutral-500">Automate your lead nurturing and engagement flows.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Create Automation
        </Button>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl">
          <TabsTrigger value="workflows" className="rounded-lg px-6">Workflows</TabsTrigger>
          <TabsTrigger value="sequences" className="rounded-lg px-6">Email Sequences</TabsTrigger>
          <TabsTrigger value="abtesting" className="rounded-lg px-6">A/B Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                name: 'Welcome Series', 
                trigger: 'New Lead Created', 
                steps: 4, 
                active: true, 
                conversions: '12.4%', 
                color: 'bg-indigo-500' 
              },
              { 
                name: 'Post-Purchase Followup', 
                trigger: 'Order Completed', 
                steps: 3, 
                active: true, 
                conversions: '22.1%', 
                color: 'bg-emerald-500' 
              },
              { 
                name: 'Re-engagement Flow', 
                trigger: 'Lead Inactive > 30d', 
                steps: 2, 
                active: false, 
                conversions: '4.8%', 
                color: 'bg-amber-500' 
              },
              { 
                name: 'Webinar RSVP', 
                trigger: 'Form Submission', 
                steps: 5, 
                active: true, 
                conversions: '18.5%', 
                color: 'bg-rose-500' 
              },
            ].map((flow) => (
              <Card key={flow.name} className="overflow-hidden border-neutral-100 dark:border-neutral-700 hover:shadow-md transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg ${flow.color} bg-opacity-10`}>
                      <Zap className={`h-4 w-4 ${flow.active ? 'text-indigo-600' : 'text-neutral-400'}`} />
                    </div>
                    <Badge variant={flow.active ? 'default' : 'secondary'} className={flow.active ? 'bg-emerald-100 text-emerald-700' : ''}>
                      {flow.active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-3">{flow.name}</CardTitle>
                  <CardDescription className="text-xs">Trigger: {flow.trigger}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                    <span className="flex items-center gap-1"><Settings2 className="h-3 w-3" /> {flow.steps} Steps</span>
                    <span className="flex items-center gap-1 font-bold text-indigo-600"><BarChart3 className="h-3 w-3" /> {flow.conversions}</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[Mail, MessageSquare, Clock, Mail].slice(0, flow.steps).map((Icon, i) => (
                      <div key={i} className="h-7 w-7 rounded-full bg-white dark:bg-neutral-800 border-2 border-neutral-50 dark:border-neutral-700 flex items-center justify-center">
                        <Icon className="h-3 w-3 text-neutral-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-neutral-50 dark:bg-neutral-900/50 py-2 border-t flex justify-between">
                  <Button variant="ghost" size="sm" className="text-[10px] h-7 px-2">View History</Button>
                  <Button variant="ghost" size="sm" className="text-[10px] h-7 px-2 text-indigo-600">Edit Path <ChevronRight className="h-3 w-3 ml-1" /></Button>
                </CardFooter>
              </Card>
            ))}
            <button className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/10 transition-all group">
              <div className="h-10 w-10 rounded-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center border group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30">
                <Plus className="h-5 w-5 text-neutral-400 group-hover:text-indigo-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">New Flow</p>
                <p className="text-[10px] text-neutral-400">Drag & drop canvas</p>
              </div>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="sequences" className="space-y-4">
           {/* Email Sequences Table-like View */}
           <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 overflow-hidden">
             <div className="p-4 border-b bg-neutral-50/50 dark:bg-neutral-900/30 flex justify-between items-center">
               <h4 className="text-sm font-bold">Manage Email Sequences</h4>
               <Badge className="bg-indigo-600">6 Sequences</Badge>
             </div>
             <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
               {[
                 { name: 'Onboarding Sequence', openRate: '68%', clickRate: '12%', status: 'Active' },
                 { name: 'Trial Expiration Warning', openRate: '45%', clickRate: '28%', status: 'Active' },
                 { name: 'Abandoned Cart Recovery', openRate: '52%', clickRate: '15%', status: 'Paused' },
                 { name: 'Monthly Newsletter', openRate: '32%', clickRate: '5%', status: 'Scheduled' },
               ].map((seq) => (
                 <div key={seq.name} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition-colors">
                   <div className="flex items-center gap-3">
                     <Mail className="h-5 w-5 text-indigo-500" />
                     <div>
                       <p className="text-sm font-bold">{seq.name}</p>
                       <p className="text-[10px] text-neutral-400">Modified 2 days ago</p>
                     </div>
                   </div>
                   <div className="flex gap-8">
                     <div className="text-center">
                       <p className="text-[10px] text-neutral-400 uppercase font-bold">Open Rate</p>
                       <p className="text-xs font-bold text-emerald-600">{seq.openRate}</p>
                     </div>
                     <div className="text-center">
                       <p className="text-[10px] text-neutral-400 uppercase font-bold">Click Rate</p>
                       <p className="text-xs font-bold text-indigo-600">{seq.clickRate}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <Badge variant="outline" className="text-[10px]">{seq.status}</Badge>
                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Settings className="h-4 w-4" /></Button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </TabsContent>

        <TabsContent value="abtesting" className="space-y-6">
          <div className="bg-indigo-600 p-6 rounded-2xl text-white flex flex-col md:flex-row items-center gap-6 overflow-hidden relative">
             <div className="relative z-10 flex-1">
               <div className="flex items-center gap-2 mb-2">
                 <Badge className="bg-white/20 text-white border-none backdrop-blur-md">Experimental</Badge>
                 <span className="text-xs font-medium text-indigo-100">Smart Optimization</span>
               </div>
               <h3 className="text-2xl font-bold mb-2">A/B Testing Lab</h3>
               <p className="text-indigo-100 text-sm max-w-md">Run experiments on headlines, CTAs, and sender names to find what resonates best with your audience.</p>
               <Button className="mt-4 bg-white text-indigo-600 hover:bg-indigo-50 font-bold border-none">
                 Start New Experiment
               </Button>
             </div>
             <div className="relative z-10 grid grid-cols-2 gap-3 w-full md:w-auto">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
                  <div className="h-8 w-8 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-2 text-emerald-400">A</div>
                  <p className="text-2xl font-extrabold line-height-1">42%</p>
                  <p className="text-[10px] text-indigo-100">Variation A</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-400/20 flex items-center justify-center mx-auto mb-2 text-indigo-400">B</div>
                  <p className="text-2xl font-extrabold text-white">58%</p>
                  <p className="text-[10px] text-indigo-100 font-bold">Winner: B</p>
                </div>
             </div>
             {/* Abstract background graphics */}
             <div className="absolute top-0 right-0 h-64 w-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-32 -mt-32" />
             <div className="absolute bottom-0 left-0 h-48 w-48 bg-indigo-400 rounded-full blur-3xl opacity-20 -ml-24 -mb-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-emerald-100 dark:border-emerald-900/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold">Completed Test: Subject Line</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold">Variation B (Winner)</span>
                    <span className="text-xs text-emerald-600 font-bold">🚀 +38% better</span>
                  </div>
                  <p className="text-sm italic">"Exclusive: Your early access is here!"</p>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg opacity-60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold">Variation A</span>
                    <span className="text-xs text-neutral-400 font-bold">Baseline</span>
                  </div>
                  <p className="text-sm italic">"New product launch announcement"</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100 dark:border-amber-900/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold">Active Test: CTA Button</CardTitle>
                <Play className="h-4 w-4 text-amber-500 fill-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Impressions</p>
                    <p className="text-lg font-bold">2,450</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Days Elapsed</p>
                    <p className="text-lg font-bold">3 / 7</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Confidence</p>
                    <p className="text-lg font-bold text-amber-600">82%</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" size="sm" className="text-xs">Live Results</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
