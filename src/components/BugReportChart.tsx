
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const BugReportChart: React.FC = () => {
  // Generate more realistic trending data with live updates
  const generateRealisticTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      // Simulate improvement trends over time
      const progressMultiplier = (index + 1) / months.length;
      const timeVariation = Math.sin((Date.now() / 300000 + index) * 0.2) * 0.15 + 1;
      
      const baseResolved = Math.round((85 + (index * 18) + Math.random() * 12) * timeVariation);
      const baseCategorized = Math.round((45 + (index * 8) - Math.random() * 8) * timeVariation);
      const baseUncategorized = Math.max(3, Math.round((35 - (index * 4) + Math.random() * 6) * timeVariation));
      
      return {
        date: month,
        uncategorized: baseUncategorized,
        categorized: baseCategorized,
        resolved: baseResolved,
        total: baseUncategorized + baseCategorized + baseResolved
      };
    });
  };

  const data = generateRealisticTrendData();
  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Issue Resolution Trends</h3>
          <p className="text-sm text-muted-foreground">Monthly progress in issue management and resolution</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            <span>Uncategorized</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>In Progress</span>
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
              formatter={(value, name) => [value, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
            />
            <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            <Area type="monotone" dataKey="categorized" stackId="1" stroke="#EAB308" fill="#EAB308" fillOpacity={0.5} />
            <Area type="monotone" dataKey="uncategorized" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.4} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="text-xl font-bold text-green-400">{latestData.resolved}</div>
          <div className="text-xs text-muted-foreground">Resolved This Month</div>
          <div className="text-xs text-green-400 mt-1">
            +{latestData.resolved - previousData.resolved} from last month
          </div>
        </div>
        <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="text-xl font-bold text-yellow-400">{latestData.categorized}</div>
          <div className="text-xs text-muted-foreground">In Progress</div>
          <div className="text-xs text-yellow-400 mt-1">
            Processing queue
          </div>
        </div>
        <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          <div className="text-xl font-bold text-red-400">{latestData.uncategorized}</div>
          <div className="text-xs text-muted-foreground">Awaiting Review</div>
          <div className="text-xs text-red-400 mt-1">
            Requires attention
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugReportChart;
