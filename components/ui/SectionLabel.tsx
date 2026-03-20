"use client";

import { motion } from "framer-motion";
import { E } from "@/lib/easing";

interface SectionLabelProps {
  label: string;
  dividerColor?: string;
  className?: string;
}

export default function SectionLabel({ label, dividerColor = "bg-white/[0.04]", className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-5 mb-16 md:mb-20 ${className}`}>
      <div className="overflow-hidden">
        <motion.span
          initial={{ y: "101%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: E }}
          className="block font-mono text-[8px] text-violet/40 tracking-[0.25em] uppercase"
        >
          {label}
        </motion.span>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: E, delay: 0.1 }}
        style={{ transformOrigin: "left" }}
        className={`flex-1 h-px ${dividerColor}`}
      />
    </div>
  );
}
