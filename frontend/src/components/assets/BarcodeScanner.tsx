'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, CameraOff, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const currentCameraIndex = useRef(0);
  const availableCameras = useRef<{ id: string, label: string }[]>([]);

  const startScanning = async (cameraId: string) => {
    if (!scannerRef.current) return;
    
    setIsInitializing(true);
    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }

      await scannerRef.current.start(
        cameraId,
        {
          fps: 20, // Increased FPS for faster detection
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdge * 0.7);
            return { width: qrboxSize, height: qrboxSize };
          },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          onScan(decodedText);
          onClose();
        },
        (errorMessage) => {
          // Normal noise during scan
        }
      );
      setError(null);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setError("Failed to access camera. Please ensure permissions are granted.");
    } finally {
      setIsInitializing(false);
    }
  };

  const switchCamera = async () => {
    if (availableCameras.current.length < 2) return;
    currentCameraIndex.current = (currentCameraIndex.current + 1) % availableCameras.current.length;
    await startScanning(availableCameras.current[currentCameraIndex.current].id);
  };

  useEffect(() => {
    const scannerId = "qr-reader";
    const html5QrCode = new Html5Qrcode(scannerId, { 
      formatsToSupport: [ 
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E
      ] 
    });
    scannerRef.current = html5QrCode;

    const init = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          availableCameras.current = devices;
          setHasMultipleCameras(devices.length > 1);
          
          // Prefer back camera
          const backIdx = devices.findIndex(d => d.label.toLowerCase().includes('back'));
          currentCameraIndex.current = backIdx !== -1 ? backIdx : 0;
          
          await startScanning(devices[currentCameraIndex.current].id);
        } else {
          setError("No cameras found on this device.");
          setIsInitializing(false);
        }
      } catch (err) {
        console.error("Initialization failed:", err);
        setError("Camera access was denied.");
        setIsInitializing(false);
      }
    };

    const timer = setTimeout(init, 300);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-emerald-600 text-white">
          <div className="flex flex-col">
            <h3 className="font-black uppercase tracking-widest text-[10px]">Smart Scanner</h3>
            <p className="text-[10px] text-emerald-100 font-bold opacity-80">QR / BARCODE / SKU</p>
          </div>
          <div className="flex items-center gap-2">
            {hasMultipleCameras && !error && (
              <button 
                onClick={switchCamera}
                className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/40 transition-colors"
                title="Switch Camera"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={onClose} 
              className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/40 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <div id="qr-reader" className="w-full h-full"></div>
          
          {isInitializing && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/50 backdrop-blur-sm z-30">
              <Zap className="h-8 w-8 text-emerald-500 animate-pulse mb-3" />
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Initializing Optic...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-neutral-50 dark:bg-neutral-900 z-40">
              <div className="h-16 w-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mb-4">
                <CameraOff className="h-8 w-8" />
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{error}</p>
              <p className="text-xs text-neutral-400">Please check your browser settings and try again.</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-xl border-neutral-200"
                onClick={onClose}
              >
                Go Back
              </Button>
            </div>
          )}

          {!error && !isInitializing && (
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan-line pointer-events-none z-20" />
          )}
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 text-center space-y-2">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            {error ? "Scanner Disabled" : isInitializing ? "Awaiting Camera..." : "Scanning in progress..."}
          </p>
          <p className="text-[9px] text-neutral-400 font-medium leading-relaxed">
            {error ? "Please enable camera access in your browser settings to use this feature." : "Align the code within the frame to capture it automatically."}
          </p>
        </div>
      </div>

      <style jsx global>{`
        #qr-reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
        @keyframes scan-line {
          0% { top: 10% }
          100% { top: 90% }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
