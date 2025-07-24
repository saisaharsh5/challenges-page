import React, { useEffect, useRef, useState } from 'react';

interface Lightning {
  id: number;
  x: number;
  y: number;
  branches: Array<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    opacity: number;
  }>;
  opacity: number;
  duration: number;
  createdAt: number;
}

export const ThunderBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightnings, setLightnings] = useState<Lightning[]>([]);
  const [flash, setFlash] = useState(false);
  const animationRef = useRef<number>();
  const lastLightningRef = useRef<number>(0);

  // Generate random lightning bolt
  const generateLightning = (): Lightning => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as Lightning;

    const startX = Math.random() * canvas.width;
    const startY = 0;
    const endY = canvas.height * (0.3 + Math.random() * 0.7);
    
    const branches: Lightning['branches'] = [];
    let currentX = startX;
    let currentY = startY;
    
    // Main bolt
    const segments = 15 + Math.random() * 20;
    for (let i = 0; i < segments; i++) {
      const nextX = currentX + (Math.random() - 0.5) * 60;
      const nextY = currentY + (endY - startY) / segments;
      
      branches.push({
        startX: currentX,
        startY: currentY,
        endX: nextX,
        endY: nextY,
        opacity: 0.8 + Math.random() * 0.2
      });
      
      // Add random side branches
      if (Math.random() < 0.3 && i > 3) {
        const branchLength = 50 + Math.random() * 100;
        const branchAngle = (Math.random() - 0.5) * Math.PI * 0.8;
        const branchEndX = currentX + Math.cos(branchAngle) * branchLength;
        const branchEndY = currentY + Math.sin(branchAngle) * branchLength;
        
        branches.push({
          startX: currentX,
          startY: currentY,
          endX: branchEndX,
          endY: branchEndY,
          opacity: 0.4 + Math.random() * 0.4
        });
      }
      
      currentX = nextX;
      currentY = nextY;
    }

    return {
      id: Date.now() + Math.random(),
      x: startX,
      y: startY,
      branches,
      opacity: 1,
      duration: 200 + Math.random() * 300,
      createdAt: Date.now()
    };
  };

  // Draw lightning on canvas
  const drawLightning = (ctx: CanvasRenderingContext2D, lightning: Lightning) => {
    const age = Date.now() - lightning.createdAt;
    const progress = Math.min(age / lightning.duration, 1);
    const fadeOpacity = progress < 0.7 ? 1 : (1 - (progress - 0.7) / 0.3);
    
    ctx.save();
    ctx.globalAlpha = lightning.opacity * fadeOpacity;
    
    // Main lightning glow
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    lightning.branches.forEach((branch, index) => {
      if (index === 0 || Math.random() < 0.8) {
        ctx.globalAlpha = lightning.opacity * fadeOpacity * branch.opacity;
        
        // Draw main bolt
        ctx.beginPath();
        ctx.moveTo(branch.startX, branch.startY);
        ctx.lineTo(branch.endX, branch.endY);
        ctx.stroke();
        
        // Add inner bright core
        ctx.shadowBlur = 5;
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Reset for next branch
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
      }
    });
    
    ctx.restore();
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw lightnings
    setLightnings(prev => {
      const now = Date.now();
      const updated = prev
        .filter(lightning => now - lightning.createdAt < lightning.duration)
        .map(lightning => {
          drawLightning(ctx, lightning);
          return lightning;
        });
      
      return updated;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  // Generate lightning strikes
  useEffect(() => {
    const generateStrike = () => {
      const now = Date.now();
      if (now - lastLightningRef.current > 2000) { // Minimum 2 seconds between strikes
        if (Math.random() < 0.3) { // 30% chance every interval
          const newLightning = generateLightning();
          setLightnings(prev => [...prev, newLightning]);
          lastLightningRef.current = now;
          
          // Trigger screen flash
          setFlash(true);
          setTimeout(() => setFlash(false), 150);
          
          // Play thunder sound (optional - can be enabled if needed)
          // playThunderSound();
        }
      }
    };

    const interval = setInterval(generateStrike, 1000);
    return () => clearInterval(interval);
  }, []);

  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Thunder Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Flash Effect */}
      <div
        className={`fixed inset-0 pointer-events-none z-20 transition-opacity duration-150 ${
          flash ? 'opacity-20' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(0,255,65,0.3) 0%, rgba(0,255,65,0.1) 50%, transparent 100%)'
        }}
      />
      
      {/* Animated Storm Clouds */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-gray-900/40 via-gray-800/20 to-transparent">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Moving cloud shadows */}
            <div className="absolute top-0 left-0 w-96 h-32 bg-gray-900/30 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 animate-bounce" style={{ animationDuration: '8s' }}></div>
            <div className="absolute top-8 right-0 w-80 h-28 bg-gray-800/25 rounded-full blur-2xl animate-pulse transform translate-x-1/3" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
            <div className="absolute top-4 left-1/3 w-64 h-24 bg-gray-900/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Rain Effect */}
      <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-blue-200/20 to-transparent animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${20 + Math.random() * 40}px`,
              animationDuration: `${0.5 + Math.random() * 1}s`,
              animationDelay: `${Math.random() * 2}s`,
              animationIterationCount: 'infinite',
              transform: `translateY(-100px)`,
              animation: `rainDrop ${0.5 + Math.random() * 1}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* CSS for rain animation */}
      <style jsx>{`
        @keyframes rainDrop {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};