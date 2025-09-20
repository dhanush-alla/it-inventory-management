import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Scanner from "@/components/ui/scanner";
import { Asset } from "@/types";
import { ArrowRight, ClipboardCheck, QrCode, ShieldAlert, Camera, History } from "lucide-react";
import AssetStatusBadge from "@/components/assets/AssetStatusBadge";
import { format } from "date-fns";
import { updateAssetScanner } from "@/lib/supabase-api";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ScannerPage = () => {
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentScans, setRecentScans] = useState<Asset[]>([]);
  const { toast } = useToast();

  const handleScan = async (data: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const asset = await updateAssetScanner(data);
      
      if (asset) {
        setScannedAsset(asset);
        // Add to recent scans without duplicates
        setRecentScans(prev => {
          const existing = prev.find(a => a.id === asset.id);
          if (existing) {
            return [asset, ...prev.filter(a => a.id !== asset.id)];
          } else {
            return [asset, ...prev].slice(0, 5); // Keep last 5 scans
          }
        });
        
        toast({
          title: "Asset Found",
          description: `Successfully located: ${asset.name}`,
        });
      } else {
        setScannedAsset(null);
        setError(`No asset found with code: ${data}`);
        toast({
          variant: "destructive",
          title: "Asset Not Found",
          description: `No asset matches code: ${data}`,
        });
      }
    } catch (err) {
      console.error("Error scanning asset:", err);
      setScannedAsset(null);
      setError(`Error scanning: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        variant: "destructive",
        title: "Scan Error",
        description: "Failed to process the scan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recentScansEmpty = recentScans.length === 0;
  
  // Function to switch to scanner tab
  const switchToScannerTab = () => {
    const scannerTab = document.querySelector('[data-value="scanner"]') as HTMLElement;
    if (scannerTab) {
      scannerTab.click();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Asset Scanner</h1>
        <p className="text-muted-foreground">
          Scan QR codes or barcodes to quickly find and manage assets
        </p>
      </div>
      
      <Tabs defaultValue="scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="scanner" className="flex items-center">
            <Camera className="mr-2 h-4 w-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            Recent Scans
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scanner" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Scanner onScanResult={handleScan} isLoading={isLoading} />
              
              {error && (
                <Card className="mt-4 border-destructive">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-destructive">
                      <ShieldAlert className="mr-2 h-5 w-5" />
                      Asset Not Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{error}</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {scannedAsset && (
              <Card className="border-primary/50 fade-in">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{scannedAsset.name}</CardTitle>
                      <CardDescription>{scannedAsset.manufacturer} {scannedAsset.model}</CardDescription>
                    </div>
                    <AssetStatusBadge status={scannedAsset.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Serial Number</p>
                      <p className="text-sm text-muted-foreground">{scannedAsset.serialNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Purchase Date</p>
                      <p className="text-sm text-muted-foreground">
                        {scannedAsset.purchaseDate ? format(new Date(scannedAsset.purchaseDate), 'MMM d, yyyy') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {scannedAsset.notes && (
                    <div>
                      <p className="text-sm font-medium mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{scannedAsset.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center p-3 bg-muted/50 rounded-md">
                    <QrCode className="text-primary h-5 w-5 mr-2" />
                    <span className="text-sm font-mono">{scannedAsset.barcodeData}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link to={`/assets/${scannedAsset.id}/edit`}>
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to={`/assets/${scannedAsset.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>How to Use the Scanner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>You can quickly look up assets by scanning their QR code or barcode using your device's camera.</p>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>Click the <strong>"Scan QR Code/Barcode"</strong> button to access your camera</li>
                <li>If prompted, <strong>allow camera access</strong> in your browser</li>
                <li>Position the QR code or barcode within the scanning area</li>
                <li>Hold steady until the code is detected</li>
                <li>The asset information will appear when successfully scanned</li>
              </ol>
              <div className="bg-muted p-3 rounded-md mt-3">
                <p className="text-sm font-medium mb-1">💡 Tips:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Ensure good lighting for better scanning results</li>
                  <li>Try different distances if scanning fails</li>
                  <li>For multiple cameras, use the dropdown to select the best one</li>
                  <li>You can manually enter the code if scanning doesn't work</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Recently Scanned Assets
              </CardTitle>
              <CardDescription>
                View assets you've recently scanned in this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentScansEmpty ? (
                <div className="text-center py-6">
                  <QrCode className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No assets have been scanned yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={switchToScannerTab}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Go to Scanner
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {recentScans.map(asset => (
                    <div key={asset.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {asset.manufacturer} {asset.model}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground mt-1">
                          {asset.barcodeData}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <AssetStatusBadge status={asset.status} />
                        <Button size="sm" asChild>
                          <Link to={`/assets/${asset.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScannerPage;
