"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number | undefined>(undefined);

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(30, Math.floor((width * height) / 50000));
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initParticles(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // Render a cada 2 frames para performance (30fps)
      if (frameCount % 2 === 0) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        ctx.clearRect(0, 0, width, height);
        
        const particles = particlesRef.current;
        const mouse = mouseRef.current;

        // Atualizar e desenhar partículas
        particles.forEach((p, i) => {
          // Movimento base
          p.x += p.vx;
          p.y += p.vy;

          // Interação com mouse (repulsão suave)
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150 * 0.02;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }

          // Limitar velocidade
          p.vx = Math.max(-1, Math.min(1, p.vx * 0.99));
          p.vy = Math.max(-1, Math.min(1, p.vy * 0.99));

          // Wrap around
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Desenhar partícula
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
          ctx.fill();

          // Conexões (apenas para partículas próximas, limitado)
          if (i % 3 === 0) { // Só verificar conexões para 1/3 das partículas
            for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
              const p2 = particles[j];
              const dx2 = p.x - p2.x;
              const dy2 = p.y - p2.y;
              const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

              if (dist2 < 100) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - dist2 / 100)})`;
                ctx.stroke();
              }
            }
          }
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ opacity: 0.6 }}
    />
  );
}
