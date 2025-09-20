import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine
} from 'recharts';

interface AssignmentTrendChartProps {
  data: { month: string; count: number }[];
}

const AssignmentTrendChart: React.FC<AssignmentTrendChartProps> = ({ data }) => {
  // Calculate moving average for trend line
  const movingAverage = [...data].map((item, index, array) => {
    if (index < 2) return { ...item };
    
    const avg = (array[index].count + array[index - 1].count + array[index - 2].count) / 3;
    return {
      ...item,
      average: parseFloat(avg.toFixed(1))
    };
  });
  
  // Calculate average for reference line
  const average = data.reduce((sum, item) => sum + item.count, 0) / data.length;

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={movingAverage}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <ReferenceLine y={average} stroke="#ff4500" strokeDasharray="3 3" label="Average" />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#3b82f6" 
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Assignments"
          />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#16a34a" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="3-Month Moving Avg"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssignmentTrendChart; 