"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface PerspectiveScrollProps {
  children: ReactNode;
  /** rotateX inicial em graus (tombado). Default 28. */
  max?: number;
  className?: string;
}

/**
 * PerspectiveScroll — conteúdo começa tombado em rotateX e endireita conforme entra na viewport.
 * Estilo Datacrazy (.perspectiva), versão Framer Motion (sem GSAP).
 * Receita 14 do skill award-winning-animations.
 */
export function PerspectiveScroll({ children, max = 28, className = "" }: PerspectiveScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "center 0.65"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : max, 0]);

  return (
    <div ref={ref} className={className} style={{ perspective: 900 }}>
      <motion.div style={{ rotateX, transformOrigin: "center top", willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  );
}
