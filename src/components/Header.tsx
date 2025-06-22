
import React from 'react';
import { Bell, User, Settings, Search, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-card/30 backdrop-blur-sm border-b border-border/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </button>
          <h2 className="text-xl font-semibold text-foreground">Aircraft Systems Dashboard</h2>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search systems..."
              className="pl-10 pr-4 py-2 bg-input border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          
          <button className="relative p-2 hover:bg-accent/50 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse-glow"></span>
          </button>
          
          <button className="p-2 hover:bg-accent/50 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-foreground" />
          </button>
          
          <button className="p-2 hover:bg-accent/50 rounded-lg transition-colors">
            <User className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
