'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Wrench, Calendar, Clock, DollarSign, User, 
  MapPin, CheckCircle2, History, AlertTriangle, 
  Settings, ChevronRight, Play, MoreVertical, Plus,
  Search, Filter, Loader2, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Asset, MaintenanceRecord } from '@/types/asset';
import { assetService } from '@/services/asset.service';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceManagerProps {
  assets: Asset[];
  onRefresh?: () => void;
}

export function MaintenanceManager({ assets, onRefresh }: MaintenanceManagerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<MaintenanceRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  
  // Sidebar State
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [serviceType, setServiceType] = useState('MAINTENANCE');
  const [estCost, setEstCost] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');

  // Fetch History
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await assetService.getMaintenanceHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching maintenance history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    if (assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets.find(a => a.status?.toUpperCase() === 'ACTIVE')?.id || assets[0].id);
    }
  }, [assets]);

  // Compute Alert Logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const overdueAssets = useMemo(() => assets.filter(a => {
    if (!a.nextServiceDate || a.status === 'DISPOSED') return false;
    const d = new Date(a.nextServiceDate);
    return d < today && a.status === 'ACTIVE';
  }), [assets]);

  const upcomingAssets = useMemo(() => assets.filter(a => {
    if (!a.nextServiceDate || a.status === 'DISPOSED') return false;
    const d = new Date(a.nextServiceDate);
    return d >= today && d <= nextWeek && a.status === 'ACTIVE';
  }), [assets]);

  // Compute Stats (Real-time from assets array)
  const inMaintenance = assets.filter(a => a.status?.toUpperCase() === 'MAINTENANCE').length;
  const inRepair = assets.filter(a => a.status?.toUpperCase() === 'IN_REPAIR').length;
  
  // Total Cost from History
  const totalCost = history.reduce((sum, h) => sum + (h.cost || 0), 0);
  
  const upcomingCount = upcomingAssets.length;
  const overdueCount = overdueAssets.length;

  // Filter History for Timeline
  const timelineRecords = history.filter(h => {
    const type = h.type?.toUpperCase();
    const assetName = (h as any).asset?.name || 'Unknown Asset';
    
    // Search match
    const matchesSearch = assetName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         h.assetId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter match
    let matchesStatus = true;
    if (statusFilter === 'MAINTENANCE') matchesStatus = type === 'MAINTENANCE';
    if (statusFilter === 'REPAIR') matchesStatus = type === 'REPAIR' || type === 'IN_REPAIR';

    return matchesSearch && matchesStatus;
  });

  const handleBookService = async () => {
    if (!selectedAssetId) return;
    setIsProcessing(true);
    try {
      await assetService.updateAsset(selectedAssetId, {
        status: serviceType as any,
        lastMaintenanceDate: new Date().toISOString().split('T')[0],
        maintenanceCost: parseFloat(estCost) || 0,
        maintenanceNotes: serviceNotes
      });
      toast({
        title: 'Service Booked',
        description: `Asset is now marked as ${serviceType.replace('_', ' ')}.`,
      });
      setEstCost('');
      setServiceNotes('');
      onRefresh?.();
      fetchHistory(); // Refresh history list
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: 'Unable to schedule the service call.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkComplete = async (asset: Asset) => {
    setIsProcessing(true);
    try {
      await assetService.updateAsset(asset.id, {
        status: 'ACTIVE'
      });
      toast({
        title: 'Maintenance Completed',
        description: `${asset.name} is now back in active service. Log created.`,
      });
      onRefresh?.();
      fetchHistory();
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update asset status.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Service', value: upcomingCount, sub: overdueCount > 0 ? `${overdueCount} OVERDUE` : 'Next 7 days', color: overdueCount > 0 ? 'text-rose-600' : 'text-indigo-600', bg: overdueCount > 0 ? 'bg-rose-50 dark:bg-rose-900/40' : 'bg-indigo-50 dark:bg-indigo-900/40' },
          { label: 'Pending Repairs', value: inRepair.toString().padStart(2, '0'), sub: 'High urgency', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/40' },
          { label: 'In Shop Now', value: inMaintenance.toString().padStart(2, '0'), sub: 'Active servicing', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/40' },
          { label: 'Total Mnt. Cost', value: `$${(totalCost / 1000).toFixed(1)}k`, sub: 'Lifetime history', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/40' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm transition-all hover:shadow-md group">
             <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{stat.label}</p>
                <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
                   <Wrench className="h-3 w-3" />
                </div>
             </div>
             <h4 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h4>
             <p className="text-[10px] text-neutral-400 font-bold mt-1 uppercase italic">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active & Scheduled Maintenance List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 px-1">
             <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock className="h-4 w-4" /> Service History Timeline
             </h3>
             <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-grow md:w-48">
                   <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />
                   <Input 
                    placeholder="Search asset history..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-[10px] bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-800" 
                   />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                   <SelectTrigger className="h-8 text-[10px] font-bold w-32 bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-800">
                      <SelectValue placeholder="Type" />
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="all">All Logs</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      <SelectItem value="REPAIR">Repair</SelectItem>
                   </SelectContent>
                </Select>
             </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
             {/* Overdue/Urgent Banner in timeline if any */}
             {overdueAssets.length > 0 && (
                <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 border-b border-rose-100 dark:border-rose-900/50 flex items-center gap-3">
                   <AlertTriangle className="h-4 w-4 text-rose-500 animate-bounce" />
                   <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">CRITICAL: {overdueAssets.length} ASSIGNMENT(S) OVERDUE</p>
                </div>
             )}

             {/* Current In-Service Assets First */}
             {assets.filter(a => a.status === 'MAINTENANCE' || a.status === 'IN_REPAIR').map(asset => (
                <div key={`active-${asset.id}`} className="p-6 flex items-center justify-between border-l-4 border-l-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/5 group">
                   <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center animate-pulse ${
                        asset.status?.toUpperCase() === 'IN_REPAIR' ? 'bg-rose-50 dark:bg-rose-900/40 text-rose-600' : 'bg-amber-50 dark:bg-amber-900/40 text-amber-600'
                      }`}>
                         <Wrench className="h-6 w-6" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                            <h4 className="font-black text-indigo-950 dark:text-white leading-none">{asset.name}</h4>
                            <Badge className={`text-[9px] uppercase font-bold tracking-widest px-2 leading-none border shadow-none ${
                               asset.status?.toUpperCase() === 'IN_REPAIR' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>{asset.status}</Badge>
                         </div>
                         <p className="text-[11px] text-neutral-400 font-bold mt-1.5 uppercase tracking-widest">IN PROGRESS · {asset.assignedTo || 'Unassigned'}</p>
                         <p className="text-xs text-indigo-600 mt-1 font-bold italic">Active service session ongoing...</p>
                      </div>
                   </div>
                   <div className="text-right flex flex-col items-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleMarkComplete(asset)}
                        className="h-8 text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 bg-emerald-50 rounded-lg"
                      >
                        Mark Done
                      </Button>
                   </div>
                </div>
             ))}

             {/* History Records */}
             {timelineRecords.length > 0 ? timelineRecords.map((record) => (
                <div key={record.id} className="p-6 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-all group">
                   <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 text-neutral-400 group-hover:text-indigo-500 transition-colors`}>
                         <History className="h-6 w-6" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                            <h4 className="font-black text-indigo-950 dark:text-white leading-none">{(record as any).asset?.name}</h4>
                            <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest px-2 leading-none border-neutral-100 text-neutral-400">{record.type}</Badge>
                         </div>
                         <p className="text-[11px] text-neutral-400 font-bold mt-1.5 uppercase tracking-widest truncate max-w-[300px]">ID: {record.assetId.slice(0, 8)} · {record.performer || 'Technician'}</p>
                         <p className="text-xs text-neutral-500 mt-1 italic">{record.description}</p>
                      </div>
                   </div>
                   <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-sm font-black text-indigo-950 dark:text-white leading-none">${(record.cost || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none italic">{new Date(record.date).toLocaleDateString('en-GB')}</p>
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-1" />
                   </div>
                </div>
             )) : (
               <div className="p-12 text-center text-neutral-400">
                  {isLoadingHistory ? <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" /> : <History className="h-12 w-12 mx-auto mb-4 opacity-20" />}
                  <p className="font-bold uppercase tracking-widest text-xs">{isLoadingHistory ? 'Syncing history...' : 'No service history found'}</p>
               </div>
             )}
          </div>

          <Button variant="outline" className="w-full h-14 border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-2xl flex items-center justify-center gap-2">
             Complete audit trail loaded from database
          </Button>
        </div>

        {/* Schedule & Setup Sidebar */}
        <div className="space-y-6">
           {/* Quick Action Setup */}
           <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-3xl overflow-hidden overflow-visible relative">
              <CardHeader>
                 <CardTitle className="text-lg font-black text-indigo-950 dark:text-white">New Service Call</CardTitle>
                 <CardDescription className="text-xs font-bold text-indigo-600 uppercase tracking-widest italic mt-1">Update Status Instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Assign Asset</label>
                     <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                        <SelectTrigger className="h-10 text-xs font-bold border-indigo-100 dark:border-indigo-900 shadow-none bg-white">
                           <SelectValue placeholder="Select Asset" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                           {assets.filter(a => a.status?.toUpperCase() === 'ACTIVE').map(asset => (
                              <SelectItem key={asset.id} value={asset.id}>{asset.name}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Service Type</label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                       <SelectTrigger className="h-10 text-xs font-bold border-indigo-100 dark:border-indigo-900 shadow-none bg-white">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-white">
                          <SelectItem value="MAINTENANCE">Regular Maintenance</SelectItem>
                          <SelectItem value="IN_REPAIR">Emergency Repair</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-1.5 pt-2">
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-indigo-50 dark:border-indigo-800/50 shadow-sm">
                       <Calendar className="h-4 w-4 text-indigo-400" />
                       <div>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Assignment Date</p>
                          <p className="text-xs font-black text-indigo-600 mt-1 uppercase">{new Date().toLocaleDateString('en-GB')}</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Estimated Cost ($)</label>
                    <Input 
                      type="number"
                      placeholder="0.00"
                      value={estCost}
                      onChange={(e) => setEstCost(e.target.value)}
                      className="h-10 text-xs font-bold border-indigo-100 dark:border-indigo-900 bg-white"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Service Notes</label>
                    <textarea 
                      placeholder="Describe the issue or service needed..."
                      value={serviceNotes}
                      onChange={(e) => setServiceNotes(e.target.value)}
                      className="w-full min-h-[80px] p-3 text-xs font-bold border border-indigo-100 dark:border-indigo-900 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                 </div>
              </CardContent>
              <CardFooter>
                 <Button 
                   onClick={handleBookService}
                   disabled={isProcessing || !selectedAssetId}
                   className="w-full bg-indigo-950 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 shadow-md transition-all active:scale-95"
                 >
                   {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                   Initiate Service
                 </Button>
              </CardFooter>
           </Card>

           {/* Health Indicators Callout */}
           <div className={`p-6 border rounded-3xl relative overflow-hidden group transition-all ${
             overdueCount > 0 ? 'bg-rose-50/50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800' : 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50'
           }`}>
              <div className="relative z-10 flex items-start gap-4">
                 <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    overdueCount > 0 ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600'
                 }`}>
                    <AlertTriangle className={`h-5 w-5 ${overdueCount > 0 ? 'animate-pulse' : ''}`} />
                 </div>
                 <div>
                    <h4 className={`text-sm font-black uppercase tracking-widest leading-none flex items-center gap-2 ${
                       overdueCount > 0 ? 'text-rose-900 dark:text-rose-400' : 'text-amber-900 dark:text-amber-400'
                    }`}>
                       {overdueCount > 0 ? 'CRITICAL ALERT' : 'Maintenance Alert'} 
                       <div className={`h-2 w-2 rounded-full animate-pulse ${overdueCount > 0 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    </h4>
                    <p className={`text-xs mt-2 font-bold leading-relaxed ${
                       overdueCount > 0 ? 'text-rose-800 dark:text-rose-500/80' : 'text-amber-800 dark:text-amber-500/80'
                    }`}>
                       {overdueCount > 0 
                         ? `URGENT: ${overdueCount} asset(s) are past their required service interval. Please investigate immediately.`
                         : upcomingCount > 0 
                           ? `You have ${upcomingCount} asset(s) with service appointments due within the next 7 days.` 
                           : 'All assets are within their operational service intervals.'}
                       
                       <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
                          <DialogTrigger asChild>
                             <span className="text-indigo-600 underline underline-offset-2 ml-1 cursor-pointer hover:text-indigo-800">View schedule?</span>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white dark:bg-neutral-900 rounded-[2.5rem] border-none shadow-2xl p-8">
                             <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tighter">Maintenance Schedule</DialogTitle>
                                <DialogDescription className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">Full Inventory Calendar Overview</DialogDescription>
                             </DialogHeader>
                             <div className="mt-6 space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {assets.filter(a => a.nextServiceDate).sort((a,b) => new Date(a.nextServiceDate!).getTime() - new Date(b.nextServiceDate!).getTime()).map(asset => {
                                   const isOverdue = new Date(asset.nextServiceDate!) < today;
                                   return (
                                      <div key={asset.id} className={`p-4 rounded-2xl border flex items-center justify-between group transition-all ${
                                         isOverdue ? 'bg-rose-50/30 border-rose-100 hover:bg-rose-50' : 'bg-neutral-50/50 border-neutral-100 hover:bg-neutral-50'
                                      }`}>
                                         <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                                               isOverdue ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                                            }`}>
                                               <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                               <p className="text-sm font-black text-neutral-900 dark:text-white">{asset.name}</p>
                                               <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{asset.category} · {asset.id.slice(0,8)}</p>
                                            </div>
                                         </div>
                                         <div className="text-right">
                                            <p className={`text-xs font-black uppercase ${isOverdue ? 'text-rose-600' : 'text-indigo-600'}`}>
                                               {new Date(asset.nextServiceDate!).toLocaleDateString('en-GB')}
                                            </p>
                                            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                                               {isOverdue ? 'Overdue' : 'Scheduled'}
                                            </p>
                                         </div>
                                      </div>
                                   );
                                })}
                                {assets.filter(a => a.nextServiceDate).length === 0 && (
                                   <div className="text-center p-12 text-neutral-400 italic text-sm font-bold uppercase tracking-widest">
                                      No upcoming services scheduled.
                                   </div>
                                )}
                             </div>
                             <div className="mt-8">
                                <Button onClick={() => setShowSchedule(false)} className="w-full h-12 bg-indigo-950 dark:bg-indigo-600 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-lg">
                                   Close Schedule
                                </Button>
                             </div>
                          </DialogContent>
                       </Dialog>
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
