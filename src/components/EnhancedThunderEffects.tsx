import React, { useEffect, useState } from 'react';

export const EnhancedThunderEffects: React.FC = () => {
  const [isThundering, setIsThundering] = useState(false);
  const [lightningFlash, setLightningFlash] = useState(false);

  useEffect(() => {
    const createThunderSequence = () => {
      // Random interval between 3-8 seconds
      const nextThunder = 3000 + Math.random() * 5000;
      
      setTimeout(() => {
        // Lightning flash first
        setLightningFlash(true);
        setIsThundering(true);
        
        // Flash duration
        setTimeout(() => {
          setLightningFlash(false);
        }, 200);
        
        // Thunder duration
        setTimeout(() => {
          setIsThundering(false);
        }, 1000);
        
        // Schedule next thunder
        createThunderSequence();
      }, nextThunder);
    };

    createThunderSequence();
  }, []);

  return (
    <>
      {/* Lightning Flash Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none z-30 transition-all duration-100 ${
          lightningFlash 
            ? 'bg-gradient-radial from-white/20 via-terminal-green/10 to-transparent opacity-100' 
            : 'opacity-0'
        }`}
      />
      
      {/* Thunder Rumble Effect */}
      <div
        className={`fixed inset-0 pointer-events-none z-25 transition-all duration-1000 ${
          isThundering 
            ? 'bg-gradient-to-b from-gray-900/30 via-transparent to-transparent' 
            : 'opacity-0'
        }`}
      />
      
      {/* Atmospheric Particles */}
      <div className="fixed inset-0 pointer-events-none z-15 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-terminal-green/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
            }}
          />
        ))}
      </div>
      
      {/* Electric Field Lines */}
      <div className="fixed inset-0 pointer-events-none z-12 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-r from-transparent via-terminal-green/10 to-transparent h-px animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${100 + Math.random() * 200}px`,
              animationDuration: `${3 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 3}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    </>
  );
};