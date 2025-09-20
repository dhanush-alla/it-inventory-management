import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';

interface MaintenanceCostChartProps {
  stats: DashboardStats;
}

// Sample data - in a real implementation, this would come from your API/stats
const maintenanceData = [
  { category: 'Laptops', cost: 2800, incidents: 12 },
  { category: 'Desktops', cost: 3400, incidents: 8 },
  { category: 'Servers', cost: 12600, incidents: 5 },
  { category: 'Network', cost: 5700, incidents: 7 },
  { category: 'Printers', cost: 1900, incidents: 15 },
  { category: 'Mobile', cost: 2300, incidents: 9 }
];

export function MaintenanceCostChart({ stats }: MaintenanceCostChartProps) {
  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'cost') {
      return [formatCurrency(value), 'Maintenance Cost'];
    }
    return [value, 'Incidents'];
  };

  return (
    <Card className="col-span-7 card-hover-effect">
      <CardHeader>
        <CardTitle>Maintenance Cost Analysis</CardTitle>
        <CardDescription>
          Cost and incident frequency by asset category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={maintenanceData}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis 
                yAxisId="left"
                orientation="left" 
                tickFormatter={(value) => `₹${value}`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                allowDecimals={false}
              />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="cost" 
                name="Maintenance Cost" 
                fill="hsl(var(--primary))" 
                barSize={50}
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="incidents" 
                name="Incident Count" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 