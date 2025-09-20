import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';

interface AssetStatusChartProps {
  stats: DashboardStats;
}

// Custom tooltip for pie chart
const StatusTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-white p-2 rounded shadow text-sm border">
        <div className="font-semibold">{name}</div>
        <div>Count: {value}</div>
      </div>
    );
  }
  return null;
};

export function AssetStatusChart({ stats }: AssetStatusChartProps) {
  const statusData = [
    { name: 'Available', value: stats.availableAssets, color: '#10B981' },
    { name: 'Assigned', value: stats.assignedAssets, color: '#3B82F6' },
    { name: 'Maintenance', value: stats.maintenanceAssets, color: '#F59E0B' },
    { name: 'Retired', value: stats.retiredAssets, color: '#EF4444' }
  ];

  return (
    <Card className="col-span-3 card-hover-effect">
      <CardHeader>
        <CardTitle>Asset Status</CardTitle>
        <CardDescription>
          Hover over the chart to see asset status details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<StatusTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
