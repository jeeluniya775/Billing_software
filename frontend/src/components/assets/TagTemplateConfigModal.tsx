import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  QrCode as QrIcon, Tag, CreditCard, Check, Settings2, Sparkles, Printer, Layout
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type TagTemplate = 'standard-qr' | 'thermal-barcode' | 'asset-badge';

interface TagTemplateConfigModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeTemplate: TagTemplate;
  onSelect: (template: TagTemplate) => void;
}

export function TagTemplateConfigModal({ 
  isOpen, onOpenChange, activeTemplate, onSelect 
}: TagTemplateConfigModalProps) {
  
  const templates = [
    {
      id: 'standard-qr' as TagTemplate,
      name: 'Standard QR Label',
      description: 'Ideal for small hardware and accessories. High data capacity.',
      icon: <QrIcon className="h-6 w-6" />,
      color: 'bg-indigo-100 text-indigo-600',
      badge: 'Bestseller'
    },
    {
      id: 'thermal-barcode' as TagTemplate,
      name: 'Thermal Sticker XL',
      description: 'Optimized for thermal printers. 1D Barcode for legacy scanners.',
      icon: <Tag className="h-6 w-6" />,
      color: 'bg-emerald-100 text-emerald-600',
      badge: 'Legacy'
    },
    {
      id: 'asset-badge' as TagTemplate,
      name: 'Asset Badge',
      description: 'A large, vertical format for heavy machinery and vehicles.',
      icon: <Layout className="h-6 w-6" />,
      color: 'bg-amber-100 text-amber-600',
      badge: 'New'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-[32px] p-0 shadow-2xl overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600">
               <Settings2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Label Template Library</DialogTitle>
              <DialogDescription className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Configure physical tagging formats</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 pt-0 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div 
                key={tpl.id}
                onClick={() => onSelect(tpl.id)}
                className={cn(
                  "p-6 rounded-3xl border-2 transition-all cursor-pointer relative group overflow-hidden",
                  activeTemplate === tpl.id 
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20" 
                    : "border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 hover:border-neutral-200 dark:hover:border-neutral-700"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", tpl.color)}>
                    {tpl.icon}
                  </div>
                  {activeTemplate === tpl.id && (
                    <div className="h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase mb-1">{tpl.name}</h3>
                <p className="text-[11px] font-bold text-neutral-500 leading-relaxed mb-4">{tpl.description}</p>
                
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white dark:bg-neutral-900 rounded-lg py-0.5">
                   {tpl.badge}
                </Badge>

                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-200/10 dark:bg-neutral-800/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-indigo-600/10 transition-all" />
              </div>
            ))}

            <div className="p-6 rounded-3xl border-2 border-dashed border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-center text-center p-8">
               <div className="h-10 w-10 bg-neutral-50 dark:bg-neutral-900 rounded-xl flex items-center justify-center text-neutral-300 mb-4">
                  <Sparkles className="h-6 w-6" />
               </div>
               <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Custom Format</p>
               <p className="text-[9px] font-bold text-neutral-500 mt-1 italic">Request additional printer-specific templates from the support team.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
             <div className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-neutral-400" />
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Recommended Gear: Zebra ZD410</p>
             </div>
             <Button 
                onClick={() => onOpenChange(false)}
                className="bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white font-black uppercase tracking-[0.2em] text-[10px] h-11 px-8 rounded-2xl shadow-xl"
             >
                Confirm Selection
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
