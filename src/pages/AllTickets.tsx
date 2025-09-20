import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAllMaintenanceLogs } from "@/lib/supabase-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { format, isValid } from "date-fns";
import { Navigate } from "react-router-dom";

const AllTickets = () => {
  const { isManager } = useAuth();
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["allMaintenanceLogs"],
    queryFn: getAllMaintenanceLogs,
    enabled: isManager,
  });

  if (!isManager) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            All Maintenance Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No tickets found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Asset</th>
                    <th className="px-4 py-2 border-b">User</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Type</th>
                    <th className="px-4 py-2 border-b">Description</th>
                    <th className="px-4 py-2 border-b">Status</th>
                    <th className="px-4 py-2 border-b">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-4 py-2 border-b">{ticket.device_name || "-"}</td>
                      <td className="px-4 py-2 border-b">{ticket.user_name || ticket.user_id || "-"}</td>
                      <td className="px-4 py-2 border-b">{ticket.user_email || "-"}</td>
                      <td className="px-4 py-2 border-b capitalize">{ticket.type}</td>
                      <td className="px-4 py-2 border-b">{ticket.description || "-"}</td>
                      <td className="px-4 py-2 border-b"><Badge>{ticket.status}</Badge></td>
                      <td className="px-4 py-2 border-b">{ticket.created_at && isValid(new Date(ticket.created_at)) ? format(new Date(ticket.created_at), "MMM d, yyyy HH:mm") : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllTickets; 