
import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Bug as BugIcon, User, Edit, Trash2 } from 'lucide-react';
import { EnhancedBug, useAircraftManager } from '../hooks/useAircraftManager';

interface EnhancedBugListProps {
  bugs: EnhancedBug[];
}

const EnhancedBugList: React.FC<EnhancedBugListProps> = ({ bugs }) => {
  const { updateBugStatus, deleteBug } = useAircraftManager();

  const getSeverityColor = (severity: EnhancedBug['severity']) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusColor = (status: EnhancedBug['status']) => {
    switch (status) {
      case 'Open': return 'text-red-400';
      case 'In Progress': return 'text-yellow-400';
      case 'Resolved': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (bugs.length === 0) {
    return (
      <div className="aviation-card p-8 text-center">
        <BugIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Bug Reports Found</h3>
        <p className="text-muted-foreground">Add aircraft and submit bug reports to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bugs.map((bug) => (
        <div key={bug.id} className="aviation-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(bug.severity)}`}>
                  {bug.severity}
                </span>
                <span className="text-sm text-muted-foreground">{bug.aircraftId}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{bug.subsystem}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{bug.type}</span>
              </div>
              
              <h4 className="font-semibold text-foreground mb-2">{bug.description}</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{bug.timestamp.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{bug.reportedBy}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {bug.status === 'Resolved' ? (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-orange-400" />
                  )}
                  <span className={getStatusColor(bug.status)}>{bug.status}</span>
                </div>
                <div>
                  <span>{bug.location}</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <strong>Airline:</strong> {bug.airlineName}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {bug.status !== 'Resolved' && (
                <select
                  value={bug.status}
                  onChange={(e) => updateBugStatus(bug.id, e.target.value as EnhancedBug['status'])}
                  className="px-2 py-1 text-xs bg-input border border-border rounded"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              )}
              <button
                onClick={() => deleteBug(bug.id)}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                title="Delete bug"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedBugList;
