"use client";

import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { useScramble } from "@/hooks/useScramble";

interface Props {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  /** Delay (ms) before auto-scramble fires on viewport entry */
  delay?: number;
}

/**
 * Renders text that scrambles on viewport entry and on hover.
 * Wraps the existing clip-path / LineReveal entrance — place inside those wrappers.
 */
export function AnimatedHeading({ text, className = "", style, delay = 300 }: Props) {
  const { displayText, scramble } = useScramble(text, 900);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(scramble, delay);
      return () => clearTimeout(t);
    }
  }, [isInView, scramble, delay]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ ...style, cursor: "default" }}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  );
}
