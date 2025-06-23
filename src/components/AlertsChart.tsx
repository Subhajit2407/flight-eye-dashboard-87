
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const AlertsChart: React.FC = () => {
  // Generate more realistic alert data based on time patterns with live updates
  const generateRealisticData = () => {
    const currentHour = new Date().getHours();
    const baseData = [
      { time: '00:00', critical: 3, high: 8, medium: 15, low: 22 },
      { time: '04:00', critical: 2, high: 6, medium: 12, low: 18 },
      { time: '08:00', critical: 12, high: 28, medium: 45, low: 65 },
      { time: '12:00', critical: 18, high: 35, medium: 58, low: 78 },
      { time: '16:00', critical: 15, high: 32, medium: 52, low: 72 },
      { time: '20:00', critical: 8, high: 18, medium: 35, low: 48 },
    ];

    // Add real-time fluctuation based on current time
    return baseData.map((item, index) => {
      const timeMultiplier = Math.sin((Date.now() / 60000 + index) * 0.1) * 0.3 + 1;
      return {
        ...item,
        critical: Math.max(0, Math.round(item.critical * timeMultiplier + Math.random() * 4 - 2)),
        high: Math.max(0, Math.round(item.high * timeMultiplier + Math.random() * 8 - 4)),
        medium: Math.max(0, Math.round(item.medium * timeMultiplier + Math.random() * 12 - 6)),
        low: Math.max(0, Math.round(item.low * timeMultiplier + Math.random() * 15 - 7)),
      };
    });
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
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
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
              formatter={(value, name) => [value, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
            />
            <Bar dataKey="critical" stackId="a" fill="#EF4444" />
            <Bar dataKey="high" stackId="a" fill="#F59E0B" />
            <Bar dataKey="medium" stackId="a" fill="#EAB308" />
            <Bar dataKey="low" stackId="a" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
          <div className="text-lg font-bold text-red-400">{data.reduce((sum, item) => sum + item.critical, 0)}</div>
          <div className="text-xs text-muted-foreground">Critical</div>
          <div className="text-xs text-red-400 mt-1">Immediate action required</div>
        </div>
        <div className="p-2 bg-orange-500/10 rounded border border-orange-500/20">
          <div className="text-lg font-bold text-orange-400">{data.reduce((sum, item) => sum + item.high, 0)}</div>
          <div className="text-xs text-muted-foreground">High Priority</div>
          <div className="text-xs text-orange-400 mt-1">Needs attention</div>
        </div>
        <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
          <div className="text-lg font-bold text-yellow-400">{data.reduce((sum, item) => sum + item.medium, 0)}</div>
          <div className="text-xs text-muted-foreground">Medium Priority</div>
          <div className="text-xs text-yellow-400 mt-1">Monitor closely</div>
        </div>
        <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
          <div className="text-lg font-bold text-green-400">{data.reduce((sum, item) => sum + item.low, 0)}</div>
          <div className="text-xs text-muted-foreground">Low Priority</div>
          <div className="text-xs text-green-400 mt-1">Routine maintenance</div>
        </div>
      </div>
    </div>
  );
};

export default AlertsChart;
