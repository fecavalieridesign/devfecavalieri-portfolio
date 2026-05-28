"use client";

import { motion } from "framer-motion";

interface CharRevealProps {
  text: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

// Char Reveal — Referência: String Tune, Abstract Intelligence
// Caractere por caractere com stagger
export default function CharReveal({ 
  text, 
  stagger = 0.04,
  duration = 0.4,
  delay = 0,
  className = ""
}: CharRevealProps) {
  const chars = text.split("");

  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            delay: delay + i * stagger,
            duration,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
