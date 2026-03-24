"use client";

// ScrollIntoCard — Zentry "clip-path card" effect
// • Fundo claro (lavanda) + card dark que expande de inset(8% 24%) → inset(0%)
// • Card tem tilt 3D que se retifica conforme expande
// • Dentro do card: orb violeta + mão CSS emergindo de baixo
// • Título no fundo claro que sobe e some enquanto o card expande
// • position:fixed (não sticky) → 100% compatível com Lenis v1

import { useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

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
            {/* Fundo escuro do card */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 52% 12%, rgba(255,255,255,0.04), transparent 22%)," +
                  "linear-gradient(180deg, #03000d 0%, #07001c 100%)",
              }}
            />

            {/* Grid mesh */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px)",
                backgroundSize: "2rem 2rem",
                opacity: 0.25,
                mixBlendMode: "screen",
              }}
            />

            {/* Linha horizontal sutil */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "2.5rem",
                left: "6%",
                right: "6%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(168,85,247,0.28), transparent)",
              }}
            />

            {/* ORB violeta — cresce conforme o scroll */}
            <motion.div
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
            </motion.div>

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
