import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Bug, FileText, Clock, User, Calendar } from "lucide-react";
import { MaintenanceLog, MaintenanceLogType, MaintenanceLogStatus } from "@/types";
import { updateMaintenanceLogStatus } from "@/lib/supabase-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { format, isValid, parseISO } from "date-fns";

interface MaintenanceLogHistoryProps {
  logs: MaintenanceLog[];
  deviceId: string;
  isManager?: boolean;
}

const MaintenanceLogHistory = ({ logs, deviceId, isManager = false }: MaintenanceLogHistoryProps) => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MaintenanceLogStatus }) =>
      updateMaintenanceLogStatus(id, status),
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Maintenance log status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['maintenanceLogs', deviceId] });
    },
    onError: (error) => {
      console.error("Error updating maintenance log status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getTypeIcon = (type: MaintenanceLogType) => {
    switch (type) {
      case MaintenanceLogType.MAINTENANCE:
        return <Wrench className="h-4 w-4" />;
      case MaintenanceLogType.MALFUNCTION:
        return <Bug className="h-4 w-4" />;
      case MaintenanceLogType.MISC:
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: MaintenanceLogStatus) => {
    switch (status) {
      case MaintenanceLogStatus.OPEN:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case MaintenanceLogStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case MaintenanceLogStatus.RESOLVED:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case MaintenanceLogStatus.CLOSED:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusText = (status: MaintenanceLogStatus) => {
    switch (status) {
      case MaintenanceLogStatus.OPEN:
        return "Open";
      case MaintenanceLogStatus.IN_PROGRESS:
        return "In Progress";
      case MaintenanceLogStatus.RESOLVED:
        return "Resolved";
      case MaintenanceLogStatus.CLOSED:
        return "Closed";
      default:
        return status;
    }
  };

  const handleStatusChange = (logId: string, newStatus: MaintenanceLogStatus) => {
    updateStatusMutation.mutate({ id: logId, status: newStatus });
  };

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Maintenance Log
          </CardTitle>
          <CardDescription>
            Record of all maintenance tickets for this device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No maintenance tickets found for this device.</p>
            <p className="text-sm">Tickets will appear here once they are created.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Maintenance Log
        </CardTitle>
        <CardDescription>
          Record of all maintenance tickets for this device ({logs.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(log.type)}
                  <span className="font-medium capitalize">{log.type}</span>
                  <Badge className={getStatusColor(log.status)}>
                    {getStatusText(log.status)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {log.created_at && isValid(new Date(log.created_at)) ? format(new Date(log.created_at), 'MMM d, yyyy HH:mm') : '-'}
                </div>
              </div>

              {log.description && (
                <div className="text-sm text-muted-foreground">
                  {log.description}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{log.user_name || log.user_id || 'Unknown User'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Created {format(new Date(log.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                {isManager && log.status !== MaintenanceLogStatus.CLOSED && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Update Status:</span>
                    <Select
                      value={log.status}
                      onValueChange={(value) => handleStatusChange(log.id, value as MaintenanceLogStatus)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(MaintenanceLogStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {getStatusText(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {log.status !== MaintenanceLogStatus.OPEN && (
                <div className="text-xs text-muted-foreground">
                  Last updated: {log.updated_at && isValid(new Date(log.updated_at)) ? format(new Date(log.updated_at), 'MMM d, yyyy HH:mm') : '-'}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceLogHistory; 