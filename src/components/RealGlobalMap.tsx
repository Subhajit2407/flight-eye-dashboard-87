
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
  heading: number;
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
      // Using OpenSky Network API with better coverage
      const response = await fetch('https://opensky-network.org/api/states/all?lamin=25&lomin=-140&lamax=70&lomax=50');
      
      if (!response.ok) {
        throw new Error('Failed to fetch flight data');
      }

      const data = await response.json();
      
      const processedFlights: ProcessedFlight[] = data.states
        ?.filter((state: any[]) => 
          state[6] !== null && // latitude
          state[5] !== null && // longitude
          !state[8] && // not on ground
          state[1] !== null && // has callsign
          state[6] >= 25 && state[6] <= 70 && // latitude range
          state[5] >= -140 && state[5] <= 50 // longitude range
        )
        .slice(0, 100) // Increase to 100 flights for better coverage
        .map((state: any[]) => {
          const velocity = state[9] || 0;
          const altitude = state[7] || 0;
          const lastContact = state[4] || 0;
          const heading = state[10] || 0;
          
          // More realistic status classification
          let status: 'normal' | 'warning' | 'critical' = 'normal';
          if (velocity < 150 && altitude > 3000) status = 'warning'; // Slow at altitude
          if (velocity < 100 || altitude < 1000) status = 'critical'; // Very slow or very low

          return {
            id: state[0],
            callsign: state[1]?.trim() || `AC${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            country: state[2] || 'Unknown',
            lat: state[6],
            lng: state[5],
            altitude: Math.round(altitude * 3.281), // Convert to feet
            velocity: Math.round(velocity * 1.944), // Convert to knots
            status,
            lastContact: new Date(lastContact * 1000),
            heading: heading || Math.random() * 360
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
          {/* Enhanced World Map with Real Flight Data */}
          <div className="relative h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden border border-border/20">
            {/* Detailed World Map SVG */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-40 z-10">
              {/* Enhanced World Map with More Detail */}
              <g fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-300/50">
                {/* North America */}
                <path d="M120 80 C130 70, 140 60, 160 65 L180 70 C200 75, 220 80, 240 90 L260 100 C280 110, 300 120, 310 140 L315 160 C320 180, 315 200, 300 220 L280 240 C260 250, 240 245, 220 240 L200 230 C180 220, 160 210, 140 200 L120 180 C100 160, 95 140, 100 120 L105 100 C110 90, 115 85, 120 80 Z" />
                
                {/* Canada */}
                <path d="M130 50 C160 45, 190 50, 220 55 L250 60 C280 65, 310 70, 320 80 L325 90 C330 100, 325 110, 315 115 L290 120 C270 115, 250 110, 230 105 L200 100 C170 95, 140 90, 130 80 L125 70 C125 60, 127 55, 130 50 Z" />
                
                {/* South America */}
                <path d="M200 250 C220 240, 240 245, 250 265 L255 290 C260 320, 265 350, 260 380 L255 410 C250 440, 240 460, 220 470 L200 475 C180 470, 170 450, 175 430 L180 400 C175 370, 180 340, 185 310 L190 280 C195 260, 197 255, 200 250 Z" />
                
                {/* Europe */}
                <path d="M450 70 C480 65, 510 70, 530 85 L540 100 C545 115, 540 130, 530 140 L515 150 C500 155, 485 150, 470 145 L455 135 C445 125, 445 115, 450 105 L455 90 C450 80, 450 75, 450 70 Z" />
                
                {/* Scandinavia */}
                <path d="M470 40 C485 35, 500 40, 510 50 L515 65 C520 80, 515 85, 505 90 L490 95 C480 90, 475 80, 470 70 L465 55 C465 45, 467 40, 470 40 Z" />
                
                {/* Africa */}
                <path d="M460 170 C490 165, 520 170, 540 190 L550 220 C555 250, 560 280, 555 310 L550 340 C545 370, 535 400, 520 420 L505 440 C490 445, 475 440, 465 420 L460 390 C455 360, 460 330, 465 300 L470 270 C465 240, 465 205, 460 170 Z" />
                
                {/* Asia */}
                <path d="M550 60 C600 55, 650 60, 700 75 L750 90 C800 105, 830 120, 840 145 L845 165 C850 185, 845 195, 835 205 L815 215 C795 220, 775 215, 755 210 L715 200 C675 195, 635 190, 595 185 L565 175 C545 165, 540 145, 545 125 L550 105 C545 85, 547 70, 550 60 Z" />
                
                {/* India */}
                <path d="M620 180 C640 175, 660 180, 670 195 L675 215 C680 235, 675 250, 665 260 L650 265 C635 260, 625 245, 625 230 L620 210 C615 195, 617 185, 620 180 Z" />
                
                {/* China */}
                <path d="M680 100 C720 95, 760 100, 790 115 L810 130 C825 145, 820 160, 810 170 L790 180 C770 175, 750 170, 730 165 L700 155 C680 150, 675 135, 680 120 L685 105 C680 100, 680 100, 680 100 Z" />
                
                {/* Australia */}
                <path d="M720 340 C750 335, 780 340, 800 355 L810 370 C815 385, 810 395, 800 400 L780 405 C760 400, 740 395, 730 380 L725 365 C720 350, 720 345, 720 340 Z" />
                
                {/* Japan */}
                <path d="M820 140 C830 135, 840 140, 845 150 L850 165 C845 175, 835 180, 825 175 L815 165 C810 155, 815 145, 820 140 Z" />
                
                {/* UK */}
                <path d="M420 90 C430 85, 440 90, 445 100 L440 110 C435 115, 425 110, 420 100 L415 95 C415 90, 417 87, 420 90 Z" />
              </g>
              
              {/* Filled continents for better visibility */}
              <g fill="currentColor" className="text-blue-400/20">
                <path d="M120 80 C130 70, 140 60, 160 65 L180 70 C200 75, 220 80, 240 90 L260 100 C280 110, 300 120, 310 140 L315 160 C320 180, 315 200, 300 220 L280 240 C260 250, 240 245, 220 240 L200 230 C180 220, 160 210, 140 200 L120 180 C100 160, 95 140, 100 120 L105 100 C110 90, 115 85, 120 80 Z" />
                <path d="M200 250 C220 240, 240 245, 250 265 L255 290 C260 320, 265 350, 260 380 L255 410 C250 440, 240 460, 220 470 L200 475 C180 470, 170 450, 175 430 L180 400 C175 370, 180 340, 185 310 L190 280 C195 260, 197 255, 200 250 Z" />
                <path d="M460 170 C490 165, 520 170, 540 190 L550 220 C555 250, 560 280, 555 310 L550 340 C545 370, 535 400, 520 420 L505 440 C490 445, 475 440, 465 420 L460 390 C455 360, 460 330, 465 300 L470 270 C465 240, 465 205, 460 170 Z" />
                <path d="M550 60 C600 55, 650 60, 700 75 L750 90 C800 105, 830 120, 840 145 L845 165 C850 185, 845 195, 835 205 L815 215 C795 220, 775 215, 755 210 L715 200 C675 195, 635 190, 595 185 L565 175 C545 165, 540 145, 545 125 L550 105 C545 85, 547 70, 550 60 Z" />
                <path d="M720 340 C750 335, 780 340, 800 355 L810 370 C815 385, 810 395, 800 400 L780 405 C760 400, 740 395, 730 380 L725 365 C720 350, 720 345, 720 340 Z" />
              </g>
              
              {/* Enhanced grid lines */}
              <g stroke="currentColor" strokeWidth="0.5" className="text-blue-300/30">
                {/* Latitude lines */}
                <line x1="0" y1="100" x2="1000" y2="100" strokeDasharray="2,2" />
                <line x1="0" y1="166" x2="1000" y2="166" strokeDasharray="2,2" />
                <line x1="0" y1="250" x2="1000" y2="250" strokeDasharray="2,2" />
                <line x1="0" y1="333" x2="1000" y2="333" strokeDasharray="2,2" />
                <line x1="0" y1="400" x2="1000" y2="400" strokeDasharray="2,2" />
                
                {/* Longitude lines */}
                <line x1="166" y1="0" x2="166" y2="500" strokeDasharray="2,2" />
                <line x1="333" y1="0" x2="333" y2="500" strokeDasharray="2,2" />
                <line x1="500" y1="0" x2="500" y2="500" strokeDasharray="2,2" />
                <line x1="666" y1="0" x2="666" y2="500" strokeDasharray="2,2" />
                <line x1="833" y1="0" x2="833" y2="500" strokeDasharray="2,2" />
              </g>
            </svg>

            {/* Real flight markers with enhanced visibility */}
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
                  {/* Enhanced flight marker */}
                  <div className={`w-7 h-7 rounded-full ${getStatusColor(flight.status)} flex items-center justify-center shadow-xl border-2 border-white/50 backdrop-blur-sm hover:scale-110 transition-transform`}>
                    <Plane className="w-4 h-4 text-white drop-shadow-lg" style={{ transform: `rotate(${flight.heading}deg)` }} />
                  </div>
                  
                  {/* Enhanced hover tooltip */}
                  <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                    <div className="bg-gray-900/95 backdrop-blur-md px-4 py-3 rounded-lg text-xs whitespace-nowrap border border-gray-600/50 shadow-2xl">
                      <div className="font-bold text-white text-sm mb-1">{flight.callsign}</div>
                      <div className="text-gray-300">{flight.country}</div>
                      <div className="text-gray-300 mt-1">
                        <span className="font-medium">{flight.altitude}ft</span> • 
                        <span className="font-medium"> {flight.velocity}kts</span>
                      </div>
                      <div className={`text-xs mt-2 font-bold uppercase ${getStatusTextColor(flight.status)}`}>
                        {flight.status}
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated pulse effect */}
                  <div className={`absolute inset-0 rounded-full ${getStatusColor(flight.status)} opacity-30 animate-ping`}></div>
                  
                  {/* Flight trail effect */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70" style={{ transform: `rotate(${flight.heading + 180}deg)` }}></div>
                </div>
              </div>
            ))}

            {/* Enhanced legend */}
            <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md rounded-lg p-4 border border-gray-600/50 z-15">
              <div className="text-sm font-bold text-white mb-3">Flight Status</div>
              <div className="space-y-3">
                {[
                  { status: 'normal', label: 'Normal Operations', count: flights.filter(f => f.status === 'normal').length },
                  { status: 'warning', label: 'Monitoring Required', count: flights.filter(f => f.status === 'warning').length },
                  { status: 'critical', label: 'Attention Required', count: flights.filter(f => f.status === 'critical').length }
                ].map(({ status, label, count }) => (
                  <div key={status} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 ${getStatusColor(status)} rounded-full border border-white/40 shadow-sm`}></div>
                      <span className="text-sm text-gray-200">{label}</span>
                    </div>
                    <span className="text-sm text-white font-bold bg-gray-700/70 px-2 py-1 rounded-md">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced data source info */}
            <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md rounded-lg p-3 border border-gray-600/50 z-15">
              <div className="text-xs text-gray-300 mb-1">Live Data Source</div>
              <div className="text-sm font-bold text-white">OpenSky Network</div>
              <div className="text-xs text-green-400 flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time Updates</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Coverage: North America & Europe
              </div>
            </div>
          </div>

          {/* Enhanced Flight Details Panel */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">Active Flights ({flights.length})</h4>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">Normal: {flights.filter(f => f.status === 'normal').length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-muted-foreground">Warning: {flights.filter(f => f.status === 'warning').length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-muted-foreground">Critical: {flights.filter(f => f.status === 'critical').length}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {flights.slice(0, 12).map((flight) => (
                <div 
                  key={flight.id} 
                  className="flex items-center justify-between p-3 bg-gray-800/60 rounded-lg hover:bg-gray-800/80 transition-colors cursor-pointer border border-gray-700/30"
                  onClick={() => setSelectedFlight(flight)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(flight.status)} shadow-sm`}></div>
                    <div>
                      <div className="text-sm font-bold text-foreground">{flight.callsign}</div>
                      <div className="text-xs text-muted-foreground">{flight.country}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-foreground font-medium">{flight.altitude}ft</div>
                    <div className="text-xs text-muted-foreground">{flight.velocity}kts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Flight Details Modal */}
          {selectedFlight && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setSelectedFlight(null)}>
              <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4 border border-border shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Flight Details</h3>
                  <button 
                    onClick={() => setSelectedFlight(null)}
                    className="text-muted-foreground hover:text-foreground text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Flight Callsign</div>
                    <div className="font-bold text-lg">{selectedFlight.callsign}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Origin Country</div>
                    <div className="font-semibold">{selectedFlight.country}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Current Status</div>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-bold ${selectedFlight.status === 'critical' ? 'bg-red-400/20 text-red-400' : selectedFlight.status === 'warning' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-green-400/20 text-green-400'}`}>
                      <span className="capitalize">{selectedFlight.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Altitude</div>
                      <div className="font-bold text-lg">{selectedFlight.altitude} ft</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Ground Speed</div>
                      <div className="font-bold text-lg">{selectedFlight.velocity} kts</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Coordinates</div>
                    <div className="font-mono text-sm bg-gray-800/50 p-2 rounded">
                      {selectedFlight.lat.toFixed(4)}, {selectedFlight.lng.toFixed(4)}
                    </div>
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
