"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTilt } from "@/hooks/useTilt";
import SectionLabel from "@/components/ui/SectionLabel";

const PROJECTS = [
  {
    id: "victoria-belli",
    name: "VICTORIA BELLI",
    label: "Moda · E-commerce",
    description: "E-commerce de moda feminina com experiência de navegação premium, layout editorializado e checkout otimizado.",
    url: "https://victoria-belli.vercel.app/",
    image: "/cases/victoria-belli.png",
    tags: ["Next.js", "Tailwind", "E-commerce"],
    year: "2024",
  },
  {
    id: "dra-yasmin",
    name: "DRA. YASMIN",
    label: "Saúde · Landing Page",
    description: "Site institucional para médica com agenda online, depoimentos e identidade visual clean de saúde premium.",
    url: "https://dra-yasmin.vercel.app/",
    image: "/cases/dra-yasmin.png",
    tags: ["Next.js", "Framer Motion"],
    year: "2024",
  },
  {
    id: "atelie-do-fio",
    name: "ATELIÊ DO FIO",
    label: "Artesanato · Portfólio",
    description: "Portfólio artesanal com galeria de peças, catálogo visual e contato direto pelo WhatsApp.",
    url: "https://atelie-do-fio.vercel.app/",
    image: "/cases/atelie-do-fio.png",
    tags: ["React", "CSS"],
    year: "2023",
  },
];

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const { ref, tilt, hovered, onMove, onEnter, onLeave } = useTilt<HTMLAnchorElement>(4);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 1.2,
        delay: shouldReduceMotion ? 0 : index * 0.25,
        ease: [0.65, 0.05, 0.36, 1] as const
      }}
      style={{ perspective: "900px" }}
    >
      <motion.a
        ref={ref}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver projeto ${project.name} — abre em nova aba`}
        animate={{
          rotateX: shouldReduceMotion ? 0 : tilt.x,
          rotateY: shouldReduceMotion ? 0 : tilt.y,
          boxShadow: hovered
            ? "0 24px 60px rgba(0,0,0,0.13), 0 4px 16px rgba(168,85,247,0.08)"
            : "0 2px 8px rgba(0,0,0,0.04)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        style={{
          transformStyle: "preserve-3d",
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: "1.25rem",
          backdropFilter: "blur(6px)",
        }}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="group relative flex flex-col md:flex-row overflow-hidden cursor-pointer h-[420px] sm:h-[460px] md:h-[45vh] w-[90vw] sm:w-[85vw] md:w-[55vw] lg:w-[45vw] flex-shrink-0"
      >
        {/* Texto — esquerda */}
        <div className="flex flex-col p-4 sm:p-6 md:p-10 md:w-[38%] shrink-0" style={{ transform: "translateZ(16px)" }}>
          {/* Year badge */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet/60 flex-shrink-0" />
            <span className="font-mono text-[8px] sm:text-[9px] text-black/40 tracking-widest">
              {project.year}
            </span>
          </div>

          <p className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-black/35 uppercase mb-3 sm:mb-4">{project.label}</p>
          
          <h3
            className="font-display font-extrabold text-black leading-[0.88] mb-2 sm:mb-4"
            style={{ fontSize: "clamp(1.2rem, 2.8vw, 2.6rem)", letterSpacing: "-0.03em" }}
          >
            {project.name}
          </h3>

          <p className="font-mono text-[0.7rem] sm:text-[0.78rem] text-black/45 leading-relaxed mb-4 sm:mb-8">
            {project.description}
          </p>
          
          <div className="mt-auto flex items-center gap-2 flex-wrap">
            {project.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[7px] sm:text-[8px] text-black/40 border border-black/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-sm"
              >
                {t}
              </span>
            ))}
          </div>
          
          <div className="mt-4 sm:mt-6 flex items-center gap-2 font-mono text-[8px] sm:text-[9px] text-black/30 group-hover:text-black/60 transition-all duration-300">
            <span>VER</span>
            <motion.span
              animate={{ x: shouldReduceMotion ? 0 : (hovered ? 3 : 0), y: shouldReduceMotion ? 0 : (hovered ? -3 : 0) }}
              transition={{ duration: 0.25 }}
            >↗</motion.span>
          </div>
        </div>

        {/* Screenshot — direita */}
        <div className="relative flex-1 min-h-[200px] md:min-h-0 overflow-hidden rounded-b-[1.1rem] md:rounded-b-none md:rounded-r-[1.1rem]">
          <Image
            src={project.image}
            alt={`Screenshot do projeto ${project.name}`}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 65vw"
          />
          {/* Fade-in left para misturar com o texto */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to right, rgba(255,255,255,0.55) 0%, transparent 25%)" }}
          />
        </div>

        {/* Index number */}
        <div 
          className="absolute top-6 right-6 font-display text-6xl md:text-7xl font-bold text-black/[0.03] pointer-events-none"
          style={{ transform: "translateZ(10px)" }}
        >
          0{index + 1}
        </div>
      </motion.a>
    </motion.div>
  );
}

export default function WorkHorizontal() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const smoothX = useSpring(x, { damping: 45, stiffness: 180 });

  // Progress indicator
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative overflow-x-hidden"
      style={{
        background: "#e4e4f0"
      }}
    >
      {/* ── DESKTOP: scroll-driven sticky horizontal ── */}
      <div
        className="hidden lg:block"
        style={{ height: "350vh" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-7 md:pb-8 px-4 sm:px-6 md:px-12">
            <div className="max-w-6xl mx-auto flex items-end justify-between">
              <div>
                <SectionLabel label="[001_WORK]" dividerColor="bg-black/[0.06]" className="mb-6" />
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                    ease: [0.65, 0.05, 0.36, 1] as const
                  }}
                  className="font-display font-extrabold uppercase text-black leading-[0.88]"
                  style={{ fontSize: "clamp(2rem, 5.5vw, 5rem)", letterSpacing: "-0.04em" }}
                >
                  {t.work.label}
                </motion.h2>
              </div>

              {/* Progress bar */}
              <div className="hidden lg:flex items-center gap-3">
                <span className="font-mono text-[9px] text-black/30 tracking-wider">PROGRESS</span>
                <div className="w-24 h-[2px] bg-black/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-violet/60"
                    style={{ width: progressWidth }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal scroll track */}
          <motion.div
            className="absolute top-[55%] -translate-y-1/2 left-0 flex items-center gap-8 md:gap-12 px-6 md:px-12"
            style={{ x: smoothX }}
          >
            {PROJECTS.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}

            {/* End card - CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex-shrink-0 w-[40vw] h-[40vh] flex items-center justify-center"
            >
              <a
                href="https://github.com/fecavalieridesign"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver todos os projetos no GitHub — abre em nova aba"
                className="group flex flex-col items-center gap-6 text-center p-8 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center group-hover:border-violet/40 group-hover:bg-violet/[0.03] transition-all duration-300">
                  <motion.span
                    className="text-xl text-black/40 group-hover:text-violet/60 transition-colors"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    ↻
                  </motion.span>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-black/40 mb-2 tracking-wider">{t.work.viewAll}</p>
                  <p className="font-display text-lg text-black/70 group-hover:text-violet transition-colors">
                    GitHub →
                  </p>
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* Bottom instruction */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-black/30">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-mono text-sm"
            >
              →
            </motion.div>
            <span className="font-mono text-[10px] tracking-widest uppercase">
              Scroll horizontal
            </span>
          </div>
        </div>
      </div>

      {/* ── MOBILE: touch-scrollable vertical stack ── */}
      <div className="lg:hidden py-12 sm:py-14 px-4 sm:px-5">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <SectionLabel label="[001_WORK]" dividerColor="bg-black/[0.06]" className="mb-6" />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.65, 0.05, 0.36, 1] as const }}
            className="font-display font-extrabold uppercase text-black leading-[0.88]"
            style={{ fontSize: "clamp(2rem, 9vw, 3.5rem)", letterSpacing: "-0.04em" }}
          >
            {t.work.label}
          </motion.h2>
        </div>

        {/* Touch-scroll horizontal track */}
        <div
          ref={mobileTrackRef}
          data-testid="mobile-work-track"
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 sm:pb-6"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            touchAction: "pan-x",
          }}
        >
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              style={{ scrollSnapAlign: "start", flexShrink: 0 }}
            >
              <ProjectCard project={project} index={index} />
            </div>
          ))}

          {/* End CTA card */}
          <div
            className="flex-shrink-0 w-[72vw] flex items-center justify-center"
            style={{ scrollSnapAlign: "start" }}
          >
            <a
              href="https://github.com/fecavalieridesign"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver todos os projetos no GitHub — abre em nova aba"
              className="group flex flex-col items-center gap-5 text-center p-6 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center">
                <span className="text-xl text-black/40">↻</span>
              </div>
              <div>
                <p className="font-mono text-[10px] text-black/40 mb-1.5 tracking-wider">{t.work.viewAll}</p>
                <p className="font-display text-base text-black/70">GitHub →</p>
              </div>
            </a>
          </div>
        </div>

        {/* Swipe hint */}
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4 text-black/30">
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-mono text-sm"
          >
            →
          </motion.span>
          <span className="font-mono text-[10px] tracking-widest uppercase">Deslize para ver mais</span>
        </div>
      </div>
    </section>
  );
}
