import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AssetValueChartProps {
  data: { category: string; value: number }[];
}

const COLORS = [
  '#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac',
  '#14532d', '#15803d', '#16a34a', '#22c55e', '#4ade80',
  '#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80'
];

const AssetValueChart: React.FC<AssetValueChartProps> = ({ data }) => {
  // Sort data by value descending
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="category" 
            angle={-45} 
            textAnchor="end" 
            height={80} 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip 
            formatter={(value) => [formatCurrency(Number(value)), 'Value']}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Bar dataKey="value" fill="#8884d8">
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetValueChart; 