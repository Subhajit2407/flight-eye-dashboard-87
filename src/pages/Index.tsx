import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import AlertsChart from '../components/AlertsChart';
import BugReportChart from '../components/BugReportChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import RealGlobalMap from '../components/RealGlobalMap';
import InteractiveGlobalMap from '../components/InteractiveGlobalMap';
import FilterPanel from '../components/FilterPanel';
import BugList from '../components/BugList';
import AircraftEntryForm from '../components/AircraftEntryForm';
import EnhancedBugReportForm from '../components/EnhancedBugReportForm';
import ReportsPage from '../components/ReportsPage';
import LegacyBugPage from '../components/LegacyBugPage';
import EnhancedReportsPage from '../components/EnhancedReportsPage';
import { useBugManager } from '../hooks/useBugManager';
import { useAircraftManager } from '../hooks/useAircraftManager';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { Filter, Download, RefreshCw, Plus, Trash2, Wifi, WifiOff } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { bugs, allBugs, filter, setFilter, addRandomBug, clearAllBugs, resolveBug } = useBugManager();
  const { aircraft, bugs: enhancedBugs } = useAircraftManager();
  const { flightData, alerts, isLoading, lastUpdate, getActiveFlights, getCriticalAlerts, getRecentAlerts } = useRealTimeData();

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Real-time Status Indicator */}
            <div className="flex items-center justify-between bg-accent/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                {isLoading ? (
                  <WifiOff className="w-4 h-4 text-red-400" />
                ) : (
                  <Wifi className="w-4 h-4 text-green-400" />
                )}
                <span className="text-sm">
                  {isLoading ? 'Connecting to live data...' : 'Live data active'}
                </span>
                {lastUpdate && (
                  <span className="text-xs text-muted-foreground">
                    Last update: {lastUpdate.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {flightData.length} flights tracked • {alerts.length} active alerts
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Live Flight Alerts" 
                value={getRecentAlerts().length.toString()} 
                change={Math.floor(Math.random() * 20) - 10}
                changeType={Math.random() > 0.5 ? "increase" : "decrease"}
                severity="high"
                subtitle="Last 5 minutes"
              />
              <MetricCard 
                title="Critical Issues" 
                value={getCriticalAlerts().length.toString()} 
                change={-Math.floor(Math.random() * 5)}
                changeType="decrease"
                severity="critical"
                subtitle={`Total alerts: ${alerts.length}`}
              />
              <MetricCard 
                title="Active Flights" 
                value={getActiveFlights().length.toString()} 
                change={Math.floor(Math.random() * 15)}
                changeType="increase"
                severity="low"
                subtitle="Currently airborne"
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
                <InteractiveGlobalMap />
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
        return <EnhancedReportsPage />;
      
      case 'bugs':
        return <LegacyBugPage />;
      
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
              <h3 className="text-xl font-semibold mb-4">Interactive Global Flight Monitoring</h3>
              <p className="text-muted-foreground">Real-time tracking with enhanced visualization, zoom, and pan capabilities.</p>
            </div>
            <InteractiveGlobalMap />
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
