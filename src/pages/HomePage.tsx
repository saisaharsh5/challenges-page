import React from 'react';
import { EditableText } from '../components/EditableText';
import { TryHackMeSection } from '../components/sections/TryHackMeSection';
import { HackTheBoxSection } from '../components/sections/HackTheBoxSection';
import { CTFSection } from '../components/sections/CTFSection';
import { ReturnToMainButton } from '../components/ReturnToMainButton';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-mono font-bold text-white mb-6 leading-tight">
              <EditableText
                contentKey="hero-title"
                defaultText="> Cybersecurity\n> Portfolio"
                className="whitespace-pre-line"
              />
            </h1>
            <div className="text-xl text-gray-300 leading-relaxed mb-8">
              <EditableText
                contentKey="hero-description"
                defaultText="Welcome to my cybersecurity journey. Explore my achievements from TryHackMe rooms, Hack The Box machines, and CTF competitions. Every challenge conquered, every vulnerability discovered, and every flag captured represents a step forward in the endless pursuit of security knowledge."
                className="block"
              />
            </div>
            <div className="inline-block">
              <div className="flex items-center space-x-2 text-terminal-green font-mono">
                <span className="animate-pulse">█</span>
                <span>Ready to hack the planet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-900 border-t border-terminal-green/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-mono font-bold text-white mb-8 text-center">
            <span className="text-terminal-green">{'>'}</span> About Me
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <div className="text-gray-300 leading-relaxed">
              <EditableText
                contentKey="about-me"
                defaultText="I am a passionate cybersecurity enthusiast dedicated to understanding the intricate world of digital security. My journey spans across various platforms including TryHackMe, Hack The Box, and numerous CTF competitions. Each challenge I tackle enhances my skills in penetration testing, vulnerability assessment, and ethical hacking. I believe in continuous learning and pushing the boundaries of what's possible in cybersecurity."
                className="block min-h-[120px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Sections */}
      <TryHackMeSection />
      <HackTheBoxSection />
      <CTFSection />
      
      {/* Return to Main Page Button - Now placed below CTF section */}
      <ReturnToMainButton />
    </div>
  );
};