
import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Bug, Shield, Zap } from 'lucide-react';

interface MapIncident {
  id: number;
  lat: number;
  lng: number;
  type: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  aircraft: string;
  description: string;
  timestamp: string;
}

const GlobalMap: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<MapIncident | null>(null);
  const [incidents, setIncidents] = useState<MapIncident[]>([
    { 
      id: 1, 
      lat: 40.7128, 
      lng: -74.0060, 
      type: 'critical', 
      location: 'New York, USA',
      aircraft: 'Boeing 737-800',
      description: 'Navigation system malfunction detected',
      timestamp: '2m ago'
    },
    { 
      id: 2, 
      lat: 51.5074, 
      lng: -0.1278, 
      type: 'high', 
      location: 'London, UK',
      aircraft: 'Airbus A320',
      description: 'Engine performance anomaly',
      timestamp: '5m ago'
    },
    { 
      id: 3, 
      lat: 35.6762, 
      lng: 139.6503, 
      type: 'medium', 
      location: 'Tokyo, Japan',
      aircraft: 'Boeing 777-300',
      description: 'Communication timeout warning',
      timestamp: '8m ago'
    },
    { 
      id: 4, 
      lat: -33.8688, 
      lng: 151.2093, 
      type: 'low', 
      location: 'Sydney, Australia',
      aircraft: 'Airbus A330',
      description: 'Sensor calibration drift',
      timestamp: '12m ago'
    },
    { 
      id: 5, 
      lat: 37.7749, 
      lng: -122.4194, 
      type: 'critical', 
      location: 'San Francisco, USA',
      aircraft: 'Boeing 787',
      description: 'Flight control system error',
      timestamp: '15m ago'
    },
    { 
      id: 6, 
      lat: 48.8566, 
      lng: 2.3522, 
      type: 'high', 
      location: 'Paris, France',
      aircraft: 'Airbus A350',
      description: 'Hydraulic pressure warning',
      timestamp: '18m ago'
    }
  ]);

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  const getIncidentBgColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-400';
      case 'high': return 'bg-orange-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-blue-400';
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'high': return Zap;
      case 'medium': return Bug;
      case 'low': return Shield;
      default: return MapPin;
    }
  };

  // Simulate new incidents appearing
  useEffect(() => {
    const interval = setInterval(() => {
      const newIncident: MapIncident = {
        id: Date.now(),
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
        type: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as any,
        location: ['Mumbai, India', 'Dubai, UAE', 'Los Angeles, USA', 'Berlin, Germany'][Math.floor(Math.random() * 4)],
        aircraft: ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A330'][Math.floor(Math.random() * 4)],
        description: [
          'System diagnostic alert',
          'Performance threshold exceeded',
          'Maintenance required',
          'Configuration mismatch'
        ][Math.floor(Math.random() * 4)],
        timestamp: 'Just now'
      };
      
      setIncidents(prev => [newIncident, ...prev.slice(0, 9)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Global Activity Map</h3>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-muted-foreground">Live Updates</div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Interactive World Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden border border-border/20">
        {/* World Map SVG Background */}
        <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-30">
          {/* Simplified world map paths */}
          <path d="M158 206c9-1 24-6 32-5 23 3 46 9 69 7 15-1 30-7 45-6 42 4 84 19 126 18 28-1 56-8 84-6 35 3 70 14 105 13 25-1 50-6 75-4 38 3 76 12 114 11 23-1 46-5 69-3 29 2 58 8 87 7 21-1 42-4 63-2 27 2 54 7 81 6 19-1 38-3 57-1 24 2 48 6 72 5 17-1 34-2 51 0 21 2 42 5 63 4 15-1 30-2 45 0 19 2 38 5 57 4 13-1 26-1 39 1 16 2 32 5 48 4 11-1 22-1 33 1 13 2 26 4 39 3 9-1 18-1 27 1 11 2 22 4 33 3 7-1 14-1 21 1 8 2 16 4 24 3 5-1 10-1 15 1 6 2 12 4 18 3 4-1 8-1 12 1 5 2 10 4 15 3 3-1 6-1 9 1 4 2 8 4 12 3 2-1 4-1 6 1 3 2 6 4 9 3 1-1 2-1 3 1 2 2 4 4 6 3 1-1 1-1 2 1 1 2 2 4 3 3 0-1 0-1 1 1 1 2 1 4 2 3" 
                fill="currentColor" className="text-blue-500/40" />
          <path d="M200 150c15-2 35-8 50-7 45 4 90 16 135 14 30-1 60-9 90-7 50 5 100 20 150 18 35-1 70-10 105-8 55 4 110 18 165 16 40-1 80-8 120-6 60 5 120 20 180 18 30-1 60-6 90-4 45 4 90 15 135 13 25-1 50-4 75-2 38 3 76 10 114 8 23-1 46-3 69-1 29 3 58 9 87 7 19-1 38-2 57 0 24 3 48 8 72 6 15-1 30-1 45 1 19 3 38 7 57 5 12-1 24-1 36 2 15 3 30 7 45 5 9-1 18-1 27 2 11 3 22 7 33 5 6-1 12-1 18 2 7 3 14 7 21 5 4-1 8-1 12 2 5 3 10 7 15 5 2-1 4-1 6 2 3 3 6 7 9 5 1-1 2-1 3 2 2 3 3 7 5 5 0-1 1-1 1 2 1 3 1 7 2 5" 
                fill="currentColor" className="text-green-500/30" />
          <path d="M100 300c12-1 28-4 40-3 32 2 64 8 96 7 20-1 40-3 60-2 38 2 76 8 114 7 24-1 48-3 72-1 36 2 72 8 108 7 22-1 44-2 66 0 33 2 66 7 99 6 20-1 40-1 60 1 30 2 60 6 90 5 18-1 36-1 54 1 27 2 54 6 81 5 16-1 32-1 48 1 24 2 48 5 72 4 14-1 28-1 42 1 21 2 42 5 63 4 12-1 24-1 36 1 18 2 36 4 54 3 10-1 20-1 30 1 15 2 30 4 45 3 8-1 16-1 24 1 12 2 24 4 36 3 6-1 12-1 18 1 9 2 18 4 27 3 5-1 10-1 15 1 7 2 14 4 21 3 3-1 6-1 9 1 5 2 10 4 15 3 2-1 4-1 6 1 4 2 7 4 11 3 1-1 2-1 3 1 2 2 4 4 6 3 1-1 1-1 2 1 1 2 2 4 3 3" 
                fill="currentColor" className="text-purple-500/20" />
        </svg>
        
        {/* Flight paths/connections */}
        <svg className="absolute inset-0 w-full h-full">
          {incidents.slice(0, 4).map((incident, index) => (
            <g key={incident.id}>
              <path
                d={`M${200 + index * 150},${150 + index * 50} Q${400 + index * 100},${100 + index * 30} ${600 + index * 50},${200 + index * 40}`}
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-blue-400/30"
                strokeDasharray="5,5"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;10"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          ))}
        </svg>
        
        {/* Incident markers with proper positioning */}
        {incidents.map((incident, index) => {
          const IconComponent = getIncidentIcon(incident.type);
          return (
            <div
              key={incident.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in cursor-pointer z-10"
              style={{
                left: `${15 + (index % 5) * 18}%`,
                top: `${25 + Math.floor(index / 5) * 25 + (index % 3) * 8}%`,
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => setSelectedIncident(incident)}
            >
              <div className="relative group">
                <div className={`w-6 h-6 rounded-full ${getIncidentBgColor(incident.type)} flex items-center justify-center animate-pulse-glow shadow-lg`}>
                  <IconComponent className="w-3 h-3 text-white" />
                </div>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="bg-gray-900 px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-gray-700 shadow-xl">
                    <div className="font-medium text-white">{incident.location}</div>
                    <div className="text-gray-300 capitalize">{incident.type} - {incident.aircraft}</div>
                  </div>
                </div>
                {/* Ripple effect */}
                <div className={`absolute inset-0 rounded-full ${getIncidentBgColor(incident.type)} opacity-30 animate-ping`}></div>
              </div>
            </div>
          );
        })}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-4 backdrop-blur-sm border border-gray-700">
          <div className="text-xs font-medium text-white mb-3">Severity Levels</div>
          <div className="space-y-2">
            {[
              { type: 'critical', label: 'Critical', count: incidents.filter(i => i.type === 'critical').length },
              { type: 'high', label: 'High', count: incidents.filter(i => i.type === 'high').length },
              { type: 'medium', label: 'Medium', count: incidents.filter(i => i.type === 'medium').length },
              { type: 'low', label: 'Low', count: incidents.filter(i => i.type === 'low').length }
            ].map(({ type, label, count }) => {
              const IconComponent = getIncidentIcon(type);
              return (
                <div key={type} className="flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 ${getIncidentBgColor(type)} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-xs text-gray-300">{label}</span>
                  </div>
                  <span className="text-xs text-white font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active aircraft indicator */}
        <div className="absolute top-4 right-4 bg-black/70 rounded-lg p-3 backdrop-blur-sm border border-gray-700">
          <div className="text-xs text-gray-300 mb-1">Active Aircraft</div>
          <div className="text-lg font-bold text-white">{incidents.length * 12}</div>
          <div className="text-xs text-green-400">+3 this hour</div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-6 space-y-3">
        <h4 className="text-sm font-medium text-foreground">Recent Incidents</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {incidents.slice(0, 5).map((incident) => {
            const IconComponent = getIncidentIcon(incident.type);
            return (
              <div 
                key={incident.id} 
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
                onClick={() => setSelectedIncident(incident)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getIncidentBgColor(incident.type)} flex items-center justify-center`}>
                    <IconComponent className="w-2 h-2 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">{incident.location}</div>
                    <div className="text-xs text-muted-foreground">{incident.aircraft}</div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{incident.timestamp}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedIncident(null)}>
          <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4 border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Incident Details</h3>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium">{selectedIncident.location}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Aircraft</div>
                <div className="font-medium">{selectedIncident.aircraft}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Severity</div>
                <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${selectedIncident.type === 'critical' ? 'bg-red-400/10 text-red-400' : selectedIncident.type === 'high' ? 'bg-orange-400/10 text-orange-400' : selectedIncident.type === 'medium' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-green-400/10 text-green-400'}`}>
                  <span className="capitalize">{selectedIncident.type}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="font-medium">{selectedIncident.description}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Reported</div>
                <div className="font-medium">{selectedIncident.timestamp}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalMap;
