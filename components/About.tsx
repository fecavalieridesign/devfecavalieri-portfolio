"use client";

// About — KPRverse × Zentry
// Left: giant stat numbers in lime (Syne 800) + right: text + tags
// Stats animate with CountUp when entering viewport

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { E } from "@/lib/easing";
import SectionLabel from "@/components/ui/SectionLabel";

function parseNum(v: string): { n: number; suffix: string } {
  const m = v.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return m ? { n: parseFloat(m[1]), suffix: m[2] } : { n: 0, suffix: v };
}

function StatCard({ stat, index }: { stat: { value: string; label: string }; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });
  const { n, suffix } = parseNum(stat.value);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const duration = 1500;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * n));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, n]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: E, delay: index * 0.08 }}
      className="border border-white/[0.06] p-5 hover:border-violet/20 transition-colors duration-400 group"
    >
      <div
        className="font-display font-extrabold uppercase text-violet leading-none mb-2"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em" }}
        aria-label={`${inView ? count : 0}${suffix} — ${stat.label}`}
      >
        {inView ? count : 0}{suffix}
      </div>
      <div className="font-mono text-[8px] text-white/50 tracking-[0.2em] uppercase group-hover:text-violet/60 transition-colors duration-300">
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function About() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const leftY  = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section id="about" ref={ref} className="relative py-24 md:py-36 border-t border-white/[0.05] overflow-hidden">
      {/* Animated CSS blob — Zentry organic shape */}
      <div
        aria-hidden
        className="absolute -right-32 top-1/4 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(168,85,247,0.04) 0%, rgba(168,85,247,0.01) 50%, transparent 70%)",
          borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
          animation: "blob-morph 8s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      {/* Secondary blob */}
      <div
        aria-hidden
        className="absolute -left-16 bottom-1/4 w-72 h-72 pointer-events-none"
        style={{
          background: "rgba(168,85,247,0.025)",
          clipPath: "polygon(4% 0, 83% 21%, 100% 73%, 0% 100%)",
          filter: "blur(20px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionLabel label="[004_ABOUT]" />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">

          {/* LEFT — stat numbers with CountUp (slowest parallax) */}
          <motion.div style={{ y: leftY }} className="grid grid-cols-2 gap-4 md:gap-6">
            {t.about.stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </motion.div>

          {/* RIGHT — heading + text + tags (faster parallax) */}
          <motion.div style={{ y: rightY }}>
            {/* Heading */}
            <div className="overflow-hidden mb-8">
              <motion.div
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: E }}
              >
                <h2
                  className="font-display font-extrabold uppercase text-white leading-[0.88]"
                  style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.04em" }}
                >
                  {t.about.heading1}
                </h2>
                <h2
                  className="font-display font-extrabold uppercase leading-[0.88]"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 4.5rem)",
                    letterSpacing: "-0.04em",
                    WebkitTextStroke: "1px #a855f7",
                    color: "transparent",
                  }}
                >
                  {t.about.heading2}
                </h2>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: E, delay: 0.1 }}
              className="font-body text-sm text-white/65 leading-relaxed mb-8"
            >
              {t.about.description}
            </motion.p>

            {/* Tag pills */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
              className="flex flex-wrap gap-2"
            >
              {["React", "Next.js", "TypeScript", "Suporte Técnico", "Sucesso do Cliente", "Figma", "Tailwind", "APIs e Integrações"].map((tag) => (
                <motion.span
                  key={tag}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: E } },
                  }}
                  className="font-mono text-[8px] text-white/60 border border-white/[0.08] px-2.5 py-1 tracking-[0.12em] cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
