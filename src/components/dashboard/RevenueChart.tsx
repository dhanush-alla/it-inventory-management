import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';

interface RevenueChartProps {
  stats: DashboardStats;
}

// Sample data - in a real implementation, this would come from your API/stats
const revenueData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 15600 },
  { month: 'Mar', revenue: 14200 },
  { month: 'Apr', revenue: 18900 },
  { month: 'May', revenue: 21500 },
  { month: 'Jun', revenue: 25800 },
  { month: 'Jul', revenue: 27400 },
  { month: 'Aug', revenue: 24300 },
  { month: 'Sep', revenue: 29100 },
  { month: 'Oct', revenue: 32800 },
  { month: 'Nov', revenue: 35600 },
  { month: 'Dec', revenue: 38900 }
];

export function RevenueChart({ stats }: RevenueChartProps) {
  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="col-span-7 card-hover-effect">
      <CardHeader>
        <CardTitle>Annual Revenue Trend</CardTitle>
        <CardDescription>
          Monthly revenue over the current year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 