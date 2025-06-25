
export interface RealTimeFlightData {
  icao24: string;
  callsign: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  on_ground: boolean;
  last_contact: number;
}

export interface AlertData {
  id: string;
  aircraftId: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  severity: number;
}

class RealTimeDataService {
  private flightDataCache: RealTimeFlightData[] = [];
  private alertsCache: AlertData[] = [];
  private subscribers: Array<(data: any) => void> = [];
  private pollingInterval: NodeJS.Timeout | null = null;

  async fetchFlightData(): Promise<RealTimeFlightData[]> {
    try {
      const response = await fetch('https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226');
      const data = await response.json();
      
      if (data && data.states) {
        const flights: RealTimeFlightData[] = data.states.slice(0, 50).map((state: any[]) => ({
          icao24: state[0],
          callsign: state[1]?.trim() || 'N/A',
          origin_country: state[2],
          longitude: state[5],
          latitude: state[6],
          baro_altitude: state[7],
          velocity: state[9],
          true_track: state[10],
          vertical_rate: state[11],
          on_ground: state[8],
          last_contact: state[3]
        })).filter(flight => flight.longitude && flight.latitude);
        
        this.flightDataCache = flights;
        this.generateRandomAlerts(flights);
        return flights;
      }
    } catch (error) {
      console.error('Error fetching flight data:', error);
      // Return mock data on error
      return this.generateMockFlightData();
    }
    return [];
  }

  private generateMockFlightData(): RealTimeFlightData[] {
    const mockFlights: RealTimeFlightData[] = [];
    const airlines = ['UAL', 'DAL', 'AAL', 'SWA', 'JBU', 'ASA', 'FFT'];
    
    for (let i = 0; i < 25; i++) {
      mockFlights.push({
        icao24: `${Math.random().toString(36).substr(2, 6)}`,
        callsign: `${airlines[Math.floor(Math.random() * airlines.length)]}${Math.floor(Math.random() * 9999)}`,
        origin_country: ['United States', 'Germany', 'United Kingdom', 'France', 'Japan'][Math.floor(Math.random() * 5)],
        longitude: -180 + Math.random() * 360,
        latitude: -90 + Math.random() * 180,
        baro_altitude: Math.random() * 12000,
        velocity: 200 + Math.random() * 600,
        true_track: Math.random() * 360,
        vertical_rate: (Math.random() - 0.5) * 20,
        on_ground: Math.random() < 0.1,
        last_contact: Date.now() / 1000
      });
    }
    
    return mockFlights;
  }

  private generateRandomAlerts(flights: RealTimeFlightData[]) {
    // Generate some random alerts based on flight data
    if (Math.random() < 0.3) { // 30% chance of new alert
      const flight = flights[Math.floor(Math.random() * flights.length)];
      const alertTypes = ['critical', 'warning', 'info'] as const;
      const messages = [
        'Altitude deviation detected',
        'Communication anomaly',
        'Navigation system alert',
        'Engine parameter warning',
        'Weather advisory active'
      ];
      
      const newAlert: AlertData = {
        id: Math.random().toString(36).substr(2, 9),
        aircraftId: flight.callsign,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: new Date(),
        severity: Math.floor(Math.random() * 5) + 1
      };
      
      this.alertsCache.unshift(newAlert);
      if (this.alertsCache.length > 20) {
        this.alertsCache = this.alertsCache.slice(0, 20);
      }
    }
  }

  startPolling(interval: number = 10000) {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    
    this.pollingInterval = setInterval(async () => {
      const newData = await this.fetchFlightData();
      this.notifySubscribers({ flights: newData, alerts: this.alertsCache });
    }, interval);
    
    // Initial fetch
    this.fetchFlightData().then(data => {
      this.notifySubscribers({ flights: data, alerts: this.alertsCache });
    });
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  subscribe(callback: (data: any) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(data: any) {
    this.subscribers.forEach(callback => callback(data));
  }

  getFlightData() {
    return this.flightDataCache;
  }

  getAlerts() {
    return this.alertsCache;
  }
}

export const realTimeDataService = new RealTimeDataService();
