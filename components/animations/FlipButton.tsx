"use client";

import { ReactNode } from "react";

interface FlipButtonProps {
  /** Label visível em repouso */
  front: string;
  /** Label que entra no hover (flip 3D) */
  back: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * FlipButton — botão hero estilo Datacrazy.
 * Hover: texto gira em rotateX (flip 3D), shine atravessa, fill circular escuro expande do centro.
 * Receita 13 do skill award-winning-animations. CSS em globals.css (.flip-btn).
 */
export function FlipButton({ front, back, href, onClick, className = "" }: FlipButtonProps) {
  const inner = (
    <>
      <span className="flip-btn__fill" aria-hidden />
      <span className="flip-btn__shine" aria-hidden />
      <span className="flip-btn__text">
        {/* reserva largura: usa o maior label */}
        <span className="flip-btn__ghost" aria-hidden>
          {front.length >= back.length ? front : back}
        </span>
        <span className="flip-btn__front">{front}</span>
        <span className="flip-btn__back" aria-hidden>
          {back}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={`flip-btn ${className}`}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`flip-btn ${className}`}>
      {inner}
    </button>
  );
}

export type { FlipButtonProps };
