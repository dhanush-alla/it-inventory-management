import { useAuth } from '@/contexts/AuthContext';
import { getDashboardStats } from '@/lib/supabase-api';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { RecentAssignments } from '@/components/dashboard/RecentAssignments';
import { ManagerTools } from '@/components/dashboard/ManagerTools';
import { useQuery } from '@tanstack/react-query';
import Usage from './Usage';
import Alerts from './Alerts';

const Dashboard = () => {
  const { user, isManager } = useAuth();
  
  const { data: dashboardStats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    initialData: {
      totalAssets: 0,
      availableAssets: 0,
      assignedAssets: 0,
      maintenanceAssets: 0,
      retiredAssets: 0,
      assetsByCategory: [],
      recentAssignments: []
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-12 text-red-600">
        <div className="font-bold text-lg mb-2">Error loading dashboard</div>
        <div>{error.message || 'An unexpected error occurred.'}</div>
      </div>
    );
  }

  const isEmpty =
    !dashboardStats ||
    (dashboardStats.totalAssets === 0 &&
      dashboardStats.availableAssets === 0 &&
      dashboardStats.assignedAssets === 0 &&
      dashboardStats.maintenanceAssets === 0 &&
      dashboardStats.retiredAssets === 0);

  return (
    <div className="space-y-6">
      <DashboardHeader userName={user?.name} />
      {isEmpty ? (
        <div className="flex flex-col items-center py-12 text-muted-foreground">
          <div className="font-bold text-lg mb-2">No data available</div>
          <div>Please add assets to see dashboard statistics.</div>
        </div>
      ) : (
        <>
          <StatsCards stats={dashboardStats} />
          <ChartsSection stats={dashboardStats} />
          <RecentAssignments stats={dashboardStats} />
          {isManager && <ManagerTools stats={dashboardStats} />}
        </>
      )}
    </div>
  );
};

export default Dashboard;
