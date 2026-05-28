"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const E = [0.165, 0.84, 0.44, 1] as const;

interface LineRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function LineReveal({ children, delay = 0, className = "" }: LineRevealProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "110%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, delay, ease: E }}
      >
        {children}
      </motion.div>
    </div>
  );
}
