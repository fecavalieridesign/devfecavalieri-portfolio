"use client";

import { useEffect, useRef } from "react";
import { bus } from "@/lib/v4/bus";

/** Canvas fixo do CRT + HUD com números medidos de verdade. */
export default function Stage() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const hud = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dispose = () => {};
    let dead = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("./crt/stage").then(({ createStage }) => {
      if (dead || !canvas.current) return;
      try {
        dispose = createStage(canvas.current, reduced).dispose;
      } catch (err) {
        // sem WebGL o site continua inteiro, só sem o monitor
        console.warn("CRT indisponível:", err);
        canvas.current.style.display = "none";
        if (hud.current) hud.current.style.display = "none";
      }
    });

    const el = hud.current!;
    const q = (k: string) => el.querySelector<HTMLElement>(`[data-k="${k}"]`)!;
    const paint = () => {
      const s = bus.stats.get();
      const c = bus.channel.get();
      q("fps").textContent = String(s.fps);
      q("draw").textContent = String(s.calls);
      q("tri").textContent = s.tris >= 1000 ? `${(s.tris / 1000).toFixed(1)}k` : String(s.tris);
      q("dpr").textContent = s.dpr.toFixed(2);
      q("ch").textContent = c === -1 ? "boot" : c === -2 ? "00" : String(c + 1).padStart(2, "0");
    };
    const offStats = bus.stats.on(paint);
    const offCh = bus.channel.on(paint);

    return () => {
      dead = true;
      offStats();
      offCh();
      dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="stage" aria-hidden="true" />
      <div ref={hud} className="hud" aria-hidden="true">
        <span>
          FPS <b data-k="fps">0</b>
        </span>
        <span className="wide">
          DRAW <b data-k="draw">0</b>
        </span>
        <span className="wide">
          TRI <b data-k="tri">0</b>
        </span>
        <span className="wide">
          DPR <b data-k="dpr">1.00</b>
        </span>
        <span>
          CH <b data-k="ch">boot</b>
        </span>
      </div>
    </>
  );
}
