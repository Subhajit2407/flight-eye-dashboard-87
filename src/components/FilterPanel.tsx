
import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const severityLevels = ['Critical', 'High', 'Medium', 'Low'];
  const subsystems = ['Flight Control', 'Navigation', 'Engine', 'Communication', 'Landing Gear'];
  const errorTypes = ['Hardware', 'Software', 'Network', 'Sensor', 'Configuration'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Filter Options</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Severity</h4>
            <div className="space-y-2">
              {severityLevels.map((level) => (
                <label key={level} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Subsystem</h4>
            <div className="space-y-2">
              {subsystems.map((system) => (
                <label key={system} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">{system}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Error Type</h4>
            <div className="space-y-2">
              {errorTypes.map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
