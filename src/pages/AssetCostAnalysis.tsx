import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RevenueExpenseChart } from '@/components/dashboard/RevenueExpenseChart';
import { MaintenanceCostChart } from '@/components/dashboard/MaintenanceCostChart';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const AssetCostAnalysis = () => {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Asset Cost Analysis</CardTitle>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 gap-6">
        <RevenueChart stats={{}} />
        <RevenueExpenseChart stats={{}} />
        <MaintenanceCostChart stats={{}} />
      </div>
    </div>
  );
};

export default AssetCostAnalysis; 