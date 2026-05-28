"use client";

// ScrollIntoCard — Zentry "clip-path card" effect
// BG_VARIANT: 1 = Aurora blobs | 2 = Star field | 5 = Topographic lines
const BG_VARIANT: 1 | 2 | 5 = 1;

import { useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

// ── Background variants ────────────────────────────────────────────────────────

function BgAurora() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #06000f 0%, #0d0025 50%, #04000e 100%)" }} />
      {/* Blob 1 — violet, large, center-top */}
      <div className="absolute pointer-events-none" style={{
        width: "65vw", height: "65vw", maxWidth: 700, maxHeight: 700,
        top: "-15%", left: "20%",
        background: "radial-gradient(circle at 40% 40%, rgba(168,85,247,0.45) 0%, rgba(139,60,220,0.25) 35%, transparent 70%)",
        filter: "blur(60px)",
        animation: "blob-morph 9s ease-in-out infinite",
        borderRadius: "50%",
      }} />
      {/* Blob 2 — indigo, medium, bottom-left */}
      <div className="absolute pointer-events-none" style={{
        width: "45vw", height: "45vw", maxWidth: 500, maxHeight: 500,
        bottom: "0%", left: "-10%",
        background: "radial-gradient(circle at 60% 50%, rgba(99,60,220,0.35) 0%, rgba(80,30,180,0.18) 45%, transparent 70%)",
        filter: "blur(50px)",
        animation: "blob-morph 12s ease-in-out infinite reverse",
        borderRadius: "50%",
      }} />
      {/* Blob 3 — purple-pink, small, right */}
      <div className="absolute pointer-events-none" style={{
        width: "30vw", height: "30vw", maxWidth: 350, maxHeight: 350,
        top: "30%", right: "-5%",
        background: "radial-gradient(circle at 50% 50%, rgba(192,100,255,0.3) 0%, rgba(168,85,247,0.12) 50%, transparent 70%)",
        filter: "blur(40px)",
        animation: "blob-morph 7s ease-in-out infinite",
        animationDelay: "2s",
        borderRadius: "50%",
      }} />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(4,0,14,0.7) 100%)",
      }} />
    </>
  );
}

function BgStarField() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    x: ((i * 137.508) % 100),
    y: ((i * 97.31 + 13) % 100),
    r: i % 5 === 0 ? 1.5 : i % 3 === 0 ? 1.2 : 0.8,
    delay: `${(i * 0.17) % 4}s`,
    dur: `${2.5 + (i % 5) * 0.6}s`,
  }));
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #03000d 0%, #06001a 60%, #02000b 100%)" }} />
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 45% at 50% 30%, rgba(168,85,247,0.12) 0%, transparent 70%)",
      }} />
      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.85 }}>
        {stars.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white">
            <animate attributeName="opacity" values="0.15;0.9;0.15" dur={s.dur} begin={s.delay} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
      {/* Subtle horizontal glow bands */}
      <div className="absolute pointer-events-none" style={{
        top: "25%", left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.15) 50%, transparent)",
      }} />
      <div className="absolute pointer-events-none" style={{
        top: "60%", left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.1) 50%, transparent)",
      }} />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(3,0,13,0.8) 100%)",
      }} />
    </>
  );
}

function BgTopographic() {
  // Contour lines — SVG paths at different y offsets, staggered
  const lines = [
    "M-100,180 C100,120 200,240 400,180 C600,120 700,200 900,160 C1100,120 1300,200 1500,160 L1500,600 L-100,600 Z",
    "M-100,240 C80,180 220,300 420,240 C620,180 720,260 920,220 C1120,180 1320,250 1500,210 L1500,600 L-100,600 Z",
    "M-100,300 C120,240 200,340 450,290 C650,240 750,310 950,270 C1150,230 1350,290 1500,260 L1500,600 L-100,600 Z",
    "M-100,360 C100,300 250,390 480,345 C680,300 780,370 980,330 C1180,290 1380,345 1500,310 L1500,600 L-100,600 Z",
    "M-100,420 C130,370 270,440 500,400 C700,360 800,420 1000,385 C1200,350 1380,400 1500,370 L1500,600 L-100,600 Z",
    "M-100,480 C150,440 280,490 520,455 C720,420 820,470 1020,440 C1220,410 1400,455 1500,430 L1500,600 L-100,600 Z",
  ];
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #04000e 0%, #080018 55%, #030009 100%)" }} />
      {/* Topo lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1400 600" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.7 }}>
        {lines.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(168,85,247,1)"
            strokeWidth="0.7"
            style={{
              opacity: 0.12 + i * 0.04,
              animation: `topo-drift ${6 + i * 0.8}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        {/* Filled areas with very low opacity */}
        {lines.slice(0, 3).map((d, i) => (
          <path
            key={`fill-${i}`}
            d={d}
            fill={`rgba(168,85,247,${0.015 + i * 0.008})`}
            stroke="none"
          />
        ))}
      </svg>
      {/* Ambient top glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(168,85,247,0.1) 0%, transparent 70%)",
      }} />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(4,0,14,0.75) 100%)",
      }} />
    </>
  );
}

export default function ScrollIntoCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(0);

  // ── Progress + visibilidade do panel ─────────────────────────────────
  // Aparece 1vh ANTES da seção (card pequeno, estado inicial) — igual Zentry.
  // Opacity controlada via DOM direto para evitar conflito com Framer Motion.
  useEffect(() => {
    const onScroll = () => {
      const s = sectionRef.current;
      const panel = panelRef.current;
      if (!s || !panel) return;

      const sTop = s.offsetTop;
      const range = s.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      const scrolled = window.scrollY - sTop;

      // Começa a aparecer apenas 25% do viewport antes da seção
      const preRange = window.innerHeight * 0.25;

      // Sai apenas quando a próxima seção (z-20) já cobriu o panel
      const exitRange = range + window.innerHeight * 0.85;

      if (scrolled < -preRange || scrolled > exitRange) {
        panel.style.display = "none";
        return;
      }

      panel.style.display = "flex";

      // Fade-in suave na aproximação pré-seção
      if (scrolled < 0) {
        panel.style.opacity = String((scrolled + preRange) / preRange);
      } else {
        panel.style.opacity = "1";
      }

      const raw = Math.max(0, Math.min(1, scrolled / range));
      progress.set(raw);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [progress]);

  // ── clip-path: inset(8% 24% round 2.5rem) → inset(0% 0% round 0rem) ────
  const insetTB = useTransform(progress, [0, 1], [8, 0]);
  const insetLR = useTransform(progress, [0, 1], [24, 0]);
  const radius  = useTransform(progress, [0, 1], [2.5, 0]);
  const clipPath = useMotionTemplate`inset(${insetTB}% ${insetLR}% round ${radius}rem)`;

  // ── 3D tilt → flat ───────────────────────────────────────────────────
  const rotateX = useTransform(progress, [0, 0.65, 1], [-8, -1, 0]);
  const rotateY = useTransform(progress, [0, 0.65, 1], [6, 1, 0]);

  // ── Título: sobe e some enquanto card expande ────────────────────────
  const titleY  = useTransform(progress, [0, 0.30], [0, -80]);
  const titleOp = useTransform(progress, [0, 0.24], [1, 0]);

  // ── Conteúdo do card ─────────────────────────────────────────────────
  const orbScale = useTransform(progress, [0, 0.5, 1], [0.75, 1.08, 1.25]);
  const orbOp    = useTransform(progress, [0, 0.15, 1], [0.5, 1, 1]);
  const handY    = useTransform(progress, [0, 1], ["65%", "-28%"]);

  return (
    <section
      ref={sectionRef}
      id="approach"
      aria-label="Abordagem"
      className="relative h-[300vh]"
    >
      {/* ── FIXED PANEL — substitui sticky, 100% Lenis-compatível ──── */}
      <motion.div
        ref={panelRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          marginLeft: "var(--sidebar-w, 0px)",
          pointerEvents: "none",
          zIndex: 10,
          background: "#e4e4f0",
          overflow: "hidden",
        }}
      >
        {/* Título sobre o fundo claro — sobe e some */}
        <motion.div
          style={
            reduceMotion
              ? undefined
              : { y: titleY, opacity: titleOp }
          }
          className="absolute inset-x-0 top-[6%] sm:top-[8%] md:top-[9%] z-20 px-4 sm:px-6 md:px-12 text-center"
        >
          <p className="mb-2 sm:mb-3 font-mono text-[8px] sm:text-[9px] tracking-[0.24em] uppercase text-white/50">
            WELCOME TO MY WORLD
          </p>
          <h2
            className="font-display font-black uppercase text-white"
            style={{
              fontSize: "clamp(1.5rem, 6.5vw, 6rem)",
              letterSpacing: "-0.045em",
              lineHeight: 0.9,
              textShadow: "0 2px 32px rgba(0,0,0,0.18)",
            }}
          >
            Código que as<br />pessoas sentem.
          </h2>
          <p className="mx-auto mt-3 sm:mt-5 max-w-md text-xs sm:text-sm leading-6 sm:leading-7 text-white/55">
            Suporte técnico, customer success e front-end — cada parte reforça a outra.
          </p>
        </motion.div>

        {/* ── O CARD dark que expande via clip-path ─────────────────── */}
        <div
          className="absolute inset-0"
          style={{ perspective: "1100px" }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={
              reduceMotion
                ? { clipPath: "inset(0% 0% round 0rem)" }
                : { clipPath, rotateX, rotateY }
            }
          >
            {/* Background variant — trocar BG_VARIANT no topo do arquivo */}
            {BG_VARIANT === 1 && <BgAurora />}
            {BG_VARIANT === 2 && <BgStarField />}
            {BG_VARIANT === 5 && <BgTopographic />}

            {/* ORB violeta — temporariamente oculto para comparar fundos */}
            {/* <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={
                reduceMotion
                  ? { top: "10%" }
                  : { top: "10%", scale: orbScale, opacity: orbOp }
              }
            >
              <div
                style={{
                  width: "clamp(200px, 30vw, 400px)",
                  height: "clamp(200px, 30vw, 400px)",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 50% 42%, rgba(230,170,255,0.95) 0%, rgba(168,85,247,0.72) 34%, rgba(8,0,28,0.68) 68%, rgba(8,0,28,0) 70%)",
                  filter: "blur(14px)",
                  boxShadow: "0 0 140px rgba(168,85,247,0.32)",
                }}
              />
            </motion.div> */}

            {/* Strata atmospheric lines */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "-10%", right: "-6%", top: "56%", height: "9%",
                borderRadius: "9999px", rotate: "7deg",
                background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.18), rgba(192,132,252,0.22), transparent)",
                filter: "blur(10px)", opacity: 0.45,
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "-6%", right: "-10%", top: "71%", height: "7%",
                borderRadius: "9999px", rotate: "-8deg",
                background: "linear-gradient(90deg, transparent, rgba(110,40,190,0.16), rgba(168,85,247,0.2), transparent)",
                filter: "blur(10px)", opacity: 0.38,
              }}
            />

            {/* ── TERMINAL — emerge de baixo ───────────────────────── */}
            <motion.div
              className="absolute inset-x-0 bottom-0 flex justify-center"
              style={
                reduceMotion
                  ? { paddingBottom: "0", paddingInline: "clamp(1.5rem,8vw,6rem)" }
                  : { paddingBottom: "0", paddingInline: "clamp(1.5rem,8vw,6rem)", y: handY }
              }
            >
              <div
                style={{
                  width: "min(100%, 520px)",
                  borderRadius: "1rem 1rem 0 0",
                  background: "linear-gradient(180deg, rgba(22,8,50,0.97), rgba(6,0,18,0.99))",
                  border: "1px solid rgba(168,85,247,0.18)",
                  borderBottom: "none",
                  boxShadow: "0 -12px 60px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
                  overflow: "hidden",
                }}
              >
                {/* Barra de título */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.55rem 0.9rem",
                    borderBottom: "1px solid rgba(168,85,247,0.1)",
                    background: "rgba(168,85,247,0.04)",
                  }}
                >
                  {["rgba(255,95,86,0.7)", "rgba(255,190,46,0.7)", "rgba(40,200,64,0.7)"].map((c, i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: c, display: "block" }} />
                  ))}
                  <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(168,85,247,0.45)", letterSpacing: "0.1em" }}>
                    portfolio.tsx
                  </span>
                </div>

                {/* Linhas de código */}
                <div style={{ padding: "0.9rem 1.1rem 1.2rem", fontFamily: "monospace", fontSize: "clamp(0.6rem,1.2vw,0.72rem)", lineHeight: 1.85 }}>
                  {[
                    { c: "rgba(168,85,247,0.5)",  t: "export default function " },
                    { c: "rgba(230,180,255,0.85)", t: "Felipe", bold: true },
                    { c: "rgba(168,85,247,0.5)",  t: "() {" },
                    { c: "rgba(130,100,180,0.4)",  t: "  // support · success · frontend" },
                    { c: "rgba(168,85,247,0.5)",  t: "  const role = [" },
                    { c: "rgba(200,230,255,0.7)",  t: '    "Suporte Técnico",' },
                    { c: "rgba(200,230,255,0.7)",  t: '    "Customer Success",' },
                    { c: "rgba(200,230,255,0.7)",  t: '    "Front-end Dev",' },
                    { c: "rgba(168,85,247,0.5)",  t: "  ];" },
                    { c: "rgba(168,85,247,0.5)",  t: "  return <Experience data={role} />;" },
                    { c: "rgba(168,85,247,0.5)",  t: "}" },
                  ].map((line, i) => (
                    <div key={i} style={{ color: line.c, fontWeight: line.bold ? 700 : 400, display: "inline-block", width: "100%" }}>
                      {line.t}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 110%, rgba(168,85,247,0.08), transparent 26%)," +
                  "linear-gradient(180deg, rgba(255,255,255,0.012), transparent 16%)",
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
