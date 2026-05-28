"use client";

// KPRverse-inspired sidebar navigation
// Desktop: 60px fixed left sidebar with section dots + tooltips
// Mobile: fixed top bar + full-screen overlay menu

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { E } from "@/lib/easing";
import { CurvedNavbar } from "@/components/ui/curved-menu";

const SECTIONS = [
  { id: "work",      label: "WORK" },
  { id: "stack",     label: "STACK" },
  { id: "about",     label: "ABOUT" },
  { id: "expertise", label: "SKILLS" },
  { id: "contact",   label: "CONTACT" },
];

const CURVED_NAV_ITEMS = [
  { heading: "Work",    href: "#work" },
  { heading: "Stack",   href: "#stack" },
  { heading: "About",   href: "#about" },
  { heading: "Skills",  href: "#expertise" },
  { heading: "Contact", href: "#contact" },
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

      {/* ══ MOBILE OVERLAY — CurvedNavbar ═══════════════════════ */}
      <AnimatePresence mode="wait">
        {mobileOpen && (
          <CurvedNavbar
            setIsActive={setMobileOpen}
            navItems={CURVED_NAV_ITEMS}
          />
        )}
      </AnimatePresence>
    </>
  );
}
