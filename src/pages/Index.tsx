import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import AlertsChart from '../components/AlertsChart';
import BugReportChart from '../components/BugReportChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import RealGlobalMap from '../components/RealGlobalMap';
import FilterPanel from '../components/FilterPanel';
import BugList from '../components/BugList';
import AircraftEntryForm from '../components/AircraftEntryForm';
import EnhancedBugReportForm from '../components/EnhancedBugReportForm';
import ReportsPage from '../components/ReportsPage';
import { useBugManager } from '../hooks/useBugManager';
import { useAircraftManager } from '../hooks/useAircraftManager';
import { Filter, Download, RefreshCw, Plus, Trash2 } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { bugs, allBugs, filter, setFilter, addRandomBug, clearAllBugs, resolveBug } = useBugManager();
  const { aircraft, bugs: enhancedBugs } = useAircraftManager();

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Active Alerts" 
                value="1,247" 
                change={12}
                changeType="increase"
                severity="high"
                subtitle="24h period"
              />
              <MetricCard 
                title="Critical Issues" 
                value={enhancedBugs.filter(b => b.severity === 'Critical' && b.status !== 'Resolved').length.toString()} 
                change={-15}
                changeType="decrease"
                severity="critical"
                subtitle={`Resolved: ${enhancedBugs.filter(b => b.severity === 'Critical' && b.status === 'Resolved').length}`}
              />
              <MetricCard 
                title="Registered Aircraft" 
                value={aircraft.length.toString()} 
                change={8}
                changeType="increase"
                severity="low"
                subtitle="Total registered"
              />
              <MetricCard 
                title="Bug Reports" 
                value={enhancedBugs.length.toString()} 
                change={8}
                changeType="increase"
                severity="medium"
                subtitle="Total reported"
              />
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertsChart />
              <BugReportChart />
            </div>
            
            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CategoryBreakdown />
              <div className="lg:col-span-2">
                <RealGlobalMap />
              </div>
            </div>
          </div>
        );
      
      case 'aircraft-entry':
        return (
          <div className="space-y-6">
            <AircraftEntryForm />
          </div>
        );
        
      case 'bug-reporting':
        return (
          <div className="space-y-6">
            <EnhancedBugReportForm />
          </div>
        );
        
      case 'reports':
        return <ReportsPage />;
      
      case 'bugs':
        return (
          <div className="space-y-6">
            <div className="aviation-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Legacy Bug Report Management</h3>
                  <p className="text-muted-foreground">Simple bug tracking and resolution management.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={addRandomBug}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Bug</span>
                  </button>
                  <button
                    onClick={clearAllBugs}
                    className="flex items-center space-x-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3 mb-6">
                <select
                  value={filter.severity || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value as any || undefined }))}
                  className="px-3 py-2 bg-input border border-border rounded-lg text-sm"
                >
                  <option value="">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                
                <select
                  value={filter.subsystem || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, subsystem: e.target.value || undefined }))}
                  className="px-3 py-2 bg-input border border-border rounded-lg text-sm"
                >
                  <option value="">All Subsystems</option>
                  <option value="Flight Control">Flight Control</option>
                  <option value="Navigation">Navigation</option>
                  <option value="Engine">Engine</option>
                  <option value="Communication">Communication</option>
                  <option value="Landing Gear">Landing Gear</option>
                </select>
                
                <select
                  value={filter.type || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any || undefined }))}
                  className="px-3 py-2 bg-input border border-border rounded-lg text-sm"
                >
                  <option value="">All Types</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Network">Network</option>
                  <option value="Sensor">Sensor</option>
                  <option value="Configuration">Configuration</option>
                </select>
              </div>
            </div>
            
            <BugList bugs={bugs} onResolveBug={resolveBug} />
          </div>
        );
      
      case 'alerts':
        return (
          <div className="space-y-6">
            <div className="aviation-card p-6">
              <h3 className="text-xl font-semibold mb-4">Detection Alerts Management</h3>
              <p className="text-muted-foreground">Real-time monitoring of aircraft system alerts and anomalies.</p>
            </div>
            <AlertsChart />
          </div>
        );
      
      case 'map':
        return (
          <div className="space-y-6">
            <div className="aviation-card p-6">
              <h3 className="text-xl font-semibold mb-4">Live Global Flight Monitoring</h3>
              <p className="text-muted-foreground">Real-time tracking of aircraft worldwide with live data from OpenSky Network.</p>
            </div>
            <RealGlobalMap />
          </div>
        );
      
      default:
        return (
          <div className="aviation-card p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Section Under Development</h3>
            <p className="text-muted-foreground">This section is being built. Please check back soon.</p>
          </div>
        );
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'System Overview';
      case 'aircraft-entry': return 'Aircraft Registration';
      case 'bug-reporting': return 'Bug Reporting';
      case 'reports': return 'Reports & Analytics';
      default: return activeSection.replace('-', ' ');
    }
  };

  return (
    <div className="min-h-screen bg-aviation-darker flex w-full">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground capitalize">
                {getSectionTitle()}
              </h1>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-accent/50 hover:bg-accent rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filters</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          {renderMainContent()}
        </main>
      </div>
      
      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

export default Index;
