/**
 * Ponte mínima entre o DOM (seções, scroll) e a cena three.js do CRT.
 * Sem React state: a cena lê e escreve aqui fora do ciclo de render.
 */

export type PoseName = "hero" | "aside" | "work" | "off" | "contact";

/** -1 = boot, 0..n-1 = projeto, -2 = contato */
export type Channel = number;

type Listener<T> = (v: T) => void;

function signal<T>(initial: T) {
  let value = initial;
  const subs = new Set<Listener<T>>();
  return {
    get: () => value,
    set(v: T) {
      if (v === value) return;
      value = v;
      subs.forEach((f) => f(v));
    },
    on(f: Listener<T>) {
      subs.add(f);
      return () => {
        subs.delete(f);
      };
    },
  };
}

export type Stats = { fps: number; calls: number; tris: number; dpr: number };

export const bus = {
  pose: signal<PoseName>("hero"),
  channel: signal<Channel>(-1),
  power: signal<boolean>(true),
  stats: signal<Stats>({ fps: 0, calls: 0, tris: 0, dpr: 1 }),
  /** velocidade do scroll (px/frame aprox.), escrita pelo Lenis */
  velocity: 0,
};
