import React from 'react';
import { 
  Gauge, 
  AlertTriangle, 
  Bug, 
  Settings, 
  FileText, 
  Layers,
  Shield,
  Activity,
  Map,
  Plane,
  ClipboardList
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Gauge },
    { id: 'aircraft-entry', label: 'Aircraft Entry', icon: Plane },
    { id: 'bug-reporting', label: 'Bug Reporting', icon: ClipboardList },
    { id: 'reports', label: 'Reports & PDF', icon: FileText },
    { id: 'alerts', label: 'Detection Alerts', icon: AlertTriangle },
    { id: 'bugs', label: 'Legacy Bugs', icon: Bug },
    { id: 'subsystems', label: 'Subsystems', icon: Layers },
    { id: 'map', label: 'Global View', icon: Map },
    { id: 'history', label: 'Error History', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">AirShield</h1>
            <p className="text-xs text-sidebar-foreground/60">System Monitor</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`sidebar-item w-full ${
                isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">
          System Status: <span className="text-green-400">Online</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
