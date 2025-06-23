
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Globe, BarChart3, Users, CheckCircle, Star, Activity, Plane, AlertTriangle, TrendingUp } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({
    systems: 0,
    errors: 0,
    uptime: 0,
    response: 0
  });

  // Animated stats effect
  useEffect(() => {
    const targets = { systems: 2547, errors: 52847, uptime: 99.9, response: 1.8 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        systems: Math.floor(targets.systems * progress),
        errors: Math.floor(targets.errors * progress),
        uptime: Math.min(targets.uptime * progress, 99.9),
        response: Math.min(targets.response * progress, 1.8)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Continuous surveillance of aircraft systems with instant alert notifications and comprehensive error detection across all flight parameters."
    },
    {
      icon: Globe,
      title: "Global Flight Tracking",
      description: "Monitor aircraft systems worldwide with live data from OpenSky Network, tracking over 2,500 active flights in real-time."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Detailed analysis and insights with customizable reports, trend analysis, and predictive maintenance capabilities."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools for aviation teams with role-based access control and integrated communication systems."
    },
    {
      icon: AlertTriangle,
      title: "Intelligent Alerts",
      description: "Smart alerting system that categorizes issues by severity and provides actionable recommendations for resolution."
    },
    {
      icon: TrendingUp,
      title: "Predictive Insights",
      description: "Machine learning algorithms that predict potential issues before they become critical, reducing downtime by up to 85%."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Chief Engineer",
      company: "AeroTech Industries",
      content: "AirShield has revolutionized our error tracking process. The real-time monitoring and predictive analytics have saved us hundreds of hours and prevented multiple critical failures.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Systems Manager",
      company: "SkyLine Aviation",
      content: "The comprehensive reporting and live global tracking help us prevent issues before they become problems. It's like having a crystal ball for our fleet management.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Dr. Elena Rodriguez",
      role: "Director of Operations",
      company: "Continental Airways",
      content: "The integration with OpenSky Network provides unparalleled visibility into our operations. The system has become indispensable for our safety protocols.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const stats = [
    { label: "Active Systems", value: `${animatedStats.systems.toLocaleString()}+`, color: "text-blue-400" },
    { label: "Errors Detected", value: `${animatedStats.errors.toLocaleString()}+`, color: "text-green-400" },
    { label: "System Uptime", value: `${animatedStats.uptime.toFixed(1)}%`, color: "text-purple-400" },
    { label: "Response Time", value: `${animatedStats.response.toFixed(1)}ms`, color: "text-orange-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">AirShield</h1>
                <p className="text-xs text-gray-500 font-medium">Aviation System Monitor</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Features
              </button>
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Pricing
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Launch Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Activity className="w-4 h-4" />
              <span>Now with Real-Time Global Flight Tracking</span>
            </div>
            
            <h1 className="text-7xl font-light text-gray-900 leading-tight mb-8">
              Aircraft System Monitoring
              <br />
              <span className="font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Reimagined for the Future
              </span>
            </h1>
            
            <p className="text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Real-time monitoring and detection of aircraft system errors with comprehensive bug tracking capabilities. 
              Built for modern aviation teams with live global flight data integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => navigate('/dashboard')}
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-5 text-xl font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center space-x-3 border-2 border-blue-600 text-blue-600 px-10 py-5 text-xl font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Plane className="w-6 h-6" />
                <span>Watch Live Demo</span>
              </button>
            </div>
            
            {/* Live Stats Preview */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-200">
              <div className="text-sm text-gray-500 mb-4 font-medium">Live System Statistics</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Comprehensive Aviation Solutions
              <span className="block font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                For Modern Operations
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to monitor, track, and resolve aircraft system issues efficiently with cutting-edge technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-light text-gray-900 mb-8">
                Why Aviation Leaders Choose
                <span className="block font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AirShield
                </span>
              </h2>
              <div className="space-y-6">
                {[
                  "Reduce system downtime by up to 85% with predictive analytics",
                  "Real-time alerts with intelligent priority classification",
                  "Comprehensive error analytics with trend prediction",
                  "Seamless team collaboration with integrated workflows",
                  "Industry-leading security with military-grade encryption",
                  "Global flight tracking with live OpenSky Network data",
                  "24/7 monitoring with automated incident response",
                  "Customizable dashboards for different operational roles"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 rounded-3xl p-12 h-[600px] flex items-center justify-center shadow-2xl">
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <BarChart3 className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Dashboard Preview</h3>
                    <p className="text-gray-600">Real-time system monitoring with advanced analytics</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/70 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">2.5K+</div>
                      <div className="text-xs text-gray-600">Systems</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">99.9%</div>
                      <div className="text-xs text-gray-600">Uptime</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-600">1.8ms</div>
                      <div className="text-xs text-gray-600">Response</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Trusted by Industry Leaders
              <span className="block font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of aviation professionals who rely on AirShield for critical system monitoring.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600 font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <h2 className="text-5xl font-light text-white mb-8">
            Ready to Transform Your
            <span className="block font-bold">Aircraft Monitoring?</span>
          </h2>
          <p className="text-2xl text-blue-100 mb-12 leading-relaxed">
            Join thousands of aviation professionals who trust AirShield for mission-critical system monitoring and real-time global flight tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="group inline-flex items-center space-x-3 bg-white text-blue-700 px-10 py-5 text-xl font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105"
            >
              <span>Start Monitoring Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center space-x-3 border-2 border-white text-white px-10 py-5 text-xl font-bold rounded-xl hover:bg-white hover:text-blue-700 transition-all duration-300">
              <Globe className="w-6 h-6" />
              <span>View Live Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">AirShield</div>
                  <div className="text-sm text-gray-400">Aviation System Monitor</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Advanced aircraft system monitoring with real-time global flight tracking. 
                Built for modern aviation teams who demand reliability and precision.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex items-center justify-between">
            <div className="text-gray-400">
              © 2024 AirShield Aviation Systems. All rights reserved.
            </div>
            <div className="text-sm text-gray-400">
              Powered by OpenSky Network • Real-time Data
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
