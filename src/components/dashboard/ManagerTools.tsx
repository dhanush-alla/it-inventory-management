import { Clock, FileBarChart2, PackageX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getAssets } from '@/lib/supabase-api';

interface ManagerToolsProps {
  stats: DashboardStats;
}

export function ManagerTools({ stats }: ManagerToolsProps) {
  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets
  });
  
  const totalAssetValue = assets
    .reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0)
    .toLocaleString();

  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileBarChart2 className="mr-2 h-5 w-5" />
          Manager Tools
        </CardTitle>
        <CardDescription>
          Advanced features available to managers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Maintenance card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm">Assets in Maintenance</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.maintenanceAssets}</div>
            </CardContent>
          </Card>
          
          {/* Retired assets card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm">Retired Assets</CardTitle>
                <PackageX className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.retiredAssets}</div>
            </CardContent>
          </Card>
          
          {/* Asset value card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm">Total Asset Value</CardTitle>
                <div className="h-4 w-4 text-green-500 font-bold">₹</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(stats.totalAssetValue || 0).toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
