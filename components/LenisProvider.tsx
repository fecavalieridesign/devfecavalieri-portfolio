"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Lenis v1.3+ usa scroll nativo do window por padrão —
    // NÃO seta overflow:hidden no <html> como versões antigas faziam.
    // smoothWheel: smooth no desktop, touch no mobile é nativo (smoothTouch: false).
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      // touch: não precisa configurar — Lenis v1.3 usa scroll nativo no mobile
    });

    // Só previne overflow horizontal — nunca setar overflowY:clip no mobile
    // pois bloqueia scroll touch completamente.
    document.documentElement.style.overflowX = "clip";

    // Expose scroll velocity as CSS variable — used for velocity skew
    lenis.on("scroll", ({ velocity }: { velocity: number }) => {
      const v = Math.max(-14, Math.min(14, velocity));
      document.documentElement.style.setProperty("--lenis-velocity", String(v));
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      document.documentElement.style.removeProperty("overflow-x");
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
