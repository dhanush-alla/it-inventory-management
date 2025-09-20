import React from 'react';
import { AssetStatus } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssetStatusReportChartProps {
  data: { status: AssetStatus; count: number }[];
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

const AssetStatusReportChart: React.FC<AssetStatusReportChartProps> = ({ data }) => {
  // Transform data for display
  const chartData = data.map(item => ({
    name: item.status === AssetStatus.AVAILABLE 
      ? 'Available' 
      : item.status === AssetStatus.ASSIGNED
        ? 'Assigned' 
        : item.status === AssetStatus.MAINTENANCE
          ? 'In Maintenance'
          : 'Retired',
    value: item.count
  }));

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} assets`, 'Count']} 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetStatusReportChart; 