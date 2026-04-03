'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Scan, Activity } from 'lucide-react';
import { Asset } from '@/types/asset';
import { assetService } from '@/services/asset.service';
import { getEmployees } from '@/services/team.service';
import { Employee } from '@/types/team';
import { BarcodeScanner } from './BarcodeScanner';

interface AssetFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  asset?: Asset | null;
}

export function AssetFormModal({ isOpen, onOpenChange, onSuccess, asset }: AssetFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<Partial<Asset>>({
    name: '',
    category: 'IT Equipment',
    purchaseCost: 0,
    currentValue: 0,
    location: '',
    serialNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    assignedTo: 'none',
    lastMaintenanceDate: '',
    maintenanceCost: 0,
    maintenanceNotes: '',
    nextServiceDate: ''
  });
  const [baseValueForService, setBaseValueForService] = useState(0);

  const isEdit = !!asset;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        category: asset.category,
        purchaseCost: asset.purchaseCost,
        currentValue: asset.currentValue,
        location: asset.location,
        serialNumber: asset.serialNumber,
        purchaseDate: asset.purchaseDate,
        status: asset.status?.toUpperCase() as any,
        assignedTo: asset.assignedTo || 'none',
        lastMaintenanceDate: asset.lastMaintenanceDate || '',
        maintenanceCost: asset.maintenanceCost || 0,
        maintenanceNotes: asset.maintenanceNotes || '',
        nextServiceDate: asset.nextServiceDate || ''
      });
      setBaseValueForService(asset.currentValue);
    } else {
      setFormData({
        name: '',
        category: 'IT Equipment',
        purchaseCost: 0,
        currentValue: 0,
        location: '',
        serialNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        assignedTo: 'none',
        lastMaintenanceDate: '',
        maintenanceCost: 0,
        maintenanceNotes: '',
        nextServiceDate: ''
      });
      setBaseValueForService(0);
    }
  }, [asset, isOpen]);

  const handleSubmit = async () => {
    if (!formData.name) return;
    setIsSubmitting(true);
    try {
      const dataToSave: any = {
        ...formData,
        assignedTo: formData.assignedTo === 'none' ? '' : formData.assignedTo,
        status: formData.status
      };

      // Remove empty date strings to avoid backend validation errors
      if (!dataToSave.lastMaintenanceDate) delete dataToSave.lastMaintenanceDate;
      if (!dataToSave.nextServiceDate) delete dataToSave.nextServiceDate;
      if (!dataToSave.purchaseDate) delete dataToSave.purchaseDate;
      
      if (isEdit && asset?.id) {
        await assetService.updateAsset(asset.id, dataToSave);
      } else {
        await assetService.createAsset(dataToSave);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(isEdit ? 'Failed to update asset:' : 'Failed to create asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScanSuccess = (code: string) => {
    setFormData(prev => ({ ...prev, serialNumber: code }));
    setIsScannerOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] border-none shadow-2xl bg-white dark:bg-neutral-900 rounded-[2rem] overflow-hidden p-0">
          <div className={`${isEdit ? 'bg-indigo-600' : 'bg-emerald-600'} p-8 text-white relative overflow-hidden`}>
            <DialogHeader className="relative z-10">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                {isEdit ? 'Update Asset' : 'Register New Asset'}
              </DialogTitle>
              <DialogDescription className={`${isEdit ? 'text-indigo-100' : 'text-emerald-100'} font-medium`}>
                {isEdit 
                  ? 'Modify existing asset details and tracking information.' 
                  : 'Initialize tracking for your company hardware and furniture.'}
              </DialogDescription>
            </DialogHeader>
            <div className={`absolute -right-20 -top-20 w-64 h-64 ${isEdit ? 'bg-indigo-400/20' : 'bg-emerald-400/20'} rounded-full blur-3xl`} />
          </div>
          
          <div className="max-h-[65vh] overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Asset Name</label>
                <Input 
                  placeholder="e.g. MacBook Pro M3" 
                  className="h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-bold px-4" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Category</label>
                <Select 
                  value={formData.category}
                  onValueChange={(v) => setFormData({...formData, category: v as any})}
                >
                  <SelectTrigger className="h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-bold px-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-xl shadow-xl">
                    <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                    <SelectItem value="Machinery">Machinery</SelectItem>
                    <SelectItem value="Vehicles">Vehicles</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Purchase Cost (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
                  <Input 
                    type="number" 
                    className="h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-black pl-8" 
                    value={formData.purchaseCost}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev, 
                        purchaseCost: val, 
                        currentValue: isEdit ? prev.currentValue : val
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Current Value (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
                  <Input 
                    type="number" 
                    className="h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-black pl-8" 
                    value={formData.currentValue}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setFormData({...formData, currentValue: val});
                      setBaseValueForService(val);
                    }}
                  />
                </div>
              </div>
            </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Serial Number</label>
              <div className="relative group">
                <Input 
                  placeholder="SN-XXXXX-XXXX" 
                  className="h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-mono uppercase font-bold pl-4 pr-12" 
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                  <Scan className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {/* Optional: Add more fields here later */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Primary Location</label>
              <Input 
                placeholder="e.g. Rajkot Office, Floor 3" 
                className="h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-bold px-4" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Acquisition Date</label>
              <Input 
                type="date" 
                className="h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-bold px-4" 
                value={formData.purchaseDate}
                onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Currently Assigned</label>
              <Select 
                value={formData.assignedTo}
                onValueChange={(v) => setFormData({...formData, assignedTo: v})}
              >
                <SelectTrigger className="h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-bold px-4">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-xl shadow-xl">
                  <SelectItem value="none">Unassigned</SelectItem>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Asset Status</label>
              <Select 
                value={formData.status}
                onValueChange={(v) => {
                  const isNewService = (v === 'MAINTENANCE' || v === 'IN_REPAIR') && formData.status !== v;
                  const isZeroValue = v === 'LOST' || v === 'DISPOSED';
                  
                  setFormData({
                    ...formData, 
                    status: v as any,
                    ...(isNewService ? {
                      lastMaintenanceDate: '',
                      maintenanceCost: 0,
                      maintenanceNotes: '',
                      nextServiceDate: ''
                    } : {}),
                    ...(isZeroValue ? { currentValue: 0 } : {})
                  });
                }}
              >
                <SelectTrigger className="h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-bold px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-xl shadow-xl">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="IN_REPAIR">In Repair</SelectItem>
                  <SelectItem value="DISPOSED">Disposed</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(formData.status?.toUpperCase() === 'MAINTENANCE' || formData.status?.toUpperCase() === 'IN_REPAIR') && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6 p-6 bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center text-amber-600">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-[10px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-[0.2em]">
                  {formData.status === 'IN_REPAIR' ? 'Repair Details' : 'Maintenance Details'}
                </h4>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{formData.status === 'IN_REPAIR' ? 'Repair Date' : 'Service Date'}</label>
                  <Input 
                    type="date" 
                    className="h-12 bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-bold px-4" 
                    value={formData.lastMaintenanceDate}
                    onChange={(e) => setFormData({...formData, lastMaintenanceDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{formData.status === 'IN_REPAIR' ? 'Repair Cost (USD)' : 'Service Cost (USD)'}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
                    <Input 
                      type="number" 
                      className="h-12 bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-black pl-8" 
                      value={formData.maintenanceCost}
                      onChange={(e) => {
                        const cost = parseFloat(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev, 
                          maintenanceCost: cost,
                          // Use the baseline current value for more accurate impairment tracking
                          currentValue: Math.max(0, (baseValueForService || prev.purchaseCost || 0) - cost)
                        }))
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Next Service Due</label>
                  <Input 
                    type="date" 
                    className="h-12 bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-bold px-4 text-emerald-600" 
                    value={formData.nextServiceDate}
                    onChange={(e) => setFormData({...formData, nextServiceDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{formData.status === 'IN_REPAIR' ? 'Repair Notes' : 'Technical Notes'}</label>
                  <Input 
                    placeholder="Describe issues fixed..." 
                    className="h-12 bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 rounded-xl font-bold px-4" 
                    value={formData.maintenanceNotes}
                    onChange={(e) => setFormData({...formData, maintenanceNotes: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          </div>

          <DialogFooter className="p-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 rounded-b-[2rem]">
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)} 
              className="font-bold text-neutral-400 hover:text-neutral-900 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              className={`${isEdit ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'} text-white font-black uppercase tracking-widest text-xs h-12 px-10 rounded-xl shadow-lg`}
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name}
            >
              {isSubmitting ? (isEdit ? 'Updating...' : 'Registering...') : (isEdit ? 'Update Asset' : 'Complete Registration')}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>

    {isScannerOpen && (
      <BarcodeScanner 
        onScan={handleScanSuccess} 
        onClose={() => setIsScannerOpen(false)} 
      />
    )}
  </>
);
}
