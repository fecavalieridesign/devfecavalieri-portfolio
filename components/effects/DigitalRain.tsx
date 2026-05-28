"use client";

import { useEffect, useRef } from "react";

export function DigitalRain({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width: number, height: number, dpr: number;
    let animId: number;

    const FALL_SPEED = 1.0;
    const COLUMN_DENSITY = 0.7;

    const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const numbers = "0123456789";
    const mathSymbols = "×÷∆ΣΠ√∞≈≠≤≥∫∂αβγθφψω";
    const allChars = katakana + numbers + mathSymbols;

    const FONT_SIZE = 15;

    interface WavePoint { y: number; vy: number; }
    interface Ripple { x: number; y: number; radius: number; maxRadius: number; speed: number; life: number; decay: number; }
    interface CharCell { char: string; cycleTimer: number; cycleRate: number; }
    interface Column { x: number; y: number; speed: number; length: number; chars: CharCell[]; active: boolean; restartDelay: number; opacity: number; hitWater: boolean; }

    let columns: Column[] = [];
    let waterSurface = 0;
    let ripples: Ripple[] = [];
    const MAX_RIPPLES = 40;
    let wavePoints: WavePoint[] = [];
    let waveCount = 0;
    const WAVE_RESOLUTION = 4;

    function randomChar() { return allChars[Math.floor(Math.random() * allChars.length)]; }

    function initColumns() {
      waterSurface = height * 0.78;
      const colCount = Math.floor(width / FONT_SIZE);
      const newColumns: Column[] = [];
      for (let i = 0; i < colCount; i++) {
        const existing = columns[i];
        if (existing) { existing.x = i * FONT_SIZE; newColumns.push(existing); }
        else newColumns.push(createColumn(i, true));
      }
      columns = newColumns;
      waveCount = Math.ceil(width / WAVE_RESOLUTION) + 1;
      wavePoints = Array.from({ length: waveCount }, () => ({ y: 0, vy: 0 }));
    }

    function createColumn(index: number, scatter: boolean): Column {
      const trailLen = 12 + Math.floor(Math.random() * 20);
      const maxChars = trailLen + 5;
      const chars: CharCell[] = Array.from({ length: maxChars }, () => ({
        char: randomChar(), cycleTimer: Math.random() * 3, cycleRate: 0.5 + Math.random() * 2,
      }));
      const startY = scatter
        ? Math.random() < COLUMN_DENSITY
          ? Math.random() * (waterSurface + trailLen * FONT_SIZE) - trailLen * FONT_SIZE * 0.3
          : -trailLen * FONT_SIZE - Math.random() * height * 0.5
        : -trailLen * FONT_SIZE * Math.random() * 0.3;
      return {
        x: index * FONT_SIZE, y: startY,
        speed: 1.2 + Math.random() * 2.5, length: trailLen, chars,
        active: scatter ? Math.random() < COLUMN_DENSITY + 0.2 : Math.random() < COLUMN_DENSITY,
        restartDelay: 0, opacity: 0.6 + Math.random() * 0.4, hitWater: false,
      };
    }

    function updateColumns(dt: number) {
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (!col.active) {
          col.restartDelay -= dt;
          if (col.restartDelay <= 0) {
            if (Math.random() < COLUMN_DENSITY) {
              col.active = true; col.y = -col.length * FONT_SIZE * Math.random() * 0.3;
              col.speed = 1.2 + Math.random() * 2.5; col.length = 12 + Math.floor(Math.random() * 20);
              col.opacity = 0.6 + Math.random() * 0.4; col.hitWater = false;
              col.chars.forEach(c => { c.char = randomChar(); });
            } else { col.restartDelay = 0.3 + Math.random() * 1.5; }
          }
          continue;
        }
        const prevY = col.y;
        col.y += col.speed * FALL_SPEED * dt * 60;
        col.chars.forEach(c => { c.cycleTimer -= dt; if (c.cycleTimer <= 0) { c.char = randomChar(); c.cycleTimer = c.cycleRate; } });
        if (!col.hitWater && col.y >= waterSurface && prevY < waterSurface) {
          col.hitWater = true;
          spawnRipple(col.x + FONT_SIZE * 0.5, waterSurface);
          disturbWave(col.x + FONT_SIZE * 0.5, -2 - Math.random() * 3);
        }
        if (col.y - col.length * FONT_SIZE > waterSurface + 30) {
          col.active = false; col.restartDelay = 0.2 + Math.random() * 2;
        }
      }
    }

    function drawColumns() {
      ctx.font = `${FONT_SIZE}px "SF Mono", "Fira Code", monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (!col.active) continue;
        for (let j = 0; j < col.length; j++) {
          const charY = col.y - j * FONT_SIZE;
          if (charY > waterSurface || charY < -FONT_SIZE) continue;
          const charIndex = j % col.chars.length;
          let brightness = j === 0 ? 1.0 : j === 1 ? 0.9 : j < 4 ? 0.75 - (j - 2) * 0.08 : Math.max(0, 0.6 * (1 - j / col.length));
          const distToWater = waterSurface - charY;
          if (distToWater < FONT_SIZE * 3) brightness *= Math.max(0, distToWater / (FONT_SIZE * 3));
          brightness *= col.opacity;
          if (brightness < 0.02) continue;
          const [r, g, b] = j === 0 ? [255, 245, 220] : j < 3 ? [240, 200, 140] : [200, 149, 108];
          ctx.fillStyle = `rgba(${r},${g},${b},${brightness})`;
          if (j === 0) { ctx.shadowColor = "rgba(255,220,160,0.6)"; ctx.shadowBlur = 8; }
          ctx.fillText(col.chars[charIndex].char, col.x + FONT_SIZE * 0.5, charY);
          if (j === 0) { ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; }
        }
      }
    }

    function drawReflections() {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, waterSurface, width, height - waterSurface); ctx.clip();
      ctx.font = `${FONT_SIZE}px "SF Mono", "Fira Code", monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (!col.active) continue;
        for (let j = 0; j < Math.min(col.length, 8); j++) {
          const charY = col.y - j * FONT_SIZE;
          if (charY > waterSurface || charY < waterSurface - FONT_SIZE * 8) continue;
          const reflectY = waterSurface + (waterSurface - charY);
          const depthBelow = reflectY - waterSurface;
          const reflectAlpha = Math.max(0, 0.12 * (1 - depthBelow / (height * 0.2)));
          if (reflectAlpha < 0.01) continue;
          const waveIdx = Math.floor(col.x / WAVE_RESOLUTION);
          const waveOffset = waveIdx >= 0 && waveIdx < wavePoints.length ? wavePoints[waveIdx].y * 2 : 0;
          ctx.fillStyle = `rgba(200,149,108,${reflectAlpha})`;
          ctx.fillText(col.chars[j % col.chars.length].char, col.x + FONT_SIZE * 0.5 + Math.sin(depthBelow * 0.05) * 3, reflectY + waveOffset);
        }
      }
      ctx.restore();
    }

    function spawnRipple(x: number, y: number) {
      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({ x, y, radius: 0, maxRadius: 30 + Math.random() * 50, speed: 20 + Math.random() * 30, life: 1.0, decay: 0.3 + Math.random() * 0.2 });
    }

    function updateRipples(dt: number) {
      let i = ripples.length;
      while (i--) {
        const r = ripples[i]; r.radius += r.speed * dt; r.life -= r.decay * dt;
        if (r.life <= 0 || r.radius > r.maxRadius) ripples.splice(i, 1);
      }
    }

    function drawRipples() {
      for (const r of ripples) {
        for (let ring = 0; ring < 3; ring++) {
          const ringRadius = r.radius - ring * 8;
          if (ringRadius <= 0) continue;
          ctx.beginPath();
          ctx.ellipse(r.x, r.y + ring * 2, ringRadius, ringRadius * 0.3, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200,170,130,${r.life * 0.3 * (1 - ring * 0.3)})`;
          ctx.lineWidth = 1 - ring * 0.2; ctx.stroke();
        }
      }
    }

    function disturbWave(x: number, force: number) {
      const idx = Math.floor(x / WAVE_RESOLUTION);
      for (let i = -3; i <= 3; i++) {
        const wi = idx + i;
        if (wi >= 0 && wi < wavePoints.length) wavePoints[wi].vy += force * (1 - Math.abs(i) / 4);
      }
    }

    function updateWaves(dt: number) {
      for (const p of wavePoints) { p.vy += -0.03 * p.y; p.vy *= 0.97; p.y += p.vy; }
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < wavePoints.length; i++) {
          if (i > 0) wavePoints[i].vy += 0.25 * (wavePoints[i - 1].y - wavePoints[i].y);
          if (i < wavePoints.length - 1) wavePoints[i].vy += 0.25 * (wavePoints[i + 1].y - wavePoints[i].y);
        }
      }
    }

    function drawWaterSurface(time: number) {
      const waterGrad = ctx.createLinearGradient(0, waterSurface, 0, height);
      waterGrad.addColorStop(0, "rgba(15,13,11,0.6)"); waterGrad.addColorStop(0.3, "rgba(12,11,10,0.85)"); waterGrad.addColorStop(1, "rgba(10,10,10,0.95)");
      ctx.fillStyle = waterGrad; ctx.fillRect(0, waterSurface - 2, width, height - waterSurface + 2);
      ctx.beginPath();
      for (let x = 0; x <= width; x += WAVE_RESOLUTION) {
        const idx = Math.floor(x / WAVE_RESOLUTION);
        const waveY = idx < wavePoints.length ? wavePoints[idx].y : 0;
        const ambient = Math.sin(x * 0.01 + time * 0.8) * 1.5 + Math.sin(x * 0.023 + time * 0.5) * 1.0 + Math.sin(x * 0.007 + time * 0.3) * 2.0;
        const py = waterSurface + waveY + ambient;
        x === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
      }
      ctx.strokeStyle = "rgba(200,170,130,0.25)"; ctx.lineWidth = 1.5; ctx.stroke();
      const surfGlow = ctx.createLinearGradient(0, waterSurface - 10, 0, waterSurface + 20);
      surfGlow.addColorStop(0, "rgba(200,149,108,0)"); surfGlow.addColorStop(0.4, "rgba(200,149,108,0.06)"); surfGlow.addColorStop(1, "rgba(200,149,108,0)");
      ctx.fillStyle = surfGlow; ctx.fillRect(0, waterSurface - 10, width, 30);
      // Zen ripples
      const zenPoints = [{ x: width * 0.3, y: waterSurface + (height - waterSurface) * 0.4 }, { x: width * 0.7, y: waterSurface + (height - waterSurface) * 0.5 }, { x: width * 0.5, y: waterSurface + (height - waterSurface) * 0.7 }];
      for (let z = 0; z < zenPoints.length; z++) {
        const zp = zenPoints[z];
        for (let ring = 0; ring < 4; ring++) {
          const phase = time * 0.4 + ring * 1.5 + z * 2.0;
          const radius = 20 + (phase % 6) * 15;
          const alpha = 0.06 * Math.max(0, 1 - (phase % 6) / 6);
          if (alpha < 0.005) continue;
          ctx.beginPath(); ctx.ellipse(zp.x, zp.y, radius, radius * 0.3, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200,170,130,${alpha})`; ctx.lineWidth = 0.8; ctx.stroke();
        }
      }
    }

    function drawWaterParticles(time: number) {
      ctx.save(); ctx.beginPath(); ctx.rect(0, waterSurface, width, height - waterSurface); ctx.clip();
      for (let i = 0; i < 30; i++) {
        const px = (Math.sin(i * 73.1 + time * 0.07) * 0.5 + 0.5) * width;
        const py = waterSurface + (Math.cos(i * 127.3 + time * 0.05) * 0.5 + 0.5) * (height - waterSurface);
        ctx.fillStyle = `rgba(200,149,108,${0.04 + 0.03 * Math.sin(time * 0.5 + i * 1.7)})`;
        ctx.beginPath(); ctx.arc(px, py, 1, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function drawVignette() {
      const cx = width / 2, cy = height / 2, maxDim = Math.max(width, height);
      const vignette = ctx.createRadialGradient(cx, cy, maxDim * 0.25, cx, cy, maxDim * 0.8);
      vignette.addColorStop(0, "rgba(10,10,10,0)"); vignette.addColorStop(1, "rgba(10,10,10,0.45)");
      ctx.fillStyle = vignette; ctx.fillRect(0, 0, width, height);
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initColumns();
    }

    const handleClick = (e: MouseEvent) => {
      disturbWave(e.clientX, -4 - Math.random() * 3);
      spawnRipple(e.clientX, waterSurface);
      const colIdx = Math.floor(e.clientX / FONT_SIZE);
      for (let di = -1; di <= 1; di++) {
        const ci = colIdx + di;
        if (ci >= 0 && ci < columns.length) {
          columns[ci].active = true; columns[ci].y = e.clientY;
          columns[ci].speed = 2.5 + Math.random() * 2; columns[ci].opacity = 0.8 + Math.random() * 0.2; columns[ci].hitWater = false;
        }
      }
    };

    let lastTime = 0;
    function render(timestamp: number) {
      if (!lastTime) lastTime = timestamp;
      let dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      if (prefersReduced) dt = 0;
      const time = timestamp / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0, 0, width, height);
      updateColumns(dt); updateRipples(dt); updateWaves(dt);
      drawColumns(); drawWaterSurface(time); drawReflections(); drawRipples(); drawWaterParticles(time); drawVignette();
      animId = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("click", handleClick);
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={style} />;
}
