
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';

interface CategoryBarChartProps {
  stats: DashboardStats;
}

export function CategoryBarChart({ stats }: CategoryBarChartProps) {
  return (
    <Card className="col-span-4 card-hover-effect">
      <CardHeader>
        <CardTitle>Assets by Category</CardTitle>
        <CardDescription>
          Distribution of assets across different categories
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={stats.assetsByCategory} 
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="categoryName" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="Assets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
