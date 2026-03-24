"use client";

// Contact — terminal prompt style (KPRverse console UI)
// "> CONNECT_WITH://" heading + three contact rows + CTA

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { E } from "@/lib/easing";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Contact() {
  const { t } = useLanguage();

  const links = [
    {
      id: "PHONE",
      ariaLabel: `Ligar para ${t.contact.phone}`,
      value: t.contact.phone,
      href: `tel:+${t.contact.phoneRaw}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.42 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 5.55 5.55l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
        </svg>
      ),
    },
    {
      id: "LINKEDIN",
      ariaLabel: "LinkedIn de Felipe Cavalieri — abre em nova aba",
      value: t.contact.linkedin,
      href: t.contact.linkedinHref,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      id: "GITHUB",
      ariaLabel: "GitHub de Felipe Cavalieri — abre em nova aba",
      value: t.contact.github,
      href: t.contact.githubHref,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="relative py-24 md:py-40 overflow-hidden" style={{ background: "#e4e4f0" }}>
      {/* Animated CSS blob */}
      <div
        aria-hidden
        className="absolute -left-24 top-1/3 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at 60% 60%, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0.04) 50%, transparent 70%)",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          animation: "blob-morph 10s ease-in-out infinite reverse",
          filter: "blur(50px)",
        }}
      />
      {/* Zentry diagonal shape */}
      <div
        aria-hidden
        className="absolute right-0 bottom-1/4 w-72 h-72 pointer-events-none"
        style={{
          background: "rgba(168,85,247,0.015)",
          clipPath: "polygon(16% 0, 89% 15%, 75% 100%, 0 97%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        <SectionLabel label="[006_CONTACT]" dividerColor="bg-black/[0.08]" />

        {/* Terminal prompt heading */}
        <div className="mb-14 md:mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: E }}
            className="font-mono text-[10px] text-violet/40 tracking-[0.2em] mb-4 flex items-center gap-2"
          >
            <span className="text-violet/60">›</span>
            CONNECT_WITH://
          </motion.div>
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: E, delay: 0.05 }}
          >
            <h2
              className="font-display font-extrabold uppercase text-black leading-[0.88]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)", letterSpacing: "-0.04em" }}
            >
              {t.contact.heading1}
            </h2>
          </motion.div>
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: E, delay: 0.15 }}
          >
            <h2
              className="font-display font-extrabold uppercase leading-[0.88]"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 6.5rem)",
                letterSpacing: "-0.04em",
                WebkitTextStroke: "1.5px #a855f7",
                color: "transparent",
              }}
            >
              {t.contact.heading2}
            </h2>
          </motion.div>
        </div>

        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: E, delay: 0.25 }}
          className="flex items-center gap-2.5 mb-12"
        >
          <span className="blink-dot text-violet" />
          <span className="font-mono text-[12px] text-violet/50 tracking-[0.22em] uppercase">{t.contact.available}</span>
        </motion.div>

        {/* Contact rows — terminal output style */}
        <div className="border-t border-black/[0.08] mb-14">
          {links.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={link.ariaLabel}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E, delay: i * 0.07 }}
              className="group flex items-center justify-between gap-6 py-5 border-b border-black/[0.06] hover:bg-black/[0.03] -mx-2 px-2 transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-[9px] text-black/50 group-hover:text-black transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-black/30 group-hover:text-violet/40 transition-colors">{link.icon}</span>
                <div>
                  <p className="font-mono text-[11px] text-black/40 tracking-[0.18em] uppercase mb-0.5">{link.id}</p>
                  <p className="font-body text-sm text-black/60 group-hover:text-black transition-colors duration-300">{link.value}</p>
                </div>
              </div>
              <span className="font-mono text-black/20 group-hover:text-violet/50 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300 shrink-0">
                ↗
              </span>
            </motion.a>
          ))}
        </div>

        {/* CTA button — lime fill that wipes on hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: E, delay: 0.35 }}
        >
          <a
            href={t.contact.linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.contact.cta} — LinkedIn de Felipe Cavalieri, abre em nova aba`}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-violet group-hover:scale-x-0 transition-transform duration-400 origin-right" />
            <div className="absolute inset-0 border border-violet group-hover:scale-x-100 scale-x-0 transition-transform duration-400 origin-left" />
            <span className="relative font-mono text-[10px] font-bold text-black group-hover:text-violet transition-colors duration-400 tracking-[0.15em] uppercase">
              {t.contact.cta}
            </span>
            <motion.span
              className="relative font-mono text-black/70 group-hover:text-violet transition-colors duration-400 text-sm"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ↗
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
