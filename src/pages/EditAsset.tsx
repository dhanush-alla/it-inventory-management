import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getAssetById, updateAsset } from "@/lib/supabase-api";
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
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { format } from "date-fns";

const EditAsset = () => {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Partial<Asset>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialAsset, setInitialAsset] = useState<Asset | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch the asset to edit
  const { data: existingAsset, isLoading: assetLoading } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => getAssetById(id!),
    enabled: !!id,
  });

  // Replace any useQuery for categories with a static array:
  const staticCategories = [
    { id: 'LAPTOP', name: 'Laptop' },
    { id: 'DESKTOP', name: 'Desktop' },
    { id: 'PRINTER', name: 'Printer' },
  ];

  // Update local state when the asset data is fetched
  useEffect(() => {
    if (existingAsset) {
      setAsset(existingAsset);
      setInitialAsset(existingAsset);
    }
  }, [existingAsset]);

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

    if (!asset.categoryId) {
      toast({
        title: "Missing Category",
        description: "Please select a category for the asset",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Asset ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateAsset(id, asset);
      
      // Success message
      toast({
        title: "Asset Updated",
        description: "The asset has been successfully updated",
      });
      
      // Refresh assets data
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset", id] });
      
      // Navigate back to asset detail page
      navigate(`/assets/${id}`);
    } catch (error) {
      console.error("Error updating asset:", error);
      toast({
        title: "Error Updating Asset",
        description: "There was an error updating the asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = assetLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!existingAsset) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Asset Not Found</CardTitle>
            <CardDescription>
              The asset you're trying to edit doesn't exist or has been removed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <div onClick={() => navigate("/assets")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assets
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Asset</h1>
          <p className="text-muted-foreground">
            Update information for: {initialAsset?.name}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/assets/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
            <CardDescription>
              Update the information about this asset
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={asset.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter asset name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select 
                  value={asset.categoryId || ""}
                  onValueChange={(value) => handleSelectChange("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {staticCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
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
                value={asset.description || ""}
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
                  value={asset.manufacturer || ""}
                  onChange={handleInputChange}
                  placeholder="Enter manufacturer"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  value={asset.model || ""}
                  onChange={handleInputChange}
                  placeholder="Enter model number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  value={asset.serialNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Enter serial number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="barcodeData">Barcode</Label>
                <Input
                  id="barcodeData"
                  name="barcodeData"
                  value={asset.barcodeData || ""}
                  onChange={handleInputChange}
                  placeholder="Enter barcode data"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={asset.purchaseDate ? asset.purchaseDate.substring(0, 10) : ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  value={asset.purchasePrice?.toString() || "0"}
                  onChange={handleNumberChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={asset.status || ""}
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
                value={asset.warrantyExpiry ? asset.warrantyExpiry.substring(0, 10) : ""}
                onChange={handleInputChange}
              />
            </div>
            

          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(`/assets/${id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EditAsset; 