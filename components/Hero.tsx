"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { E } from "@/lib/easing";

const BG_VIDEO =
  "https://videos.pexels.com/video-files/29848606/12817773_2560_1440_30fps.mp4";

const AMBER = "var(--color-amber)";
const AMBER_HEX = "#c8956c";
const AMBER_DIM = "rgba(200,149,108,";

function AnimatedCharName({ text, delay }: { text: string; delay: number }) {
  return (
    <span style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: delay + i * 0.05,
            duration: 0.5,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          style={{
            display: "inline-block",
            transformOrigin: "50% 100%",
            willChange: "opacity, transform",
          }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.28], [0, -14]);
  const scale = useTransform(scrollYProgress, [0, 0.28], [1, 0.82]);
  const textY = useTransform(scrollYProgress, [0, 0.4], ["0%", "28%"]);

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [0.62, 0.9]);
  const overlayBg = useMotionTemplate`rgba(0,0,0,${overlayOpacity})`;

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

  // Defer video load: skip on reduced-motion preference or slow connections
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slowNet = conn?.saveData || conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g";

    if (prefersReduced || slowNet) return;

    video.src = BG_VIDEO;
    video.load();
    video.play().catch(() => {});
  }, []);

  return (
    <div ref={containerRef} style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "#030308" }}>

        {/* ── Video background ── */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: videoScale, opacity: videoOpacity, willChange: "transform, opacity" }}
        >
          {/* poster="/hero-poster.jpg" — create from a frame of BG_VIDEO and place in /public */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            poster="/hero-poster.jpg"
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>

        {/* ── Dark overlay ── */}
        <motion.div className="absolute inset-0" style={{ background: overlayBg, zIndex: 1 }} />

        {/* ── Gradient — bottom preto pra texto legível ── */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background:
              "linear-gradient(to top, rgba(3,3,8,1) 0%, rgba(3,3,8,0.97) 22%, rgba(3,3,8,0.7) 45%, rgba(3,3,8,0.1) 70%, transparent 100%)",
          }}
        />

        {/* ── Mouse blob ── */}
        <motion.div
          style={{
            x: blobX, y: blobY,
            translateX: "-50%", translateY: "-50%",
            position: "absolute", left: 0, top: 0,
            width: 700, height: 700, borderRadius: "50%",
            background: `radial-gradient(circle, ${AMBER_DIM}0.04) 0%, ${AMBER_DIM}0.012) 45%, transparent 70%)`,
            mixBlendMode: "screen", filter: "blur(60px)",
            pointerEvents: "none", zIndex: 2, willChange: "transform",
          }}
        />

        {/* ── Corner brackets ── */}
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
              borderTop:    c.borderTop    ? "1px solid rgba(var(--color-amber-rgb),0.25)" : undefined,
              borderBottom: c.borderBottom ? "1px solid rgba(var(--color-amber-rgb),0.25)" : undefined,
              borderLeft:   c.borderLeft   ? "1px solid rgba(var(--color-amber-rgb),0.25)" : undefined,
              borderRight:  c.borderRight  ? "1px solid rgba(var(--color-amber-rgb),0.25)" : undefined,
              pointerEvents: "none", zIndex: 3,
            }}
          />
        ))}

        {/* ── Status indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: E, delay: 3.0 }}
          className="absolute top-12 sm:top-14 md:top-8 left-4 sm:left-6 md:left-10 flex items-center gap-2.5"
          style={{ zIndex: 5 }}
        >
          <span className="blink-dot" style={{ color: AMBER_HEX }} />
          <span className="font-mono text-[9px] text-white/70 tracking-[0.25em] uppercase">
            {t.hero.available}
          </span>
        </motion.div>

        {/* ── Year mark ── */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1 }}
          className="absolute top-12 sm:top-14 md:top-8 right-4 sm:right-6 md:right-10 font-mono text-[6px] sm:text-[7px] md:text-[8px] text-white/10 tracking-[0.3em] uppercase"
          style={{ zIndex: 3 }}
        >
          DEVFC — 2026
        </motion.span>

        {/* ── Content ── */}
        <div
          className="absolute inset-0 flex flex-col justify-center pt-16 sm:pt-20 md:pt-12 pb-4 px-4 sm:px-6"
          style={{ perspective: "1200px", perspectiveOrigin: "50% 100%", zIndex: 4 }}
        >
          <motion.div
            style={{
              y: textY, rotateX, scale, opacity: contentOpacity,
              transformOrigin: "50% 100%", willChange: "transform, opacity",
            }}
            className="relative px-0 sm:px-6 md:px-12 max-w-7xl mx-auto w-full"
          >
            {/* Giant name */}
            <h1
              data-testid="hero-title"
              className="mb-6 sm:mb-8 md:mb-12 font-sfpro font-extrabold uppercase leading-[0.85]"
              style={{ perspective: "1200px", letterSpacing: "-0.04em" }}
            >
              <div className="overflow-visible">
                <span className="block text-white" style={{ fontSize: "clamp(3rem, 18vw, 18rem)" }}>
                  <AnimatedCharName delay={2.8} text={t.hero.line1} />
                </span>
              </div>
              <div className="overflow-visible">
                <span
                  className="block text-white"
                  style={{
                    fontSize: "clamp(2rem, 11.5vw, 11rem)",
                    paddingLeft: "clamp(0rem, 11vw, 10.8rem)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <AnimatedCharName delay={3.0} text={t.hero.line2} />
                </span>
              </div>
            </h1>

            {/* Bottom row */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-3 sm:gap-5 lg:gap-8">
              <div className="max-w-sm">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: E, delay: 3.5 }}
                  className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2"
                  style={{ color: AMBER_HEX }}
                >
                  {t.hero.role}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: E, delay: 3.6 }}
                  className="font-body text-sm text-white/55 leading-relaxed mb-4 sm:mb-8"
                >
                  {t.hero.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: E, delay: 3.8 }}
                  className="flex flex-wrap gap-3"
                >
                  {/* Primary CTA — amber original */}
                  <a
                    href="#work"
                    className="group relative inline-flex items-center px-6 py-2.5 overflow-hidden rounded-full font-mono text-[10px] tracking-[0.15em] uppercase font-bold text-black active:scale-[0.97] transition-transform duration-100"
                  >
                    <div
                      className="absolute inset-0 rounded-[inherit] group-hover:scale-x-0 transition-transform duration-400 origin-right"
                      style={{ background: AMBER_HEX }}
                    />
                    <div
                      className="absolute inset-0 rounded-[inherit] group-hover:scale-x-100 scale-x-0 transition-transform duration-400 origin-left"
                      style={{ border: `1px solid ${AMBER_HEX}` }}
                    />
                    <span className="relative transition-colors duration-400 group-hover:text-[#c8956c]">
                      {t.hero.cta}
                    </span>
                  </a>

                  {/* Secondary CTA — liquid glass */}
                  <a
                    href="#contact"
                    className="liquid-glass inline-flex items-center gap-2 px-6 py-2.5 font-mono text-[10px] text-white/60 hover:text-white transition-colors duration-300 tracking-[0.15em] uppercase rounded-full"
                  >
                    {t.hero.secondary}
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Scroll hint ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 1 }}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-10 flex items-center gap-2 sm:gap-3"
          style={{ zIndex: 5 }}
        >
          <div className="relative w-7 h-7 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="absolute inset-0"
              style={{ animation: "spin-clockwise 8s linear infinite" }}>
              <circle cx="14" cy="14" r="12" stroke={`${AMBER_DIM}0.18)`} strokeWidth="1" strokeDasharray="4 5" />
            </svg>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="absolute inset-0">
              <circle cx="14" cy="14" r="12" stroke={`${AMBER_DIM}0.6)`} strokeWidth="1"
                strokeDasharray="75.4" strokeDashoffset="75.4" strokeLinecap="round"
                style={{ animation: "draw-stroke 1.2s cubic-bezier(0.19,1,0.22,1) 4.6s forwards" }} />
            </svg>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-3"
              style={{ background: `linear-gradient(to bottom, ${AMBER_DIM}0.6), transparent)` }}
            />
          </div>
          <span className="font-mono text-[7px] sm:text-[8px] text-white/35 tracking-[0.3em] uppercase hidden sm:inline">
            SCROLL
          </span>
        </motion.div>

        {/* ── Section counter ── */}
        <div className="absolute bottom-8 right-8 font-mono text-[10px] text-white/20" style={{ zIndex: 5 }}>
          01 / 02
        </div>
      </div>
    </div>
  );
}
