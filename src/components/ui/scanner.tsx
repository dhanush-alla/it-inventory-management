import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeScanType, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Camera, 
  CameraOff, 
  Loader2, 
  RefreshCw, 
  Smartphone, 
  SwitchCamera, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface ScannerProps {
  onScanResult: (data: string) => void;
  className?: string;
  isLoading?: boolean;
}

export function Scanner({ onScanResult, className, isLoading = false }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraDetectionAttempted, setCameraDetectionAttempted] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);
  const scannerId = 'qr-scanner-element';
  
  // Create a hidden div that's always in the DOM for scanner initialization
  const hiddenScannerId = 'qr-scanner-hidden';
  
  // Initialize scanner when component mounts
  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);
  
  // Detect available cameras
  const detectCameras = async () => {
    setError(null);
    setCameraDetectionAttempted(true);
    
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        setSelectedCamera(devices[0].id);
        setHasCameraPermission(true);
      } else {
        setCameras([]);
        setHasCameraPermission(false);
        setError('No cameras detected on your device.');
      }
    } catch (err) {
      console.error('Error getting cameras:', err);
      setCameras([]);
      setHasCameraPermission(false);
      setError('Failed to access cameras. Please ensure camera permissions are enabled in your browser settings.');
    }
  };
  
  // Function to start scanning using device camera
  const startScanner = async () => {
    setError(null);
    
    if (!cameraDetectionAttempted) {
      await detectCameras();
    }
    
    if (!selectedCamera) {
      setError('No camera selected. Please select a camera or ensure camera permissions are enabled.');
      return;
    }
    
    // First, make sure we set isScanning so that the UI will show the scanner element
    setIsScanning(true);
    
    // Wait for the next render cycle to ensure the element exists in the DOM
    setTimeout(async () => {
      const scannerElement = document.getElementById(scannerId);
      
      if (!scannerElement) {
        setError('Scanner initialization failed. Please try again.');
        setIsScanning(false);
        return;
      }
      
      try {
        // Clear previous instance if exists
        if (scannerRef.current) {
          await scannerRef.current.clear();
        }
        
        // Initialize new scanner
        scannerRef.current = new Html5Qrcode(scannerId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_128
          ],
          verbose: false
        });
        
        if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop();
        }
        
        await scannerRef.current.start(
          selectedCamera,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.CODE_128
            ],
            scanType: Html5QrcodeScanType.SCAN_TYPE_CAMERA
          },
          (decodedText) => {
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Don't display transient errors to user
            console.warn(errorMessage);
          }
        );
      } catch (err) {
        console.error('Error starting scanner:', err);
        setError('Failed to start camera. Please ensure camera permissions are enabled and try again.');
        setHasCameraPermission(false);
        setIsScanning(false);
      }
    }, 100); // Give 100ms for the DOM to update
  };
  
  // Function to stop the scanner
  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };
  
  // Handle successful scan
  const handleScanSuccess = (decodedText: string) => {
    onScanResult(decodedText);
    stopScanner();
  };
  
  // Handle manual input submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanResult(manualInput.trim());
      setManualInput('');
    }
  };
  
  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardContent className="p-6">
        {/* Camera selection */}
        {cameras.length > 0 && !isScanning && (
          <div className="mb-4">
            <Label htmlFor="camera-select" className="mb-2 block">Select Camera</Label>
            <div className="flex gap-2">
              <Select
                value={selectedCamera || ''}
                onValueChange={(value) => setSelectedCamera(value)}
                disabled={isLoading || isScanning}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  {cameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      {camera.label || `Camera ${camera.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={detectCameras}
                      disabled={isLoading || isScanning}
                    >
                      <RefreshCw size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh camera list</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
        
        {/* Scanner area */}
        {isScanning && (
          <div className="relative mb-4">
            <div 
              id={scannerId} 
              ref={scannerDivRef} 
              className="w-full h-64 mx-auto overflow-hidden rounded-md bg-muted"
            ></div>
            <div className="absolute top-2 right-2 flex gap-1">
              {cameras.length > 1 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="bg-black/20 hover:bg-black/40 text-white rounded-full"
                        onClick={detectCameras}
                        disabled={isLoading}
                      >
                        <SwitchCamera size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Switch camera</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/20 hover:bg-black/40 text-white rounded-full"
                onClick={stopScanner}
                disabled={isLoading}
              >
                <X size={18} />
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 mx-auto text-center">
              <div className="inline-block bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                Position QR code or barcode in the center
              </div>
            </div>
          </div>
        )}
        
        {!isScanning && (
          <div className="space-y-4 py-2">
            <div className="text-center mb-4">
              <Button 
                onClick={
                  hasCameraPermission === false && cameraDetectionAttempted
                    ? detectCameras
                    : startScanner
                }
                className="w-full"
                type="button"
                disabled={isLoading}
                variant={hasCameraPermission === false ? "destructive" : "default"}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : hasCameraPermission === false ? (
                  <CameraOff className="mr-2 h-4 w-4" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                {isLoading 
                  ? "Processing..." 
                  : hasCameraPermission === false 
                    ? "Camera Access Blocked"
                    : "Scan QR Code/Barcode"
                }
              </Button>
              
              {hasCameraPermission === false && (
                <p className="text-xs text-muted-foreground mt-1">
                  Click to try again or use manual entry below
                </p>
              )}
            </div>
            
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">or enter code manually</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            </div>
            
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manualInput">Asset Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="manualInput"
                    placeholder="Enter asset code"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    variant="secondary"
                    disabled={isLoading || !manualInput.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Smartphone className="mr-2 h-4 w-4" />
                    )}
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Scanner;
