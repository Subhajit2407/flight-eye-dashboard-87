
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Plane, Wifi, AlertTriangle, Clock, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';

const InteractiveGlobalMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [mapTransform, setMapTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { flightData, alerts, isLoading, lastUpdate } = useRealTimeData();

  // Enhanced world map with more detail
  const worldMapPaths = [
    // North America
    "M158,150 Q200,120 300,150 Q400,180 500,150 Q550,130 600,150 L580,200 Q520,230 450,200 Q350,230 250,200 Q200,180 158,200 Z",
    // Europe
    "M480,140 Q520,120 580,140 Q620,160 580,180 Q540,200 480,180 Q460,160 480,140 Z",
    // Asia
    "M580,140 Q650,120 750,140 Q800,160 750,200 Q700,220 650,200 Q580,180 580,140 Z",
    // Africa
    "M450,180 Q500,160 550,180 Q580,220 550,280 Q500,320 450,280 Q420,230 450,180 Z",
    // South America
    "M280,220 Q320,200 360,220 Q380,280 360,340 Q320,380 280,340 Q260,280 280,220 Z",
    // Australia
    "M700,280 Q750,260 800,280 Q820,300 800,320 Q750,340 700,320 Q680,300 700,280 Z"
  ];

  const handleZoom = useCallback((factor: number, centerX?: number, centerY?: number) => {
    setMapTransform(prev => {
      const newScale = Math.min(Math.max(prev.scale * factor, 0.5), 5);
      
      if (centerX !== undefined && centerY !== undefined) {
        const deltaX = (centerX - prev.translateX) * (factor - 1);
        const deltaY = (centerY - prev.translateY) * (factor - 1);
        
        return {
          scale: newScale,
          translateX: prev.translateX - deltaX,
          translateY: prev.translateY - deltaY
        };
      }
      
      return { ...prev, scale: newScale };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setMapTransform(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    handleZoom(factor, centerX, centerY);
  }, [handleZoom]);

  const resetView = () => {
    setMapTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  const convertCoordToSVG = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`aviation-card p-6 ${isFullscreen ? 'fixed inset-0 z-50 m-4' : 'h-[700px]'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Interactive Global Flight Map</h3>
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
            onClick={() => handleZoom(1.2)}
            className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.8)}
            className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span>{flightData.filter(f => !f.on_ground).length} Airborne</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>{flightData.filter(f => f.on_ground).length} Ground</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>{alerts.length} Active Alerts</span>
          </div>
        </div>
        <div className="text-muted-foreground">
          Zoom: {Math.round(mapTransform.scale * 100)}% | Use mouse wheel to zoom, drag to pan
        </div>
      </div>

      <div className="relative bg-slate-900 rounded-lg overflow-hidden flex-1 cursor-grab active:cursor-grabbing">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 500"
          className="w-full h-full"
          style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a)' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <g transform={`translate(${mapTransform.translateX}, ${mapTransform.translateY}) scale(${mapTransform.scale})`}>
            {/* Enhanced World Map */}
            <g opacity="0.6">
              {worldMapPaths.map((path, index) => (
                <path
                  key={index}
                  d={path}
                  fill="#334155"
                  stroke="#475569"
                  strokeWidth="1"
                />
              ))}
            </g>

            {/* Grid lines */}
            <g opacity="0.3" stroke="#475569" strokeWidth="0.5">
              {Array.from({ length: 21 }, (_, i) => (
                <line
                  key={`lat-${i}`}
                  x1="0"
                  y1={i * 25}
                  x2="1000"
                  y2={i * 25}
                />
              ))}
              {Array.from({ length: 41 }, (_, i) => (
                <line
                  key={`lon-${i}`}
                  x1={i * 25}
                  y1="0"
                  x2={i * 25}
                  y2="500"
                />
              ))}
            </g>

            {/* Flight Paths */}
            {flightData.slice(0, 20).map((flight, index) => {
              const { x, y } = convertCoordToSVG(flight.latitude, flight.longitude);
              const nextFlight = flightData[(index + 1) % flightData.length];
              const { x: x2, y: y2 } = convertCoordToSVG(nextFlight.latitude, nextFlight.longitude);
              
              return (
                <line
                  key={`path-${flight.icao24}`}
                  x1={x}
                  y1={y}
                  x2={x2}
                  y2={y2}
                  stroke="#3b82f6"
                  strokeWidth="1"
                  opacity="0.3"
                  strokeDasharray="5,5"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;10"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </line>
              );
            })}

            {/* Flight Markers */}
            {flightData.map((flight, index) => {
              const { x, y } = convertCoordToSVG(flight.latitude, flight.longitude);
              const isSelected = selectedFlight?.icao24 === flight.icao24;
              
              return (
                <g key={flight.icao24} className="cursor-pointer" onClick={() => setSelectedFlight(flight)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 12 : 6}
                    fill={flight.on_ground ? '#3b82f6' : '#10b981'}
                    stroke={isSelected ? '#fbbf24' : 'white'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-all duration-200"
                  >
                    <animate
                      attributeName="r"
                      values={`${isSelected ? 12 : 6};${isSelected ? 15 : 8};${isSelected ? 12 : 6}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  {/* Flight direction indicator */}
                  {flight.velocity > 0 && !flight.on_ground && (
                    <line
                      x1={x}
                      y1={y}
                      x2={x + Math.cos((flight.true_track || 0) * Math.PI / 180) * 20}
                      y2={y + Math.sin((flight.true_track || 0) * Math.PI / 180) * 20}
                      stroke="#10b981"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  )}
                  
                  {/* Flight callsign */}
                  <text
                    x={x}
                    y={y - 20}
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    opacity={isSelected ? 1 : 0.7}
                  >
                    {flight.callsign}
                  </text>
                </g>
              );
            })}

            {/* Alert Markers */}
            {alerts.slice(0, 15).map((alert, index) => {
              const randomX = 100 + Math.random() * 800;
              const randomY = 100 + Math.random() * 300;
              
              return (
                <g key={alert.id}>
                  <circle
                    cx={randomX}
                    cy={randomY}
                    r="8"
                    fill={getAlertColor(alert.type)}
                    stroke="white"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <text
                    x={randomX}
                    y={randomY + 25}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                  >
                    ⚠️
                  </text>
                </g>
              );
            })}

            {/* Arrow marker definition */}
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
          </g>
        </svg>

        {/* Flight Details Panel */}
        {selectedFlight && (
          <div className="absolute top-4 right-4 bg-background border border-border rounded-lg p-4 w-80 shadow-lg max-h-96 overflow-y-auto">
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
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Country:</strong> {selectedFlight.origin_country}</div>
                <div><strong>ICAO24:</strong> {selectedFlight.icao24}</div>
                <div><strong>Altitude:</strong> {selectedFlight.baro_altitude ? `${Math.round(selectedFlight.baro_altitude)} m` : 'N/A'}</div>
                <div><strong>Speed:</strong> {selectedFlight.velocity ? `${Math.round(selectedFlight.velocity)} m/s` : 'N/A'}</div>
                <div><strong>Track:</strong> {selectedFlight.true_track ? `${Math.round(selectedFlight.true_track)}°` : 'N/A'}</div>
                <div><strong>V-Rate:</strong> {selectedFlight.vertical_rate ? `${selectedFlight.vertical_rate} m/s` : 'N/A'}</div>
              </div>
              <div className="pt-2 border-t border-border">
                <div><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${selectedFlight.on_ground ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {selectedFlight.on_ground ? 'On Ground' : 'Airborne'}
                  </span>
                </div>
                <div className="mt-2"><strong>Last Contact:</strong> {new Date(selectedFlight.last_contact * 1000).toLocaleString()}</div>
                <div><strong>Coordinates:</strong> {selectedFlight.latitude?.toFixed(4)}, {selectedFlight.longitude?.toFixed(4)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg font-semibold">Loading live flight data...</p>
              <p className="text-sm text-muted-foreground">Connecting to global aviation network</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveGlobalMap;
