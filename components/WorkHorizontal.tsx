"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { E } from "@/lib/easing";
import SectionLabel from "@/components/ui/SectionLabel";
import { useTilt } from "@/hooks/useTilt";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: "victoria-belli",
    name: "VICTORIA BELLI",
    label: "Moda · E-commerce",
    description:
      "E-commerce de moda feminina com experiência de navegação premium, layout editorializado e checkout otimizado para maximizar conversão.",
    outcome: "↑ 38% conversão",
    url: "https://victoria-belli.vercel.app/",
    image: "/cases/victoria-belli.png",
    tags: ["Next.js", "Tailwind", "E-commerce"],
    year: "2024",
  },
  {
    id: "dra-yasmin",
    name: "DRA. YASMIN",
    label: "Saúde · Landing Page",
    description:
      "Site institucional para biomédica esteta com agenda online, depoimentos e identidade visual de saúde premium — do design ao deploy.",
    outcome: "100 SEO",
    url: "https://dra-yasmin.vercel.app/",
    image: "/cases/dra-yasmin.png",
    tags: ["Next.js", "Framer Motion"],
    year: "2024",
  },
  {
    id: "atelie-do-fio",
    name: "ATELIÊ DO FIO",
    label: "Artesanato · Portfólio",
    description:
      "Portfólio artesanal com galeria de peças, catálogo visual responsivo e contato direto pelo WhatsApp — presença digital do zero.",
    outcome: "↑ 2× contatos",
    url: "https://atelie-do-fio.vercel.app/",
    image: "/cases/atelie-do-fio.png",
    tags: ["React", "CSS"],
    year: "2023",
  },
];

// ── Stack Card ─────────────────────────────────────────────────────────────────

function StackCard({
  project,
  index,
  totalCards,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  totalCards: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref: tiltRef, tilt, hovered, onMove, onEnter, onLeave } = useTilt(3);

  const targetScale = 1 - (totalCards - index) * 0.05;

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    gsap.set(card, { scale: 1, transformOrigin: "center top" });

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        const scale = gsap.utils.interpolate(1, targetScale, self.progress);
        gsap.set(card, { scale: Math.max(scale, targetScale), transformOrigin: "center top" });
      },
    });

    return () => st.kill();
  }, [targetScale]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        ref={cardRef}
        style={{
          position: "relative",
          width: "min(78%, 1000px)",
          height: "clamp(380px, 48vh, 480px)",
          borderRadius: "24px",
          top: `${index * 24}px`,
          transformOrigin: "top center",
          perspective: "900px",
        }}
      >
        {/* Main card surface — tilt applies here, GSAP scale applies on parent */}
        <motion.div
          ref={tiltRef}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(16px) saturate(150%)",
            WebkitBackdropFilter: "blur(16px) saturate(150%)",
            border: hovered ? "1px solid rgba(168,85,247,0.22)" : "1px solid rgba(0,0,0,0.06)",
            boxShadow: hovered
              ? "0 16px 48px rgba(0,0,0,0.14), 0 0 0 1px rgba(168,85,247,0.08)"
              : "0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
            overflow: "hidden",
            transition: "border-color 0.4s, box-shadow 0.4s",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Hover glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(168,85,247,0.06) 0%, transparent 70%)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.4s",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Left: text */}
          <div
            style={{
              flex: "0 0 42%",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Index + year */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
              <span className="font-mono" style={{ fontSize: "9px", color: "rgba(124,58,237,1)", letterSpacing: "0.22em" }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span style={{ width: "18px", height: "1px", background: "rgba(124,58,237,0.4)", flexShrink: 0 }} />
              <span className="font-mono" style={{ fontSize: "9px", color: "rgba(0,0,0,0.6)", letterSpacing: "0.18em" }}>
                {project.year}
              </span>
            </div>

            {/* Label */}
            <p className="font-mono" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(0,0,0,0.6)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              {project.label}
            </p>

            {/* Name */}
            <h3
              className="font-display"
              style={{
                fontWeight: 800,
                fontSize: "clamp(1.3rem, 2.4vw, 2.3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
                color: "#0a0a0a",
                marginBottom: "0.9rem",
              }}
            >
              {project.name}
            </h3>

            {/* Description */}
            <p
              className="font-mono"
              style={{
                fontSize: "0.7rem",
                color: "rgba(0,0,0,0.65)",
                lineHeight: 1.65,
                flex: 1,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {project.description}
            </p>

            {/* Tags */}
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "1rem", marginBottom: "1rem" }}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono"
                  style={{
                    fontSize: "8px",
                    color: "rgba(0,0,0,0.62)",
                    border: "1px solid rgba(0,0,0,0.10)",
                    padding: "3px 8px",
                    borderRadius: "3px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Outcome metric */}
            {project.outcome && (
              <div style={{ marginBottom: "0.75rem" }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "9px",
                    color: "rgba(124,58,237,1)",
                    border: "1px solid rgba(124,58,237,0.3)",
                    background: "rgba(168,85,247,0.06)",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    letterSpacing: "0.1em",
                  }}
                >
                  {project.outcome}
                </span>
              </div>
            )}

            {/* CTA */}
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono group"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "9px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "rgba(124,58,237,1)",
                transition: "color 0.2s",
              }}
            >
              VER PROJETO ↗
            </a>
          </div>

          {/* Right: screenshot */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", borderRadius: "0 24px 24px 0" }}>
            <Image
              src={project.image}
              alt={`Screenshot do projeto ${project.name}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            {/* Left fade overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(228,228,240,0.9) 0%, transparent 35%)", pointerEvents: "none" }} />
          </div>

          {/* Ghost index */}
          <div
            className="font-display"
            style={{
              position: "absolute",
              bottom: "1.25rem",
              right: "1.75rem",
              fontSize: "clamp(4rem, 7vw, 7rem)",
              fontWeight: 800,
              color: "rgba(0,0,0,0.03)",
              pointerEvents: "none",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            0{index + 1}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function WorkHorizontal() {
  const { t } = useLanguage();

  return (
    <section id="work" style={{ background: "#e4e4f0" }}>
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-20 md:pt-28 pb-8">
        <SectionLabel label="[001_WORK]" dividerColor="bg-black/[0.08]" />
        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          whileInView={{ clipPath: "inset(0% 0 0 0)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: E }}
          className="mt-6"
        >
          <h2
            className="font-display font-extrabold uppercase text-black leading-[0.88]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", letterSpacing: "-0.04em" }}
          >
            {t.work.label}
          </h2>
        </motion.div>
      </div>

      {/* Stacked cards */}
      <div>
        {PROJECTS.map((project, index) => (
          <StackCard
            key={project.id}
            project={project}
            index={index}
            totalCards={PROJECTS.length}
          />
        ))}
      </div>

      {/* View all CTA */}
      <div className="flex justify-center py-16">
        <motion.a
          href="https://github.com/fecavalieridesign"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver todos os projetos no GitHub — abre em nova aba"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: E }}
          className="font-mono inline-flex items-center gap-3 text-black/60 hover:text-black/80 transition-colors duration-300"
          style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}
        >
          <span className="w-8 h-px bg-current" />
          {t.work.viewAll}
          <span>→</span>
        </motion.a>
      </div>
    </section>
  );
}
