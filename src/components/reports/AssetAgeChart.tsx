import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssetAgeChartProps {
  data: { ageGroup: string; count: number }[];
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#f0f9ff'];

const AssetAgeChart: React.FC<AssetAgeChartProps> = ({ data }) => {
  // Transform data for display
  const chartData = data.map(item => ({
    name: item.ageGroup,
    value: item.count
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
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

export default AssetAgeChart; 