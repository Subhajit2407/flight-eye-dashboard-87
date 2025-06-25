import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Plane, Wifi, AlertTriangle, Clock, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';

const InteractiveGlobalMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [flightPaths, setFlightPaths] = useState<Map<string, Array<{x: number, y: number, timestamp: number}>>>(new Map());
  
  const { flightData, alerts, isLoading, lastUpdate } = useRealTimeData();

  // Track flight paths for animation
  useEffect(() => {
    flightData.forEach(flight => {
      const { x, y } = convertCoordToSVG(flight.latitude, flight.longitude);
      setFlightPaths(prev => {
        const newPaths = new Map(prev);
        const currentPath = newPaths.get(flight.icao24) || [];
        const newPoint = { x, y, timestamp: Date.now() };
        
        // Keep only last 10 positions and remove old ones (older than 5 minutes)
        const filteredPath = [...currentPath, newPoint]
          .filter(point => Date.now() - point.timestamp < 300000)
          .slice(-10);
          
        newPaths.set(flight.icao24, filteredPath);
        return newPaths;
      });
    });
  }, [flightData]);

  const convertCoordToSVG = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  const getFlightRotation = (flight: any) => {
    return flight.true_track || 0;
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setPan(prev => ({
      x: prev.x + deltaX / zoom,
      y: prev.y + deltaY / zoom
    }));
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedFlight(null);
  };

  return (
    <div className="aviation-card p-6 h-[700px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Enhanced Global Flight Tracking</h3>
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
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center space-x-4">
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
        <div className="text-muted-foreground">
          Zoom: {(zoom * 100).toFixed(0)}% | Pan: {pan.x.toFixed(0)}, {pan.y.toFixed(0)}
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative bg-slate-900 rounded-lg overflow-hidden h-[550px] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 800 400"
          className="w-full h-full"
          style={{ 
            background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center'
          }}
        >
          {/* Enhanced World Map Background */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          
          <rect width="800" height="400" fill="url(#grid)" />
          
          {/* Continents with more detail */}
          <g opacity="0.7">
            {/* North America */}
            <path
              d="M100,80 Q150,60 200,80 Q250,100 300,90 L320,110 Q280,140 240,150 Q180,160 120,140 Q80,120 100,80 Z"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* Europe */}
            <path
              d="M380,70 Q420,60 460,70 Q500,80 520,90 L520,120 Q480,130 440,125 Q400,120 380,110 Z"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* Asia */}
            <path
              d="M520,60 Q600,50 680,70 Q720,90 740,110 L740,180 Q700,200 650,190 Q580,180 520,160 Z"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* Africa */}
            <path
              d="M380,120 Q420,130 460,140 Q480,200 460,260 Q420,280 380,270 Q360,220 380,120 Z"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* South America */}
            <path
              d="M200,200 Q240,190 280,210 Q300,260 280,320 Q240,340 200,330 Q180,280 200,200 Z"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* Australia */}
            <path
              d="M600,280 Q650,270 700,280 Q720,300 700,320 Q650,330 600,320 Q580,310 600,280 Z"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1"
            />
          </g>

          {/* Flight Paths */}
          {Array.from(flightPaths.entries()).map(([icao24, path]) => (
            path.length > 1 && (
              <g key={`path-${icao24}`}>
                <path
                  d={`M ${path.map(p => `${p.x},${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1"
                  opacity="0.6"
                  strokeDasharray="2,2"
                />
              </g>
            )
          ))}

          {/* Flight Markers */}
          {flightData.map((flight, index) => {
            const { x, y } = convertCoordToSVG(flight.latitude, flight.longitude);
            const isSelected = selectedFlight?.icao24 === flight.icao24;
            const rotation = getFlightRotation(flight);
            
            return (
              <g key={flight.icao24} className="cursor-pointer">
                {/* Flight marker */}
                <g transform={`translate(${x},${y}) rotate(${rotation})`}>
                  <circle
                    r={isSelected ? 8 : 5}
                    fill={flight.on_ground ? '#3b82f6' : '#10b981'}
                    stroke={isSelected ? '#fbbf24' : 'white'}
                    strokeWidth={isSelected ? 2 : 1}
                    className="transition-all duration-200"
                    onClick={() => setSelectedFlight(selectedFlight?.icao24 === flight.icao24 ? null : flight)}
                  />
                  
                  {/* Aircraft icon for airborne flights */}
                  {!flight.on_ground && (
                    <path
                      d="M0,-8 L-3,-2 L-8,0 L-3,2 L0,8 L3,2 L8,0 L3,-2 Z"
                      fill="white"
                      stroke="none"
                      fontSize="8"
                      className="pointer-events-none"
                    />
                  )}
                </g>
                
                {/* Callsign label */}
                {isSelected && (
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {flight.callsign}
                  </text>
                )}
                
                {/* Velocity indicator */}
                {!flight.on_ground && flight.velocity > 100 && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1"
                    opacity="0.3"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}

          {/* Alert Markers */}
          {alerts.slice(0, 15).map((alert, index) => {
            // Distribute alerts across the map
            const randomX = 100 + (index * 47) % 600;
            const randomY = 100 + (index * 31) % 200;
            
            return (
              <g key={alert.id}>
                <circle
                  cx={randomX}
                  cy={randomY}
                  r="8"
                  fill={getAlertColor(alert.type)}
                  stroke="white"
                  strokeWidth="2"
                  className="animate-pulse cursor-pointer"
                  onClick={() => console.log('Alert clicked:', alert)}
                />
                <text
                  x={randomX}
                  y={randomY + 3}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  !
                </text>
              </g>
            );
          })}
        </svg>

        {/* Flight Details Panel */}
        {selectedFlight && (
          <div className="absolute top-4 right-4 bg-background border border-border rounded-lg p-4 w-72 shadow-lg max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">{selectedFlight.callsign}</h4>
              <button
                onClick={() => setSelectedFlight(null)}
                className="text-muted-foreground hover:text-foreground text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Country:</strong></div>
                <div>{selectedFlight.origin_country}</div>
                
                <div><strong>Altitude:</strong></div>
                <div>{selectedFlight.baro_altitude ? `${Math.round(selectedFlight.baro_altitude).toLocaleString()} m` : 'N/A'}</div>
                
                <div><strong>Speed:</strong></div>
                <div>{selectedFlight.velocity ? `${Math.round(selectedFlight.velocity * 3.6)} km/h` : 'N/A'}</div>
                
                <div><strong>Heading:</strong></div>
                <div>{selectedFlight.true_track ? `${Math.round(selectedFlight.true_track)}°` : 'N/A'}</div>
                
                <div><strong>Vertical Rate:</strong></div>
                <div>{selectedFlight.vertical_rate ? `${selectedFlight.vertical_rate > 0 ? '+' : ''}${Math.round(selectedFlight.vertical_rate)} m/s` : 'N/A'}</div>
                
                <div><strong>Status:</strong></div>
                <div className={`px-2 py-1 rounded text-xs ${selectedFlight.on_ground ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {selectedFlight.on_ground ? 'On Ground' : 'Airborne'}
                </div>
              </div>
              
              <div className="pt-2 border-t border-border">
                <div><strong>Last Contact:</strong></div>
                <div>{new Date(selectedFlight.last_contact * 1000).toLocaleString()}</div>
              </div>
              
              <div className="pt-2">
                <div><strong>Coordinates:</strong></div>
                <div className="font-mono text-xs">
                  {selectedFlight.latitude.toFixed(4)}, {selectedFlight.longitude.toFixed(4)}
                </div>
              </div>
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

        {/* Map Controls */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Click and drag to pan • Use zoom controls • Click flights for details
        </div>
      </div>
    </div>
  );
};

export default InteractiveGlobalMap;
