"use client";

import { ReactNode } from "react";

interface GradientGlassButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * GradientGlassButton — botão de vidro estilo Datacrazy (.second-button).
 * Borda gradiente recortada via mask-composite que acende no hover + texto vira gradiente.
 * Receita 15 do skill award-winning-animations. CSS em globals.css (.glass-grad-btn).
 */
export function GradientGlassButton({ children, href, onClick, className = "" }: GradientGlassButtonProps) {
  if (href) {
    return (
      <a href={href} onClick={onClick} className={`glass-grad-btn ${className}`}>
        <span className="text">{children}</span>
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`glass-grad-btn ${className}`}>
      <span className="text">{children}</span>
    </button>
  );
}
