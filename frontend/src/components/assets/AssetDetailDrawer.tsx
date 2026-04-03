import { useState, useEffect } from 'react';
import { 
  X, MapPin, User, Calendar, DollarSign, Activity, 
  ShieldCheck, ShieldAlert, FileText, Tag, History,
  ExternalLink, TrendingDown, ClipboardCheck, ArrowRight,
  QrCode, UserPlus, Info, AlertTriangle, Loader2, Printer, Download
} from 'lucide-react';
import { 
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Asset, MaintenanceRecord } from '@/types/asset';
import { assetService } from '@/services/asset.service';
import { AssetTagModal } from './AssetTagModal';
import { useToast } from '@/hooks/use-toast';

interface AssetDetailDrawerProps {
  asset: Asset;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function AssetDetailDrawer({ asset, isOpen, onOpenChange, onRefresh }: AssetDetailDrawerProps) {
  const { toast } = useToast();
  const [history, setHistory] = useState<MaintenanceRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (asset?.id && isOpen) {
      loadHistory();
    }
  }, [asset?.id, isOpen]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await assetService.getMaintenanceHistory(asset.id);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleAssignAsset = async () => {
    const name = prompt('Enter employee name to assign this asset:');
    if (!name) return;

    setIsAssigning(true);
    try {
      await assetService.assignAsset(asset.id, name);
      toast({
        title: 'Asset Assigned',
        description: `Successfully assigned ${asset.name} to ${name}.`,
      });
      onRefresh?.();
    } catch (error) {
      toast({
        title: 'Assignment Failed',
        description: 'Unable to assign the asset at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const historyHtml = history.length > 0 
      ? history.map(h => `
          <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>${h.type}</span>
              <span>$${h.cost.toLocaleString()}</span>
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
              ${new Date(h.date).toLocaleDateString()} · ${h.performer || 'N/A'}
            </div>
            <div style="font-size: 11px; margin-top: 5px; font-style: italic;">"${h.description}"</div>
          </div>
        `).join('')
      : '<p style="color: #999; font-style: italic;">No service records found.</p>';

    printWindow.document.write(`
      <html>
        <head>
          <title>Asset Lifecycle Report - ${asset.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
            .header { border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title { font-size: 28px; font-weight: 900; margin: 0; color: #312e81; }
            .id { font-family: monospace; font-size: 12px; color: #666; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 10px; font-weight: 900; color: #6366f1; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; border-left: 4px solid #6366f1; padding-left: 10px; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; }
            .stat-box { background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .stat-label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; }
            .stat-value { font-size: 18px; font-weight: 800; margin-top: 5px; }
            .footer { margin-top: 50px; border-top: 1px solid #eee; pt: 20px; font-size: 10px; color: #999; text-align: center; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="no-print" style="position: fixed; top: 20px; right: 20px; display: flex; gap: 10px;">
             <button onclick="window.print()" style="padding: 10px 20px; border-radius: 8px; background: #6366f1; color: white; border: none; font-weight: bold; cursor: pointer;">Download as PDF</button>
             <button onclick="window.close()" style="padding: 10px 20px; border-radius: 8px; background: #eee; border: none; font-weight: bold; cursor: pointer;">Close</button>
          </div>

          <div class="header">
            <div>
              <h1 class="title">${asset.name}</h1>
              <p class="id">REFERENCE ID: ${asset.id}</p>
            </div>
            <div style="text-align: right">
              <div style="background: #e0f2f1; color: #00695c; padding: 5px 15px; border-radius: 20px; font-size: 10px; font-weight: 900; text-transform: uppercase;">${asset.status}</div>
              <p style="font-size: 10px; color: #999; margin-top: 5px;">Report Generated: ${new Date().toLocaleString()}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Asset Classification</div>
            <div class="grid">
              <div class="stat-box">
                <div class="stat-label">Category</div>
                <div class="stat-value">${asset.category}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Location</div>
                <div class="stat-value">${asset.location}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Department</div>
                <div class="stat-value">${asset.department}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Assigned To</div>
                <div class="stat-value">${asset.assignedTo || 'Unassigned'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Financial Valuation</div>
            <div class="grid" style="grid-template-cols: 1fr 1fr 1fr;">
              <div class="stat-box">
                <div class="stat-label">Purchase Cost</div>
                <div class="stat-value">$${asset.purchaseCost.toLocaleString()}</div>
              </div>
              <div class="stat-box" style="background: #eef2ff; border-color: #c7d2fe;">
                <div class="stat-label" style="color: #4f46e5;">Current Value</div>
                <div class="stat-value" style="color: #312e81;">$${asset.currentValue.toLocaleString()}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Valuation Diff</div>
                <div class="stat-value" style="color: ${asset.currentValue >= asset.purchaseCost ? '#059669' : '#dc2626'}">
                  ${asset.currentValue >= asset.purchaseCost ? '+' : '-'}$${Math.abs(asset.purchaseCost - asset.currentValue).toLocaleString()}
                </div>
              </div>
            </div>
            <p style="font-size: 10px; color: #94a3b8; font-style: italic; margin-top: 10px;">Depreciation Method: ${asset.depreciationMethod} · Acquired: ${new Date(asset.purchaseDate).toLocaleDateString()}</p>
          </div>

          <div class="section">
            <div class="section-title">Service & Audit History</div>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
              ${historyHtml}
            </div>
          </div>

          <div class="footer">
            BillFast Asset Management · Automated Compliance Report · Page 1 of 1
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
    }, 500);
  };

  if (!asset) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[550px] overflow-y-auto p-0 border-l-0 dark:bg-neutral-900">
        <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <Tag className="h-5 w-5" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none">Asset Lifecycle</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">ID: {asset.id}</p>
               </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => onOpenChange(false)}>
               <X className="h-4 w-4" />
            </Button>
        </div>

        <div className="p-8 space-y-10">
          {/* Main Info Section */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
               <div>
                  <h1 className="text-2xl font-black text-indigo-950 dark:text-white leading-tight">{asset.name}</h1>
                  <p className="text-neutral-500 font-medium">{asset.category} · {asset.department}</p>
               </div>
               <Badge className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border shadow-sm ${
                 asset.status === 'Active' || asset.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
               }`}>
                 {asset.status}
               </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Primary Location</p>
                  <div className="flex items-center gap-2 text-indigo-950 dark:text-white font-bold">
                     <MapPin className="h-4 w-4 text-indigo-600" />
                     {asset.location}
                  </div>
               </div>
               <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Currently Assigned</p>
                  <div className="flex items-center gap-2 text-indigo-950 dark:text-white font-bold">
                     {isAssigning ? <Loader2 className="h-4 w-4 animate-spin text-indigo-600" /> : <User className="h-4 w-4 text-indigo-600" />}
                     <span className="truncate max-w-[120px]">{asset.assignedTo || 'Unassigned'}</span>
                     <Button 
                        size="sm" 
                        variant="ghost" 
                        disabled={isAssigning}
                        onClick={handleAssignAsset}
                        className="h-6 px-1.5 text-[10px] text-indigo-600 hover:bg-indigo-50 rounded-lg ml-auto"
                      >
                        <UserPlus className="h-3 w-3" />
                      </Button>
                  </div>
               </div>
            </div>
          </section>

          {/* Financials Overview */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <DollarSign className="h-4 w-4" /> Financial Valuation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
               <div className="p-5 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-l-2xl">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Initial Cost</p>
                  <p className="text-lg font-black mt-1">${asset.purchaseCost.toLocaleString()}</p>
               </div>
               <div className="p-5 bg-indigo-50 dark:bg-indigo-900 border-y md:border-y-0 md:border-x border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest relative z-10">Current Market</p>
                  <p className="text-lg font-black text-indigo-950 dark:text-white mt-1 relative z-10">${asset.currentValue.toLocaleString()}</p>
                  <div className="absolute top-0 right-0 h-1 w-full bg-indigo-600/50" />
               </div>
               <div className={`p-5 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-r-2xl ${
                 (asset.currentValue - asset.purchaseCost) >= 0 ? 'bg-emerald-50/10' : 'bg-rose-50/10'
               }`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    (asset.currentValue - asset.purchaseCost) >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {(asset.currentValue - asset.purchaseCost) >= 0 ? 'Total App.' : 'Total Dep.'}
                  </p>
                  <p className={`text-lg font-black mt-1 ${
                    (asset.currentValue - asset.purchaseCost) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {(asset.currentValue - asset.purchaseCost) >= 0 ? '+' : '-'}${Math.abs(asset.purchaseCost - asset.currentValue).toLocaleString()}
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-neutral-500 mt-2">
               <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Acquired {new Date(asset.purchaseDate).toLocaleDateString()}</span>
               <span className="flex items-center gap-1 font-mono uppercase bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded italic">Method: {asset.depreciationMethod}</span>
            </div>
          </section>

          {/* Maintenance Hub */}
          <section className="space-y-4 pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center justify-between">
               <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> Service Record</span>
               {asset.nextServiceDate && (
                 <Badge variant="outline" className={`text-[9px] uppercase font-bold border-emerald-100 ${
                   new Date(asset.nextServiceDate) < new Date() ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700'
                 }`}>
                   {new Date(asset.nextServiceDate) < new Date() ? 'OVERDUE:' : 'Next Service:'} {new Date(asset.nextServiceDate).toLocaleDateString()}
                 </Badge>
               )}
            </h3>
            <div className="space-y-3">
               {isLoadingHistory ? (
                 <div className="p-12 flex justify-center bg-neutral-50 dark:bg-neutral-800/20 rounded-2xl">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-300" />
                 </div>
               ) : history.length > 0 ? (
                 history.slice(0, 3).map((rec, i) => (
                   <div key={rec.id} className="p-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl group hover:border-indigo-200 transition-all shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              rec.type.includes('REPAIR') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                               {rec.type.includes('REPAIR') ? <AlertTriangle className="h-4 w-4" /> : <ClipboardCheck className="h-4 w-4" />}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-gray-900 dark:text-white leading-none capitalize">{rec.type.toLowerCase()}</p>
                               <p className="text-[10px] text-neutral-400 mt-1.5 font-bold uppercase tracking-widest">{new Date(rec.date).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">${rec.cost?.toLocaleString() || '0'}</p>
                      </div>
                      <div className="text-[11px] text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/50 italic leading-relaxed">
                        "{rec.description}"
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
                    <History className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">No service history found</p>
                 </div>
               )}
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/assets/maintenance'}
              className="w-full h-11 text-[11px] font-black uppercase tracking-widest border-indigo-100 dark:border-indigo-900/50 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-all active:scale-[0.98]"
            >
              Access Maintenance Hub
            </Button>
          </section>

          {/* Insurance & Protection Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-5 bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                   <ShieldCheck className="h-4 w-4 text-emerald-600" />
                   <h4 className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">Warranty Status</h4>
                </div>
                <p className="text-lg font-black text-emerald-950 dark:text-white leading-none">Valid</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2 italic">Expires {asset.warrantyExpiry || 'N/A'}</p>
             </div>
             <div className="p-5 bg-rose-50/50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                   <ShieldAlert className="h-4 w-4 text-rose-600" />
                   <h4 className="text-[11px] font-black text-rose-800 dark:text-rose-400 uppercase tracking-widest">Insurance Policy</h4>
                </div>
                <p className="text-lg font-black text-rose-950 dark:text-white leading-none">{asset.insuranceExpiry ? 'Active' : 'Missing'}</p>
                <p className="text-[10px] text-rose-600 font-bold uppercase mt-2 italic">{asset.insuranceExpiry ? `Exp: ${asset.insuranceExpiry}` : 'Policy input required'}</p>
             </div>
          </section>

          {/* Quick Actions Footer */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-neutral-100 dark:border-neutral-800">
             <Button 
                onClick={() => setIsTagModalOpen(true)}
                className="bg-indigo-950 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] h-14 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98]"
              >
                <QrCode className="h-4 w-4 mr-2" /> Print Tag
             </Button>
             <Button 
                variant="outline" 
                onClick={handlePrintReport}
                className="border-neutral-200 dark:border-neutral-700 h-14 font-black uppercase tracking-[0.2em] text-[10px] text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all active:scale-[0.98]"
              >
                <FileText className="h-4 w-4 mr-2" /> PDF Report
             </Button>
          </div>
        </div>
      </SheetContent>

      <AssetTagModal 
        isOpen={isTagModalOpen} 
        onOpenChange={setIsTagModalOpen} 
        asset={asset} 
      />
    </Sheet>
  );
}

