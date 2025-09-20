import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AssetsByCategoryChartProps {
  data: { category: string; count: number }[];
}

const COLORS = [
  '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe',
  '#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe',
  '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'
];

const AssetsByCategoryChart: React.FC<AssetsByCategoryChartProps> = ({ data }) => {
  // Sort data by count descending for better visualization
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="category" 
            angle={-45} 
            textAnchor="end" 
            height={80} 
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} assets`, 'Count']}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Bar dataKey="count" fill="#8884d8">
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetsByCategoryChart; 