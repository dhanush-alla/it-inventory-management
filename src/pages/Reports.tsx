import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

// Placeholder for chart component
const PieChartPlaceholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-48 border rounded bg-muted/30">
    <PieChart className="h-12 w-12 text-muted-foreground mb-2" />
    <span className="text-muted-foreground">{title} (Pie Chart)</span>
  </div>
);

const mockVendors = [
  { name: 'Windows', count: 42 },
  { name: 'VMWare', count: 18 },
];

const mockWatchlist = [
  { id: 'dev-001', name: 'Laptop-001', status: 'Active' },
  { id: 'dev-002', name: 'VM-Server-01', status: 'Active' },
];

const mockPorts = { used: 120, total: 200 };

const Reports = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Usage Overview</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Endpoint Vendors Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Endpoint Vendors</CardTitle>
            <CardDescription>Distribution of active endpoints by vendor</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartPlaceholder title="Windows vs VMWare Endpoints" />
            <ul className="mt-4 space-y-1">
              {mockVendors.map(v => (
                <li key={v.name} className="flex justify-between">
                  <span>{v.name}</span>
                  <span className="font-semibold">{v.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {/* Ports Usage Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ports Usage</CardTitle>
            <CardDescription>Number of ports in use vs total available</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartPlaceholder title="Ports Usage" />
            <div className="mt-4 flex justify-between">
              <span>Used Ports</span>
              <span className="font-semibold">{mockPorts.used}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Ports</span>
              <span className="font-semibold">{mockPorts.total}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Device Watchlist */}
      <Card>
        <CardHeader>
          <CardTitle>Device Watchlist</CardTitle>
          <CardDescription>Bookmarked devices for 24/7 supervision</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {mockWatchlist.map(device => (
              <li key={device.id} className="py-2 flex justify-between">
                <span>{device.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{device.status}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports; 