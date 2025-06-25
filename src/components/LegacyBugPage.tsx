
import React, { useState } from 'react';
import { Plus, Trash2, Filter, RefreshCw, Bug, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useBugManager } from '../hooks/useBugManager';
import { useAircraftManager } from '../hooks/useAircraftManager';

const LegacyBugPage: React.FC = () => {
  const { bugs, allBugs, filter, setFilter, addRandomBug, clearAllBugs, resolveBug } = useBugManager();
  const { addBugReport, aircraft } = useAircraftManager();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBug, setNewBug] = useState({
    subsystem: '',
    severity: 'Medium' as const,
    description: '',
    type: 'Software' as const,
    aircraftId: ''
  });

  const handleAddBug = () => {
    if (newBug.description && newBug.subsystem) {
      // Add to legacy system
      const legacyBug = {
        id: Math.random().toString(36).substr(2, 9),
        subsystem: newBug.subsystem,
        severity: newBug.severity,
        description: newBug.description,
        timestamp: new Date(),
        status: 'Open' as const,
        type: newBug.type
      };

      // If aircraft is selected, also add to enhanced system
      if (newBug.aircraftId) {
        const selectedAircraft = aircraft.find(a => a.id === newBug.aircraftId);
        if (selectedAircraft) {
          addBugReport({
            aircraftId: newBug.aircraftId,
            subsystem: newBug.subsystem,
            severity: newBug.severity,
            description: newBug.description,
            type: newBug.type,
            reportedBy: 'Engineer',
            location: selectedAircraft.location,
            airlineName: selectedAircraft.airlineName
          });
        }
      }

      setNewBug({
        subsystem: '',
        severity: 'Medium',
        description: '',
        type: 'Software',
        aircraftId: ''
      });
      setShowAddForm(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/10';
      case 'High': return 'text-orange-400 bg-orange-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="aviation-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Bug className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Legacy Bug Management</h3>
              <p className="text-muted-foreground">Manage and track aircraft system issues</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bug</span>
            </button>
            <button
              onClick={addRandomBug}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Sample</span>
            </button>
            <button
              onClick={clearAllBugs}
              className="flex items-center space-x-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Add Bug Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-accent/20 rounded-lg border border-border">
            <h4 className="text-lg font-semibold mb-4">Add New Bug Report</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Aircraft (Optional)</label>
                <select
                  value={newBug.aircraftId}
                  onChange={(e) => setNewBug(prev => ({ ...prev, aircraftId: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select Aircraft (Legacy Mode)</option>
                  {aircraft.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.aircraftId} - {a.airlineName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subsystem</label>
                <select
                  value={newBug.subsystem}
                  onChange={(e) => setNewBug(prev => ({ ...prev, subsystem: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select Subsystem</option>
                  <option value="Flight Control">Flight Control</option>
                  <option value="Navigation">Navigation</option>
                  <option value="Engine">Engine</option>
                  <option value="Communication">Communication</option>
                  <option value="Landing Gear">Landing Gear</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Severity</label>
                <select
                  value={newBug.severity}
                  onChange={(e) => setNewBug(prev => ({ ...prev, severity: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={newBug.type}
                  onChange={(e) => setNewBug(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Network">Network</option>
                  <option value="Sensor">Sensor</option>
                  <option value="Configuration">Configuration</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newBug.description}
                  onChange={(e) => setNewBug(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue in detail..."
                  rows={3}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBug}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
              >
                Add Bug Report
              </button>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filter.severity || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value as any || undefined }))}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          
          <select
            value={filter.subsystem || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, subsystem: e.target.value || undefined }))}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm"
          >
            <option value="">All Subsystems</option>
            <option value="Flight Control">Flight Control</option>
            <option value="Navigation">Navigation</option>
            <option value="Engine">Engine</option>
            <option value="Communication">Communication</option>
            <option value="Landing Gear">Landing Gear</option>
          </select>
          
          <select
            value={filter.type || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any || undefined }))}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm"
          >
            <option value="">All Types</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Sensor">Sensor</option>
            <option value="Configuration">Configuration</option>
          </select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <div className="text-xl font-bold text-blue-400">{allBugs.length}</div>
            <div className="text-xs text-muted-foreground">Total Bugs</div>
          </div>
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <div className="text-xl font-bold text-red-400">
              {allBugs.filter(b => b.severity === 'Critical').length}
            </div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <div className="text-xl font-bold text-yellow-400">
              {allBugs.filter(b => b.status === 'In Progress').length}
            </div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <div className="text-xl font-bold text-green-400">
              {allBugs.filter(b => b.status === 'Resolved').length}
            </div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
        </div>
      </div>

      {/* Bug List */}
      <div className="aviation-card p-6">
        <h4 className="text-lg font-semibold mb-4">Active Bug Reports ({bugs.length})</h4>
        <div className="space-y-3">
          {bugs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bug className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bugs found matching current filters</p>
              <p className="text-sm">Try adjusting your filters or add a new bug report</p>
            </div>
          ) : (
            bugs.map((bug) => (
              <div key={bug.id} className="p-4 bg-accent/10 rounded-lg border border-border hover:bg-accent/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(bug.status)}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(bug.severity)}`}>
                        {bug.severity}
                      </div>
                      <div className="text-sm text-muted-foreground">{bug.subsystem}</div>
                      <div className="text-sm text-muted-foreground">•</div>
                      <div className="text-sm text-muted-foreground">{bug.type}</div>
                    </div>
                    <p className="text-foreground mb-2">{bug.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Reported: {bug.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {bug.status !== 'Resolved' && (
                      <button
                        onClick={() => resolveBug(bug.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LegacyBugPage;
