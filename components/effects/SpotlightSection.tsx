"use client";

import { useRef, useState } from "react";

/**
 * String Tune–style radial spotlight that follows the cursor.
 * Wrap any section with this for a subtle ambient glow effect.
 * Works on both dark (#000) and light (#e4e4f0) backgrounds.
 */
export function SpotlightSection({
  children,
  className = "",
  color = "168,85,247",
  intensity = 0.06,
  radius = 350,
}: {
  children: React.ReactNode;
  className?: string;
  /** RGB triplet e.g. "168,85,247" */
  color?: string;
  /** Max opacity of the spotlight (0–1) */
  intensity?: number;
  /** Spotlight radius in px */
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: "50%", y: "50%" });
  const [active, setActive] = useState(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setMouse({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` });
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        aria-hidden
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(circle ${radius}px at ${mouse.x} ${mouse.y}, rgba(${color},${intensity}) 0%, transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
