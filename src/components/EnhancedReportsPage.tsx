
import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar, Plane, Search, Edit, Save, X } from 'lucide-react';
import { useReportsManager } from '../hooks/useReportsManager';
import { useAircraftManager } from '../hooks/useAircraftManager';

const EnhancedReportsPage: React.FC = () => {
  const { reports, downloadReportPDF } = useReportsManager();
  const { aircraft } = useAircraftManager();
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(report => {
    if (selectedAircraftId && report.aircraftId !== selectedAircraftId) return false;
    if (typeFilter && report.type !== typeFilter) return false;
    if (severityFilter && report.severity !== severityFilter) return false;
    if (statusFilter && report.status !== statusFilter) return false;
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !report.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getAircraftName = (aircraftId: string) => {
    const plane = aircraft.find(a => a.id === aircraftId);
    return plane ? `${plane.aircraftId} - ${plane.airlineName}` : aircraftId;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return '🐛';
      case 'registration': return '✈️';
      case 'incident': return '⚠️';
      case 'maintenance': return '🔧';
      case 'inspection': return '🔍';
      default: return '📄';
    }
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
              <h3 className="text-xl font-semibold">Aircraft Reports Dashboard</h3>
              <p className="text-muted-foreground">View and manage all aircraft reports and documentation</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Total Reports: {filteredReports.length}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search Reports
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or content..."
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Plane className="w-4 h-4 inline mr-2" />
              Aircraft
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
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Types</option>
              <option value="bug">Bug Reports</option>
              <option value="registration">Registration</option>
              <option value="incident">Incidents</option>
              <option value="maintenance">Maintenance</option>
              <option value="inspection">Inspections</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{filteredReports.length}</div>
            <div className="text-sm text-muted-foreground">Total Reports</div>
          </div>
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">
              {filteredReports.filter(r => r.severity === 'critical').length}
            </div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </div>
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-400">
              {filteredReports.filter(r => r.type === 'bug').length}
            </div>
            <div className="text-sm text-muted-foreground">Bug Reports</div>
          </div>
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">
              {filteredReports.filter(r => r.type === 'registration').length}
            </div>
            <div className="text-sm text-muted-foreground">Registrations</div>
          </div>
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400">
              {filteredReports.filter(r => r.type === 'incident').length}
            </div>
            <div className="text-sm text-muted-foreground">Incidents</div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="aviation-card p-8 text-center">
            <p className="text-muted-foreground">No reports found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try registering an aircraft or submitting a bug report to see entries here.
            </p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="aviation-card p-6 hover:bg-accent/10 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTypeIcon(report.type)}</div>
                  <div>
                    <h4 className="text-lg font-semibold">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {getAircraftName(report.aircraftId)} • {report.author}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(report.severity)}`}>
                    {report.severity.toUpperCase()}
                  </span>
                  <button
                    onClick={() => downloadReportPDF(report)}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {report.content}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Type: {report.type}</span>
                  <span>Status: {report.status}</span>
                  <span>Created: {report.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-1">
                  {report.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-accent/50 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedReportsPage;
