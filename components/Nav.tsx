"use client";

// KPRverse-inspired sidebar navigation
// Desktop: 60px fixed left sidebar with section dots + tooltips
// Mobile: fixed top bar + full-screen overlay menu

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { E } from "@/lib/easing";

const SECTIONS = [
  { id: "work",      label: "WORK" },
  { id: "stack",     label: "STACK" },
  { id: "about",     label: "ABOUT" },
  { id: "expertise", label: "SKILLS" },
  { id: "contact",   label: "CONTACT" },
];

export default function Nav() {
  const { lang, toggleLang } = useLanguage();
  const [active, setActive] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.25, rootMargin: "-10% 0px -60% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ══ DESKTOP SIDEBAR ══════════════════════════════════════ */}
      <aside
        data-testid="desktop-nav"
        className="fixed left-0 top-0 h-screen w-[60px] border-r border-white/[0.06] z-50 hidden lg:flex flex-col items-center py-7 gap-5 bg-black overflow-hidden"
      >
        {/* Scroll progress — thin lime line grows from top */}
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute left-0 top-0 w-[2px] h-full bg-violet/50 pointer-events-none"
        />
        <a href="#" aria-label="Ir para o início" className="font-mono text-[10px] font-bold text-white/30 hover:text-violet transition-colors duration-300 tracking-widest">
          FC
        </a>

        <nav className="flex-1 flex flex-col items-center justify-center gap-5">
          {SECTIONS.map(({ id, label }) => (
            <div key={id} className="relative group">
              <a href={`#${id}`} aria-label={label} className="block p-1.5">
                <motion.div
                  animate={{
                    width:           active === id ? 7 : 4,
                    height:          active === id ? 7 : 4,
                    backgroundColor: active === id ? "#a855f7" : "rgba(255,255,255,0.18)",
                  }}
                  transition={{ duration: 0.25, ease: E }}
                  style={{ borderRadius: "50%" }}
                />
              </a>
              <span className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 font-mono text-[8px] text-violet tracking-[0.18em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {label}
              </span>
            </div>
          ))}
        </nav>

        <button
          onClick={toggleLang}
          aria-label={lang === "pt" ? "Switch to English" : "Trocar para Português"}
        className="font-mono text-[8px] text-white/25 hover:text-violet transition-colors tracking-widest"
        >
          {lang.toUpperCase()}
        </button>

        <div className="flex flex-col items-center gap-4">
          <a href="https://github.com/fecavalieridesign" target="_blank" rel="noopener noreferrer"
            aria-label="GitHub de Felipe Cavalieri — abre em nova aba"
            className="font-mono text-[8px] text-white/20 hover:text-violet transition-colors"
            style={{ writingMode: "vertical-rl" }} data-hover>GH</a>
          <a href="https://www.linkedin.com/in/felipe-cavalieri-241092251" target="_blank" rel="noopener noreferrer"
            aria-label="LinkedIn de Felipe Cavalieri — abre em nova aba"
            className="font-mono text-[8px] text-white/20 hover:text-violet transition-colors"
            style={{ writingMode: "vertical-rl" }} data-hover>LI</a>
        </div>
      </aside>

      {/* ══ MOBILE HAMBURGUER — flutuante, sem faixa ════════════ */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu de navegação"
        data-testid="mobile-menu-button"
        className="fixed top-4 right-4 z-50 flex lg:hidden flex-col justify-center items-center gap-[5px] w-11 h-11"
        style={{ mixBlendMode: "difference" }}
      >
        <span className="block h-[1.5px] w-5 bg-white" />
        <span className="block h-[1.5px] w-3.5 bg-white" />
        <span className="block h-[1.5px] w-5 bg-white" />
      </button>

      {/* ══ MOBILE OVERLAY ═══════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            data-testid="mobile-nav-overlay"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: E }}
            className="fixed inset-0 bg-[#030303] z-[60] flex flex-col overflow-hidden"
          >
            {/* Subtle violet orb background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[50vh] rounded-full bg-violet/[0.04] blur-[80px]" />
            </div>

            {/* Header row */}
            <div className="relative flex items-center justify-between px-6 h-14 border-b border-white/[0.05]">
              <span className="font-mono text-[10px] text-white/30 tracking-widest">FC / MENU</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                data-testid="mobile-menu-close"
                className="flex flex-col justify-center items-center gap-[5px] min-h-[44px] min-w-[44px] px-2 group"
              >
                {/* X icon from crossed bars */}
                <motion.span
                  initial={{ rotate: 0, y: 0 }}
                  animate={{ rotate: 45, y: 6.5 }}
                  className="block w-5 h-[1.5px] bg-white/40 group-hover:bg-violet transition-colors origin-center"
                />
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  className="block w-5 h-[1.5px] bg-white/40"
                />
                <motion.span
                  initial={{ rotate: 0, y: 0 }}
                  animate={{ rotate: -45, y: -6.5 }}
                  className="block w-5 h-[1.5px] bg-white/40 group-hover:bg-violet transition-colors origin-center"
                />
              </button>
            </div>

            {/* Nav links */}
            <nav className="relative flex-1 flex flex-col justify-center px-7 gap-0">
              {SECTIONS.map(({ id, label }, i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: E, delay: 0.1 + i * 0.07 }}
                  className="group flex items-center gap-4 border-b border-white/[0.05] py-5 hover:border-violet/20 transition-colors"
                >
                  <span className="font-mono text-[9px] text-white/15 group-hover:text-violet/60 transition-colors w-5 shrink-0">0{i + 1}</span>
                  <span
                    className="font-display font-extrabold text-white/70 group-hover:text-white transition-colors uppercase tracking-tight leading-none"
                    style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}
                  >
                    {label}
                  </span>
                  <span className="ml-auto font-mono text-[9px] text-white/0 group-hover:text-violet/60 transition-colors">↗</span>
                </motion.a>
              ))}
            </nav>

            {/* Footer row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="relative flex items-center justify-between px-7 py-5 border-t border-white/[0.05]"
            >
              <div className="flex gap-5">
                <a href="https://github.com/fecavalieridesign" target="_blank" rel="noopener noreferrer"
                  aria-label="GitHub de Felipe Cavalieri — abre em nova aba"
                  className="font-mono text-[9px] text-white/25 hover:text-violet transition-colors tracking-widest">
                  GITHUB
                </a>
                <a href="https://www.linkedin.com/in/felipe-cavalieri-241092251" target="_blank" rel="noopener noreferrer"
                  aria-label="LinkedIn de Felipe Cavalieri — abre em nova aba"
                  className="font-mono text-[9px] text-white/25 hover:text-violet transition-colors tracking-widest">
                  LINKEDIN
                </a>
              </div>
              <span className="font-mono text-[9px] text-white/[0.12] tracking-widest">© 2026</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
