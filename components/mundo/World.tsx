"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SmoothScroll from "@/components/v4/SmoothScroll";
import { contact, services } from "@/lib/v4/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Scene = {
  id: string;
  label: string;
  img: string;
  alt: string;
  /** ponto da imagem para onde a câmera mergulha (% da largura, % da altura) */
  focus: [number, number];
  eyebrow: string;
  title: ReactNode;
  body?: string;
  tags?: string[];
  cta?: ReactNode;
};

const SCENES: Scene[] = [
  {
    id: "mesa",
    label: "Estúdio",
    img: "/mundo/mesa.webp",
    alt: "Miniatura de argila: mesa de trabalho com um monitor antigo, teclado, luminária e xícara de café.",
    focus: [51, 19],
    eyebrow: "Felipe Cavalieri · Sorocaba, SP",
    title: (
      <>
        Sites, sistemas e agentes de IA, <em>do rascunho ao deploy.</em>
      </>
    ),
    body: "Construo o site, o sistema por trás dele e a automação que tira trabalho repetitivo da sua equipe.",
  },
  {
    id: "sites",
    label: "Sites",
    img: "/mundo/sites.webp",
    alt: "Miniatura de argila: lojinha com toldo listrado e uma página de site na vitrine.",
    focus: [42, 42],
    eyebrow: `${services[0].n} · O que faço`,
    title: services[0].title,
    body: services[0].desc,
    tags: services[0].items,
  },
  {
    id: "sistemas",
    label: "Sistemas",
    img: "/mundo/sistemas.webp",
    alt: "Miniatura de argila: sala de máquinas com servidores, engrenagens, painel de controle e banco de dados.",
    focus: [52, 26],
    eyebrow: `${services[1].n} · O que faço`,
    title: services[1].title,
    body: services[1].desc,
    tags: services[1].items,
  },
  {
    id: "agentes",
    label: "Agentes de IA",
    img: "/mundo/agentes.webp",
    alt: "Miniatura de argila: dois robôs com fone de ouvido atendendo num balcão, com balões de conversa em volta.",
    focus: [50, 48],
    eyebrow: `${services[2].n} · O que faço`,
    title: services[2].title,
    body: services[2].desc,
    tags: services[2].items,
  },
  {
    id: "contato",
    label: "Contato",
    img: "/mundo/contato.webp",
    alt: "Miniatura de argila: caixa de correio com envelopes e um avião de papel saindo dela.",
    focus: [42, 36],
    eyebrow: "Contato",
    title: (
      <>
        Tem um projeto? <em>Me chama.</em>
      </>
    ),
    cta: (
      <div className="cta-row">
        <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
          Chamar no WhatsApp <span className="arr">↗</span>
        </a>
        <a href="/#trabalhos" className="btn btn-line">
          Ver trabalhos <span className="arr">↗</span>
        </a>
      </div>
    ),
  },
];

const N = SCENES.length;
/** metade do trecho em que a cena fica parada no centro (em unidades de cena) */
const HOLD = 0.2;
const ENTER = 0.55;
const EXIT = 0.7;
const DUST = 12;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function World() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const figs = gsap.utils.toArray<HTMLElement>(".mw-fig", el);
        const copies = gsap.utils.toArray<HTMLElement>(".mw-copy", el);
        const dots = gsap.utils.toArray<HTMLElement>(".mw-rail a", el);
        const dust = gsap.utils.toArray<HTMLElement>(".mw-dust i", el);
        const hint = el.querySelector<HTMLElement>(".mw-hint");
        const state = { g: 0 };
        let active = -1;

        const render = () => {
          const g = state.g;
          for (let i = 0; i < N; i++) {
            const d = g - i;
            const fig = figs[i];
            const copy = copies[i];
            let scale = 1;
            let op = 0;
            let blur = 0;

            if (d > -ENTER && d < -HOLD) {
              // chegando de longe
              const y = (d + ENTER) / (ENTER - HOLD);
              const e = 1 - Math.pow(1 - y, 3);
              scale = 0.3 + (1 - 0.06 - 0.3) * e;
              op = clamp01(y * 2.2);
              blur = (1 - y) * 10;
            } else if (d >= -HOLD && d <= HOLD) {
              // parada no centro, com leve avanço para não congelar
              scale = 1 + 0.06 * (d / HOLD);
              op = 1;
            } else if (d > HOLD && d < EXIT) {
              // mergulho para dentro da cena
              const x = (d - HOLD) / (EXIT - HOLD);
              scale = 1.06 * Math.pow(3.6, Math.pow(x, 1.35));
              op = 1 - clamp01((x - 0.4) / 0.6);
              blur = x * x * 12;
            }

            fig.style.opacity = op.toFixed(3);
            fig.style.visibility = op > 0.001 ? "visible" : "hidden";
            fig.style.transform = `scale(${scale.toFixed(4)})`;
            fig.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";

            const cop = clamp01((HOLD + 0.12 - Math.abs(d)) / 0.12);
            copy.style.opacity = cop.toFixed(3);
            copy.style.visibility = cop > 0.001 ? "visible" : "hidden";
            copy.style.transform = `translate3d(0, ${(-d * 46).toFixed(1)}px, 0)`;
            copy.style.pointerEvents = cop > 0.6 ? "auto" : "none";
          }

          // poeira: fragmentos que passam pela câmera, em laço, no ritmo do scroll
          for (let k = 0; k < dust.length; k++) {
            const p = (((g * 0.85 + k / dust.length) % 1) + 1) % 1;
            const s = 0.25 * Math.pow(9, p);
            const a = (k * 137.5 * Math.PI) / 180;
            const r = 6 + 46 * p * p;
            const speck = dust[k];
            speck.style.transform = `translate3d(${(Math.cos(a) * r).toFixed(2)}vw, ${(Math.sin(a) * r * 0.62).toFixed(2)}vw, 0) scale(${s.toFixed(3)}) rotate(${(k * 47 + p * 90).toFixed(0)}deg)`;
            speck.style.opacity = (Math.sin(Math.PI * p) * 0.55).toFixed(3);
          }

          const now = Math.round(g);
          if (now !== active) {
            active = now;
            dots.forEach((dot, i) => {
              if (i === now) dot.setAttribute("aria-current", "true");
              else dot.removeAttribute("aria-current");
            });
          }
          if (hint) hint.style.opacity = clamp01(1 - g * 6).toFixed(3);
        };

        render();
        const tween = gsap.to(state, {
          g: N - 1,
          ease: "none",
          onUpdate: render,
          scrollTrigger: {
            trigger: ".mw-track",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });

        // leve paralaxe com o ponteiro (só onde há mouse)
        const fine = window.matchMedia("(pointer: fine)").matches;
        const onMove = (e: PointerEvent) => {
          el.style.setProperty("--mx", (e.clientX / window.innerWidth - 0.5).toFixed(3));
          el.style.setProperty("--my", (e.clientY / window.innerHeight - 0.5).toFixed(3));
        };
        if (fine) window.addEventListener("pointermove", onMove, { passive: true });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          if (fine) window.removeEventListener("pointermove", onMove);
        };
      });
    },
    { scope: root },
  );

  return (
    <div className="mw" ref={root}>
      <SmoothScroll />

      <a href="#main-content" className="skip">
        Pular para o conteúdo
      </a>

      <header className="nav">
        <a href="/" className="nav-name" aria-label="Felipe Cavalieri, voltar ao site">
          Felipe Cavalieri
        </a>
        <nav className="nav-links" aria-label="Principal">
          <a href="/">Site completo</a>
          <a href="#contato" className="nav-cta">
            Contato
          </a>
        </nav>
      </header>

      <main id="main-content" className="mw-track" style={{ ["--n" as string]: N }}>
        {SCENES.map((s, i) => (
          <span
            key={s.id}
            id={s.id}
            className="mw-anchor"
            style={{ ["--i" as string]: i }}
            aria-hidden="true"
          />
        ))}

        <div className="mw-stage">
          <div className="mw-dust" aria-hidden="true">
            {Array.from({ length: DUST }, (_, k) => (
              <i key={k} data-k={k % 3} />
            ))}
          </div>

          {SCENES.map((s, i) => (
            <section className="mw-sec" key={s.id} aria-labelledby={`mw-t-${s.id}`} style={{ zIndex: N - i }}>
              <div className="mw-fig" style={{ transformOrigin: `${s.focus[0]}% ${s.focus[1]}%` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.alt}
                  width={1536}
                  height={1024}
                  decoding="async"
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
              </div>
              <div className="mw-copy">
                <p className="mono">{s.eyebrow}</p>
                {i === 0 ? (
                  <h1 id={`mw-t-${s.id}`} className="mw-title">
                    {s.title}
                  </h1>
                ) : (
                  <h2 id={`mw-t-${s.id}`} className="mw-title">
                    {s.title}
                  </h2>
                )}
                {s.body && <p className="mw-body">{s.body}</p>}
                {s.tags && (
                  <ul className="tags">
                    {s.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
                {s.cta}
              </div>
            </section>
          ))}

          <nav className="mw-rail" aria-label="Cenas">
            {SCENES.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} aria-current={i === 0 ? "true" : undefined}>
                <span>{s.label}</span>
              </a>
            ))}
          </nav>

          <p className="mono mw-hint" aria-hidden="true">
            Role para atravessar ↓
          </p>
        </div>
      </main>
    </div>
  );
}
