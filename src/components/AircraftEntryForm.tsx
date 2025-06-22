
import React, { useState } from 'react';
import { Plane, MapPin, Calendar, Building2 } from 'lucide-react';
import { useAircraftManager } from '../hooks/useAircraftManager';

interface AircraftEntryFormProps {
  onAircraftAdded?: (aircraftId: string) => void;
}

const AircraftEntryForm: React.FC<AircraftEntryFormProps> = ({ onAircraftAdded }) => {
  const { addAircraft } = useAircraftManager();
  const [formData, setFormData] = useState({
    airlineName: '',
    aircraftId: '',
    flightNumber: '',
    location: '',
    dateTime: new Date().toISOString().slice(0, 16)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const aircraftId = addAircraft({
      ...formData,
      dateTime: new Date(formData.dateTime)
    });
    
    if (onAircraftAdded) {
      onAircraftAdded(aircraftId);
    }
    
    // Reset form
    setFormData({
      airlineName: '',
      aircraftId: '',
      flightNumber: '',
      location: '',
      dateTime: new Date().toISOString().slice(0, 16)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Plane className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Aircraft Registration</h3>
          <p className="text-muted-foreground">Register new aircraft for error tracking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Airline Name *
            </label>
            <input
              type="text"
              name="airlineName"
              value={formData.airlineName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g., Emirates Airlines"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Plane className="w-4 h-4 inline mr-2" />
              Aircraft ID / Serial Number *
            </label>
            <input
              type="text"
              name="aircraftId"
              value={formData.aircraftId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g., AI-302, N747BA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Flight Number (Optional)</label>
            <input
              type="text"
              name="flightNumber"
              value={formData.flightNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g., EK203, AI401"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location (Airport Code) *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g., JFK, LAX, DXB"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date & Time of Registration
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium"
        >
          Register Aircraft
        </button>
      </form>
    </div>
  );
};

export default AircraftEntryForm;
