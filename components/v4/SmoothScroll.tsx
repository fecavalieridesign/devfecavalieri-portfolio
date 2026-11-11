"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bus } from "@/lib/v4/bus";

gsap.registerPlugin(ScrollTrigger);

/** Lenis em modo janela (não cria container: sticky e fixed seguem funcionando). */
export default function SmoothScroll() {
  useEffect(() => {
    history.scrollRestoration = "manual";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: true });
    lenis.on("scroll", (l: Lenis) => {
      bus.velocity = l.velocity;
      ScrollTrigger.update();
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      bus.velocity = 0;
    };
  }, []);

  return null;
}
