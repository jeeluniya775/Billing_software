import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Asset } from '@/types/asset';
import { 
  Trash2, AlertCircle, CheckCircle2, ShieldAlert, FileText, 
  Settings, User, MapPin, Calculator, Loader2 
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface AssetDisposalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  onConfirm: (disposalData: any) => Promise<void>;
}

export function AssetDisposalModal({ 
  isOpen, onOpenChange, asset, onConfirm 
}: AssetDisposalModalProps) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('END_OF_LIFE');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!asset) return null;

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      await onConfirm({ reason, notes });
      setStep(3); // Show Success
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after some time to animation can finish
    setTimeout(() => {
      setStep(1);
      setReason('END_OF_LIFE');
      setNotes('');
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-[32px] p-0 shadow-2xl overflow-hidden">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DialogHeader className="p-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-rose-100 dark:bg-rose-900/40 rounded-2xl flex items-center justify-center text-rose-600">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Security Verification</DialogTitle>
                  <DialogDescription className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Pre-Disposal Financial Check</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="p-8 pt-0 space-y-6">
              <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 space-y-4">
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">Target Asset</p>
                   <Badge variant="outline" className="text-[9px] font-black uppercase text-rose-500 border-rose-100 bg-rose-50/50">Irreversible</Badge>
                </div>
                <h3 className="text-base font-black text-neutral-900 dark:text-white uppercase">{asset.name}</h3>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                  <div>
                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Current Value</p>
                    <p className="text-sm font-black text-indigo-600">${asset.currentValue?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Book Value Status</p>
                    {asset.currentValue > 0 ? (
                      <p className="text-xs font-black text-rose-500 tracking-tight uppercase">Partial Value-Loss</p>
                    ) : (
                      <p className="text-xs font-black text-emerald-600 tracking-tight uppercase">Fully Depreciated</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5" />
                <p className="text-[11px] font-medium text-rose-900 dark:text-rose-300 leading-relaxed">
                  Disposing of this asset will remove it from active inventory and record an accounting write-off of <b>${asset.currentValue?.toLocaleString() || '0'}</b>. This action cannot be reversed.
                </p>
              </div>

              <Button 
                onClick={() => setStep(2)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 shadow-lg shadow-rose-600/20"
              >
                Proceed to Disposal Form
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <DialogHeader className="p-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-neutral-100 dark:bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-600">
                   <FileText className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Disposal Documentation</DialogTitle>
                  <DialogDescription className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Record disposal reason and details</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="p-8 pt-0 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-1">Disposal Reason</label>
                   <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger className="h-12 bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 font-bold">
                        <SelectValue placeholder="Select Reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="END_OF_LIFE">End of Useful Life / Obsolete</SelectItem>
                        <SelectItem value="SCRAPPED">Damaged beyond Repair</SelectItem>
                        <SelectItem value="SOLD">Asset Resale / Liquidation</SelectItem>
                        <SelectItem value="DONATED">Philanthropic Donation</SelectItem>
                        <SelectItem value="LOST">Lost or Stolen Record</SelectItem>
                      </SelectContent>
                   </Select>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-1">Internal Notes</label>
                   <Input 
                      placeholder="Enter specific details for the registrar..." 
                      className="h-24 bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 font-medium"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="font-black uppercase tracking-widest text-[10px] h-12">Back</Button>
                <Button 
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 shadow-xl"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Confirm & Retire
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in zoom-in-95 duration-500 overflow-hidden">
            <div className="p-12 text-center space-y-6">
               <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Disposal Complete</h3>
                  <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mt-2">{asset.name} has been retired.</p>
               </div>
               <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 space-y-1 text-left">
                  <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest px-1">Confirmation Details</p>
                  <div className="flex justify-between items-center text-[11px] font-bold text-emerald-900 dark:text-emerald-200">
                    <span>Write-off Value:</span>
                    <span>${asset.currentValue?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-emerald-900 dark:text-emerald-200">
                    <span>Reference ID:</span>
                    <span className="uppercase">{asset.id.slice(0, 8)}</span>
                  </div>
               </div>
               <Button onClick={handleClose} className="w-full bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 rounded-2xl">Close Window</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
