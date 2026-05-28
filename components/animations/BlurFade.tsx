"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const E = [0.165, 0.84, 0.44, 1] as const;

interface BlurFadeProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function BlurFade({ children, delay = 0, duration = 0.8, className = "" }: BlurFadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
      whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration, ease: E }}
    >
      {children}
    </motion.div>
  );
}
