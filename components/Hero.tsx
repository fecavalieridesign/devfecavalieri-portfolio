"use client";

// Hero — Zentry × KPRverse fusion
// 1. Polygon clip-path expand (Zentry iconic entry)
// 2. Mouse-tracking lime blob/orb
// 3. Zentry animated-word 3D flip on title
// 4. Lusion 3D pull-back on scroll

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { E } from "@/lib/easing";

const CONSOLE_LINES = [
  "FUNÇÃO.........DESENVOLVEDOR WEB",
  "ESPECIALIDADE..SUPORTE TÉCNICO",
  "TECNOLOGIA.....REACT / NEXT.JS",
  "EXPERIÊNCIA....4+ ANOS",
  "CLIENTES.......98% SATISFEITOS",
  "STATUS.........DISPONÍVEL",
];

// Zentry pattern #22 — 3D word flip
function AnimatedWord({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, rotateY: 60, rotateX: -40, y: 51, z: -60 }}
      animate={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0, z: 0 }}
      transition={{ duration: 1, ease: E, delay }}
      style={{
        transformOrigin: "50% 50% -150px",
        willChange: "opacity, transform",
        display: "inline-block",
      }}
    >
      {children}
    </motion.span>
  );
}

function ConsoleWindow() {
  const [shown, setShown] = useState<string[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (lineIdx >= CONSOLE_LINES.length) { setFinished(true); return; }
    const line = CONSOLE_LINES[lineIdx];
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setShown((p) => [...p, line]);
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }, 160);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx]);

  const current = lineIdx < CONSOLE_LINES.length ? CONSOLE_LINES[lineIdx].slice(0, charIdx) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: E, delay: 3.9 }}
      className="border border-white/[0.1] bg-black relative overflow-hidden"
      style={{ width: "min(320px, 90vw)" }}
    >
      {/* CRT scan line */}
      <div
        aria-hidden
        className="absolute left-0 right-0 h-px pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.08), transparent)",
          animation: "scan-h 4s linear infinite",
        }}
      />

      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <span className="font-mono text-[8px] text-white/45 tracking-[0.2em] uppercase">TERMINAL_v1.0</span>
        <div className="flex gap-1.5">
          {[1,2,3].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          ))}
        </div>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono min-h-[140px] sm:min-h-[200px]" role="log" aria-live="polite" aria-atomic="false" aria-label="Terminal de apresentação">
        {shown.map((line, i) => (
          <div key={i} className="flex gap-3 mb-1.5">
            <span className="text-violet/70 shrink-0">›</span>
            <span className="text-[10px] text-white/75 tracking-wider">{line}</span>
          </div>
        ))}
        {lineIdx < CONSOLE_LINES.length && (
          <div className="flex gap-3 mb-1.5">
            <span className="text-violet/80 shrink-0 text-[10px]">›</span>
            <span className="text-[10px] text-violet/90 tracking-wider">
              {current}
              <span className="inline-block w-[7px] h-[12px] bg-violet/70 ml-0.5 -mb-0.5 cursor-blink" />
            </span>
          </div>
        )}
        {finished && (
          <div className="flex gap-3 mt-1">
            <span className="text-violet/80 text-[10px]">›</span>
            <span className="inline-block w-[7px] h-[12px] bg-violet/70 -mb-0.5 cursor-blink" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Orbital Rings — CSS-only, zero bugs, premium violet ───────────────────
function HeroGem({ prog }: { prog: MotionValue<number> }) {
  const y = useTransform(prog, [0, 0.8], ["0%", "-30%"]);
  const opacity = useTransform(prog, [0, 0.55], [1, 0]);

  const ring = (tilt: number, speed: string, dir: "spin-clockwise" | "spin-ccw", dotSize: number, alpha: number) => (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ width: "100%", height: "100%", transform: `rotateX(72deg) rotateZ(${tilt}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{
          width: "100%", height: "100%", borderRadius: "50%",
          border: `1.5px solid rgba(168,85,247,${alpha})`,
          animation: `${dir} ${speed} linear infinite`,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: -dotSize / 2, left: "50%", transform: "translateX(-50%)",
            width: dotSize, height: dotSize, borderRadius: "50%",
            background: "rgba(220,160,255,0.95)",
            boxShadow: "0 0 8px rgba(168,85,247,0.9)",
          }} />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="absolute top-[10%] right-[3%] hidden md:block pointer-events-none select-none"
      style={{ zIndex: 1, y, opacity }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.9, duration: 2 }}
      >
        <div style={{ width: 180, height: 180, position: "relative", perspective: "500px" }}>
          {ring(0,   "9s",  "spin-clockwise", 6, 0.45)}
          {ring(60,  "13s", "spin-ccw",        5, 0.28)}
          {ring(-60, "6s",  "spin-clockwise",  4, 0.20)}
          {/* Central orb */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 22, height: 22, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(240,200,255,0.95) 0%, rgba(168,85,247,0.7) 45%, transparent 70%)",
            boxShadow: "0 0 28px rgba(168,85,247,0.6)",
            filter: "blur(1.5px)",
          }} />
          {/* Ground glow */}
          <div style={{
            position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)",
            width: 60, height: 8,
            background: "radial-gradient(ellipse at center, rgba(168,85,247,0.3) 0%, transparent 70%)",
            filter: "blur(6px)",
          }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Lusion 3D pull-back on scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.6], [0, -5]);
  const scale   = useTransform(scrollYProgress, [0, 0.6], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  // Mouse-tracking blob
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);
  const blobX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const blobY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col justify-start md:justify-end pb-12 sm:pb-16 md:pb-24 pt-20 sm:pt-24 md:pt-0 px-4 sm:px-6"
      style={{ background: "#030308" }}
    >
      {/* ── LAYER 1: Zentry polygon clip-path expand ─────────────────── */}
      <motion.div
        initial={{ clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)" }}
        animate={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        transition={{ duration: 1.8, ease: [0.165, 0.84, 0.44, 1], delay: 2.6 }}
        className="absolute inset-0 bg-black"
        style={{ zIndex: 0 }}
      />

      {/* ── LAYER 2: Mouse-tracking lime blob ───────────────────────── */}
      <motion.div
        style={{
          x: blobX,
          y: blobY,
          translateX: "-50%",
          translateY: "-50%",
          position: "absolute",
          left: 0,
          top: 0,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.055) 0%, rgba(168,85,247,0.018) 45%, transparent 70%)",
          mixBlendMode: "screen",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 1,
          willChange: "transform",
        }}
      />

      {/* ── LAYER 2.5: 3D wireframe gem ──────────────────────────────── */}
      <HeroGem prog={scrollYProgress} />

      {/* ── LAYER 3: Shell + Corner brackets ─────────────────────────── */}
      <div className="shell" aria-hidden style={{ zIndex: 2 }} />
      {[
        { top: "1.5rem",    left: "1.5rem",  borderTop: true,    borderLeft: true  },
        { top: "1.5rem",    right: "1.5rem", borderTop: true,    borderRight: true },
        { bottom: "1.5rem", left: "1.5rem",  borderBottom: true, borderLeft: true  },
        { bottom: "1.5rem", right: "1.5rem", borderBottom: true, borderRight: true },
      ].map((c, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            width: 14, height: 14,
            top: c.top, left: (c as { left?: string }).left,
            right: (c as { right?: string }).right, bottom: c.bottom,
            borderTop:    c.borderTop    ? "1px solid rgba(168,85,247,0.2)" : undefined,
            borderBottom: c.borderBottom ? "1px solid rgba(168,85,247,0.2)" : undefined,
            borderLeft:   c.borderLeft   ? "1px solid rgba(168,85,247,0.2)" : undefined,
            borderRight:  c.borderRight  ? "1px solid rgba(168,85,247,0.2)" : undefined,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      ))}

      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: E, delay: 3.0 }}
        className="absolute top-12 sm:top-14 md:top-8 left-4 sm:left-6 md:left-10 flex items-center gap-2.5"
        style={{ zIndex: 5 }}
      >
        <span className="blink-dot text-violet" />
        <span className="font-mono text-[9px] text-violet/50 tracking-[0.25em] uppercase">{t.hero.available}</span>
      </motion.div>

      {/* Year mark */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
        className="absolute top-12 sm:top-14 md:top-8 right-4 sm:right-6 md:right-10 font-mono text-[6px] sm:text-[7px] md:text-[8px] text-white/10 tracking-[0.3em] uppercase"
        style={{ zIndex: 3 }}
      >
        DEVFC — 2026
      </motion.span>

      {/* ── LAYER 4: Lusion 3D perspective wrapper ───────────────────── */}
      <div style={{ perspective: "1200px", perspectiveOrigin: "50% 100%", position: "relative", zIndex: 3 }}>
        <motion.div
          style={{ y: textY, rotateX, scale, opacity, transformOrigin: "50% 100%", willChange: "transform, opacity" }}
          className="relative px-0 sm:px-6 md:px-12 max-w-7xl mx-auto w-full"
        >
          {/* Giant name — Zentry animated-word 3D flip */}
          <h1
            data-testid="hero-title"
            className="mb-6 sm:mb-8 md:mb-12 font-display font-extrabold uppercase leading-[0.85]"
            style={{ perspective: "1200px", letterSpacing: "-0.04em" }}
          >
            <div className="overflow-visible">
              <span
                className="block text-white"
                style={{ fontSize: "clamp(3rem, 18vw, 18rem)" }}
              >
                <AnimatedWord delay={3.0}>{t.hero.line1}</AnimatedWord>
              </span>
            </div>

            <div className="overflow-visible">
              <span
                className="block"
                style={{
                  fontSize: "clamp(2rem, 11.5vw, 11rem)",
                  paddingLeft: "clamp(0rem, 11vw, 10.8rem)",
                  WebkitTextStroke: "1px #a855f7",
                  color: "transparent",
                }}
              >
                <AnimatedWord delay={3.2}>{t.hero.line2}</AnimatedWord>
              </span>
            </div>
          </h1>

          {/* Bottom row: role + console */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-3 sm:gap-5 lg:gap-8">
            {/* Left: role + CTA */}
            <div className="max-w-sm">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: E, delay: 3.5 }}
                className="font-mono text-[10px] text-violet/50 tracking-[0.2em] uppercase mb-2"
              >
                {t.hero.role}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: E, delay: 3.6 }}
                className="font-body text-sm text-white/60 leading-relaxed mb-4 sm:mb-8"
              >
                {t.hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: E, delay: 3.8 }}
                className="flex flex-wrap gap-3"
              >
                <a
                  href="#work"
                  className="group relative inline-flex items-center px-6 py-2.5 overflow-hidden font-mono text-[10px] tracking-[0.15em] uppercase font-bold text-black active:scale-[0.97] active:opacity-90 transition-transform duration-100"
                >
                  <div className="absolute inset-0 bg-violet group-hover:scale-x-0 transition-transform duration-400 origin-right" />
                  <div className="absolute inset-0 border border-violet group-hover:scale-x-100 scale-x-0 transition-transform duration-400 origin-left" />
                  <span className="relative group-hover:text-violet transition-colors duration-400">{t.hero.cta}</span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-2.5 font-mono text-[10px] text-white/30 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all duration-400 tracking-[0.15em] uppercase"
                >
                  {t.hero.secondary}
                  <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
                </a>
              </motion.div>
            </div>

            {/* Right: console terminal */}
            <ConsoleWindow />
          </div>
        </motion.div>
      </div>

      {/* ── Scroll hint with SVG orbit ring ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 1 }}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-10 flex items-center gap-2 sm:gap-3"
        style={{ zIndex: 3 }}
      >
        <div className="relative w-7 h-7 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="absolute inset-0"
            style={{ animation: "spin-clockwise 8s linear infinite" }}>
            <circle cx="14" cy="14" r="12" stroke="rgba(168,85,247,0.15)" strokeWidth="1" strokeDasharray="4 5" />
          </svg>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="absolute inset-0">
            <circle
              cx="14" cy="14" r="12"
              stroke="rgba(168,85,247,0.5)" strokeWidth="1"
              strokeDasharray="75.4" strokeDashoffset="75.4" strokeLinecap="round"
              style={{ animation: "draw-stroke 1.2s cubic-bezier(0.19,1,0.22,1) 4.6s forwards" }}
            />
          </svg>
          <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-3 bg-gradient-to-b from-violet/60 to-transparent" />
        </div>
        <span className="font-mono text-[7px] sm:text-[8px] text-white/40 tracking-[0.3em] uppercase hidden sm:inline">SCROLL</span>
      </motion.div>
    </section>
  );
}
