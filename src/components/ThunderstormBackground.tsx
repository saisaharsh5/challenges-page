import React, { useEffect, useRef, useState } from 'react';

interface Lightning {
  id: number;
  x: number;
  y: number;
  branches: Array<{ x: number; y: number }>;
  opacity: number;
  duration: number;
  startTime: number;
}

export const ThunderstormBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightnings, setLightnings] = useState<Lightning[]>([]);
  const [flash, setFlash] = useState(false);
  const animationRef = useRef<number>();
  const lastLightningRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const generateLightning = (x: number, y: number): Array<{ x: number; y: number }> => {
      const branches: Array<{ x: number; y: number }> = [{ x, y }];
      let currentX = x;
      let currentY = y;
      
      const segments = 15 + Math.random() * 20;
      
      for (let i = 0; i < segments; i++) {
        const angle = (Math.random() - 0.5) * 0.8;
        const length = 20 + Math.random() * 40;
        
        currentX += Math.sin(angle) * length;
        currentY += Math.cos(angle) * length;
        
        branches.push({ x: currentX, y: currentY });
        
        // Add random side branches
        if (Math.random() < 0.3 && i > 3) {
          const branchX = currentX;
          const branchY = currentY;
          const branchAngle = angle + (Math.random() - 0.5) * 1.5;
          const branchLength = 10 + Math.random() * 30;
          
          branches.push({
            x: branchX + Math.sin(branchAngle) * branchLength,
            y: branchY + Math.cos(branchAngle) * branchLength
          });
        }
      }
      
      return branches;
    };

    const createLightning = () => {
      const now = Date.now();
      if (now - lastLightningRef.current < 2000) return;
      
      lastLightningRef.current = now;
      
      const x = Math.random() * canvas.width;
      const y = 0;
      
      const newLightning: Lightning = {
        id: Date.now(),
        x,
        y,
        branches: generateLightning(x, y),
        opacity: 1,
        duration: 200 + Math.random() * 300,
        startTime: now
      };
      
      setLightnings(prev => [...prev, newLightning]);
      
      // Flash effect
      setFlash(true);
      setTimeout(() => setFlash(false), 150);
      
      // Remove lightning after duration
      setTimeout(() => {
        setLightnings(prev => prev.filter(l => l.id !== newLightning.id));
      }, newLightning.duration);
    };

    const drawLightning = (lightning: Lightning) => {
      const now = Date.now();
      const elapsed = now - lightning.startTime;
      const progress = elapsed / lightning.duration;
      
      if (progress >= 1) return;
      
      const opacity = Math.max(0, 1 - progress * 2);
      
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 2 + Math.random() * 3;
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      lightning.branches.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
      
      // Add glow effect
      ctx.globalAlpha = opacity * 0.3;
      ctx.lineWidth = 8;
      ctx.shadowBlur = 20;
      ctx.stroke();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw all active lightnings
      lightnings.forEach(drawLightning);
      
      // Randomly create new lightning
      if (Math.random() < 0.001) {
        createLightning();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [lightnings]);

  return (
    <>
      {/* Storm clouds */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-transparent to-transparent"></div>
        
        {/* Animated clouds */}
        <div className="absolute top-0 left-0 w-full h-1/3">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
        </div>
        
        {/* Rain effect */}
        <div className="rain-container">
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
        
        {/* Lightning canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />
        
        {/* Flash effect */}
        {flash && (
          <div className="absolute inset-0 bg-white/10 animate-pulse" style={{ zIndex: 2 }} />
        )}
      </div>
    </>
  );
};