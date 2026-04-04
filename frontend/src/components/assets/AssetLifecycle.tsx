import { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, Trash2, Calculator, QrCode, Tag, 
  MapPin, User, Building, ArrowDownRight, Info,
  ShieldCheck, AlertTriangle, CheckCircle2, Loader2,
  Search, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Asset } from '@/types/asset';
import { assetService } from '@/services/asset.service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DepreciationScheduleModal } from './DepreciationScheduleModal';
import { AssetDisposalModal } from './AssetDisposalModal';
import { AssetTagModal } from './AssetTagModal';
import { TagTemplateConfigModal, TagTemplate } from './TagTemplateConfigModal';

interface AssetLifecycleProps {
  assets: Asset[];
  onRefresh?: () => void;
}

export function AssetLifecycle({ assets, onRefresh }: AssetLifecycleProps) {
  const { toast } = useToast();
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const [targetLocation, setTargetLocation] = useState('Corporate HQ - NY');
  const [targetDepartment, setTargetDepartment] = useState('IT');
  const [salvageValue, setSalvageValue] = useState(0);
  const [usefulLife, setUsefulLife] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modal States
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isDisposalOpen, setIsDisposalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TagTemplate>('standard-qr');

  const selectedAsset = assets.find(a => a.id === selectedAssetId);

  // Auto-select first asset on load
  useEffect(() => {
    if (!selectedAssetId && assets.length > 0) {
      setSelectedAssetId(assets[0].id);
    }
  }, [assets, selectedAssetId]);

  useEffect(() => {
    if (selectedAsset) {
      // Default salvage value is 10% of cost
      setSalvageValue(Math.floor((selectedAsset.purchaseCost || 0) * 0.1));
    }
  }, [selectedAssetId, assets]);

  const annualDepreciation = selectedAsset 
    ? Math.max(0, ((selectedAsset.purchaseCost || 0) - salvageValue) / usefulLife)
    : 0;

  const handleTransfer = async () => {
    if (!selectedAssetId) return;
    setIsProcessing(true);
    try {
      await assetService.updateAsset(selectedAssetId, {
        location: targetLocation,
        department: targetDepartment
      });
      toast({
        title: 'Transfer Complete',
        description: `${selectedAsset?.name} has been moved to ${targetLocation}.`,
      });
      onRefresh?.();
    } catch (error) {
      toast({
        title: 'Transfer Failed',
        description: 'Unable to process the departmental transfer.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onConfirmDisposal = async (data: any) => {
    if (!selectedAssetId) return;
    setIsProcessing(true);
    try {
      await assetService.updateAsset(selectedAssetId, {
        status: 'DISPOSED',
        currentValue: 0,
        notes: `Disposed: ${data.reason}. ${data.notes}`
      });
      toast({
        title: 'Asset Retired',
        description: 'Disposal record has been successfully created.',
      });
      onRefresh?.();
    } catch (error) {
       toast({
        title: 'Disposal Error',
        description: 'Failed to record asset disposal.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Asset Tool */}
        <Card className="lg:col-span-2 border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden overflow-visible relative">
           <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600">
                    <ArrowRightLeft className="h-5 w-5" />
                 </div>
                 <div>
                    <CardTitle className="text-lg">Inter-Departmental Transfer</CardTitle>
                    <CardDescription>Move assets between physical locations or departments.</CardDescription>
                 </div>
              </div>
           </CardHeader>
           <CardContent className="pt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Source Details</p>
                        <div className="space-y-3 p-4 bg-neutral-50 dark:bg-black rounded-2xl border border-neutral-100 dark:border-neutral-800">
                           <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                              <SelectTrigger className="h-10 text-[11px] font-black uppercase bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                                 <SelectValue placeholder="Select Asset" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                                 {assets.filter(a => a.status !== 'DISPOSED').map(asset => (
                                   <SelectItem key={asset.id} value={asset.id}>{asset.name}</SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-tight">
                              <MapPin className="h-3.5 w-3.5 text-indigo-500" /> 
                              Origin: <span className="text-neutral-900 dark:text-white ml-1">{selectedAsset?.location || 'Unassigned'}</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Destination</p>
                        <div className="grid grid-cols-1 gap-3">
                           <Select value={targetLocation} onValueChange={setTargetLocation}>
                              <SelectTrigger className="h-10 text-[11px] font-black uppercase bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                                 <SelectValue placeholder="To Location" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="Corporate HQ - NY">Corporate HQ - NY</SelectItem>
                                 <SelectItem value="Production Plant - MI">Production Plant - MI</SelectItem>
                                 <SelectItem value="Regional Hub - CA">Regional Hub - CA</SelectItem>
                                 <SelectItem value="Warehouse 01 - TX">Warehouse 01 - TX</SelectItem>
                                 <SelectItem value="Rajkot Tech Park">Rajkot Tech Park</SelectItem>
                                 <SelectItem value="Remote / Home Office">Remote / Home Office</SelectItem>
                              </SelectContent>
                           </Select>
                           <Select value={targetDepartment} onValueChange={setTargetDepartment}>
                              <SelectTrigger className="h-10 text-[11px] font-black uppercase bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                                 <SelectValue placeholder="To Department" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="IT">Information Technology</SelectItem>
                                 <SelectItem value="ENG">Quality Engineering</SelectItem>
                                 <SelectItem value="OPS">Operations & Logistics</SelectItem>
                                 <SelectItem value="FIN">Finance & Procurement</SelectItem>
                                 <SelectItem value="HR">Human Resources</SelectItem>
                                 <SelectItem value="SALES">Sales & Marketing</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
              </div>

              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Ownership Change Preview</span>
                    <Badge variant="outline" className="text-[9px] uppercase font-bold text-indigo-500 bg-white">Auto-Update Enabled</Badge>
                 </div>
                 <div className="flex items-center justify-center gap-8 py-2">
                    <div className="text-center">
                       <p className="text-xs font-black text-indigo-950 dark:text-white truncate max-w-[120px]">{selectedAsset?.department || 'N/A'}</p>
                       <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1 italic leading-none">Old Owner</p>
                    </div>
                    <ArrowRightLeft className="h-6 w-6 text-indigo-400 opacity-50" />
                    <div className="text-center">
                       <p className="text-xs font-black text-emerald-600 truncate max-w-[120px]">{targetDepartment || '---'}</p>
                       <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1 italic leading-none">New Owner</p>
                    </div>
                 </div>
              </div>
           </CardContent>
           <CardFooter className="bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex justify-between">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Logs will be generated automatically</p>
              <Button 
                onClick={handleTransfer}
                disabled={isProcessing || !selectedAssetId}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-8 rounded-lg shadow-lg"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Confirm Transfer
              </Button>
           </CardFooter>
        </Card>

        {/* Depreciation Calculator */}
        <Card className="border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col">
           <CardHeader>
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-600">
                    <Calculator className="h-5 w-5" />
                 </div>
                 <CardTitle className="text-lg">Value Calculator</CardTitle>
              </div>
           </CardHeader>
           <CardContent className="flex-grow space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Original Cost</label>
                 <Input 
                  type="number" 
                  value={selectedAsset?.purchaseCost || 0} 
                  readOnly
                  className="font-black text-lg h-12 bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-500/50 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 focus:ring-emerald-500 rounded-2xl" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Salvage Value</label>
                 <Input 
                  type="number" 
                  value={salvageValue} 
                  onChange={(e) => setSalvageValue(parseFloat(e.target.value) || 0)}
                  className="font-bold h-11 border-neutral-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Useful Life (Years)</label>
                 <Input 
                  type="number" 
                  value={usefulLife} 
                  onChange={(e) => setUsefulLife(parseFloat(e.target.value) || 1)}
                  className="font-bold h-11 border-neutral-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl" 
                 />
              </div>
              
              <div className="pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-800">
                 <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold text-neutral-500">Annual Allocation</span>
                    <span className="text-xl font-black text-indigo-600">${annualDepreciation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                 </div>
                 <p className="text-[10px] text-neutral-400 font-bold italic uppercase tracking-widest">Based on Straight Line Method</p>
              </div>
           </CardContent>
            <CardFooter>
               <Button 
                onClick={() => setIsScheduleOpen(true)}
                variant="outline" 
                className="w-full text-[11px] font-black uppercase tracking-widest border-emerald-100 dark:border-emerald-900/40 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
               >
                 Simulate Schedule
               </Button>
            </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Asset Disposal Process */}
         <div className="p-8 bg-black text-white rounded-3xl relative overflow-hidden group">
            <div className="relative z-10">
               <div className="h-12 w-12 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                  <Trash2 className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-black mb-2">Asset Disposal Workflow</h3>
               <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">Safety initiate the disposal of end-of-life assets. Handles accounting write-offs and e-waste certificates.</p>
               
               <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-neutral-300">
                     <div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Verify Depreciation Limit
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-neutral-300">
                     <div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Generate Disposal Form
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-neutral-300">
                    {selectedAsset?.id ? (
                      <span className="text-rose-400 italic">Targeting: {selectedAsset.name}</span>
                    ) : (
                      <span className="text-neutral-500">No asset selected above</span>
                    )}
                  </div>
               </div>

               <Button 
                onClick={() => setIsDisposalOpen(true)}
                disabled={isProcessing || !selectedAssetId}
                className="mt-8 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-[0.2em] text-[10px] h-11 px-8 rounded-xl shadow-lg shadow-rose-600/20"
               >
                 Begin Disposal Sequence
               </Button>
            </div>
            
            {/* Background pattern */}
            <div className="absolute -bottom-16 -right-16 h-64 w-64 bg-rose-600/10 rounded-full blur-3xl" />
         </div>

         {/* Identification & Tagging */}
         <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl flex flex-col justify-between">
            <div>
               <div className="flex items-center justify-between mb-8">
                  <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600">
                     <QrCode className="h-6 w-6" />
                  </div>
                  <Badge className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 border shadow-none font-black text-[9px] uppercase tracking-widest">Production Ready</Badge>
               </div>
               <h3 className="text-xl font-black text-indigo-950 dark:text-white mb-2">Smart Tagging System</h3>
               <p className="text-neutral-500 text-sm leading-relaxed">Integrated QR and Barcode generation for physical asset scanning and quick auditing.</p>
            </div>

             <div className="mt-8 grid grid-cols-2 gap-4">
               <div 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                  activeTemplate === 'standard-qr' ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200" : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-800 hover:border-indigo-300"
                )}
                onClick={() => {
                  setActiveTemplate('standard-qr');
                  setIsTagModalOpen(true);
                }}
               >
                  <QrCode className="h-8 w-8 text-neutral-400" />
                  <div>
                     <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest leading-none">Standard</p>
                     <p className="text-xs font-black text-indigo-600 mt-1 uppercase">QR Label</p>
                  </div>
               </div>
               <div 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                  activeTemplate === 'thermal-barcode' ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200" : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-800 hover:border-emerald-300"
                )}
                onClick={() => {
                  setActiveTemplate('thermal-barcode');
                  setIsTagModalOpen(true);
                }}
               >
                  <Tag className="h-8 w-8 text-neutral-400" />
                  <div>
                     <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest leading-none">Thermal</p>
                     <p className="text-xs font-black text-emerald-600 mt-1 uppercase">Sticker XL</p>
                  </div>
               </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setIsConfigModalOpen(true)}
              className="mt-8 border-indigo-100 dark:border-indigo-900/50 text-indigo-600 font-black uppercase tracking-widest text-[11px] h-11 w-full bg-indigo-50/20"
            >
              Configure Tag Templates
            </Button>
         </div>
      </div>

      <DepreciationScheduleModal 
        isOpen={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        asset={selectedAsset || null}
        salvageValue={salvageValue}
        usefulLife={usefulLife}
      />

      <AssetDisposalModal 
        isOpen={isDisposalOpen}
        onOpenChange={setIsDisposalOpen}
        asset={selectedAsset || null}
        onConfirm={onConfirmDisposal}
      />

      <AssetTagModal 
        isOpen={isTagModalOpen}
        onOpenChange={setIsTagModalOpen}
        asset={selectedAsset || null}
        template={activeTemplate}
      />

      <TagTemplateConfigModal 
        isOpen={isConfigModalOpen}
        onOpenChange={setIsConfigModalOpen}
        activeTemplate={activeTemplate}
        onSelect={(tpl) => {
          setActiveTemplate(tpl);
          setIsConfigModalOpen(false);
          setIsTagModalOpen(true);
        }}
      />
    </div>
  );
}

