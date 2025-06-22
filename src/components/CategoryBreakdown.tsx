
import React from 'react';

const CategoryBreakdown: React.FC = () => {
  const categories = [
    { name: 'Flight Systems', percentage: 25.5, color: 'bg-orange-500', issues: 45 },
    { name: 'Navigation', percentage: 18.2, color: 'bg-blue-500', issues: 32 },
    { name: 'Communication', percentage: 15.8, color: 'bg-purple-500', issues: 28 },
    { name: 'Engine Monitoring', percentage: 22.1, color: 'bg-green-500', issues: 39 },
    { name: 'Safety Systems', percentage: 18.4, color: 'bg-red-500', issues: 33 },
  ];

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">System Categories</h3>
        <button className="text-xs text-primary hover:text-primary/80 transition-colors">
          View Details
        </button>
      </div>
      
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{category.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{category.issues} issues</span>
                <span className="text-sm font-medium text-foreground">{category.percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`${category.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Active Issues</span>
          <span className="font-bold text-orange-400">177</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
