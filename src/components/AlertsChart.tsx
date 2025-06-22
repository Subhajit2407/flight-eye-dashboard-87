
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const AlertsChart: React.FC = () => {
  const data = [
    { time: '00:00', critical: 12, high: 24, medium: 45, low: 78 },
    { time: '04:00', critical: 8, high: 18, medium: 52, low: 85 },
    { time: '08:00', critical: 15, high: 32, medium: 38, low: 92 },
    { time: '12:00', critical: 22, high: 28, medium: 41, low: 76 },
    { time: '16:00', critical: 18, high: 35, medium: 48, low: 83 },
    { time: '20:00', critical: 10, high: 22, medium: 55, low: 89 },
  ];

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Detection Alerts</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="critical" stackId="a" fill="#EF4444" />
            <Bar dataKey="high" stackId="a" fill="#F59E0B" />
            <Bar dataKey="medium" stackId="a" fill="#EAB308" />
            <Bar dataKey="low" stackId="a" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AlertsChart;
