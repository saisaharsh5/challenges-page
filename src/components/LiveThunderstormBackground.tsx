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

export const LiveThunderstormBackground: React.FC = () => {
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
      
      const segments = 15 + Math.random() * 25;
      
      for (let i = 0; i < segments; i++) {
        const angle = (Math.random() - 0.5) * 0.6;
        const length = 25 + Math.random() * 50;
        
        currentX += Math.sin(angle) * length;
        currentY += Math.cos(angle) * length;
        
        branches.push({ x: currentX, y: currentY });
        
        // Add random side branches
        if (Math.random() < 0.4 && i > 5) {
          const branchX = currentX;
          const branchY = currentY;
          const branchAngle = angle + (Math.random() - 0.5) * 2;
          const branchLength = 15 + Math.random() * 40;
          
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
      if (now - lastLightningRef.current < 3000) return;
      
      lastLightningRef.current = now;
      
      const x = Math.random() * canvas.width;
      const y = 0;
      
      const newLightning: Lightning = {
        id: Date.now(),
        x,
        y,
        branches: generateLightning(x, y),
        opacity: 1,
        duration: 300 + Math.random() * 400,
        startTime: now
      };
      
      setLightnings(prev => [...prev, newLightning]);
      
      // Flash effect
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
      
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
      
      const opacity = Math.max(0, 1 - progress * 1.5);
      
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3 + Math.random() * 4;
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      lightning.branches.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
      
      // Add inner glow
      ctx.globalAlpha = opacity * 0.8;
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 8;
      ctx.stroke();
      
      // Add outer glow
      ctx.globalAlpha = opacity * 0.2;
      ctx.lineWidth = 12;
      ctx.shadowBlur = 25;
      ctx.stroke();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw all active lightnings
      lightnings.forEach(drawLightning);
      
      // Randomly create new lightning
      if (Math.random() < 0.0008) {
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
    <div className="live-thunderstorm-background">
      {/* Storm clouds */}
      <div className="storm-clouds">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
        <div className="cloud cloud-5"></div>
      </div>
      
      {/* Rain effect */}
      <div className="rain-container">
        {Array.from({ length: 120 }, (_, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${0.4 + Math.random() * 0.6}s`
            }}
          />
        ))}
      </div>
      
      {/* Lightning canvas */}
      <canvas
        ref={canvasRef}
        className="lightning-canvas"
      />
      
      {/* Flash effect */}
      {flash && (
        <div className="lightning-flash" />
      )}
      
      {/* Atmospheric overlay */}
      <div className="storm-atmosphere" />
    </div>
  );
};