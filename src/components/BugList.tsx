
import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Bug as BugIcon } from 'lucide-react';
import { Bug } from '../hooks/useBugManager';

interface BugListProps {
  bugs: Bug[];
  onResolveBug: (id: string) => void;
}

const BugList: React.FC<BugListProps> = ({ bugs, onResolveBug }) => {
  const getSeverityColor = (severity: Bug['severity']) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/10';
      case 'High': return 'text-orange-400 bg-orange-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (bugs.length === 0) {
    return (
      <div className="aviation-card p-8 text-center">
        <BugIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Bugs Found</h3>
        <p className="text-muted-foreground">Add some dummy bugs to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bugs.map((bug) => (
        <div key={bug.id} className="aviation-card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(bug.severity)}`}>
                  {bug.severity}
                </span>
                <span className="text-sm text-muted-foreground">{bug.subsystem}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{bug.type}</span>
              </div>
              
              <h4 className="font-medium text-foreground mb-2">{bug.description}</h4>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{bug.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {bug.status === 'Resolved' ? (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-orange-400" />
                  )}
                  <span>{bug.status}</span>
                </div>
              </div>
            </div>
            
            {bug.status !== 'Resolved' && (
              <button
                onClick={() => onResolveBug(bug.id)}
                className="ml-4 px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Resolve
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BugList;
