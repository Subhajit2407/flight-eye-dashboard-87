
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-6">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-black">AirShield</h1>
            <p className="text-gray-600 text-sm">System Monitor</p>
          </div>
        </div>
        
        {/* Main Heading */}
        <div className="space-y-4">
          <h2 className="text-5xl font-light text-black leading-tight">
            Aircraft Error Tracking
            <br />
            <span className="font-semibold">System</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            Real-time monitoring and detection of aircraft system errors with comprehensive bug tracking capabilities.
          </p>
        </div>
        
        {/* CTA Button */}
        <div className="pt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="group inline-flex items-center space-x-3 bg-black text-white px-8 py-4 text-lg font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Features */}
        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-black">Real-time Monitoring</h3>
            <p className="text-gray-600 text-sm">Continuous system surveillance</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-black">Error Detection</h3>
            <p className="text-gray-600 text-sm">Automated anomaly identification</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-black">Comprehensive Reports</h3>
            <p className="text-gray-600 text-sm">Detailed analysis and insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
