
import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar, Plane, Search, Edit, Save, X } from 'lucide-react';
import { useAircraftManager } from '../hooks/useAircraftManager';
import { useRealTimeData } from '../hooks/useRealTimeData';

const EnhancedReportsPage: React.FC = () => {
  const { aircraft, bugs, getBugsByAircraft } = useAircraftManager();
  const { alerts, flightData } = useRealTimeData();
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('');
  const [dateFilter, setDateFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [reportTitle, setReportTitle] = useState('Aircraft System Analysis Report');

  const filteredBugs = selectedAircraftId 
    ? getBugsByAircraft(selectedAircraftId)
    : bugs;

  const finalFilteredBugs = filteredBugs.filter(bug => {
    if (dateFilter && !bug.timestamp.toISOString().startsWith(dateFilter)) return false;
    if (severityFilter && bug.severity !== severityFilter) return false;
    return true;
  });

  const generateDetailedReport = () => {
    const selectedAircraft = selectedAircraftId 
      ? aircraft.find(a => a.id === selectedAircraftId)
      : null;

    const reportData = {
      title: reportTitle,
      generatedAt: new Date().toISOString(),
      summary: {
        totalAircraft: aircraft.length,
        totalBugs: finalFilteredBugs.length,
        criticalBugs: finalFilteredBugs.filter(b => b.severity === 'Critical').length,
        resolvedBugs: finalFilteredBugs.filter(b => b.status === 'Resolved').length,
        activeAlerts: alerts.length,
        trackedFlights: flightData.length
      },
      aircraft: selectedAircraft || { aircraftId: 'All Aircraft', airlineName: 'Multiple Airlines' },
      bugs: finalFilteredBugs.map(bug => ({
        id: bug.id,
        aircraftId: bug.aircraftId,
        subsystem: bug.subsystem,
        severity: bug.severity,
        description: bug.description,
        timestamp: bug.timestamp.toISOString(),
        status: bug.status,
        reportedBy: bug.reportedBy,
        location: bug.location,
        airlineName: bug.airlineName
      })),
      alerts: alerts.slice(0, 10).map(alert => ({
        id: alert.id,
        aircraftId: alert.aircraftId,
        type: alert.type,
        message: alert.message,
        timestamp: alert.timestamp.toISOString(),
        severity: alert.severity
      })),
      customContent: reportContent
    };

    return reportData;
  };

  const downloadPDFReport = () => {
    const reportData = generateDetailedReport();
    const selectedAircraft = selectedAircraftId 
      ? aircraft.find(a => a.id === selectedAircraftId)
      : null;
    
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportData.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
          .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .section { margin-bottom: 30px; }
          .bug-item { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px; }
          .critical { border-left: 4px solid #dc3545; }
          .high { border-left: 4px solid #fd7e14; }
          .medium { border-left: 4px solid #ffc107; }
          .low { border-left: 4px solid #28a745; }
          .stats { display: flex; justify-content: space-around; text-align: center; }
          .stat-item { padding: 10px; background: #e9ecef; border-radius: 5px; margin: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${reportData.title}</h1>
          <p>Generated: ${new Date(reportData.generatedAt).toLocaleString()}</p>
          <p>Aircraft: ${reportData.aircraft.aircraftId} - ${reportData.aircraft.airlineName}</p>
        </div>
        
        <div class="summary">
          <h2>Executive Summary</h2>
          <div class="stats">
            <div class="stat-item">
              <h3>${reportData.summary.totalAircraft}</h3>
              <p>Total Aircraft</p>
            </div>
            <div class="stat-item">
              <h3>${reportData.summary.totalBugs}</h3>
              <p>Total Issues</p>
            </div>
            <div class="stat-item">
              <h3>${reportData.summary.criticalBugs}</h3>
              <p>Critical Issues</p>
            </div>
            <div class="stat-item">
              <h3>${reportData.summary.resolvedBugs}</h3>
              <p>Resolved Issues</p>
            </div>
          </div>
        </div>

        ${reportData.customContent ? `
        <div class="section">
          <h2>Analysis Notes</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            ${reportData.customContent.replace(/\n/g, '<br>')}
          </div>
        </div>
        ` : ''}

        <div class="section">
          <h2>Issue Details</h2>
          ${reportData.bugs.map(bug => `
            <div class="bug-item ${bug.severity.toLowerCase()}">
              <h4>${bug.subsystem} - ${bug.severity}</h4>
              <p><strong>Aircraft:</strong> ${bug.aircraftId} (${bug.airlineName})</p>
              <p><strong>Description:</strong> ${bug.description}</p>
              <p><strong>Status:</strong> ${bug.status}</p>
              <p><strong>Reported:</strong> ${new Date(bug.timestamp).toLocaleString()}</p>
              <p><strong>Location:</strong> ${bug.location}</p>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Recent Alerts</h2>
          ${reportData.alerts.map(alert => `
            <div class="bug-item">
              <h4>${alert.type.toUpperCase()} Alert</h4>
              <p><strong>Aircraft:</strong> ${alert.aircraftId}</p>
              <p><strong>Message:</strong> ${alert.message}</p>
              <p><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedAircraft?.aircraftId || 'All_Aircraft'}_Detailed_Report_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const saveReport = () => {
    const reportData = generateDetailedReport();
    localStorage.setItem('saved_aircraft_report', JSON.stringify({
      ...reportData,
      savedAt: new Date().toISOString()
    }));
    setIsEditingReport(false);
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
              <h3 className="text-xl font-semibold">Enhanced Aircraft Reports</h3>
              <p className="text-muted-foreground">Generate comprehensive analysis reports with custom content</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditingReport(!isEditingReport)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isEditingReport ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              <span>{isEditingReport ? 'Cancel' : 'Edit Report'}</span>
            </button>
            {isEditingReport && (
              <button
                onClick={saveReport}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Report</span>
              </button>
            )}
            <button
              onClick={downloadPDFReport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Report Editor */}
        {isEditingReport && (
          <div className="mb-6 p-4 bg-accent/20 rounded-lg border border-border">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Report Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Custom Analysis & Notes</label>
              <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="Add your analysis, observations, recommendations, and conclusions here..."
                rows={8}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        )}

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

        {/* Enhanced Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{finalFilteredBugs.length}</div>
            <div className="text-sm text-muted-foreground">Total Issues</div>
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
          <div className="bg-accent/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-400">{alerts.length}</div>
            <div className="text-sm text-muted-foreground">Active Alerts</div>
          </div>
        </div>
      </div>

      {/* Real-time Preview */}
      <div className="aviation-card p-6">
        <h4 className="text-lg font-semibold mb-4">Report Preview</h4>
        <div className="bg-accent/10 p-4 rounded-lg border border-border">
          <h5 className="font-semibold text-lg mb-2">{reportTitle}</h5>
          <p className="text-sm text-muted-foreground mb-4">
            Generated: {new Date().toLocaleString()} | 
            Aircraft: {selectedAircraftId ? aircraft.find(a => a.id === selectedAircraftId)?.aircraftId : 'All Aircraft'}
          </p>
          
          {reportContent && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
              <p className="whitespace-pre-wrap">{reportContent}</p>
            </div>
          )}
          
          <div className="text-sm">
            <p><strong>Issues Found:</strong> {finalFilteredBugs.length}</p>
            <p><strong>Critical Issues:</strong> {finalFilteredBugs.filter(b => b.severity === 'Critical').length}</p>
            <p><strong>Resolution Rate:</strong> {finalFilteredBugs.length > 0 ? Math.round((finalFilteredBugs.filter(b => b.status === 'Resolved').length / finalFilteredBugs.length) * 100) : 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedReportsPage;
