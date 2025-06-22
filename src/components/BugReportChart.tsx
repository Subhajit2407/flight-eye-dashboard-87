
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

const BugReportChart: React.FC = () => {
  const data = [
    { date: 'Jan', uncategorized: 45, categorized: 78, resolved: 120 },
    { date: 'Feb', uncategorized: 52, categorized: 85, resolved: 142 },
    { date: 'Mar', uncategorized: 38, categorized: 92, resolved: 158 },
    { date: 'Apr', uncategorized: 41, categorized: 76, resolved: 165 },
    { date: 'May', uncategorized: 48, categorized: 83, resolved: 187 },
    { date: 'Jun', uncategorized: 35, categorized: 89, resolved: 203 },
  ];

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Bug Report Trends</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>Uncategorized</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>Categorized</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            <Area type="monotone" dataKey="categorized" stackId="1" stroke="#EAB308" fill="#EAB308" fillOpacity={0.3} />
            <Area type="monotone" dataKey="uncategorized" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BugReportChart;
