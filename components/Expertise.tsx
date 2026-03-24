"use client";

// Expertise — KPRverse console/terminal aesthetic
// Categories styled as "// COMMENT" headers + skill tags

import { motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { E } from "@/lib/easing";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Expertise() {
  const { t } = useLanguage();
  const [marquePaused, setMarquePaused] = useState(false);

  return (
    <section id="expertise" className="relative py-24 md:py-36 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">

        <SectionLabel label="[005_SKILLS]" />

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
            {t.expertise.label}
          </h2>
        </motion.div>

        {/* Categories — terminal comment style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {t.expertise.categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: E, delay: i * 0.07 }}
            >
              {/* Category header — console comment style */}
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.05]">
                <span className="font-mono text-[9px] text-violet/50 tracking-[0.15em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[9px] text-white/55 tracking-[0.18em] uppercase">
                  {cat.name}
                </span>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {cat.items.flatMap((item) => item.split(" · ")).map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-[9px] text-white/60 border border-white/[0.07] px-2.5 py-1.5 tracking-[0.1em] cursor-default"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marquee — Inversa pattern — tech stack infinite scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: E, delay: 0.3 }}
          className="mt-16 md:mt-20 overflow-hidden border-t border-b border-white/[0.05] py-4"
        >
          <div
            className="flex gap-0 whitespace-nowrap"
            style={{ animation: "marquee 22s linear infinite", animationPlayState: marquePaused ? "paused" : "running" }}
            onMouseEnter={() => setMarquePaused(true)}
            onMouseLeave={() => setMarquePaused(false)}
          >
            {[...Array(2)].flatMap((_, outerIdx) =>
              ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Framer Motion",
               "Node.js", "Figma", "REST APIs", "Suporte Técnico", "Customer Success", "SQL", "Git"].map((tech, i) => (
                <span key={`${outerIdx}-${i}`} className="font-mono text-[9px] text-white/20 tracking-[0.15em] uppercase px-6 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-violet/40 flex-shrink-0" />
                  {tech}
                </span>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
