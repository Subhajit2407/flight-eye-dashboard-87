
import React, { useState, useEffect } from 'react';
import { useReportsManager, Report } from '../hooks/useReportsManager';
import { Edit, Download, Plus, Trash2, Search, Filter, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const DashboardManagement: React.FC = () => {
  const { reports, updateReport, deleteReport, downloadReportPDF } = useReportsManager();
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Report['status']>('all');
  const [isPolling, setIsPolling] = useState(true);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());

  // Real-time polling simulation
  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      // Simulate new entries being highlighted
      const randomReport = reports[Math.floor(Math.random() * reports.length)];
      if (randomReport) {
        setHighlightedIds(prev => new Set(prev).add(randomReport.id));
        setTimeout(() => {
          setHighlightedIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(randomReport.id);
            return newSet;
          });
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [reports, isPolling]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (report: Report) => {
    setEditingReport(report);
  };

  const handleSaveEdit = () => {
    if (editingReport) {
      updateReport(editingReport.id, editingReport);
      setEditingReport(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      deleteReport(id);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-100';
      case 'high': return 'text-orange-500 bg-orange-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      case 'low': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="aviation-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Dashboard Management</h3>
            <p className="text-muted-foreground">
              Manage reports with real-time updates
              <span className="ml-2 flex items-center text-green-400">
                <div className={`w-2 h-2 rounded-full mr-1 ${isPolling ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                {isPolling ? 'Live Updates Active' : 'Updates Paused'}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPolling(!isPolling)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isPolling ? 'animate-spin' : ''}`} />
              <span>{isPolling ? 'Live' : 'Start'}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Search Reports</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or content..."
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-muted-foreground">
              Showing {filteredReports.length} of {reports.length} reports
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="aviation-card p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Aircraft</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow 
                key={report.id}
                className={`${highlightedIds.has(report.id) ? 'bg-yellow-50 dark:bg-yellow-900/20 animate-pulse' : ''} transition-all duration-300`}
              >
                <TableCell className="font-medium">{report.title}</TableCell>
                <TableCell>{report.aircraftId}</TableCell>
                <TableCell>
                  <span className="capitalize">{report.type}</span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                    {report.severity.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>{report.updatedAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(report)}
                      className="p-1 hover:bg-accent rounded text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadReportPDF(report)}
                      className="p-1 hover:bg-accent rounded text-green-600 hover:text-green-700"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-1 hover:bg-accent rounded text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      {editingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Report</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={editingReport.title}
                  onChange={(e) => setEditingReport({...editingReport, title: e.target.value})}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={editingReport.status}
                    onChange={(e) => setEditingReport({...editingReport, status: e.target.value as Report['status']})}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Severity</label>
                  <select
                    value={editingReport.severity}
                    onChange={(e) => setEditingReport({...editingReport, severity: e.target.value as Report['severity']})}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={editingReport.content}
                  onChange={(e) => setEditingReport({...editingReport, content: e.target.value})}
                  rows={8}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingReport(null)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardManagement;
