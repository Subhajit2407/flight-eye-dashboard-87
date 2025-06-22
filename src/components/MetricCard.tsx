
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  subtitle?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  severity
}) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'decrease': return <TrendingDown className="w-4 h-4 text-green-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            {getChangeIcon()}
            <span className={`text-xs ${changeType === 'increase' ? 'text-red-400' : 'text-green-400'}`}>
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      
      <div className={`text-2xl font-bold ${getSeverityColor(severity)}`}>
        {value}
      </div>
      
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};

export default MetricCard;
