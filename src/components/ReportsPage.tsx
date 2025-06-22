
import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar, Plane } from 'lucide-react';
import { useAircraftManager } from '../hooks/useAircraftManager';
import EnhancedBugList from './EnhancedBugList';

const ReportsPage: React.FC = () => {
  const { aircraft, bugs, getBugsByAircraft } = useAircraftManager();
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('');
  const [dateFilter, setDateFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const filteredBugs = selectedAircraftId 
    ? getBugsByAircraft(selectedAircraftId)
    : bugs;

  const finalFilteredBugs = filteredBugs.filter(bug => {
    if (dateFilter && !bug.timestamp.toISOString().startsWith(dateFilter)) return false;
    if (severityFilter && bug.severity !== severityFilter) return false;
    return true;
  });

  const generatePDFReport = () => {
    const selectedAircraft = selectedAircraftId 
      ? aircraft.find(a => a.id === selectedAircraftId)
      : null;

    // Create a basic text report for now (in a real app, you'd use a PDF library)
    const reportData = {
      title: 'Aircraft Error Report',
      generatedAt: new Date().toISOString(),
      aircraft: selectedAircraft || { aircraftId: 'All Aircraft', airlineName: 'Multiple Airlines' },
      totalBugs: finalFilteredBugs.length,
      criticalBugs: finalFilteredBugs.filter(b => b.severity === 'Critical').length,
      bugs: finalFilteredBugs.map(bug => ({
        id: bug.id,
        subsystem: bug.subsystem,
        severity: bug.severity,
        description: bug.description,
        timestamp: bug.timestamp.toISOString(),
        status: bug.status,
        reportedBy: bug.reportedBy
      }))
    };

    // Create downloadable JSON file (in production, this would be a PDF)
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedAircraft?.aircraftId || 'All_Aircraft'}_Report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="aviation-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Aircraft Error Reports</h3>
              <p className="text-muted-foreground">Generate and download comprehensive audit reports</p>
            </div>
          </div>
          <button
            onClick={generatePDFReport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Plane className="w-4 h-4 inline mr-2" />
              Select Aircraft
            </label>
            <select
              value={selectedAircraftId}
              onChange={(e) => setSelectedAircraftId(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Aircraft</option>
              {aircraft.map(a => (
                <option key={a.id} value={a.id}>
                  {a.aircraftId} - {a.airlineName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date Filter
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Severity Filter
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{finalFilteredBugs.length}</div>
            <div className="text-sm text-muted-foreground">Total Reports</div>
          </div>
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">
              {finalFilteredBugs.filter(b => b.severity === 'Critical').length}
            </div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </div>
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-400">
              {finalFilteredBugs.filter(b => b.severity === 'High').length}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </div>
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">
              {finalFilteredBugs.filter(b => b.status === 'Resolved').length}
            </div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </div>
        </div>
      </div>

      <EnhancedBugList bugs={finalFilteredBugs} />
    </div>
  );
};

export default ReportsPage;
