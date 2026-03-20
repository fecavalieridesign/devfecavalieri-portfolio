"use client";

// KPRverse-inspired loader
// Progress bar with file enumeration — matches KPRverse's preloader aesthetic

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const E = [0.165, 0.84, 0.44, 1] as const;

const FILE_NAMES = [
  "index.tsx",
  "hero.module.css",
  "syne-800.woff2",
  "space-mono.woff2",
  "work.data.json",
  "contact.config.ts",
];

export default function Loader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [fileIdx, setFileIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          clearInterval(t);
          setTimeout(() => setDone(true), 600);
          return 100;
        }
        const step = p < 70 ? Math.random() * 18 + 8 : Math.random() * 5 + 2;
        return Math.min(p + step, 100);
      });
    }, 75);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setFileIdx((i) => Math.min(i + 1, FILE_NAMES.length - 1));
    }, 160);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
          transition={{ duration: 0.9, ease: E }}
          className="fixed inset-0 z-[9997] bg-black flex flex-col items-center justify-center gap-8"
        >
          {/* FC mark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: E }}
          >
            <span
              className="font-display font-extrabold uppercase text-white/10 select-none"
              style={{ fontSize: "clamp(4rem, 12vw, 9rem)", letterSpacing: "-0.04em" }}
            >
              FC
            </span>
          </motion.div>

          {/* Progress track */}
          <div className="flex flex-col items-center gap-3 w-56">
            <div className="w-full h-px bg-white/[0.06] relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-violet"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: pct / 100 }}
                style={{ originX: 0 }}
                transition={{ ease: "linear", duration: 0.08 }}
              />
            </div>

            {/* File name + percentage */}
            <div className="flex items-center justify-between w-full">
              <span className="font-mono text-[8px] text-white/20 tracking-widest truncate max-w-[70%]">
                {FILE_NAMES[fileIdx]}
              </span>
              <span className="font-mono text-[10px] text-violet/60 tabular-nums tracking-[0.1em]">
                {String(Math.round(pct)).padStart(3, "0")}%
              </span>
            </div>
          </div>

          {/* Status */}
          <span className="font-mono text-[8px] text-white/10 tracking-[0.3em] uppercase">
            activate console for access...
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
