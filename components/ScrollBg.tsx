"use client";

// ScrollBg — IntersectionObserver-based smooth background transition
// Updates html background-color as sections scroll into view
// Each section uses a data-bg attribute to declare its color

import { useEffect } from "react";

const SECTION_COLORS: Record<string, string> = {
  hero:       "#030308",
  statement:  "#030308",
  work:       "#000000",
  services:   "#04040c",
  about:      "#04040c",
  expertise:  "#000000",
  experience: "#04040c",
  contact:    "#000000",
};

export default function ScrollBg() {
  useEffect(() => {
    const root = document.documentElement;
    const observers: IntersectionObserver[] = [];

    Object.entries(SECTION_COLORS).forEach(([id, color]) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            root.style.backgroundColor = color;
          }
        },
        { threshold: 0.15, rootMargin: "-8% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return null;
}
