"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import SectionLabel from "@/components/ui/SectionLabel";

const easeOutExpo: [number, number, number, number] = [0.19, 1, 0.22, 1];
const easeZentry: [number, number, number, number] = [0.65, 0.05, 0.36, 1];

interface StackCard {
  title: string;
  titlePt: string;
  desc: string;
  descPt: string;
  icon: string;
  skills: string[];
}

const stackData: StackCard[] = [
  {
    title: "Frontend",
    titlePt: "Frontend",
    desc: "React, Next.js, TypeScript, Tailwind CSS — building fast, accessible, and beautiful interfaces.",
    descPt: "React, Next.js, TypeScript, Tailwind CSS — construindo interfaces rápidas, acessíveis e belas.",
    icon: "◈",
    skills: ["React 19", "Next.js 16", "TypeScript", "Tailwind v4"],
  },
  {
    title: "3D & Motion",
    titlePt: "3D & Motion",
    desc: "Three.js, React Three Fiber, Framer Motion — immersive experiences that captivate.",
    descPt: "Three.js, React Three Fiber, Framer Motion — experiências imersivas que cativam.",
    icon: "✦",
    skills: ["Three.js", "R3F", "Framer Motion", "WebGL"],
  },
  {
    title: "Design",
    titlePt: "Design",
    desc: "UI/UX, Design Systems, Prototyping — crafting interfaces that feel intuitive.",
    descPt: "UI/UX, Design Systems, Prototipagem — criando interfaces intuitivas.",
    icon: "○",
    skills: ["Figma", "UI/UX", "Design Systems", "Motion"],
  },
  {
    title: "Backend",
    titlePt: "Backend",
    desc: "Node.js, APIs, Databases — scalable architecture that powers the frontend.",
    descPt: "Node.js, APIs, Bancos de Dados — arquitetura escalável que alimenta o frontend.",
    icon: "◇",
    skills: ["Node.js", "REST APIs", "SQL", "NoSQL"],
  },
  {
    title: "DevOps",
    titlePt: "DevOps",
    desc: "CI/CD, Deployment, Performance — ensuring reliability at every step.",
    descPt: "CI/CD, Deploy, Performance — garantindo confiabilidade em cada etapa.",
    icon: "▲",
    skills: ["Vercel", "CI/CD", "Performance", "Analytics"],
  },
];

export default function Stack() {
  const [isSpread, setIsSpread] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { t, lang } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const cards = lang === "pt"
    ? stackData.map(c => ({ ...c, title: c.titlePt, desc: c.descPt }))
    : stackData;

  const stackVariants = {
    stacked: (i: number) => ({
      x: 0,
      y: i * -6,
      rotate: (i - 2) * 2.5,
      scale: 1 - i * 0.015,
      zIndex: cards.length - i,
    }),
    spread: (i: number) => ({
      x: isMobile ? (i - 2) * 58 : (i - 2) * 120,
      y: 0,
      rotate: 0,
      scale: isMobile ? 0.78 : 1,
      zIndex: 10,
    }),
  };

  return (
    <section
      id="stack"
      className="relative py-24 md:py-36 border-t border-white/[0.05] overflow-hidden"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(168,85,247,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionLabel label="[003_STACK]" />

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: easeZentry }}
          className="mb-6"
        >
          <h2
            className="font-display font-extrabold uppercase text-white leading-[0.88]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", letterSpacing: "-0.04em" }}
          >
            {lang === "pt" ? "Stack" : "Stack"}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeZentry }}
          className="text-white/50 text-sm md:text-base max-w-xl mb-16"
          style={{ fontFamily: "var(--font-onest)" }}
        >
          <span className="hidden md:inline">
            {lang === "pt"
              ? "Passe o mouse para explorar as áreas de expertise"
              : "Hover to explore areas of expertise"}
          </span>
          <span className="md:hidden">
            {lang === "pt"
              ? "Toque para explorar as áreas de expertise"
              : "Tap to explore areas of expertise"}
          </span>
        </motion.p>

        {/* Card Stack */}
        <motion.div
          className="relative flex items-center justify-center py-16 cursor-pointer md:cursor-default"
          style={{ width: "100%", maxWidth: "700px", margin: "0 auto", minHeight: "500px" }}
          onHoverStart={() => setIsSpread(true)}
          onHoverEnd={() => {
            setIsSpread(false);
            setActiveCard(null);
          }}
          onClick={() => setIsSpread(!isSpread)}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: easeZentry }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              role="button"
              tabIndex={isSpread ? 0 : -1}
              aria-label={`Área de expertise: ${card.title}`}
              className="absolute cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet focus-visible:outline-offset-2 rounded-2xl"
              custom={index}
              variants={stackVariants}
              initial="stacked"
              animate={isSpread ? "spread" : "stacked"}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.7,
                ease: easeOutExpo,
                delay: isSpread ? index * 0.08 : 0,
              }}
              whileHover={
                isSpread && !shouldReduceMotion
                  ? {
                      y: -30,
                      scale: 1.08,
                      zIndex: 100,
                      transition: { duration: 0.2 },
                    }
                  : undefined
              }
              onHoverStart={() => isSpread && setActiveCard(index)}
              onHoverEnd={() => setActiveCard(null)}
              onFocus={() => isSpread && setActiveCard(index)}
              onBlur={() => setActiveCard(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (isSpread) setActiveCard(activeCard === index ? null : index);
                }
              }}
              style={{
                zIndex: activeCard === index ? 100 : isSpread ? 10 : cards.length - index,
              }}
            >
              <motion.div
                className="relative w-[180px] md:w-[200px] h-[300px] md:h-[320px] rounded-2xl overflow-hidden"
                style={{
                  background: activeCard === index
                    ? "linear-gradient(145deg, #1a0a2e 0%, #0c0c0c 100%)"
                    : "#0c0c0c",
                  border: `1px solid ${
                    activeCard === index 
                      ? "rgba(168,85,247,0.5)" 
                      : "rgba(168,85,247,0.15)"
                  }`,
                  boxShadow: activeCard === index
                    ? "0 30px 60px rgba(168,85,247,0.2), 0 0 40px rgba(168,85,247,0.1)"
                    : "0 20px 40px rgba(0,0,0,0.5)",
                }}
              >
                {/* Violet gradient top */}
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-32"
                  style={{
                    background: "linear-gradient(180deg, rgba(168,85,247,0.12) 0%, transparent 100%)",
                  }}
                  animate={{ opacity: activeCard === index ? 1 : 0.6 }}
                />

                {/* Corner accent */}
                <div 
                  className="absolute top-4 left-4 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(168,85,247,0.15)",
                    border: "1px solid rgba(168,85,247,0.3)",
                  }}
                >
                  <span className="text-[10px]" style={{ color: "#a855f7" }}>
                    0{index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-5">
                  {/* Icon */}
                  <motion.div
                    className="text-3xl md:text-4xl mt-8"
                    animate={{ 
                      scale: activeCard === index ? 1.15 : 1,
                      y: activeCard === index ? -5 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "#a855f7" }}
                  >
                    {card.icon}
                  </motion.div>

                  {/* Text */}
                  <div>
                    <motion.h3
                      className="text-lg md:text-xl font-bold mb-2"
                      style={{
                        fontFamily: "var(--font-archivo-black)",
                        color: "#fff",
                      }}
                    >
                      {card.title}
                    </motion.h3>
                    
                    <AnimatePresence>
                      {activeCard === index && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs leading-relaxed mb-3"
                          style={{
                            fontFamily: "var(--font-onest)",
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          {card.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Skills */}
                    <motion.div
                      className="flex flex-wrap gap-1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activeCard === index ? 1 : 0.5 }}
                    >
                      {card.skills.map((skill, i) => (
                        <span
                          key={skill}
                          className="text-[8px] md:text-[9px] px-2 py-1 rounded-full"
                          style={{
                            fontFamily: "var(--font-space-mono)",
                            backgroundColor: "rgba(168,85,247,0.1)",
                            color: "rgba(168,85,247,0.9)",
                            border: "1px solid rgba(168,85,247,0.2)",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </motion.div>

                    {/* Violet line accent */}
                    <motion.div
                      className="mt-4 h-0.5 rounded-full"
                      style={{ backgroundColor: "#a855f7" }}
                      initial={{ width: "20%" }}
                      animate={{ width: activeCard === index ? "100%" : "30%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Hint text — desktop */}
        <motion.p
          className="hidden md:block text-center mt-12 text-xs"
          style={{
            fontFamily: "var(--font-onest)",
            color: "rgba(255,255,255,0.25)",
          }}
          animate={{ opacity: isSpread ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {lang === "pt" ? "Hover para interagir" : "Hover to interact"}
        </motion.p>

        {/* Mobile hint */}
        <p className="md:hidden text-center mt-4 text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(255,255,255,0.25)" }}>
          Toque para interagir
        </p>
      </div>
    </section>
  );
}
