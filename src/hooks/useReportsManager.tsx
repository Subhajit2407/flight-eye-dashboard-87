
import { useState, useEffect } from 'react';
import { useAircraftManager } from './useAircraftManager';
import { useRealTimeData } from './useRealTimeData';

export interface Report {
  id: string;
  title: string;
  content: string;
  aircraftId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  type: 'bug' | 'maintenance' | 'inspection' | 'incident' | 'registration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  author: string;
  tags: string[];
}

export const useReportsManager = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { aircraft, bugs } = useAircraftManager();
  const { alerts } = useRealTimeData();

  // Generate initial reports from existing data
  useEffect(() => {
    const generateInitialReports = () => {
      const bugReports: Report[] = bugs.map(bug => ({
        id: `bug-${bug.id}`,
        title: `${bug.subsystem} Issue - ${bug.severity}`,
        content: `Aircraft: ${bug.aircraftId}\nSubsystem: ${bug.subsystem}\nDescription: ${bug.description}\nLocation: ${bug.location}\nStatus: ${bug.status}`,
        aircraftId: bug.aircraftId,
        createdAt: bug.timestamp,
        updatedAt: bug.timestamp,
        status: bug.status === 'Resolved' ? 'published' : 'draft',
        type: 'bug',
        severity: bug.severity.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        author: bug.reportedBy,
        tags: [bug.subsystem, bug.severity]
      }));

      const alertReports: Report[] = alerts.slice(0, 5).map(alert => ({
        id: `alert-${alert.id}`,
        title: `${alert.type.toUpperCase()} Alert - ${alert.aircraftId}`,
        content: `Alert Type: ${alert.type}\nAircraft: ${alert.aircraftId}\nMessage: ${alert.message}\nSeverity Level: ${alert.severity}`,
        aircraftId: alert.aircraftId,
        createdAt: alert.timestamp,
        updatedAt: alert.timestamp,
        status: 'published',
        type: 'incident',
        severity: alert.type === 'critical' ? 'critical' : 'medium',
        author: 'System',
        tags: [alert.type, 'real-time']
      }));

      const registrationReports: Report[] = aircraft.map(plane => ({
        id: `registration-${plane.id}`,
        title: `Aircraft Registration - ${plane.aircraftId}`,
        content: `Aircraft ID: ${plane.aircraftId}\nAirline: ${plane.airlineName}\nLocation: ${plane.location}\nRegistration Date: ${plane.dateTime.toLocaleString()}\nFlight Number: ${plane.flightNumber || 'N/A'}`,
        aircraftId: plane.id,
        createdAt: plane.dateTime,
        updatedAt: plane.dateTime,
        status: 'published',
        type: 'registration',
        severity: 'low',
        author: 'System',
        tags: ['registration', plane.airlineName]
      }));

      setReports([...bugReports, ...alertReports, ...registrationReports]);
    };

    generateInitialReports();
  }, [bugs, alerts, aircraft]);

  const createReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReport: Report = {
      ...reportData,
      id: `report-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === id 
        ? { ...report, ...updates, updatedAt: new Date() }
        : report
    ));
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const getReportsByAircraft = (aircraftId: string) => {
    return reports.filter(report => report.aircraftId === aircraftId);
  };

  const getReportsByStatus = (status: Report['status']) => {
    return reports.filter(report => report.status === status);
  };

  const generatePDFContent = (report: Report) => {
    const selectedAircraft = aircraft.find(a => a.id === report.aircraftId);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
          .meta { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .content { line-height: 1.6; margin-bottom: 30px; }
          .footer { border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${report.title}</h1>
          <p>Report ID: ${report.id}</p>
        </div>
        
        <div class="meta">
          <p><strong>Aircraft:</strong> ${selectedAircraft?.aircraftId || report.aircraftId}</p>
          <p><strong>Type:</strong> ${report.type.toUpperCase()}</p>
          <p><strong>Severity:</strong> ${report.severity.toUpperCase()}</p>
          <p><strong>Status:</strong> ${report.status.toUpperCase()}</p>
          <p><strong>Author:</strong> ${report.author}</p>
          <p><strong>Created:</strong> ${report.createdAt.toLocaleString()}</p>
          <p><strong>Updated:</strong> ${report.updatedAt.toLocaleString()}</p>
        </div>
        
        <div class="content">
          <h2>Report Content</h2>
          <div style="white-space: pre-wrap;">${report.content}</div>
        </div>
        
        <div class="footer">
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Aircraft Monitoring System - Automated Report</p>
        </div>
      </body>
      </html>
    `;
  };

  const downloadReportPDF = (report: Report) => {
    const htmlContent = generatePDFContent(report);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/[^a-z0-9]/gi, '_')}_${report.id}.html`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return {
    reports,
    isLoading,
    createReport,
    updateReport,
    deleteReport,
    getReportsByAircraft,
    getReportsByStatus,
    downloadReportPDF
  };
};
