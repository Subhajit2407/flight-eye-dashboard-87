
import React, { useState } from 'react';
import { Bug, AlertTriangle, User, Clock } from 'lucide-react';
import { useAircraftManager } from '../hooks/useAircraftManager';
import { useReportsManager } from '../hooks/useReportsManager';
import { useToast } from '../hooks/use-toast';
import { Textarea } from './ui/textarea';

const EnhancedBugReportForm: React.FC = () => {
  const { aircraft, addBugReport } = useAircraftManager();
  const { createReport } = useReportsManager();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    aircraftId: '',
    subsystem: '',
    severity: 'Medium' as const,
    description: '',
    type: 'Hardware' as const,
    reportedBy: 'Engineer' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.aircraftId) {
      toast({
        title: "Error",
        description: "Please select an aircraft first",
        variant: "destructive"
      });
      return;
    }

    const selectedAircraft = aircraft.find(a => a.id === formData.aircraftId);
    if (!selectedAircraft) {
      toast({
        title: "Error",
        description: "Selected aircraft not found",
        variant: "destructive"
      });
      return;
    }

    // Add bug report to aircraft manager
    addBugReport({
      ...formData,
      location: selectedAircraft.location,
      airlineName: selectedAircraft.airlineName
    });

    // Create a report entry
    createReport({
      title: `${formData.subsystem} Issue - ${formData.severity}`,
      content: `Aircraft: ${selectedAircraft.aircraftId} (${selectedAircraft.airlineName})\nSubsystem: ${formData.subsystem}\nDescription: ${formData.description}\nLocation: ${selectedAircraft.location}\nReported By: ${formData.reportedBy}\nType: ${formData.type}`,
      aircraftId: formData.aircraftId,
      status: 'draft',
      type: 'bug',
      severity: formData.severity.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
      author: formData.reportedBy,
      tags: [formData.subsystem, formData.severity, formData.type]
    });

    toast({
      title: "Bug Report Submitted",
      description: `Bug report for ${selectedAircraft.aircraftId} has been created and added to reports.`,
    });

    // Reset form
    setFormData({
      aircraftId: '',
      subsystem: '',
      severity: 'Medium',
      description: '',
      type: 'Hardware',
      reportedBy: 'Engineer'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
          <Bug className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Bug Report Submission</h3>
          <p className="text-muted-foreground">Submit detailed aircraft system error reports</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Aircraft *</label>
            <select
              name="aircraftId"
              value={formData.aircraftId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Choose Aircraft...</option>
              {aircraft.map(a => (
                <option key={a.id} value={a.id}>
                  {a.aircraftId} - {a.airlineName}
                </option>
              ))}
            </select>
            {aircraft.length === 0 && (
              <p className="text-sm text-yellow-500 mt-1">
                No aircraft registered yet. Please register an aircraft first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Affected Subsystem *</label>
            <select
              name="subsystem"
              value={formData.subsystem}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select Subsystem...</option>
              <option value="Engine">Engine</option>
              <option value="Flight Control">Flight Control</option>
              <option value="Navigation">Navigation</option>
              <option value="Landing Gear">Landing Gear</option>
              <option value="Communication">Communication</option>
              <option value="Radar">Radar</option>
              <option value="Hydraulics">Hydraulics</option>
              <option value="Electrical">Electrical</option>
              <option value="Avionics">Avionics</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Error Severity *
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Issue Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Sensor">Sensor</option>
              <option value="Configuration">Configuration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Reported By *
            </label>
            <select
              name="reportedBy"
              value={formData.reportedBy}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Pilot">Pilot</option>
              <option value="Engineer">Engineer</option>
              <option value="AI Log">AI Log</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bug Description *</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Provide detailed description of the issue, symptoms, and any relevant information..."
            className="w-full min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
        >
          Submit Bug Report
        </button>
      </form>
    </div>
  );
};

export default EnhancedBugReportForm;
