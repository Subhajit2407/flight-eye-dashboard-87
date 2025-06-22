
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Globe, BarChart3, Users, CheckCircle, Star } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Real-time Monitoring",
      description: "Continuous surveillance of aircraft systems with instant alert notifications and comprehensive error detection."
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Monitor aircraft systems worldwide with our advanced tracking and reporting infrastructure."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Detailed analysis and insights with customizable reports and performance metrics."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools for engineering teams with role-based access control."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Chief Engineer",
      company: "AeroTech Industries",
      content: "AirShield has revolutionized our error tracking process. The real-time monitoring saves us hours of manual work.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Systems Manager",
      company: "SkyLine Aviation",
      content: "The comprehensive reporting and analytics help us prevent issues before they become critical problems.",
      rating: 5
    }
  ];

  const stats = [
    { label: "Active Systems", value: "2,500+" },
    { label: "Errors Detected", value: "50,000+" },
    { label: "Uptime", value: "99.9%" },
    { label: "Response Time", value: "<2ms" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">AirShield</h1>
                <p className="text-xs text-gray-500">System Monitor</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-light text-black leading-tight mb-6">
              Aircraft Error Tracking
              <br />
              <span className="font-semibold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                Reinvented
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Real-time monitoring and detection of aircraft system errors with comprehensive bug tracking capabilities. 
              Built for modern aviation teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="group inline-flex items-center space-x-3 bg-black text-white px-8 py-4 text-lg font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center space-x-3 border-2 border-black text-black px-8 py-4 text-lg font-medium rounded-lg hover:bg-black hover:text-white transition-all duration-300">
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-black mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-4">
              Powerful Features for
              <span className="font-semibold"> Modern Aviation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to monitor, track, and resolve aircraft system issues efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light text-black mb-6">
                Why Choose
                <span className="font-semibold"> AirShield?</span>
              </h2>
              <div className="space-y-6">
                {[
                  "Reduce system downtime by up to 85%",
                  "Real-time alerts and notifications",
                  "Comprehensive error analytics",
                  "Seamless team collaboration",
                  "Industry-leading security standards"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-4">
              Trusted by
              <span className="font-semibold"> Industry Leaders</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-black">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light text-white mb-6">
            Ready to Transform Your
            <span className="font-semibold"> Aircraft Monitoring?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of aviation professionals who trust AirShield for their system monitoring needs.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="group inline-flex items-center space-x-3 bg-white text-black px-8 py-4 text-lg font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-black">AirShield</div>
                <div className="text-xs text-gray-500">System Monitor</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 AirShield. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
