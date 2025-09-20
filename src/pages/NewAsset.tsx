import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCategories, createAsset } from "@/lib/supabase-api";
import { Asset, AssetStatus } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, RefreshCcw, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

// Function to generate a random 11-digit number
const generateRandomBarcode = () => {
  return Math.floor(10000000000 + Math.random() * 90000000000).toString();
};

const NewAsset = () => {
  const { isManager } = useAuth();
  const [asset, setAsset] = useState<Partial<Asset>>({
    name: "",
    description: "",
    category: "",
    manufacturer: "",
    model: "",
    manufactured: format(new Date(), "yyyy-MM-dd"),
    assetExpenditure: 0,
    status: AssetStatus.AVAILABLE,
    barcodeData: generateRandomBarcode(),
    warrantyExpiry: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check authorization
  useEffect(() => {
    if (!isManager) {
      toast({
        title: "Access Denied",
        description: "Only managers can create new assets",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [isManager, navigate, toast]);

  // If not authorized, don't render the form
  if (!isManager) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <CardTitle className="text-xl mb-2">Access Restricted</CardTitle>
        <CardDescription className="mb-6">
          Only managers are authorized to create new assets.
        </CardDescription>
        <Button onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </Button>
      </Card>
    );
  }

  // Add static categories:
  const staticCategories = [
    { id: 'LAPTOP', name: 'Laptop' },
    { id: 'DESKTOP', name: 'Desktop' },
    { id: 'PRINTER', name: 'Printer' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAsset((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setAsset((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAsset((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const regenerateBarcode = () => {
    setAsset(prev => ({ ...prev, barcodeData: generateRandomBarcode() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!asset.name) {
      toast({
        title: "Missing Asset Name",
        description: "Please enter a name for the asset",
        variant: "destructive",
      });
      return;
    }

    if (!asset.category) {
      toast({
        title: "Missing Category",
        description: "Please select a category for the asset",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createAsset(asset);
      
      // Success message
      toast({
        title: "Asset Created",
        description: "The asset has been successfully created",
      });
      
      // Refresh assets data
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      
      // Navigate back to assets page
      navigate("/assets");
    } catch (error) {
      console.error("Error creating asset:", error);
      toast({
        title: "Error Creating Asset",
        description: "There was an error creating the asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Asset</h1>
          <p className="text-muted-foreground">
            Enter the details for a new asset in your inventory
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/assets")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assets
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
            <CardDescription>
              Enter the basic information about this asset
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={asset.name}
                  onChange={handleInputChange}
                  placeholder="Enter asset name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={asset.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {staticCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={asset.description}
                onChange={handleInputChange}
                placeholder="Enter asset description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  value={asset.manufacturer}
                  onChange={handleInputChange}
                  placeholder="Enter manufacturer"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  value={asset.model}
                  onChange={handleInputChange}
                  placeholder="Enter model number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="barcodeData">Barcode</Label>
                <div className="flex gap-2">
                  <Input
                    id="barcodeData"
                    name="barcodeData"
                    value={asset.barcodeData}
                    onChange={handleInputChange}
                    placeholder="Barcode data"
                    readOnly
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={regenerateBarcode}
                    title="Generate new barcode"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="manufactured">Manufactured Date</Label>
                <Input
                  id="manufactured"
                  name="manufactured"
                  type="date"
                  value={asset.manufactured}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assetExpenditure">Asset Expenditure</Label>
                <Input
                  id="assetExpenditure"
                  name="assetExpenditure"
                  type="number"
                  value={asset.assetExpenditure}
                  onChange={handleNumberChange}
                  min={0}
                  step={0.01}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={asset.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AssetStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry Date</Label>
              <Input
                id="warrantyExpiry"
                name="warrantyExpiry"
                type="date"
                value={asset.warrantyExpiry || ""}
                onChange={handleInputChange}
              />
            </div>
            

          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/assets")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Asset...
                </>
              ) : (
                "Create Asset"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NewAsset; 