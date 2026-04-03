import { useState, useEffect, useRef } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, X, Download, QrCode as QrIcon, Loader2 } from 'lucide-react';
import { Asset } from '@/types/asset';
import QRCode from 'qrcode';

interface AssetTagModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

export function AssetTagModal({ isOpen, onOpenChange, asset }: AssetTagModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (asset && isOpen) {
      generateQR();
    }
  }, [asset, isOpen]);

  const generateQR = async () => {
    if (!asset) return;
    setIsGenerating(true);
    try {
      // Generate QR locally using the installed library
      const url = await QRCode.toDataURL(asset.id, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('QR Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!asset) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=900,height=650');
    if (windowPrint && printContent) {
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
                  width: 4in; 
                  height: 2.5in; 
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 shadow-2xl rounded-[32px] overflow-hidden p-0">
        <DialogHeader className="p-8 pb-0 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2 text-indigo-950 dark:text-white">
              <QrIcon className="h-6 w-6 text-indigo-600" />
              Generate Asset Tag
            </DialogTitle>
            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">Ready for physical labeling</p>
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
              className="asset-tag w-[320px] h-[200px] bg-white border-2 border-neutral-900 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] leading-none mb-1">Company Asset</p>
                  <h3 className="text-sm font-black text-neutral-950 truncate max-w-[150px] uppercase leading-tight">{asset.name}</h3>
                  <p className="text-[9px] font-bold text-neutral-500 italic mt-1">{asset.category}</p>
                </div>
                <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                   <div className="h-4 w-4 border-t-2 border-l-2 border-white" />
                </div>
              </div>

              <div className="flex justify-center flex-grow items-center">
                {isGenerating ? (
                  <Loader2 className="h-10 w-10 animate-spin text-neutral-300" />
                ) : (
                  <img 
                    src={qrCodeUrl} 
                    alt="Asset QR Code" 
                    className="h-28 w-28 bg-neutral-50 p-1 border border-neutral-100 rounded-lg"
                  />
                )}
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-neutral-900/10">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest leading-none">Serial Number</p>
                  <p className="text-[9px] font-black text-neutral-900 uppercase">{asset.serialNumber || 'N/A'}</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest leading-none">Asset ID</p>
                   <p className="text-[9px] font-black text-indigo-600">{asset.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-neutral-900 rotate-45 translate-x-8 -translate-y-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-neutral-100 dark:border-neutral-800 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center gap-2"
                onClick={() => window.open(qrCodeUrl, '_blank')}
             >
                <Download className="h-4 w-4" /> Export QR
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
