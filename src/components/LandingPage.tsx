import React from 'react';
import { Zap, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Main title with glow effect */}
        <div className="relative mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
            <span className="inline-block animate-pulse-glow">STORM</span>
            <span className="text-blue-300 ml-4">TECH</span>
          </h1>
          <div className="absolute inset-0 text-6xl md:text-8xl font-bold text-blue-400 opacity-20 blur-sm animate-pulse">
            STORM TECH
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed font-light">
          Riding the storm of innovation in the digital world
        </p>

        {/* Description */}
        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Experience the power of cutting-edge technology solutions designed to weather any digital storm. 
          We build robust, scalable applications that stand strong against the elements.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Explore Our Work</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
          
          <button className="px-8 py-4 border-2 border-gray-400 text-gray-300 font-semibold rounded-lg hover:border-white hover:text-white transition-all duration-300 hover:bg-white/5">
            Get In Touch
          </button>
        </div>

        {/* Social links */}
        <div className="flex justify-center space-x-6">
          <a 
            href="#" 
            className="p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-full text-gray-400 hover:text-white hover:border-blue-400 transition-all duration-300 hover:scale-110"
            title="GitHub"
          >
            <Github className="h-6 w-6" />
          </a>
          <a 
            href="#" 
            className="p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-full text-gray-400 hover:text-white hover:border-blue-400 transition-all duration-300 hover:scale-110"
            title="LinkedIn"
          >
            <Linkedin className="h-6 w-6" />
          </a>
          <a 
            href="#" 
            className="p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-full text-gray-400 hover:text-white hover:border-blue-400 transition-all duration-300 hover:scale-110"
            title="Email"
          >
            <Mail className="h-6 w-6" />
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};