
declare module 'html5-qrcode' {
  export enum Html5QrcodeScanType {
    SCAN_TYPE_CAMERA = 0,
    SCAN_TYPE_FILE = 1
  }

  export interface Html5QrcodeScannerConfig {
    fps?: number;
    qrbox?: number | { width: number; height: number };
    aspectRatio?: number;
    disableFlip?: boolean;
    formatsToSupport?: Array<any>;
    experimentalFeatures?: any;
    rememberLastUsedCamera?: boolean;
    supportedScanTypes?: Array<Html5QrcodeScanType>;
    useBarCodeDetectorIfSupported?: boolean;
    showTorchButtonIfSupported?: boolean;
    defaultZoomValueIfSupported?: number;
    scanType?: Html5QrcodeScanType;
  }

  export interface CameraDevice {
    id: string;
    label: string;
  }

  export interface Html5QrcodeConfigs {
    formatsToSupport?: Array<any>;
    experimentalFeatures?: any;
    verbose?: boolean;
    useBarCodeDetectorIfSupported?: boolean;
  }

  export class Html5Qrcode {
    constructor(elementId: string, config?: Html5QrcodeConfigs);
    
    start(
      cameraIdOrConfig: string | MediaTrackConstraints,
      configuration: Html5QrcodeScannerConfig,
      qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void,
      qrCodeErrorCallback?: (errorMessage: string, error: any) => void
    ): Promise<void>;
    
    stop(): Promise<void>;
    
    clear(): void;
    
    getRunningTrackCapabilities(): MediaTrackCapabilities;
    
    getRunningTrackSettings(): MediaTrackSettings;
    
    applyVideoConstraints(videoConstraints: MediaTrackConstraints): Promise<void>;
    
    isScanning: boolean;
  }
}
