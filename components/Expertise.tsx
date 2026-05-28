"use client";

// Expertise — KPRverse console/terminal aesthetic
// Categories styled as "// COMMENT" headers + skill tags

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { E } from "@/lib/easing";
import SectionLabel from "@/components/ui/SectionLabel";
import { LineReveal } from "@/components/animations";
import { InfiniteTextMarquee } from "@/components/ui/infinite-text-marquee";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { SpotlightSection } from "@/components/effects/SpotlightSection";

export default function Expertise() {
  const { t } = useLanguage();

  return (
    <SpotlightSection>
    <section id="expertise" className="relative py-24 md:py-36 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">

        <SectionLabel label="[005_SKILLS]" />

        {/* Heading — LineReveal aplicado */}
        <LineReveal delay={0.1} className="mb-14 md:mb-16">
          <h2
            className="font-display font-extrabold uppercase text-white leading-[0.88]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", letterSpacing: "-0.04em" }}
          >
            <AnimatedHeading text={t.expertise.label} delay={600} />
          </h2>
        </LineReveal>

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

      </div>
      
      {/* Marquee de tecnologias — InfiniteTextMarquee com cursor tooltip */}
      <div className="mt-16 md:mt-24 border-t border-b border-white/[0.05] py-2 overflow-hidden">
        <InfiniteTextMarquee
          text="REACT · NEXT.JS · TYPESCRIPT · TAILWIND · FRAMER MOTION · NODE.JS · GITHUB · VERCEL"
          speed={40}
          fontSize="clamp(1rem, 2.5vw, 1.6rem)"
          textColor="rgba(255,255,255,0.18)"
          hoverColor="#a855f7"
          tooltipText="Let's build something"
          link="#contact"
        />
      </div>
    </section>
    </SpotlightSection>
  );
}
