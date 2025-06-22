
import { useState } from 'react';

export interface Bug {
  id: string;
  subsystem: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  timestamp: Date;
  status: 'Open' | 'In Progress' | 'Resolved';
  type: 'Hardware' | 'Software' | 'Network' | 'Sensor' | 'Configuration';
}

const generateRandomBug = (): Bug => {
  const subsystems = ['Flight Control', 'Navigation', 'Engine', 'Communication', 'Landing Gear'];
  const severities: Bug['severity'][] = ['Critical', 'High', 'Medium', 'Low'];
  const types: Bug['type'][] = ['Hardware', 'Software', 'Network', 'Sensor', 'Configuration'];
  const descriptions = [
    'Sensor malfunction detected',
    'Communication timeout error',
    'Navigation system drift',
    'Engine performance anomaly',
    'Control surface response delay'
  ];

  return {
    id: Math.random().toString(36).substr(2, 9),
    subsystem: subsystems[Math.floor(Math.random() * subsystems.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    timestamp: new Date(),
    status: 'Open',
    type: types[Math.floor(Math.random() * types.length)]
  };
};

export const useBugManager = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [filter, setFilter] = useState<{
    severity?: Bug['severity'];
    subsystem?: string;
    type?: Bug['type'];
  }>({});

  const addRandomBug = () => {
    const newBug = generateRandomBug();
    setBugs(prev => [newBug, ...prev]);
  };

  const clearAllBugs = () => {
    setBugs([]);
  };

  const resolveBug = (id: string) => {
    setBugs(prev => prev.map(bug => 
      bug.id === id ? { ...bug, status: 'Resolved' } : bug
    ));
  };

  const filteredBugs = bugs.filter(bug => {
    if (filter.severity && bug.severity !== filter.severity) return false;
    if (filter.subsystem && bug.subsystem !== filter.subsystem) return false;
    if (filter.type && bug.type !== filter.type) return false;
    return true;
  });

  return {
    bugs: filteredBugs,
    allBugs: bugs,
    filter,
    setFilter,
    addRandomBug,
    clearAllBugs,
    resolveBug
  };
};
