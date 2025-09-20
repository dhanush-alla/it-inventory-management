import { CategoryBarChart } from './CategoryBarChart';
import { AssetStatusChart } from './AssetStatusChart';
// Removed: import { RevenueChart } from './RevenueChart';
// Removed: import { RevenueExpenseChart } from './RevenueExpenseChart';
// Removed: import { MaintenanceCostChart } from './MaintenanceCostChart';
import { UserAssetsSection } from './UserAssetsSection';
import { DashboardStats } from '@/types';

interface ChartsSectionProps {
  stats: DashboardStats;
}

export function ChartsSection({ stats }: ChartsSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <UserAssetsSection stats={stats} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <CategoryBarChart stats={stats} />
        <AssetStatusChart stats={stats} />
      </div>
    </div>
  );
}
