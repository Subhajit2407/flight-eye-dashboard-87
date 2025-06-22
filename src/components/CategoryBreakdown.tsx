
import React from 'react';

const CategoryBreakdown: React.FC = () => {
  // Generate more realistic system data
  const generateCategories = () => {
    const baseCategories = [
      { name: 'Navigation Systems', percentage: 28.5, color: 'bg-blue-500', issues: 52, trend: 'up' },
      { name: 'Engine Monitoring', percentage: 22.8, color: 'bg-green-500', issues: 41, trend: 'down' },
      { name: 'Flight Controls', percentage: 19.2, color: 'bg-orange-500', issues: 35, trend: 'stable' },
      { name: 'Communication', percentage: 15.5, color: 'bg-purple-500', issues: 28, trend: 'up' },
      { name: 'Safety Systems', percentage: 14.0, color: 'bg-red-500', issues: 25, trend: 'down' },
    ];

    // Add slight randomization to make it feel live
    return baseCategories.map(category => ({
      ...category,
      issues: Math.max(1, category.issues + Math.floor(Math.random() * 10 - 5)),
      percentage: Math.max(5, category.percentage + (Math.random() * 6 - 3))
    }));
  };

  const categories = generateCategories();
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
          <h3 className="text-lg font-semibold text-foreground">System Categories</h3>
          <p className="text-sm text-muted-foreground">Distribution of active issues by system type</p>
        </div>
        <button className="text-xs text-primary hover:text-primary/80 transition-colors px-3 py-1 bg-primary/10 rounded-lg">
          View All Systems
        </button>
      </div>
      
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{category.name}</span>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-muted-foreground">{category.issues} active</span>
                <span className={`text-xs ${getTrendColor(category.trend)}`}>{getTrendIcon(category.trend)}</span>
                <span className="text-sm font-bold text-foreground">{category.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className={`${category.color} h-3 rounded-full transition-all duration-1000 ease-out shadow-sm`}
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Last updated: {Math.floor(Math.random() * 30) + 1}min ago</span>
              <span>Priority: {category.issues > 40 ? 'High' : category.issues > 25 ? 'Medium' : 'Low'}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/20">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{totalIssues}</div>
            <div className="text-xs text-muted-foreground">Total Active Issues</div>
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
