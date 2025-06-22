
import React from 'react';
import { MapPin, AlertTriangle, Bug, Shield } from 'lucide-react';

const GlobalMap: React.FC = () => {
  const incidents = [
    { id: 1, lat: 40.7128, lng: -74.0060, type: 'critical', location: 'New York' },
    { id: 2, lat: 51.5074, lng: -0.1278, type: 'high', location: 'London' },
    { id: 3, lat: 35.6762, lng: 139.6503, type: 'medium', location: 'Tokyo' },
    { id: 4, lat: -33.8688, lng: 151.2093, type: 'low', location: 'Sydney' },
    { id: 5, lat: 37.7749, lng: -122.4194, type: 'critical', location: 'San Francisco' },
  ];

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Global Activity Map</h3>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-muted-foreground">Live Updates</div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Mock World Map Container */}
      <div className="relative h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
        {/* Simulated world map background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 800 400" className="w-full h-full">
            <path d="M100,100 Q200,50 300,100 T500,100 Q600,80 700,100 L700,300 Q600,280 500,300 T300,300 Q200,320 100,300 Z" 
                  fill="currentColor" className="text-blue-500/30" />
            <path d="M150,150 Q250,120 350,150 T550,150 Q650,130 750,150 L750,250 Q650,230 550,250 T350,250 Q250,270 150,250 Z" 
                  fill="currentColor" className="text-green-500/20" />
          </svg>
        </div>
        
        {/* Incident markers */}
        {incidents.map((incident, index) => (
          <div
            key={incident.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${30 + (index * 10)}%`,
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className={`relative group cursor-pointer`}>
              <div className={`w-4 h-4 rounded-full ${getIncidentColor(incident.type).replace('text-', 'bg-')} animate-pulse-glow`}></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 px-2 py-1 rounded text-xs whitespace-nowrap">
                  {incident.location} - {incident.type}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg p-3 backdrop-blur-sm">
          <div className="text-xs font-medium text-white mb-2">Severity Levels</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-xs text-gray-300">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span className="text-xs text-gray-300">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-xs text-gray-300">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-300">Low</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-foreground">Recent Activity</h4>
        <div className="space-y-2">
          {incidents.slice(0, 3).map((incident) => (
            <div key={incident.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getIncidentColor(incident.type).replace('text-', 'bg-')}`}></div>
                <span className="text-xs">{incident.location}</span>
              </div>
              <span className="text-xs text-muted-foreground">2m ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalMap;
