
import { useState, useEffect } from 'react';
import { realTimeDataService, RealTimeFlightData, AlertData } from '../services/realTimeDataService';

export const useRealTimeData = () => {
  const [flightData, setFlightData] = useState<RealTimeFlightData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const unsubscribe = realTimeDataService.subscribe((data) => {
      setFlightData(data.flights);
      setAlerts(data.alerts);
      setLastUpdate(new Date());
      setIsLoading(false);
    });

    realTimeDataService.startPolling(8000); // Poll every 8 seconds

    return () => {
      unsubscribe();
      realTimeDataService.stopPolling();
    };
  }, []);

  const getActiveFlights = () => flightData.filter(f => !f.on_ground);
  const getCriticalAlerts = () => alerts.filter(a => a.type === 'critical');
  const getRecentAlerts = () => alerts.filter(a => 
    new Date().getTime() - a.timestamp.getTime() < 300000 // Last 5 minutes
  );

  return {
    flightData,
    alerts,
    isLoading,
    lastUpdate,
    getActiveFlights,
    getCriticalAlerts,
    getRecentAlerts
  };
};
