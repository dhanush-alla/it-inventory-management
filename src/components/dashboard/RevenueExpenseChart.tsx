import { 
  BarChart, 
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

interface RevenueExpenseChartProps {
  stats: DashboardStats;
}

// Sample data - in a real implementation, this would come from your API/stats
const comparisonData = [
  { month: 'Jan', revenue: 12400, expenses: 8900 },
  { month: 'Feb', revenue: 15600, expenses: 10200 },
  { month: 'Mar', revenue: 14200, expenses: 11800 },
  { month: 'Apr', revenue: 18900, expenses: 13400 },
  { month: 'May', revenue: 21500, expenses: 15700 },
  { month: 'Jun', revenue: 25800, expenses: 17200 }
];

export function RevenueExpenseChart({ stats }: RevenueExpenseChartProps) {
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
        <CardTitle>Revenue vs Expenses</CardTitle>
        <CardDescription>
          Monthly comparison for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Amount']}
              />
              <Legend />
              <Bar 
                dataKey="revenue" 
                name="Revenue" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                name="Expenses" 
                fill="hsl(var(--destructive))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 