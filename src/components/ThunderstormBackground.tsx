import React, { useEffect, useRef, useState } from 'react';

interface ThunderstormBackgroundProps {
  children: React.ReactNode;
}

export const ThunderstormBackground: React.FC<ThunderstormBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>();
  
  // Rain particles
  const raindrops = useRef<Array<{
    x: number;
    y: number;
    speed: number;
    length: number;
    opacity: number;
  }>>([]);

  // Lightning system
  const [isLightning, setIsLightning] = useState(false);
  const lightningTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize raindrops
    const initRain = () => {
      raindrops.current = [];
      const numDrops = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000));
      
      for (let i = 0; i < numDrops; i++) {
        raindrops.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 3 + 2,
          length: Math.random() * 20 + 10,
          opacity: Math.random() * 0.6 + 0.2
        });
      }
    };

    initRain();

    // Lightning generation
    const generateLightning = () => {
      setIsLightning(true);
      
      // Play thunder sound if enabled
      if (soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }

      // Lightning duration
      setTimeout(() => setIsLightning(false), 150);

      // Schedule next lightning (3-8 seconds)
      const nextLightning = Math.random() * 5000 + 3000;
      lightningTimeout.current = setTimeout(generateLightning, nextLightning);
    };

    // Start lightning cycle
    const initialDelay = Math.random() * 3000 + 2000;
    lightningTimeout.current = setTimeout(generateLightning, initialDelay);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw rain
      ctx.strokeStyle = 'rgba(173, 216, 230, 0.6)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      raindrops.current.forEach((drop, index) => {
        ctx.globalAlpha = drop.opacity;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.length);
        ctx.stroke();

        // Update raindrop position
        drop.y += drop.speed;
        drop.x -= 0.5; // Slight diagonal movement

        // Reset raindrop when it goes off screen
        if (drop.y > canvas.height + drop.length) {
          drop.y = -drop.length;
          drop.x = Math.random() * (canvas.width + 100);
        }
        if (drop.x < -50) {
          drop.x = canvas.width + 50;
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (lightningTimeout.current) {
        clearTimeout(lightningTimeout.current);
      }
    };
  }, [soundEnabled]);

  // Initialize audio
  useEffect(() => {
    // Create a simple thunder sound using Web Audio API
    const createThunderSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const duration = 2;
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate thunder-like noise
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 3) * (1 - Math.exp(-t * 20));
        data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.1;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      return () => {
        source.start();
      };
    };

    if (soundEnabled) {
      try {
        const playThunder = createThunderSound();
        audioRef.current = { play: playThunder, currentTime: 0 } as any;
      } catch (error) {
        console.warn('Audio not supported:', error);
      }
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated storm clouds background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0">
          {/* Moving clouds */}
          <div className="absolute top-0 left-0 w-full h-full opacity-40">
            <div className="cloud cloud-1 absolute top-10 left-0 w-96 h-32 bg-gray-700 rounded-full blur-xl animate-cloud-1"></div>
            <div className="cloud cloud-2 absolute top-20 right-0 w-80 h-28 bg-gray-600 rounded-full blur-xl animate-cloud-2"></div>
            <div className="cloud cloud-3 absolute top-32 left-1/3 w-72 h-24 bg-gray-800 rounded-full blur-xl animate-cloud-3"></div>
            <div className="cloud cloud-4 absolute top-5 right-1/4 w-64 h-20 bg-gray-700 rounded-full blur-xl animate-cloud-4"></div>
          </div>
        </div>
      </div>

      {/* Canvas for rain and lightning effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Lightning flash overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 pointer-events-none ${
          isLightning 
            ? 'opacity-30 bg-gradient-radial from-white via-blue-100 to-transparent' 
            : 'opacity-0'
        }`}
        style={{ zIndex: 2 }}
      />

      {/* Lightning bolts */}
      {isLightning && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
          <svg className="w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Main lightning bolt */}
            <path
              d={`M ${Math.random() * 200 + 100} 0 
                 L ${Math.random() * 100 + 150} 100
                 L ${Math.random() * 150 + 120} 200
                 L ${Math.random() * 200 + 100} 300
                 L ${Math.random() * 150 + 130} 400`}
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="3"
              fill="none"
              filter="url(#glow)"
              className="animate-lightning"
            />
            {/* Secondary bolt */}
            <path
              d={`M ${Math.random() * 200 + 300} 0 
                 L ${Math.random() * 100 + 350} 150
                 L ${Math.random() * 150 + 320} 300`}
              stroke="rgba(173, 216, 230, 0.7)"
              strokeWidth="2"
              fill="none"
              filter="url(#glow)"
              className="animate-lightning-delayed"
            />
          </svg>
        </div>
      )}

      {/* Dark overlay for text readability */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-[1px]"
        style={{ zIndex: 4 }}
      />

      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Sound toggle button */}
      <button
        onClick={toggleSound}
        className="fixed top-4 right-4 z-20 p-3 bg-gray-900/80 backdrop-blur-sm border border-gray-600 rounded-full text-white hover:bg-gray-800/80 transition-all duration-300 group"
        title={soundEnabled ? 'Disable thunder sounds' : 'Enable thunder sounds'}
      >
        {soundEnabled ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.846l3.537-3.816a1 1 0 011.617.816zM16 8a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" />
            <path d="M14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.846l3.537-3.816a1 1 0 011.617.816zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
  );
};