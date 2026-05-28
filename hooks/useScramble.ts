"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

export function useScramble(finalText: string, duration = 700) {
  const [displayText, setDisplayText] = useState(finalText);
  const rafRef = useRef<number | null>(null);

  // Sync when source text changes (e.g. language switch)
  useEffect(() => {
    setDisplayText(finalText);
  }, [finalText]);

  const scramble = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = Date.now();

    const frame = () => {
      const progress = Math.min(1, (Date.now() - start) / duration);
      setDisplayText(
        finalText
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (progress > i / finalText.length) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setDisplayText(finalText);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  }, [finalText, duration]);

  return { displayText, scramble };
}
