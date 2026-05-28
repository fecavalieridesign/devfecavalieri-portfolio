"use client";

import { useState } from "react";

interface MarqueeProps {
  items: string[];
  duration?: number;
  className?: string;
}

export function Marquee({ items, duration = 24, className = "" }: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            <span className="w-1 h-1 rounded-full bg-violet/35 inline-block mr-5" />
            {item}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
