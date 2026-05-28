"use client";

import { motion } from "framer-motion";

const E = [0.165, 0.84, 0.44, 1] as const;

interface WordRevealProps {
  text: string;
  delay?: number;
  className?: string;
}

export function WordReveal({ text, delay = 0, className = "" }: WordRevealProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: delay + i * 0.08,
              duration: 0.6,
              ease: E,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
