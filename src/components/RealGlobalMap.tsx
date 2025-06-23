
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle, Plane, Wifi, WifiOff, Activity } from 'lucide-react';

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
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const mapRef = useRef<HTMLDivElement>(null);

  const fetchFlightData = async () => {
    try {
      console.log('Fetching flight data from OpenSky Network...');
      // Using OpenSky Network API with better coverage and real-time data
      const response = await fetch('https://opensky-network.org/api/states/all?lamin=20&lomin=-180&lamax=85&lomax=180');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch flight data`);
      }

      const data = await response.json();
      console.log('Raw flight data received:', data);
      
      const processedFlights: ProcessedFlight[] = data.states
        ?.filter((state: any[]) => 
          state[6] !== null && // latitude
          state[5] !== null && // longitude
          !state[8] && // not on ground
          state[1] !== null && // has callsign
          state[6] >= 20 && state[6] <= 85 && // latitude range (avoid polar regions)
          state[5] >= -180 && state[5] <= 180 // longitude range
        )
        .slice(0, 150) // Increase to 150 flights for better global coverage
        .map((state: any[]) => {
          const velocity = state[9] || 0;
          const altitude = state[7] || 0;
          const lastContact = state[4] || 0;
          const heading = state[10] || Math.random() * 360;
          
          // Enhanced status classification based on real aviation parameters
          let status: 'normal' | 'warning' | 'critical' = 'normal';
          const timeSinceLastContact = (Date.now() / 1000) - lastContact;
          
          if (timeSinceLastContact > 300) status = 'critical'; // No contact for 5+ minutes
          else if (velocity < 100 && altitude > 5000) status = 'warning'; // Suspiciously slow at cruise
          else if (velocity < 50 || altitude < 500) status = 'critical'; // Very slow or very low
          else if (velocity > 600) status = 'warning'; // Very fast

          return {
            id: state[0],
            callsign: (state[1]?.trim() || `N${Math.random().toString(36).substr(2, 5).toUpperCase()}`),
            country: state[2] || 'Unknown',
            lat: state[6],
            lng: state[5],
            altitude: Math.round((altitude || 0) * 3.281), // Convert meters to feet
            velocity: Math.round((velocity || 0) * 1.944), // Convert m/s to knots
            status,
            lastContact: new Date(lastContact * 1000),
            heading: heading || Math.random() * 360
          };
        }) || [];

      console.log(`Processed ${processedFlights.length} flights`);
      setFlights(processedFlights);
      setError(null);
      setIsOnline(true);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching flight data:', err);
      setError(`Failed to fetch real-time data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightData();
    
    // Update every 30 seconds for real-time data
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
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span>Live Global Flight Tracking</span>
          </h3>
          <p className="text-sm text-muted-foreground">Real-time aircraft monitoring with OpenSky Network data</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Live Data</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400">Connection Issues</span>
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground bg-gray-800/50 px-3 py-1 rounded-lg">
            <span className="font-bold text-blue-400">{flights.length}</span> active flights
          </div>
          <div className="text-xs text-muted-foreground">
            Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {loading && (
        <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 rounded-xl border border-blue-500/20">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-3 border-blue-400 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-blue-300 text-lg font-medium">Loading Global Flight Data...</p>
            <p className="text-gray-400 text-sm mt-2">Connecting to OpenSky Network</p>
          </div>
        </div>
      )}

      {error && (
        <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 rounded-xl border border-red-500/20">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-300 mb-4 font-medium">{error}</p>
            <button 
              onClick={fetchFlightData}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Enhanced World Map with Clearer Visibility */}
          <div className="relative h-[500px] bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 rounded-xl overflow-hidden border border-blue-500/30 shadow-2xl">
            {/* Improved World Map SVG with Better Visibility */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full z-10">
              {/* Enhanced World Map with Higher Contrast */}
              <defs>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#1e40af" stopOpacity="0.5"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Ocean background */}
              <rect width="1000" height="500" fill="url(#oceanGradient)" />
              
              {/* Enhanced Continental Outlines */}
              <g fill="none" stroke="#3b82f6" strokeWidth="2" className="drop-shadow-lg" filter="url(#glow)">
                {/* North America - Enhanced Detail */}
                <path d="M120 80 Q140 60, 170 65 L200 70 Q230 75, 260 90 L290 100 Q320 115, 330 140 L335 160 Q340 185, 325 210 L305 235 Q285 250, 255 245 L225 235 Q195 225, 165 215 L135 195 Q105 175, 100 145 L105 115 Q110 95, 120 80 Z" />
                
                {/* Canada */}
                <path d="M130 30 Q170 25, 210 30 L250 35 Q290 40, 320 50 L340 60 Q350 75, 335 85 L305 90 Q275 85, 245 80 L215 75 Q185 70, 155 65 L135 55 Q125 45, 130 30 Z" />
                
                {/* South America */}
                <path d="M220 250 Q245 240, 260 265 L265 295 Q270 330, 265 365 L260 400 Q255 435, 235 455 L215 470 Q195 465, 185 445 L190 415 Q185 385, 190 355 L195 325 Q200 295, 205 265 Q210 250, 220 250 Z" />
                
                {/* Europe */}
                <path d="M450 70 Q480 65, 510 75 L530 90 Q545 105, 540 125 L535 145 Q525 160, 505 165 L485 160 Q465 155, 450 140 L445 120 Q440 100, 445 85 Q447 75, 450 70 Z" />
                
                {/* Scandinavia */}
                <path d="M470 20 Q490 15, 510 25 L520 40 Q525 60, 515 75 L505 85 Q490 90, 475 80 L465 65 Q460 45, 465 30 Q467 22, 470 20 Z" />
                
                {/* Africa - More Detailed */}
                <path d="M460 170 Q500 165, 530 180 L550 200 Q560 230, 565 260 L570 290 Q575 320, 570 350 L565 380 Q555 410, 535 430 L515 445 Q495 450, 475 445 L455 435 Q440 420, 445 395 L450 365 Q445 335, 450 305 L455 275 Q450 245, 455 215 L460 185 Q458 177, 460 170 Z" />
                
                {/* Asia - Enhanced */}
                <path d="M550 60 Q620 55, 690 70 L760 85 Q820 100, 850 125 L870 145 Q880 170, 865 190 L845 205 Q825 215, 795 210 L765 205 Q735 200, 705 195 L675 185 Q645 175, 615 165 L585 150 Q555 135, 550 115 L545 95 Q542 75, 550 60 Z" />
                
                {/* India */}
                <path d="M620 180 Q650 175, 675 190 L685 210 Q690 235, 680 255 L670 270 Q655 275, 640 270 L630 255 Q620 235, 625 215 L620 195 Q618 187, 620 180 Z" />
                
                {/* China - More Defined */}
                <path d="M680 100 Q730 95, 780 110 L820 125 Q850 140, 845 165 L840 185 Q830 200, 800 205 L770 200 Q740 195, 710 185 L690 170 Q675 155, 680 135 L685 115 Q682 107, 680 100 Z" />
                
                {/* Australia */}
                <path d="M720 340 Q760 335, 790 350 L810 365 Q820 385, 810 400 L795 410 Q775 415, 755 410 L735 400 Q720 385, 725 370 L720 355 Q718 347, 720 340 Z" />
                
                {/* Japan */}
                <path d="M820 140 Q835 135, 850 145 L860 160 Q865 180, 850 190 L835 195 Q820 190, 815 175 L810 160 Q815 150, 820 140 Z" />
                
                {/* United Kingdom */}
                <path d="M420 90 Q435 85, 445 95 L450 110 Q445 125, 430 130 L420 125 Q410 115, 415 100 Q417 92, 420 90 Z" />
              </g>
              
              {/* Continental Fill for Better Visibility */}
              <g fill="#1e40af" fillOpacity="0.15">
                <path d="M120 80 Q140 60, 170 65 L200 70 Q230 75, 260 90 L290 100 Q320 115, 330 140 L335 160 Q340 185, 325 210 L305 235 Q285 250, 255 245 L225 235 Q195 225, 165 215 L135 195 Q105 175, 100 145 L105 115 Q110 95, 120 80 Z" />
                <path d="M220 250 Q245 240, 260 265 L265 295 Q270 330, 265 365 L260 400 Q255 435, 235 455 L215 470 Q195 465, 185 445 L190 415 Q185 385, 190 355 L195 325 Q200 295, 205 265 Q210 250, 220 250 Z" />
                <path d="M460 170 Q500 165, 530 180 L550 200 Q560 230, 565 260 L570 290 Q575 320, 570 350 L565 380 Q555 410, 535 430 L515 445 Q495 450, 475 445 L455 435 Q440 420, 445 395 L450 365 Q445 335, 450 305 L455 275 Q450 245, 455 215 L460 185 Q458 177, 460 170 Z" />
                <path d="M550 60 Q620 55, 690 70 L760 85 Q820 100, 850 125 L870 145 Q880 170, 865 190 L845 205 Q825 215, 795 210 L765 205 Q735 200, 705 195 L675 185 Q645 175, 615 165 L585 150 Q555 135, 550 115 L545 95 Q542 75, 550 60 Z" />
                <path d="M720 340 Q760 335, 790 350 L810 365 Q820 385, 810 400 L795 410 Q775 415, 755 410 L735 400 Q720 385, 725 370 L720 355 Q718 347, 720 340 Z" />
              </g>
              
              {/* Enhanced Grid Lines for Navigation */}
              <g stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3,3">
                {/* Latitude lines */}
                <line x1="0" y1="83" x2="1000" y2="83" />
                <line x1="0" y1="167" x2="1000" y2="167" />
                <line x1="0" y1="250" x2="1000" y2="250" />
                <line x1="0" y1="333" x2="1000" y2="333" />
                <line x1="0" y1="417" x2="1000" y2="417" />
                
                {/* Longitude lines */}
                <line x1="167" y1="0" x2="167" y2="500" />
                <line x1="333" y1="0" x2="333" y2="500" />
                <line x1="500" y1="0" x2="500" y2="500" />
                <line x1="667" y1="0" x2="667" y2="500" />
                <line x1="833" y1="0" x2="833" y2="500" />
              </g>
            </svg>

            {/* Enhanced Real Flight Markers */}
            {flights.map((flight, index) => (
              <div
                key={flight.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30"
                style={{
                  left: `${((flight.lng + 180) / 360) * 100}%`,
                  top: `${((90 - flight.lat) / 180) * 100}%`,
                }}
                onClick={() => setSelectedFlight(flight)}
              >
                <div className="relative group">
                  {/* Enhanced flight marker with better visibility */}
                  <div className={`w-8 h-8 rounded-full ${getStatusColor(flight.status)} flex items-center justify-center shadow-2xl border-2 border-white/70 backdrop-blur-sm hover:scale-125 transition-all duration-300 hover:z-50`}>
                    <Plane className="w-5 h-5 text-white drop-shadow-lg font-bold" style={{ transform: `rotate(${flight.heading}deg)` }} />
                  </div>
                  
                  {/* Enhanced hover tooltip */}
                  <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 pointer-events-none">
                    <div className="bg-gray-900/98 backdrop-blur-lg px-5 py-4 rounded-xl text-xs whitespace-nowrap border border-gray-500/50 shadow-2xl">
                      <div className="font-bold text-white text-base mb-2">{flight.callsign}</div>
                      <div className="text-gray-300 mb-1">
                        <span className="text-blue-300">Country:</span> {flight.country}
                      </div>
                      <div className="text-gray-300 mb-1">
                        <span className="text-green-300">Altitude:</span> <span className="font-bold">{flight.altitude.toLocaleString()}ft</span>
                      </div>
                      <div className="text-gray-300 mb-1">
                        <span className="text-yellow-300">Speed:</span> <span className="font-bold">{flight.velocity}kts</span>
                      </div>
                      <div className="text-gray-300 mb-2">
                        <span className="text-purple-300">Position:</span> {flight.lat.toFixed(2)}°, {flight.lng.toFixed(2)}°
                      </div>
                      <div className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${getStatusTextColor(flight.status)} bg-gray-800/70`}>
                        {flight.status}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced pulse effect */}
                  <div className={`absolute inset-0 rounded-full ${getStatusColor(flight.status)} opacity-40 animate-ping`}></div>
                  
                  {/* Flight trail effect with better visibility */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-80" 
                    style={{ transform: `translate(-50%, -50%) rotate(${flight.heading + 180}deg)` }}
                  ></div>
                </div>
              </div>
            ))}

            {/* Enhanced Status Legend */}
            <div className="absolute bottom-6 left-6 bg-black/95 backdrop-blur-lg rounded-xl p-5 border border-gray-500/50 z-20 shadow-2xl">
              <div className="text-base font-bold text-white mb-4">Flight Status Legend</div>
              <div className="space-y-3">
                {[
                  { status: 'normal', label: 'Normal Operations', count: flights.filter(f => f.status === 'normal').length, description: 'Standard flight parameters' },
                  { status: 'warning', label: 'Monitoring Required', count: flights.filter(f => f.status === 'warning').length, description: 'Unusual speed/altitude' },
                  { status: 'critical', label: 'Attention Required', count: flights.filter(f => f.status === 'critical').length, description: 'Communication issues' }
                ].map(({ status, label, count, description }) => (
                  <div key={status} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 ${getStatusColor(status)} rounded-full border border-white/50 shadow-sm`}></div>
                      <div>
                        <div className="text-sm text-gray-200 font-medium">{label}</div>
                        <div className="text-xs text-gray-400">{description}</div>
                      </div>
                    </div>
                    <span className="text-base text-white font-bold bg-gray-700/70 px-3 py-1 rounded-lg min-w-[3rem] text-center">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced data source info */}
            <div className="absolute top-6 right-6 bg-black/95 backdrop-blur-lg rounded-xl p-4 border border-gray-500/50 z-20 shadow-2xl">
              <div className="text-xs text-gray-300 mb-1">Real-Time Data Source</div>
              <div className="text-lg font-bold text-white mb-2">OpenSky Network</div>
              <div className="text-xs text-green-400 flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Updates Every 30s</span>
              </div>
              <div className="text-xs text-gray-400">
                Global Coverage: {flights.length} Active Flights
              </div>
              <div className="text-xs text-blue-400 mt-1">
                Last Update: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Enhanced Flight Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-xl border border-green-500/30">
              <div className="text-2xl font-bold text-green-400 mb-1">{flights.filter(f => f.status === 'normal').length}</div>
              <div className="text-sm text-green-300 font-medium">Normal Operations</div>
              <div className="text-xs text-gray-400 mt-1">Operating within parameters</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 p-4 rounded-xl border border-yellow-500/30">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{flights.filter(f => f.status === 'warning').length}</div>
              <div className="text-sm text-yellow-300 font-medium">Under Monitoring</div>
              <div className="text-xs text-gray-400 mt-1">Requires attention</div>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-4 rounded-xl border border-red-500/30">
              <div className="text-2xl font-bold text-red-400 mb-1">{flights.filter(f => f.status === 'critical').length}</div>
              <div className="text-sm text-red-300 font-medium">Critical Status</div>
              <div className="text-xs text-gray-400 mt-1">Immediate attention needed</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-xl border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400 mb-1">{flights.length}</div>
              <div className="text-sm text-blue-300 font-medium">Total Active</div>
              <div className="text-xs text-gray-400 mt-1">Real-time tracking</div>
            </div>
          </div>

          {/* Enhanced Flight Details Modal */}
          {selectedFlight && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedFlight(null)}>
              <div className="bg-gray-900 p-8 rounded-2xl max-w-lg w-full mx-4 border border-gray-600 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Flight Details</h3>
                  <button 
                    onClick={() => setSelectedFlight(null)}
                    className="text-gray-400 hover:text-white text-2xl font-bold p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center space-x-3">
                    <Plane className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="text-sm text-gray-400">Flight Callsign</div>
                      <div className="font-bold text-xl text-white">{selectedFlight.callsign}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Origin Country</div>
                      <div className="font-semibold text-white">{selectedFlight.country}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Current Status</div>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-bold ${selectedFlight.status === 'critical' ? 'bg-red-400/20 text-red-400' : selectedFlight.status === 'warning' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-green-400/20 text-green-400'}`}>
                        <span className="capitalize">{selectedFlight.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Altitude</div>
                      <div className="font-bold text-2xl text-blue-400">{selectedFlight.altitude.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">feet</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Ground Speed</div>
                      <div className="font-bold text-2xl text-green-400">{selectedFlight.velocity}</div>
                      <div className="text-xs text-gray-500">knots</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Coordinates</div>
                    <div className="font-mono text-lg bg-gray-800/50 p-3 rounded-lg text-blue-300">
                      {selectedFlight.lat.toFixed(6)}°N, {selectedFlight.lng.toFixed(6)}°W
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400">Last Contact</div>
                    <div className="font-medium text-white">{selectedFlight.lastContact.toLocaleString()}</div>
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
