import React, { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle, Plane, Wifi, WifiOff } from 'lucide-react';

interface FlightData {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number;
}

interface ProcessedFlight {
  id: string;
  callsign: string;
  country: string;
  lat: number;
  lng: number;
  altitude: number;
  velocity: number;
  status: 'normal' | 'warning' | 'critical';
  lastContact: Date;
}

const RealGlobalMap: React.FC = () => {
  const [flights, setFlights] = useState<ProcessedFlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState<ProcessedFlight | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const fetchFlightData = async () => {
    try {
      // Using OpenSky Network API (free aviation data)
      const response = await fetch('https://opensky-network.org/api/states/all?lamin=45&lomin=-180&lamax=55&lomax=180');
      
      if (!response.ok) {
        throw new Error('Failed to fetch flight data');
      }

      const data = await response.json();
      
      const processedFlights: ProcessedFlight[] = data.states
        ?.filter((state: any[]) => 
          state[6] !== null && // latitude
          state[5] !== null && // longitude
          !state[8] && // not on ground
          state[1] !== null // has callsign
        )
        .slice(0, 50) // Limit to 50 flights for performance
        .map((state: any[]) => {
          const velocity = state[9] || 0;
          const altitude = state[7] || 0;
          const lastContact = state[4] || 0;
          
          // Simulate status based on velocity and altitude
          let status: 'normal' | 'warning' | 'critical' = 'normal';
          if (velocity < 100 || altitude < 1000) status = 'warning';
          if (velocity < 50 || altitude < 500) status = 'critical';

          return {
            id: state[0], // icao24
            callsign: state[1]?.trim() || 'Unknown',
            country: state[2] || 'Unknown',
            lat: state[6],
            lng: state[5],
            altitude: Math.round(altitude * 3.281), // Convert to feet
            velocity: Math.round(velocity * 1.944), // Convert to knots
            status,
            lastContact: new Date(lastContact * 1000)
          };
        }) || [];

      setFlights(processedFlights);
      setError(null);
      setIsOnline(true);
    } catch (err) {
      console.error('Error fetching flight data:', err);
      setError('Unable to fetch real-time flight data');
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchFlightData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Live Global Flight Tracking</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">Live Data</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400">Offline</span>
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {flights.length} active flights
          </div>
        </div>
      </div>

      {loading && (
        <div className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading live flight data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">{error}</p>
            <button 
              onClick={fetchFlightData}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* World Map with Real Flight Data */}
          <div className="relative h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden border border-border/20">
            {/* Transparent World Map SVG */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-30 z-10">
              {/* World Map Continents */}
              <g fill="currentColor" className="text-blue-400/40" stroke="currentColor" strokeWidth="0.5" className="text-blue-300/60">
                {/* North America */}
                <path d="M120 100 C150 80, 200 85, 240 100 L250 120 C260 140, 270 160, 260 180 L240 200 C220 210, 200 205, 180 200 L160 180 C140 160, 130 140, 120 120 Z" />
                {/* South America */}
                <path d="M180 220 C200 210, 220 215, 230 235 L235 280 C240 320, 235 360, 220 380 L200 390 C180 385, 170 370, 175 350 L180 300 C175 270, 175 245, 180 220 Z" />
                {/* Europe */}
                <path d="M400 80 C430 75, 460 80, 480 95 L485 110 C490 125, 485 140, 475 150 L450 155 C430 150, 410 145, 405 130 L400 115 C395 100, 395 90, 400 80 Z" />
                {/* Africa */}
                <path d="M420 160 C450 155, 480 160, 500 180 L510 220 C515 260, 510 300, 495 340 L480 360 C460 365, 440 360, 430 340 L425 300 C420 260, 420 220, 420 180 Z" />
                {/* Asia */}
                <path d="M520 70 C580 65, 640 70, 700 85 L750 100 C780 115, 800 140, 795 165 L785 185 C770 200, 750 195, 730 190 L680 180 C640 175, 600 170, 560 165 L530 150 C510 135, 515 105, 520 70 Z" />
                {/* Australia */}
                <path d="M650 320 C680 315, 710 320, 730 335 L735 350 C740 365, 735 380, 725 385 L700 390 C680 385, 660 380, 655 365 L650 350 C645 335, 645 327, 650 320 Z" />
                {/* Additional landmasses for better coverage */}
                <path d="M300 90 C320 85, 340 90, 350 105 L345 120 C340 135, 325 140, 310 135 L300 120 C295 105, 295 95, 300 90 Z" />
              </g>
              
              {/* Grid lines for better map appearance */}
              <defs>
                <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-blue-300/20"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Latitude lines */}
              <g stroke="currentColor" strokeWidth="0.3" className="text-blue-300/20">
                <line x1="0" y1="125" x2="1000" y2="125" />
                <line x1="0" y1="250" x2="1000" y2="250" />
                <line x1="0" y1="375" x2="1000" y2="375" />
              </g>
              
              {/* Longitude lines */}
              <g stroke="currentColor" strokeWidth="0.3" className="text-blue-300/20">
                <line x1="250" y1="0" x2="250" y2="500" />
                <line x1="500" y1="0" x2="500" y2="500" />
                <line x1="750" y1="0" x2="750" y2="500" />
              </g>
            </svg>

            {/* Real flight markers - positioned above the map */}
            {flights.map((flight, index) => (
              <div
                key={flight.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                style={{
                  left: `${((flight.lng + 180) / 360) * 100}%`,
                  top: `${((90 - flight.lat) / 180) * 100}%`,
                }}
                onClick={() => setSelectedFlight(flight)}
              >
                <div className="relative group">
                  {/* Flight marker with enhanced visibility */}
                  <div className={`w-6 h-6 rounded-full ${getStatusColor(flight.status)} flex items-center justify-center shadow-lg border-2 border-white/30 backdrop-blur-sm`}>
                    <Plane className="w-3 h-3 text-white drop-shadow-sm" style={{ transform: `rotate(${flight.true_track || Math.random() * 360}deg)` }} />
                  </div>
                  
                  {/* Enhanced hover tooltip */}
                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30">
                    <div className="bg-gray-900/95 backdrop-blur-sm px-4 py-3 rounded-lg text-xs whitespace-nowrap border border-gray-600/50 shadow-xl">
                      <div className="font-semibold text-white text-sm">{flight.callsign}</div>
                      <div className="text-gray-300">{flight.country}</div>
                      <div className="text-gray-300 mt-1">{flight.altitude}ft • {flight.velocity}kts</div>
                      <div className={`text-xs mt-1 font-medium ${getStatusTextColor(flight.status)}`}>
                        Status: {flight.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated pulse effect */}
                  <div className={`absolute inset-0 rounded-full ${getStatusColor(flight.status)} opacity-20 animate-ping`}></div>
                  
                  {/* Flight trail effect */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60 -rotate-45"></div>
                </div>
              </div>
            ))}

            {/* Enhanced legend with better positioning */}
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-gray-600/30 z-15">
              <div className="text-sm font-semibold text-white mb-3">Flight Status</div>
              <div className="space-y-2">
                {[
                  { status: 'normal', label: 'Normal', count: flights.filter(f => f.status === 'normal').length },
                  { status: 'warning', label: 'Warning', count: flights.filter(f => f.status === 'warning').length },
                  { status: 'critical', label: 'Critical', count: flights.filter(f => f.status === 'critical').length }
                ].map(({ status, label, count }) => (
                  <div key={status} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 ${getStatusColor(status)} rounded-full border border-white/30`}></div>
                      <span className="text-sm text-gray-200">{label}</span>
                    </div>
                    <span className="text-sm text-white font-semibold bg-gray-700/50 px-2 py-1 rounded">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced data source info */}
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-gray-600/30 z-15">
              <div className="text-xs text-gray-300 mb-1">Data Source</div>
              <div className="text-sm font-semibold text-white">OpenSky Network</div>
              <div className="text-xs text-green-400 flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-foreground">Active Flights ({flights.length})</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {flights.slice(0, 8).map((flight) => (
                <div 
                  key={flight.id} 
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
                  onClick={() => setSelectedFlight(flight)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(flight.status)}`}></div>
                    <div>
                      <div className="text-xs font-medium text-foreground">{flight.callsign}</div>
                      <div className="text-xs text-muted-foreground">{flight.country}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-foreground">{flight.altitude}ft</div>
                    <div className="text-xs text-muted-foreground">{flight.velocity}kts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flight Details Modal */}
          {selectedFlight && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedFlight(null)}>
              <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4 border border-border" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Flight Details</h3>
                  <button 
                    onClick={() => setSelectedFlight(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Callsign</div>
                    <div className="font-medium">{selectedFlight.callsign}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Country</div>
                    <div className="font-medium">{selectedFlight.country}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${selectedFlight.status === 'critical' ? 'bg-red-400/10 text-red-400' : selectedFlight.status === 'warning' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-green-400/10 text-green-400'}`}>
                      <span className="capitalize">{selectedFlight.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Altitude</div>
                      <div className="font-medium">{selectedFlight.altitude} ft</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Velocity</div>
                      <div className="font-medium">{selectedFlight.velocity} kts</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Position</div>
                    <div className="font-medium">{selectedFlight.lat.toFixed(4)}, {selectedFlight.lng.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Last Contact</div>
                    <div className="font-medium">{selectedFlight.lastContact.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RealGlobalMap;
