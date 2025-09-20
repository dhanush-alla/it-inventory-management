import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import BarcodeGenerator from "@/components/ui/barcode-generator";
import QRCodeGenerator from "@/components/ui/qr-code-generator";
import AssetStatusBadge from "@/components/assets/AssetStatusBadge";
import MaintenanceLogForm from "@/components/assets/MaintenanceLogForm";
import MaintenanceLogHistory from "@/components/assets/MaintenanceLogHistory";
import { 
  ArrowLeft, 
  Calendar, 
  ClipboardCheck, 
  Coins, 
  Edit2, 
  HistoryIcon,
  Package, 
  QrCode, 
  Trash2, 
  User,
  Printer,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { Asset, AssetAssignment, Employee } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssetById, getAssetAssignments, deleteAsset, getAllProfiles, getMaintenanceLogsByDevice } from "@/lib/supabase-api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isManager } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [currentAssignment, setCurrentAssignment] = useState<{
    assignment: AssetAssignment;
    employee: Employee;
  } | null>(null);
  
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  
  const { data: asset, isLoading: assetLoading } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => getAssetById(id!),
    enabled: !!id
  });

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssetAssignments
  });

  const { data: users = [] } = useQuery({
    queryKey: ['allProfiles'],
    queryFn: getAllProfiles,
  });

  const { data: maintenanceLogs = [], isLoading: maintenanceLogsLoading } = useQuery({
    queryKey: ['maintenanceLogs', id],
    queryFn: () => getMaintenanceLogsByDevice(id!),
    enabled: !!id
  });

  const assignMutation = useMutation({
    mutationFn: async ({ userId, assetId }: { userId: string, assetId: string }) => {
      const { error } = await supabase
        .from('assignments')
        .insert({
          user_id: userId,
          device_id: assetId,
          assigned_date: new Date().toISOString(),
          status: 'Assigned',
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Asset Assigned', description: 'Asset successfully assigned.' });
      setShowAssign(false);
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to assign asset.', variant: 'destructive' });
    }
  });
  
  useEffect(() => {
    if (assignments.length > 0 && asset) {
      // Filter assignments for this asset
      const assetAssignments = assignments.filter(a => a.assetId === asset.id);
      
      // Find current assignment (no return date)
      const current = assetAssignments.find(a => !a.returnDate);
      if (current && current.employee) {
        setCurrentAssignment({
          assignment: current,
          employee: current.employee
        });
      }
    }
  }, [assignments, asset]);
  
  const handleConfirmDelete = () => {
    setConfirmDelete(true);
  };
  
  const handleDeleteAsset = async () => {
    if (!isManager || !id) {
      toast({
        title: "Permission Denied",
        description: "Only managers can delete assets",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteAsset(id);
      
      toast({
        title: "Asset Deleted",
        description: `${asset?.name} has been removed from inventory`,
      });
      
      // Invalidate the assets query to refresh the assets list
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      
      // Navigate back to assets page
      navigate('/assets');
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast({
        title: "Error",
        description: "Failed to delete the asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };
  
  const handlePrintIdentifiers = () => {
    if (printRef.current) {
      const printContent = printRef.current;
      const originalContents = document.body.innerHTML;
      const printStyles = `
        <style>
          @media print {
            body * {
              visibility: hidden;
            }
            #print-container, #print-container * {
              visibility: visible;
            }
            #print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .print-asset-info {
              margin-bottom: 20px;
              text-align: center;
            }
            .print-identifiers {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 30px;
            }
            .print-identifier {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-bottom: 20px;
            }
            .print-identifier-title {
              margin-bottom: 10px;
              font-weight: bold;
            }
            .print-identifier-value {
              margin-top: 5px;
              font-size: 12px;
            }
          }
        </style>
      `;
      
      const printableContent = `
        <div id="print-container">
          <div class="print-asset-info">
            <h2>${asset?.name}</h2>
            <p>${asset?.manufacturer || ''} ${asset?.model || ''}</p>
            <p>S/N: ${asset?.model || 'N/A'}</p>
          </div>
          <div class="print-identifiers">
            <div class="print-identifier">
              <div class="print-identifier-title">QR Code</div>
              ${printContent.querySelector('.qr-code-container')?.innerHTML || ''}
              <div class="print-identifier-value">${asset?.barcodeData || ''}</div>
            </div>
            <div class="print-identifier">
              <div class="print-identifier-title">Barcode</div>
              ${printContent.querySelector('.barcode-container')?.innerHTML || ''}
            </div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = printStyles + printableContent;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload the page to restore React state
    }
  };
  
  const isLoading = assetLoading || assignmentsLoading || maintenanceLogsLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!asset) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Asset Not Found</CardTitle>
            <CardDescription>
              The asset you're looking for doesn't exist or has been removed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/assets">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assets
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/assets">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assets
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {asset.name}
            <AssetStatusBadge status={asset.status} className="ml-2" />
          </h1>
          <p className="text-muted-foreground">
            {asset.manufacturer} {asset.model}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/assets/${id}/edit`}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          
          {isManager && (
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Asset content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Asset details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current assignment card */}
          {currentAssignment ? (
            <Card className="border-primary/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-primary">
                  <User className="mr-2 h-5 w-5" />
                  Currently Assigned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Employee</p>
                    <p>{currentAssignment.employee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentAssignment.employee.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Assigned On</p>
                    <p>{format(new Date(currentAssignment.assignment.assignedDate), 'MMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentAssignment.assignment.notes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <ClipboardCheck className="mr-2 h-5 w-5" />
                  Assignment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This asset is currently not assigned to anyone.
                </p>
                <Button className="mt-4" onClick={() => setShowAssign(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Assign Asset
                </Button>
              </CardContent>
            </Card>
          )}
          
          {showAssign && (
            <div className="mt-4 flex gap-2 items-center">
              <Select value={selectedUser || ''} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>{user.Name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                disabled={!selectedUser || assignMutation.status === 'pending'}
                onClick={() => selectedUser && assignMutation.mutate({ userId: selectedUser, assetId: asset.id })}
              >
                Confirm
              </Button>
              <Button variant="outline" onClick={() => setShowAssign(false)}>
                Cancel
              </Button>
            </div>
          )}
          
          {/* Tabs for different content sections */}
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">Assignment History</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance Log</TabsTrigger>
              <TabsTrigger value="identifiers">Identifiers</TabsTrigger>
            </TabsList>
            
            {/* Details tab */}
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.category || 'Uncategorized'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Serial Number</p>
                      <p className="text-sm text-muted-foreground">{asset.model}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm text-muted-foreground">{asset.description || 'No description provided'}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Purchase Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Purchase Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(asset.manufactured), 'MMM d, yyyy')}
                      </p>
                    </div>
                    {asset.assetExpenditure && (
                      <div>
                        <p className="text-sm font-medium">Purchase Price</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Coins className="mr-1 h-3.5 w-3.5" />
                          ${asset.assetExpenditure.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {asset.warrantyExpiry && (
                      <div>
                        <p className="text-sm font-medium">Warranty Expiry</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(asset.warrantyExpiry), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {asset.notes && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{asset.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* History tab */}
            <TabsContent value="history" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HistoryIcon className="mr-2 h-5 w-5" />
                    Assignment History
                  </CardTitle>
                  <CardDescription>
                    Record of all assignments for this asset
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {assignments.filter(a => a.assetId === asset.id).length > 0 ? (
                    <div className="space-y-4">
                      {assignments
                        .filter(a => a.assetId === asset.id)
                        .map(assignment => (
                          <div key={assignment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                            <div>
                              <p className="font-medium">
                                {assignment.employee?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {assignment.employee?.department}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {assignment.notes}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">
                                {format(new Date(assignment.assignedDate), 'MMM d, yyyy')}
                              </p>
                              {assignment.returnDate ? (
                                <p className="text-xs text-muted-foreground">
                                  Returned: {format(new Date(assignment.returnDate), 'MMM d, yyyy')}
                                </p>
                              ) : (
                                <p className="text-xs text-green-600">Currently assigned</p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      This asset has no assignment history
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Maintenance Log tab */}
            <TabsContent value="maintenance" className="pt-4">
              <div className="space-y-4">
                {/* Raise Ticket Button - only show if user is assigned to this device */}
                {currentAssignment && (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Maintenance Tickets</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage maintenance tickets for this device
                      </p>
                    </div>
                    <Button onClick={() => setShowMaintenanceForm(true)}>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Raise Ticket
                    </Button>
                  </div>
                )}
                
                {/* Maintenance Log Form */}
                {showMaintenanceForm && currentAssignment && (
                  <MaintenanceLogForm
                    deviceId={asset.id}
                    userId={currentAssignment.employee.id}
                    onSuccess={() => setShowMaintenanceForm(false)}
                    onCancel={() => setShowMaintenanceForm(false)}
                  />
                )}
                
                {/* Maintenance Log History */}
                <MaintenanceLogHistory
                  logs={maintenanceLogs}
                  deviceId={asset.id}
                  isManager={isManager}
                />
              </div>
            </TabsContent>
            
            {/* Identifiers tab */}
            <TabsContent value="identifiers" className="pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <QrCode className="mr-2 h-5 w-5" />
                      Asset Identifiers
                    </CardTitle>
                    <CardDescription>
                      QR code and barcode for this asset
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handlePrintIdentifiers}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Identifiers
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-6" ref={printRef}>
                    <div className="flex flex-col items-center qr-code-container">
                      <h3 className="text-sm font-medium mb-4">QR Code</h3>
                      <QRCodeGenerator 
                        value={asset.barcodeData} 
                        size={150} 
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {asset.barcodeData}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center barcode-container">
                      <h3 className="text-sm font-medium mb-4">Barcode</h3>
                      <BarcodeGenerator 
                        value={asset.barcodeData} 
                        options={{
                          width: 1.5,
                          height: 70,
                          fontSize: 14
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!currentAssignment ? (
                <Button className="w-full justify-start" onClick={() => setShowAssign(true)}>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Assign Asset
                </Button>
              ) : (
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to={`/assignments/${currentAssignment.assignment.id}`}>
                    <User className="mr-2 h-4 w-4" />
                    View Assignment
                  </Link>
                </Button>
              )}
              
              {currentAssignment && (
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowMaintenanceForm(true)}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Raise Ticket
                </Button>
              )}
              
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to={`/assets/${id}/edit`}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Asset
                </Link>
              </Button>
              
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to={`/assets/${id}/duplicate`}>
                  <Package className="mr-2 h-4 w-4" />
                  Duplicate Asset
                </Link>
              </Button>
              
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/scanner">
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan Another Asset
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              asset and remove it from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAsset} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Asset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssetDetail;
