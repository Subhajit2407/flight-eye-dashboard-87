
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Plane, Wifi, AlertTriangle, Clock } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';

const RealGlobalMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const { flightData, alerts, isLoading, lastUpdate } = useRealTimeData();

  // World map path (simplified for demonstration)
  const worldMapPath = "M158.719,104.062 L158.719,104.062 L156.25,106.531 L153.781,109 L149.844,111.469 L145.906,113.938 L142.25,116.406 L138.594,118.875 L134.938,121.344 L131.281,123.812 L127.625,126.281 L123.969,128.75 L120.312,131.219 L116.656,133.688 L113,136.156 L109.344,138.625 L105.688,141.094 L102.031,143.562 L98.375,146.031 L94.719,148.5 L91.062,150.969 L87.406,153.438 L83.75,155.906 L80.094,158.375 L76.438,160.844 L72.781,163.312 L69.125,165.781 L65.469,168.25 L61.812,170.719 L58.156,173.188 L54.5,175.656 L50.844,178.125";

  const convertCoordToSVG = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  const getFlightIcon = (flight: any) => {
    if (flight.on_ground) return '🛬';
    if (flight.baro_altitude > 10000) return '✈️';
    return '🛫';
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="aviation-card p-6 h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Live Global Flight Tracking</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Wifi className={`w-4 h-4 ${isLoading ? 'text-red-400' : 'text-green-400'}`} />
              <span>{isLoading ? 'Connecting...' : 'Live Data'}</span>
              {lastUpdate && (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>{flightData.filter(f => !f.on_ground).length} Airborne</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>{flightData.filter(f => f.on_ground).length} Ground</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>{alerts.length} Alerts</span>
          </div>
        </div>
      </div>

      <div className="relative bg-slate-900 rounded-lg overflow-hidden h-[500px]">
        <svg
          ref={svgRef}
          viewBox="0 0 800 400"
          className="w-full h-full"
          style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a)' }}
        >
          {/* World Map Background */}
          <g>
            {/* Continents (simplified representation) */}
            <path
              d="M100,150 Q200,120 300,150 Q400,180 500,150 Q600,120 700,150 L700,250 Q600,280 500,250 Q400,220 300,250 Q200,280 100,250 Z"
              fill="#334155"
              opacity="0.6"
            />
            <path
              d="M50,200 Q150,170 250,200 Q350,230 450,200 L450,300 Q350,330 250,300 Q150,270 50,300 Z"
              fill="#334155"
              opacity="0.6"
            />
            {/* Grid lines */}
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={`lat-${i}`}
                x1="0"
                y1={i * 50}
                x2="800"
                y2={i * 50}
                stroke="#475569"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
            {Array.from({ length: 17 }, (_, i) => (
              <line
                key={`lon-${i}`}
                x1={i * 50}
                y1="0"
                x2={i * 50}
                y2="400"
                stroke="#475569"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
          </g>

          {/* Flight Markers */}
          {flightData.map((flight, index) => {
            const { x, y } = convertCoordToSVG(flight.latitude, flight.longitude);
            const isSelected = selectedFlight?.icao24 === flight.icao24;
            
            return (
              <g key={flight.icao24} className="cursor-pointer" onClick={() => setSelectedFlight(flight)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 8 : 4}
                  fill={flight.on_ground ? '#3b82f6' : '#10b981'}
                  stroke={isSelected ? '#fbbf24' : 'white'}
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all duration-200"
                />
                {flight.velocity > 0 && !flight.on_ground && (
                  <line
                    x1={x}
                    y1={y}
                    x2={x + Math.cos((flight.true_track || 0) * Math.PI / 180) * 15}
                    y2={y + Math.sin((flight.true_track || 0) * Math.PI / 180) * 15}
                    stroke="#10b981"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                )}
                {isSelected && (
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {flight.callsign}
                  </text>
                )}
              </g>
            );
          })}

          {/* Alert Markers */}
          {alerts.slice(0, 10).map((alert, index) => {
            const randomX = 100 + Math.random() * 600;
            const randomY = 100 + Math.random() * 200;
            
            return (
              <g key={alert.id}>
                <circle
                  cx={randomX}
                  cy={randomY}
                  r="6"
                  fill={getAlertColor(alert.type)}
                  stroke="white"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                <text
                  x={randomX}
                  y={randomY + 20}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                >
                  ⚠️
                </text>
              </g>
            );
          })}

          {/* Arrow marker for flight direction */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#10b981"
              />
            </marker>
          </defs>
        </svg>

        {/* Flight Details Panel */}
        {selectedFlight && (
          <div className="absolute top-4 right-4 bg-background border border-border rounded-lg p-4 w-64 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{selectedFlight.callsign}</h4>
              <button
                onClick={() => setSelectedFlight(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <div><strong>Country:</strong> {selectedFlight.origin_country}</div>
              <div><strong>Altitude:</strong> {selectedFlight.baro_altitude ? `${Math.round(selectedFlight.baro_altitude)} m` : 'N/A'}</div>
              <div><strong>Speed:</strong> {selectedFlight.velocity ? `${Math.round(selectedFlight.velocity)} m/s` : 'N/A'}</div>
              <div><strong>Status:</strong> {selectedFlight.on_ground ? 'On Ground' : 'Airborne'}</div>
              <div><strong>Last Contact:</strong> {new Date(selectedFlight.last_contact * 1000).toLocaleTimeString()}</div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading flight data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealGlobalMap;
