
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const AlertsChart: React.FC = () => {
  // Generate more realistic alert data based on time patterns
  const generateRealisticData = () => {
    const currentHour = new Date().getHours();
    const baseData = [
      { time: '00:00', critical: 8, high: 15, medium: 32, low: 45 },
      { time: '04:00', critical: 5, high: 12, medium: 28, low: 38 },
      { time: '08:00', critical: 18, high: 35, medium: 52, low: 72 },
      { time: '12:00', critical: 25, high: 42, medium: 65, low: 85 },
      { time: '16:00', critical: 22, high: 38, medium: 58, low: 78 },
      { time: '20:00', critical: 12, high: 25, medium: 42, low: 58 },
    ];

    // Add some randomness to make it feel more real
    return baseData.map(item => ({
      ...item,
      critical: Math.max(0, item.critical + Math.floor(Math.random() * 10 - 5)),
      high: Math.max(0, item.high + Math.floor(Math.random() * 15 - 7)),
      medium: Math.max(0, item.medium + Math.floor(Math.random() * 20 - 10)),
      low: Math.max(0, item.low + Math.floor(Math.random() * 25 - 12)),
    }));
  };

  const data = generateRealisticData();

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">System Alerts - Last 24 Hours</h3>
          <p className="text-sm text-muted-foreground">Real-time monitoring across all aircraft systems</p>
        </div>
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
              formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Bar dataKey="critical" stackId="a" fill="#EF4444" />
            <Bar dataKey="high" stackId="a" fill="#F59E0B" />
            <Bar dataKey="medium" stackId="a" fill="#EAB308" />
            <Bar dataKey="low" stackId="a" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div className="p-2 bg-red-500/10 rounded">
          <div className="text-lg font-bold text-red-400">{data.reduce((sum, item) => sum + item.critical, 0)}</div>
          <div className="text-xs text-muted-foreground">Critical Alerts</div>
        </div>
        <div className="p-2 bg-orange-500/10 rounded">
          <div className="text-lg font-bold text-orange-400">{data.reduce((sum, item) => sum + item.high, 0)}</div>
          <div className="text-xs text-muted-foreground">High Priority</div>
        </div>
        <div className="p-2 bg-yellow-500/10 rounded">
          <div className="text-lg font-bold text-yellow-400">{data.reduce((sum, item) => sum + item.medium, 0)}</div>
          <div className="text-xs text-muted-foreground">Medium Priority</div>
        </div>
        <div className="p-2 bg-green-500/10 rounded">
          <div className="text-lg font-bold text-green-400">{data.reduce((sum, item) => sum + item.low, 0)}</div>
          <div className="text-xs text-muted-foreground">Low Priority</div>
        </div>
      </div>
    </div>
  );
};

export default AlertsChart;
