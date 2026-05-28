"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ImageRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

// Image Reveal — Referência: Boom & Bloom, Lucas Lamonier, Gabriel Veres
// Reveal com clip-path circle
export default function ImageReveal({ 
  children, 
  delay = 0, 
  duration = 0.8,
  className = ""
}: ImageRevealProps) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      whileInView={{ clipPath: "circle(100% at 50% 50%)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.165, 0.84, 0.44, 1] 
      }}
    >
      {children}
    </motion.div>
  );
}
