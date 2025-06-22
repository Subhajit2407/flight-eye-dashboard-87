
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import AlertsChart from '../components/AlertsChart';
import BugReportChart from '../components/BugReportChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import GlobalMap from '../components/GlobalMap';
import FilterPanel from '../components/FilterPanel';
import { Filter, Download, RefreshCw } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
                value="23" 
                change={-15}
                changeType="decrease"
                severity="critical"
                subtitle="Resolved: 8"
              />
              <MetricCard 
                title="System Uptime" 
                value="99.97%" 
                change={0.03}
                changeType="increase"
                severity="low"
                subtitle="30-day average"
              />
              <MetricCard 
                title="Bug Reports" 
                value="156" 
                change={8}
                changeType="increase"
                severity="medium"
                subtitle="This week"
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
                <GlobalMap />
              </div>
            </div>
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
      
      case 'bugs':
        return (
          <div className="space-y-6">
            <div className="aviation-card p-6">
              <h3 className="text-xl font-semibold mb-4">Bug Report Tracking</h3>
              <p className="text-muted-foreground">Comprehensive bug tracking and resolution management.</p>
            </div>
            <BugReportChart />
          </div>
        );
      
      case 'map':
        return (
          <div className="space-y-6">
            <div className="aviation-card p-6">
              <h3 className="text-xl font-semibold mb-4">Global System Monitoring</h3>
              <p className="text-muted-foreground">Worldwide view of aircraft system status and incidents.</p>
            </div>
            <GlobalMap />
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
                {activeSection === 'dashboard' ? 'System Overview' : activeSection.replace('-', ' ')}
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
