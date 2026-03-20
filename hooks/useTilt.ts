import { useRef, useState } from "react";

export function useTilt<T extends HTMLElement = HTMLDivElement>(intensity = 4) {
  const ref = useRef<T>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -intensity,
      y: ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  intensity,
    });
  };
  const onEnter = () => setHovered(true);
  const onLeave = () => { setTilt({ x: 0, y: 0 }); setHovered(false); };

  return { ref, tilt, hovered, onMove, onEnter, onLeave };
}
