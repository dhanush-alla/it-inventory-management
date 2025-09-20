import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUserDevices } from '@/lib/supabase-api';
import MaintenanceLogForm from '@/components/assets/MaintenanceLogForm';

export function UserAssetsSection() {
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const { data: userDevices = [], isLoading } = useQuery({
    queryKey: ['userDevices', user?.id],
    queryFn: () => getUserDevices(user.id),
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Your Assigned Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Your Assigned Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userDevices.length === 0 ? (
              <div className="col-span-full text-muted-foreground">No devices assigned.</div>
            ) : userDevices.map((device) => (
              <div
                key={device.id}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => { setSelected(device); setShowTicketForm(false); }}
              >
                <div className="font-semibold text-lg">{device.name}</div>
                <div className="text-sm text-muted-foreground">Manufactured: {device.manufactured}</div>
                <div className="text-sm">Status: {device.status}</div>
                <div className="text-sm">Maintenance Cost: ₹{device.maintenance_cost}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Modal for device details */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
            <div className="mb-1">Manufactured: {selected.manufactured}</div>
            <div className="mb-1">Status: {selected.status}</div>
            <div className="mb-1">Maintenance Cost: ₹{selected.maintenance_cost}</div>
            <div className="mb-3">Details: {selected.details}</div>
            <Button onClick={() => setShowTicketForm((v) => !v)} variant="outline" className="mb-2">
              {showTicketForm ? 'Hide Ticket Form' : 'Raise Ticket'}
            </Button>
            {showTicketForm && (
              <div className="mb-2">
                <MaintenanceLogForm
                  deviceId={selected.id}
                  userId={user.id}
                  onSuccess={() => setShowTicketForm(false)}
                  onCancel={() => setShowTicketForm(false)}
                />
              </div>
            )}
            <Button onClick={() => setSelected(null)} className="mt-2">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAssetsSection; 