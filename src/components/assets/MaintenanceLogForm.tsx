import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Wrench, Bug, FileText } from "lucide-react";
import { MaintenanceLogType, MaintenanceLog } from "@/types";
import { createMaintenanceLog } from "@/lib/supabase-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface MaintenanceLogFormProps {
  deviceId: string;
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MaintenanceLogForm = ({ deviceId, userId, onSuccess, onCancel }: MaintenanceLogFormProps) => {
  const [type, setType] = useState<MaintenanceLogType | "">("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (maintenanceLog: Partial<MaintenanceLog>) => 
      createMaintenanceLog(maintenanceLog),
    onSuccess: () => {
      toast({
        title: "Ticket Raised",
        description: "Your maintenance ticket has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ['maintenanceLogs', deviceId] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error creating maintenance log:", error);
      toast({
        title: "Error",
        description: "Failed to create maintenance ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type) {
      toast({
        title: "Validation Error",
        description: "Please select a ticket type.",
        variant: "destructive",
      });
      return;
    }

    if (type === MaintenanceLogType.MISC && !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a description for miscellaneous tickets.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      deviceId,
      userId,
      type,
      description: description.trim() || undefined,
    });
  };

  const getTypeIcon = (type: MaintenanceLogType) => {
    switch (type) {
      case MaintenanceLogType.MAINTENANCE:
        return <Wrench className="h-4 w-4" />;
      case MaintenanceLogType.MALFUNCTION:
        return <Bug className="h-4 w-4" />;
      case MaintenanceLogType.MISC:
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeDescription = (type: MaintenanceLogType) => {
    switch (type) {
      case MaintenanceLogType.MAINTENANCE:
        return "Schedule routine maintenance or preventive care";
      case MaintenanceLogType.MALFUNCTION:
        return "Report hardware or software issues";
      case MaintenanceLogType.MISC:
        return "Other issues requiring attention";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Raise Maintenance Ticket
        </CardTitle>
        <CardDescription>
          Create a new maintenance ticket for this device
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Ticket Type *</Label>
            <Select value={type} onValueChange={(value) => setType(value as MaintenanceLogType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MaintenanceLogType).map((ticketType) => (
                  <SelectItem key={ticketType} value={ticketType}>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(ticketType)}
                      <span className="capitalize">{ticketType}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {type && (
              <p className="text-sm text-muted-foreground">
                {getTypeDescription(type as MaintenanceLogType)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description {type === MaintenanceLogType.MISC && "*"}
            </Label>
            <Textarea
              id="description"
              placeholder={
                type === MaintenanceLogType.MISC
                  ? "Please provide details about the issue..."
                  : "Additional details (optional)"
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            {type === MaintenanceLogType.MISC && (
              <p className="text-sm text-muted-foreground">
                Description is required for miscellaneous tickets
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || !type || (type === MaintenanceLogType.MISC && !description.trim())}
            >
              {createMutation.isPending ? "Creating..." : "Raise Ticket"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceLogForm; 