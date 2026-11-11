"use client";

import { useEffect, useRef } from "react";

/** Canvas fixo do monitor CRT. */
export default function Stage() {
  const canvas = useRef<HTMLCanvasElement>(null);

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
      }
    });

    return () => {
      dead = true;
      dispose();
    };
  }, []);

  return <canvas ref={canvas} className="stage" aria-hidden="true" />;
}
