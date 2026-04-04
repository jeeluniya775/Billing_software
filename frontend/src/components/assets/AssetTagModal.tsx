import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, X, Download, QrCode as QrIcon, Loader2, Tag as TagIcon, Layout } from 'lucide-react';
import { Asset } from '@/types/asset';
import QRCode from 'qrcode';
import { TagTemplate } from './TagTemplateConfigModal';
import { cn } from '@/lib/utils';

interface AssetTagModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  template?: TagTemplate;
}

export function AssetTagModal({ isOpen, onOpenChange, asset, template = 'standard-qr' }: AssetTagModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (asset && isOpen && template === 'standard-qr') {
      generateQR();
    }
  }, [asset, isOpen, template]);

  const generateQR = async () => {
    if (!asset) return;
    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(asset.id, {
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('QR Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Simple Barcode Generator (Mock/SVG based for Code128-ish look)
  const BarcodeSvg = useMemo(() => {
    if (!asset) return null;
    const id = asset.id.slice(0, 8).toUpperCase();
    return (
      <svg className="h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="30" fill="white" />
        {/* Simple mock barcode patterns */}
        {id.split('').map((char, i) => {
          const code = char.charCodeAt(0);
          return (
            <g key={i} transform={`translate(${i * 12 + 2}, 0)`}>
              <rect x="0" y="2" width={code % 3 + 1} height="20" fill="black" />
              <rect x="4" y="2" width={code % 2 + 1} height="20" fill="black" />
              <rect x="8" y="2" width={code % 4 + 1} height="20" fill="black" />
            </g>
          );
        })}
        <text x="50" y="28" fontSize="4" textAnchor="middle" fontWeight="bold" fontFamily="monospace">{id}</text>
      </svg>
    );
  }, [asset]);

  if (!asset) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=900,height=650');
    if (windowPrint && printContent) {
      const dimensions = template === 'thermal-barcode' ? 'width: 4in; height: 2in;' : 'width: 4in; height: 2.5in;';
      windowPrint.document.write(`
        <html>
          <head>
            <title>Asset Tag - ${asset.name}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                .no-print { display: none; }
                .asset-tag { 
                  ${dimensions}
                  margin: 0; 
                  border: 2px solid #000;
                  padding: 15px;
                  font-family: sans-serif;
                }
              }
            </style>
          </head>
          <body>
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
              ${printContent.innerHTML}
            </div>
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      windowPrint.document.close();
    }
  };

  const getTemplateIcon = () => {
    switch(template) {
      case 'standard-qr': return <QrIcon className="h-6 w-6 text-indigo-600" />;
      case 'thermal-barcode': return <TagIcon className="h-6 w-6 text-emerald-600" />;
      case 'asset-badge': return <Layout className="h-6 w-6 text-amber-600" />;
      default: return <QrIcon className="h-6 w-6 text-indigo-600" />;
    }
  };

  const getTemplateTitle = () => {
     switch(template) {
      case 'standard-qr': return 'Standard QR Label';
      case 'thermal-barcode': return 'Thermal Sticker XL';
      case 'asset-badge': return 'Asset Identification Badge';
      default: return 'Asset Physical Tag';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-[32px] overflow-hidden p-0">
        <DialogHeader className="p-8 pb-0 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3 text-neutral-900 dark:text-white">
              {getTemplateIcon()}
              {getTemplateTitle()}
            </DialogTitle>
            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mt-1">Ready for physical inventorying</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="p-8 space-y-8">
          {/* Tag Preview Area */}
          <div className="flex justify-center">
            <div 
              ref={printRef}
              className={cn(
                "asset-tag bg-white border-2 border-neutral-900 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden transition-all duration-500",
                template === 'thermal-barcode' ? "w-[360px] h-[160px]" : "w-[320px] h-[200px]",
                template === 'asset-badge' ? "w-[240px] h-[340px]" : ""
              )}
            >
              {template !== 'asset-badge' ? (
                <>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] leading-none mb-1">Corporate Asset</p>
                      <h3 className="text-sm font-black text-neutral-950 truncate max-w-[150px] uppercase leading-tight">{asset.name}</h3>
                      <p className="text-[8px] font-bold text-neutral-500 italic mt-1">{asset.category}</p>
                    </div>
                    <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                       <div className="h-4 w-4 border-t-2 border-l-2 border-white" />
                    </div>
                  </div>

                  <div className="flex justify-center flex-grow items-center">
                    {template === 'standard-qr' ? (
                      isGenerating ? (
                        <Loader2 className="h-10 w-10 animate-spin text-neutral-200" />
                      ) : (
                        <img src={qrCodeUrl} alt="QR" className="h-24 w-24 bg-neutral-50 p-1 border border-neutral-100 rounded-lg" />
                      )
                    ) : (
                      <div className="w-full h-16">{BarcodeSvg}</div>
                    )}
                  </div>

                  <div className="flex justify-between items-end pt-2 border-t border-neutral-900/10">
                    <div className="space-y-0.5">
                      <p className="text-[7px] font-black text-neutral-400 uppercase tracking-widest leading-none">Serial</p>
                      <p className="text-[9px] font-black text-neutral-900 uppercase">{asset.serialNumber || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[7px] font-black text-neutral-400 uppercase tracking-widest leading-none">Asset ID</p>
                       <p className="text-[9px] font-black text-indigo-600">{asset.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full items-center text-center py-4">
                   <div className="h-12 w-full bg-neutral-900 mb-6 flex items-center justify-center">
                      <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">SECURE ASSET</p>
                   </div>
                   
                   <div className="mb-6">
                      {isGenerating ? <Loader2 className="animate-spin" /> : <img src={qrCodeUrl} className="h-24 w-24" alt="QR" />}
                   </div>

                   <h3 className="text-lg font-black text-neutral-950 uppercase leading-tight mb-2">{asset.name}</h3>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{asset.category}</p>
                      <p className="text-[10px] font-black text-indigo-600 uppercase">ID: {asset.id.slice(0, 12).toUpperCase()}</p>
                   </div>

                   <div className="mt-auto pt-4 border-t border-dashed border-neutral-200 w-full">
                      <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Property of Corporate Engineering</p>
                   </div>
                </div>
              )}

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-neutral-900 rotate-45 translate-x-8 -translate-y-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-neutral-200 dark:border-neutral-800 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center gap-2"
                onClick={() => {
                  if (template === 'standard-qr') window.open(qrCodeUrl, '_blank');
                }}
             >
                <Download className="h-4 w-4" /> Export Asset
             </Button>
             <Button 
                className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                onClick={handlePrint}
             >
                <Printer className="h-4 w-4" /> Print Tag
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
