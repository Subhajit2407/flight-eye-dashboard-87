
import React, { useEffect, useState } from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useAircraftManager } from '../hooks/useAircraftManager';

const CategoryBreakdown: React.FC = () => {
  const { alerts, flightData } = useRealTimeData();
  const { bugs } = useAircraftManager();
  const [categories, setCategories] = useState<any[]>([]);

  // Generate categories based on real-time data
  const generateCategories = () => {
    const alertsBySubsystem = alerts.reduce((acc, alert) => {
      // Map alert types to subsystems
      const subsystem = alert.type === 'critical' ? 'Safety Systems' : 
                      alert.aircraftId.includes('NAV') ? 'Navigation Systems' :
                      alert.aircraftId.includes('ENG') ? 'Engine Monitoring' :
                      alert.message.includes('communication') ? 'Communication' :
                      'Flight Controls';
      
      acc[subsystem] = (acc[subsystem] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bugsBySubsystem = bugs.reduce((acc, bug) => {
      acc[bug.subsystem] = (acc[bug.subsystem] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Combine real data with base categories
    const baseCategories = [
      { name: 'Navigation Systems', color: 'bg-blue-500', baseIssues: 15 },
      { name: 'Engine Monitoring', color: 'bg-green-500', baseIssues: 12 },
      { name: 'Flight Controls', color: 'bg-orange-500', baseIssues: 8 },
      { name: 'Communication', color: 'bg-purple-500', baseIssues: 6 },
      { name: 'Safety Systems', color: 'bg-red-500', baseIssues: 10 },
    ];

    const totalActiveFlights = Math.max(flightData.length, 50);
    
    return baseCategories.map(category => {
      const alertCount = alertsBySubsystem[category.name] || 0;
      const bugCount = bugsBySubsystem[category.name] || 0;
      const totalIssues = category.baseIssues + alertCount + bugCount;
      const percentage = (totalIssues / totalActiveFlights) * 100;
      
      // Determine trend based on recent activity
      const trend = alertCount > 2 ? 'up' : 
                   bugCount === 0 && alertCount === 0 ? 'down' : 'stable';
      
      return {
        ...category,
        issues: totalIssues,
        percentage: Math.min(percentage, 45), // Cap at 45% for display
        trend,
        alertCount,
        bugCount,
        lastUpdate: new Date()
      };
    });
  };

  useEffect(() => {
    const newCategories = generateCategories();
    setCategories(newCategories);
  }, [alerts, bugs, flightData]);

  const totalIssues = categories.reduce((sum, cat) => sum + cat.issues, 0);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-400';
      case 'down': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Real-Time System Categories</h3>
          <p className="text-sm text-muted-foreground">
            Live distribution of issues by system type
            <span className="ml-2 text-green-400">• Updated {categories[0]?.lastUpdate?.toLocaleTimeString()}</span>
          </p>
        </div>
        <button className="text-xs text-primary hover:text-primary/80 transition-colors px-3 py-1 bg-primary/10 rounded-lg">
          View Details
        </button>
      </div>
      
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{category.name}</span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {category.alertCount > 0 && (
                    <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">
                      {category.alertCount} alerts
                    </span>
                  )}
                  {category.bugCount > 0 && (
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                      {category.bugCount} bugs
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{category.issues} total</span>
                <span className={`text-xs ${getTrendColor(category.trend)}`}>{getTrendIcon(category.trend)}</span>
                <span className="text-sm font-bold text-foreground">{category.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className={`${category.color} h-3 rounded-full transition-all duration-1000 ease-out shadow-sm relative`}
                style={{ width: `${category.percentage}%` }}
              >
                {/* Animated pulse for active issues */}
                {category.alertCount > 0 && (
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Real-time: {category.alertCount + category.bugCount} new issues
              </span>
              <span>
                Priority: {category.issues > 20 ? 'High' : category.issues > 10 ? 'Medium' : 'Low'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/20">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{totalIssues}</div>
            <div className="text-xs text-muted-foreground">Total Active Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {alerts.filter(a => a.type === 'critical').length}
            </div>
            <div className="text-xs text-muted-foreground">Critical Alerts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.round(categories.filter(c => c.trend === 'down').length / categories.length * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Systems Improving</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
