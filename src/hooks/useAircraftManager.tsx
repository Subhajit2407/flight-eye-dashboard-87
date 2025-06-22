
import { useState } from 'react';

export interface Aircraft {
  id: string;
  airlineName: string;
  aircraftId: string;
  flightNumber?: string;
  location: string;
  dateTime: Date;
}

export interface EnhancedBug {
  id: string;
  aircraftId: string;
  subsystem: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  timestamp: Date;
  status: 'Open' | 'In Progress' | 'Resolved';
  type: 'Hardware' | 'Software' | 'Network' | 'Sensor' | 'Configuration';
  reportedBy: 'Pilot' | 'Engineer' | 'AI Log' | 'Maintenance' | 'Other';
  location: string;
  airlineName: string;
}

export const useAircraftManager = () => {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [bugs, setBugs] = useState<EnhancedBug[]>([]);
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('');

  const addAircraft = (aircraftData: Omit<Aircraft, 'id'>) => {
    const newAircraft: Aircraft = {
      ...aircraftData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setAircraft(prev => [newAircraft, ...prev]);
    return newAircraft.id;
  };

  const addBugReport = (bugData: Omit<EnhancedBug, 'id' | 'timestamp' | 'status'>) => {
    const newBug: EnhancedBug = {
      ...bugData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      status: 'Open'
    };
    setBugs(prev => [newBug, ...prev]);
  };

  const updateBugStatus = (bugId: string, status: EnhancedBug['status']) => {
    setBugs(prev => prev.map(bug => 
      bug.id === bugId ? { ...bug, status } : bug
    ));
  };

  const deleteBug = (bugId: string) => {
    setBugs(prev => prev.filter(bug => bug.id !== bugId));
  };

  const getBugsByAircraft = (aircraftId: string) => {
    return bugs.filter(bug => bug.aircraftId === aircraftId);
  };

  const getAircraftById = (id: string) => {
    return aircraft.find(a => a.id === id);
  };

  return {
    aircraft,
    bugs,
    selectedAircraftId,
    setSelectedAircraftId,
    addAircraft,
    addBugReport,
    updateBugStatus,
    deleteBug,
    getBugsByAircraft,
    getAircraftById
  };
};
