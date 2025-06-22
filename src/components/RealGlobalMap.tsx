
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
            {/* Simple world map background */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-20">
              <path d="M158 206c9-1 24-6 32-5 23 3 46 9 69 7 15-1 30-7 45-6 42 4 84 19 126 18 28-1 56-8 84-6 35 3 70 14 105 13 25-1 50-6 75-4 38 3 76 12 114 11 23-1 46-5 69-3 29 2 58 8 87 7 21-1 42-4 63-2 27 2 54 7 81 6 19-1 38-3 57-1 24 2 48 6 72 5 17-1 34-2 51 0 21 2 42 5 63 4 15-1 30-2 45 0 19 2 38 5 57 4 13-1 26-1 39 1 16 2 32 5 48 4 11-1 22-1 33 1 13 2 26 4 39 3 9-1 18-1 27 1 11 2 22 4 33 3 7-1 14-1 21 1 8 2 16 4 24 3 5-1 10-1 15 1 6 2 12 4 18 3 4-1 8-1 12 1 5 2 10 4 15 3 3-1 6-1 9 1 4 2 8 4 12 3 2-1 4-1 6 1 3 2 6 4 9 3 1-1 2-1 3 1 2 2 4 4 6 3 1-1 1-1 2 1 1 2 2 4 3 3 0-1 0-1 1 1 1 2 1 4 2 3" 
                    fill="currentColor" className="text-blue-500/30" />
            </svg>

            {/* Real flight markers */}
            {flights.map((flight, index) => (
              <div
                key={flight.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{
                  left: `${((flight.lng + 180) / 360) * 100}%`,
                  top: `${((90 - flight.lat) / 180) * 100}%`,
                }}
                onClick={() => setSelectedFlight(flight)}
              >
                <div className="relative group">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(flight.status)} flex items-center justify-center shadow-lg`}>
                    <Plane className="w-2 h-2 text-white" style={{ transform: `rotate(${Math.random() * 360}deg)` }} />
                  </div>
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="bg-gray-900 px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-gray-700 shadow-xl">
                      <div className="font-medium text-white">{flight.callsign}</div>
                      <div className="text-gray-300">{flight.country}</div>
                      <div className="text-gray-300">{flight.altitude}ft • {flight.velocity}kts</div>
                    </div>
                  </div>
                  <div className={`absolute inset-0 rounded-full ${getStatusColor(flight.status)} opacity-30 animate-ping`}></div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-4 backdrop-blur-sm border border-gray-700">
              <div className="text-xs font-medium text-white mb-3">Flight Status</div>
              <div className="space-y-2">
                {[
                  { status: 'normal', label: 'Normal', count: flights.filter(f => f.status === 'normal').length },
                  { status: 'warning', label: 'Warning', count: flights.filter(f => f.status === 'warning').length },
                  { status: 'critical', label: 'Critical', count: flights.filter(f => f.status === 'critical').length }
                ].map(({ status, label, count }) => (
                  <div key={status} className="flex items-center justify-between space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${getStatusColor(status)} rounded-full`}></div>
                      <span className="text-xs text-gray-300">{label}</span>
                    </div>
                    <span className="text-xs text-white font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data source info */}
            <div className="absolute top-4 right-4 bg-black/70 rounded-lg p-3 backdrop-blur-sm border border-gray-700">
              <div className="text-xs text-gray-300 mb-1">Data Source</div>
              <div className="text-xs font-medium text-white">OpenSky Network</div>
              <div className="text-xs text-green-400">Live Updates</div>
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
