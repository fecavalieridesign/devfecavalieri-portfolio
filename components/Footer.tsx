"use client";

// Footer — KPRverse minimal monospace

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="md:ml-[60px] border-t border-white/[0.06] py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <span className="blink-dot text-violet" />
          <span className="font-mono text-[8px] text-white/20 tracking-[0.25em] uppercase">
            {lang === "pt" ? "DISPONÍVEL" : "AVAILABLE"}
          </span>
        </div>

        <p className="font-mono text-[8px] text-white/10 tracking-[0.2em] uppercase">
          © {year} FELIPE_CAVALIERI
        </p>

        <div className="flex items-center gap-6">
          {[
            { href: "https://github.com/fecavalieridesign", label: "GITHUB", ariaLabel: "GitHub de Felipe Cavalieri — abre em nova aba" },
            { href: "https://www.linkedin.com/in/felipe-cavalieri-241092251", label: "LINKEDIN", ariaLabel: "LinkedIn de Felipe Cavalieri — abre em nova aba" },
          ].map(({ href, label, ariaLabel }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              whileHover={{ color: "#a855f7" }}
              className="font-mono text-[8px] text-white/20 tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
            >
              {label} ↗
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
}
