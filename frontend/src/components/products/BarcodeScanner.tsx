'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Camera, Upload, ShieldAlert, Loader2, ZoomIn, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const [activeTab, setActiveTab] = useState('camera');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDecodingImage, setIsDecodingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "barcode-scanner-video-container";

  // Camera Scanner Logic
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(false);

    // Wait for the container to be available in the DOM
    setTimeout(async () => {
      try {
        if (!document.getElementById(containerId)) return;

        const html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 150 }, // Aspect ratio fit for 1D barcodes
          aspectRatio: 1.777778, // 16:9
          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            onDetected(decodedText);
            stopCamera();
            onClose();
          },
          undefined // Error callback ignored (mostly frame failures)
        );

        setIsCameraActive(true);
      } catch (err: any) {
        console.error('Camera Error:', err);
        setCameraError(err.message || 'Could not access camera. Please check permissions.');
      }
    }, 100);
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      const scanner = scannerRef.current;
      scannerRef.current = null; // Prevent concurrent calls
      
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
        // Check if the container still exists before clearing
        const container = document.getElementById(containerId);
        if (container) {
          scanner.clear();
        }
      } catch (e) {
        console.warn("Html5Qrcode stop/clear failed safely:", e);
      }
    }
    setIsCameraActive(false);
  };

  // Image Upload Logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDecodingImage(true);
    setImageError(null);

    try {
      // We can use a temporary instance for image decoding
      const html5QrCode = new Html5Qrcode(containerId, { verbose: false });
      const decodedText = await html5QrCode.scanFile(file, true);
      
      if (decodedText) {
        onDetected(decodedText);
        onClose();
      }
    } catch (err) {
      console.error('Image Decode Error:', err);
      setImageError('Could not read a barcode. Make sure the photo is clear and well-lit.');
    } finally {
      setIsDecodingImage(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="camera" onValueChange={(v) => setActiveTab(v)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="h-4 w-4" /> Real-time Camera
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload Photo
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera" className="mt-4">
          <div 
            id={containerId} 
            className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 relative"
          >
            {!isCameraActive && !cameraError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 text-white flex-col gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                <p className="text-sm">Accessing Camera...</p>
              </div>
            )}
            
            {cameraError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 text-white flex-col gap-3 p-6 text-center">
                <ShieldAlert className="h-10 w-10 text-red-500" />
                <p className="text-sm font-medium text-red-500">{cameraError}</p>
                <Button variant="outline" size="sm" onClick={startCamera}>Request Camera Access</Button>
              </div>
            )}
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <p><strong>Tip:</strong> Hold the barcode inside the region and keep it steady. If it doesn't scan, try increasing the distance slightly for focus.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="image" className="mt-4">
          <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-10 text-center hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors relative cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isDecodingImage}
            />
            
            {isDecodingImage ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                <p className="text-sm font-medium">Analyzing Image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-neutral-400" />
                <p className="text-sm font-medium">Pick a photo from gallery</p>
                <p className="text-xs text-neutral-500">Supports EAN, SKU, UPC & QR</p>
              </div>
            )}
          </div>
          
          {imageError && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {imageError}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end pt-2 border-t mt-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <style jsx global>{`
        #barcode-scanner-video-container video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 8px !important;
        }
        #barcode-scanner-video-container #qr-shaded-region {
          border-radius: 8px !important;
          border: 40px solid rgba(0, 0, 0, 0.48) !important;
        }
      `}</style>
    </div>
  );
}
