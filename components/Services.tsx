"use client";

// Services — Zentry "zDATA/zAI/zTERMINAL" bento equivalent
// 3 cards: 1 large (FRONTEND_DEV) + 2 half (SUPORTE_N2, CUSTOMER_SUCCESS)
// Each card: label + title + description + animated CSS-only visual

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTilt } from "@/hooks/useTilt";
import { E } from "@/lib/easing";
import SectionLabel from "@/components/ui/SectionLabel";

// ── Card visuals ──────────────────────────────────────────────

// Large card visual: animated isometric grid + scan + lime glow
function IsoVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* SVG isometric lattice */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.055 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="svc-iso" x="0" y="0" width="56" height="32" patternUnits="userSpaceOnUse">
            <path d="M 0 16 L 28 0 L 56 16 L 28 32 Z" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M 28 0 L 28 32" stroke="white" strokeWidth="0.3" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#svc-iso)" />
      </svg>

      {/* Ambient lime bloom */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 55% 70% at 75% 65%, rgba(168,85,247,0.09) 0%, transparent 65%)",
        }}
      />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.5) 50%, transparent 100%)",
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
      />

      {/* Floating code brackets */}
      {["</>", "{}", "=>", "()", "[ ]"].map((sym, i) => (
        <motion.span
          key={sym}
          className="absolute font-mono text-violet/20 select-none pointer-events-none"
          style={{
            fontSize: `${0.55 + i * 0.07}rem`,
            left: `${12 + i * 15}%`,
            bottom: `${10 + (i % 3) * 12}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
        >
          {sym}
        </motion.span>
      ))}
    </div>
  );
}

// Small card visual: concentric rings bg + single morphing blob
function BlobVisual({ offset = 0 }: { offset?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-end justify-center pb-6">
      {/* Concentric circles pattern — zAI style */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.05 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`rings-${offset}`}
            x="50%" y="50%"
            width="70" height="70"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(-35,-35)"
          >
            <circle cx="35" cy="35" r="30" stroke="white" strokeWidth="0.6" fill="none" />
            <circle cx="35" cy="35" r="18" stroke="white" strokeWidth="0.6" fill="none" />
            <circle cx="35" cy="35" r="8"  stroke="white" strokeWidth="0.6" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#rings-${offset})`} />
      </svg>

      {/* Lime blob */}
      <div
        style={{
          width: 140 + offset * 10,
          height: 140 + offset * 10,
          background: `radial-gradient(circle at ${38 + offset * 5}% 32%, rgba(168,85,247,0.72) 0%, rgba(168,85,247,0.35) 42%, rgba(168,85,247,0.06) 70%, transparent 100%)`,
          filter: "blur(6px)",
          animation: `blob-morph ${7 + offset * 2}s ease-in-out infinite${offset ? " reverse" : ""}`,
          borderRadius: "50%",
          flexShrink: 0,
        }}
      />
    </div>
  );
}

// Small card 2: dot grid + multi-blob cluster
function ClusterVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-end justify-center pb-4">
      {/* Dot grid */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.05 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="dots-cs" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots-cs)" />
      </svg>

      {/* Cluster of 3 blobs — like zTERMINAL */}
      <div className="relative w-[160px] h-[110px]">
        {[
          { w: 90, h: 90, left: "0%",  top: "10%", dur: 6, opacity: 0.6 },
          { w: 65, h: 65, left: "45%", top: "0%",  dur: 8, opacity: 0.45 },
          { w: 50, h: 50, left: "60%", top: "40%", dur: 5, opacity: 0.35 },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.w,
              height: b.h,
              left: b.left,
              top: b.top,
              background: `radial-gradient(circle at 38% 30%, rgba(168,85,247,${b.opacity}) 0%, rgba(168,85,247,${b.opacity * 0.4}) 50%, transparent 80%)`,
              filter: "blur(5px)",
              animation: `blob-morph ${b.dur}s ease-in-out infinite${i % 2 ? " reverse" : ""}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// CSAT visual — centered for SmallCard (Suporte Técnico)
function CSATVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-end justify-center pb-6" style={{ zIndex: 2 }}>
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Main metric card */}
        <div
          className="border border-white/[0.14] bg-black/75 p-5 w-48"
          style={{ backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[7px] text-violet/50 tracking-[0.2em] uppercase">CSAT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet/70 blink-dot" />
          </div>
          <div
            className="font-display font-extrabold text-violet leading-none mb-1"
            style={{ fontSize: "2.4rem", letterSpacing: "-0.04em" }}
          >
            98%
          </div>
          <div className="font-mono text-[7px] text-white/50 tracking-[0.12em] uppercase mb-4">
            Satisfação dos Clientes
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-0.5 h-10">
            {[55, 72, 60, 88, 65, 95, 78, 92].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-violet/20 group-hover:bg-violet/40 transition-colors duration-300"
                style={{ height: `${h}%`, transformOrigin: "bottom" }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 + 0.5, duration: 0.45, ease: E }}
              />
            ))}
          </div>
        </div>

        {/* Floating badge */}
        <motion.div
          className="mt-2 self-end mr-2 border border-white/[0.1] bg-black/60 px-3 py-2"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <span className="font-mono text-[7px] text-violet/55 tracking-[0.15em]">4+ Anos de Experiência</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Browser mockup — right side of LargeCard (Sites e Aplicações)
function BrowserMockup() {
  return (
    <motion.div
      className="absolute hidden md:flex right-8 lg:right-12 top-1/2 -translate-y-1/2 flex-col"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      style={{ zIndex: 5, width: 220 }}
    >
      <div
        className="border border-white/[0.13] overflow-hidden"
        style={{ background: "rgba(10,4,24,0.85)", backdropFilter: "blur(16px)", borderRadius: "0.6rem" }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.08]"
          style={{ background: "rgba(168,85,247,0.06)" }}
        >
          {["rgba(255,95,86,0.6)", "rgba(255,190,46,0.6)", "rgba(40,200,64,0.6)"].map((c, i) => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: c, display: "block" }} />
          ))}
          <div className="flex-1 mx-2 h-3 rounded-sm flex items-center px-1.5"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <span className="font-mono text-[6px] text-white/25 truncate">projeto.vercel.app</span>
          </div>
        </div>
        {/* Page skeleton */}
        <div className="p-3 space-y-2">
          {/* Hero bar */}
          <div className="h-16 rounded-sm" style={{ background: "rgba(168,85,247,0.12)" }}>
            <div className="p-2 space-y-1.5">
              <div className="h-1.5 w-2/3 rounded-full" style={{ background: "rgba(168,85,247,0.4)" }} />
              <div className="h-1 w-1/2 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
              <div className="flex gap-1 mt-2">
                <div className="h-3 w-10 rounded-sm" style={{ background: "rgba(168,85,247,0.5)" }} />
                <div className="h-3 w-8 rounded-sm" style={{ background: "rgba(255,255,255,0.07)" }} />
              </div>
            </div>
          </div>
          {/* Cards row */}
          <div className="grid grid-cols-3 gap-1.5">
            {[0.5, 0.35, 0.4].map((op, i) => (
              <motion.div
                key={i}
                className="h-10 rounded-sm"
                style={{ background: `rgba(168,85,247,${op * 0.18})`, border: `1px solid rgba(168,85,247,${op * 0.25})` }}
                animate={{ opacity: [op * 0.7, op, op * 0.7] }}
                transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              />
            ))}
          </div>
          {/* Content lines */}
          <div className="space-y-1 pt-1">
            {[0.7, 0.5, 0.6, 0.4].map((w, i) => (
              <div key={i} className="h-1 rounded-full" style={{ width: `${w * 100}%`, background: "rgba(255,255,255,0.08)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating performance badge */}
      <motion.div
        className="mt-2 self-end border border-white/[0.1] bg-black/60 px-3 py-1.5 flex items-center gap-2"
        style={{ backdropFilter: "blur(10px)", borderRadius: "0.35rem" }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 block" />
        <span className="font-mono text-[7px] text-white/45 tracking-[0.12em]">100 PERFORMANCE</span>
      </motion.div>
    </motion.div>
  );
}

// ── Cards ─────────────────────────────────────────────────────

function LargeCard({ card }: { card: { id: string; title: string; desc: string } }) {
  const { ref, tilt, hovered, onMove, onEnter, onLeave } = useTilt();
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: E }}
      className="col-span-1 md:col-span-2"
      style={{ perspective: "900px" }}
    >
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hovered ? 0.99 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="relative border border-white/[0.07] hover:border-violet/25 bg-black overflow-hidden transition-colors duration-500 group min-h-[280px] md:min-h-[360px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <IsoVisual />
      <BrowserMockup />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(168,85,247,0.06) 0%, transparent 70%)" }}
      />

      {/* Content — left side */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-10 md:w-1/2" style={{ minHeight: 280 }}>
        <div>
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[8px] text-violet/40 tracking-[0.2em]">01</span>
          </div>

          {/* Title */}
          <h3
            className="font-display font-extrabold uppercase text-white/80 group-hover:text-white transition-colors duration-300 leading-[0.9] mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.03em" }}
          >
            {card.title}
          </h3>

          {/* Desc */}
          <p className="font-body text-sm text-white/65 leading-relaxed max-w-sm">
            {card.desc}
          </p>
        </div>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-2 mt-8">
          {["Next.js", "React", "TypeScript", "Tailwind", "Framer Motion"].map((tag) => (
            <span
              key={tag}
              className="font-mono text-[8px] text-white/25 border border-white/[0.07] px-2 py-1 tracking-[0.1em] group-hover:border-violet/20 group-hover:text-violet/45 transition-colors duration-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

    </motion.div>
    </motion.div>
  );
}

function SmallCard({
  card,
  index,
  visual,
}: {
  card: { id: string; title: string; desc: string };
  index: number;
  visual: React.ReactNode;
}) {
  const { ref, tilt, hovered, onMove, onEnter, onLeave } = useTilt();
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: E, delay: index * 0.08 }}
      style={{ perspective: "900px" }}
    >
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hovered ? 0.985 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="relative border border-white/[0.07] hover:border-violet/25 bg-black overflow-hidden transition-colors duration-500 group min-h-[320px] md:min-h-[440px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Visual fills bottom 55% */}
      {visual}

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 20%, rgba(168,85,247,0.05) 0%, transparent 70%)" }}
      />

      {/* Content — top area */}
      <div className="relative z-10 p-7">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[8px] text-violet/40 tracking-[0.2em]">0{index + 2}</span>
        </div>
        <h3
          className="font-display font-extrabold uppercase text-white/75 group-hover:text-white transition-colors duration-300 leading-[0.9] mb-3"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", letterSpacing: "-0.03em" }}
        >
          {card.title}
        </h3>
        <p className="font-body text-xs text-white/65 leading-relaxed">{card.desc}</p>
      </div>

    </motion.div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="relative py-24 md:py-36 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <SectionLabel label="[002_SERVICES]" />

        {/* Heading */}
        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          whileInView={{ clipPath: "inset(0% 0 0 0)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: E }}
          className="mb-14 md:mb-16"
        >
          <h2
            className="font-display font-extrabold uppercase text-white leading-[0.88]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", letterSpacing: "-0.04em" }}
          >
            {t.services.label}
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
          {/* Large card */}
          <LargeCard card={t.services.cards[0]} />

          {/* Small cards */}
          <SmallCard card={t.services.cards[1]} index={0} visual={<CSATVisual />} />
          <SmallCard card={t.services.cards[2]} index={1} visual={<ClusterVisual />} />
        </div>
      </div>
    </section>
  );
}
