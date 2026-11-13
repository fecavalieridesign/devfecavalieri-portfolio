"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Cabinet, Exploded, Relay } from "@lucasmarkes/hairline/react";
import SmoothScroll from "./SmoothScroll";
import { bus, type PoseName } from "@/lib/v4/bus";
import { contact, manifesto, projects, services, stack } from "@/lib/v4/content";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Stage = dynamic(() => import("./Stage"), { ssr: false });

const FIGURES = { exploded: Exploded, cabinet: Cabinet, relay: Relay };

const pad = (n: number) => String(n).padStart(2, "0");

export default function Site() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── sempre: a seção visível decide a pose do monitor e o canal ──
      gsap.utils.toArray<HTMLElement>("[data-stage]").forEach((el) => {
        const name = el.dataset.stage as PoseName;
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle(self) {
            if (!self.isActive) return;
            bus.pose.set(name);
            if (name === "contact") bus.channel.set(-2);
            else if (name !== "work" && name !== "off") bus.channel.set(-1);
          },
        });
      });

      const items = gsap.utils.toArray<HTMLElement>(".work-item");
      items.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 58%",
          end: "bottom 58%",
          onToggle(self) {
            el.classList.toggle("is-active", self.isActive);
            if (self.isActive) bus.channel.set(i);
          },
        });
      });

      // dica dos botões some assim que o scroll começa (no mobile ela fica abaixo
      // do monitor, então só some depois de ter passado pela tela)
      const hint = document.querySelector<HTMLElement>(".hero-hint");
      const mm = gsap.matchMedia();
      if (hint) {
        const gone = (self: ScrollTrigger) => hint.classList.toggle("is-gone", self.isActive);
        mm.add("(min-width: 900px)", () => {
          ScrollTrigger.create({ start: 24, end: "max", onToggle: gone });
        });
        mm.add("(max-width: 899px)", () => {
          ScrollTrigger.create({ trigger: hint, start: "top 30%", end: "max", onToggle: gone });
        });
      }

      // ── só com movimento permitido ──
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // entrada do hero
        gsap.set(".hero-title", { opacity: 1, animation: "none" });
        SplitText.create(".hero-title", {
          type: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 60,
              opacity: 0,
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.09,
              delay: 0.15,
            }),
        });
        gsap.fromTo(
          ".hero-in:not(.hero-title)",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.55 },
        );

        // texto pintado pelo scroll: uma tween só, ease none
        const split = SplitText.create(".para", { type: "words", wordsClass: "w" });
        gsap.fromTo(
          split.words,
          { color: "#c6c1b8" },
          {
            color: "#17171a",
            stagger: 0.3,
            ease: "none",
            scrollTrigger: { trigger: ".para", start: "top 80%", end: "bottom 55%", scrub: 0.4 },
          },
        );

        // reveal compartilhado
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 28,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // marquee: anda sozinho e acelera com a velocidade do scroll
        const loop = gsap.to(".marquee-track", { xPercent: -50, duration: 36, ease: "none", repeat: -1 });
        let speed = 1;
        const tick = () => {
          const want = 1 + Math.min(Math.abs(bus.velocity) / 6, 5);
          speed += (want - speed) * 0.08;
          loop.timeScale(speed);
        };
        gsap.ticker.add(tick);

        // contadores: o HTML já traz o valor final, a animação só sobe até ele
        gsap.utils.toArray<HTMLElement>(".stat b").forEach((el) => {
          const end = Number(el.dataset.n);
          const suffix = el.dataset.s ?? "";
          const v = { n: 0 };
          gsap.to(v, {
            n: end,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onStart: () => {
              el.textContent = `0${suffix}`;
            },
            onUpdate: () => {
              el.textContent = `${Math.round(v.n)}${suffix}`;
            },
          });
        });

        return () => {
          gsap.ticker.remove(tick);
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <SmoothScroll />
      <Stage />

      <a href="#main-content" className="skip">
        Pular para o conteúdo
      </a>

      <header className="nav">
        <a href="#top" className="nav-name" aria-label="Felipe Cavalieri, início">
          Felipe Cavalieri
        </a>
        <nav className="nav-links" aria-label="Principal">
          <a href="#trabalhos">Trabalhos</a>
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato" className="nav-cta">
            Contato
          </a>
        </nav>
      </header>

      <main id="main-content">
        {/* ── hero ── */}
        <section className="hero" id="top" data-stage="hero">
          <div>
            <div className="hero-meta hero-in">
              <span className="mono live">Disponível para projetos</span>
              <span className="mono">Sorocaba, SP · Brasil</span>
            </div>
            <h1 className="hero-title hero-in">
              Sites, sistemas
              <br />e agentes de IA, <em>do rascunho ao deploy.</em>
            </h1>
          </div>
          <div className="hero-foot hero-in">
            <p>
              Sou Felipe Cavalieri, desenvolvedor web. Construo o site, o sistema por trás dele e a automação que tira
              trabalho repetitivo da sua equipe.
            </p>
            <div className="cta-row">
              <a href="#trabalhos" className="btn btn-ink">
                Ver trabalhos <span className="arr">↘</span>
              </a>
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                Chamar no WhatsApp <span className="arr">↗</span>
              </a>
            </div>
          </div>
          <div className="crt-slot" data-crt-slot="hero" aria-hidden="true" />
          <p className="mono hero-hint hero-in">Botão CH troca o canal · botão direito liga e desliga</p>
        </section>

        {/* ── manifesto ── */}
        <section className="manifesto" data-stage="aside">
          <p className="mono label">Como trabalho</p>
          <p className="para">{manifesto}</p>
        </section>

        {/* ── trabalhos ── */}
        <section className="work" id="trabalhos" data-stage="work">
          <div className="work-grid">
            <div className="work-col">
              <p className="mono label">Trabalhos selecionados</p>
              <div className="sec-head">
                <h2 className="sec-title" data-reveal>
                  Feito e <em>no ar.</em>
                </h2>
                <span className="mono">({pad(projects.length)})</span>
              </div>
              <ol>
                {projects.map((p, i) => (
                  <li className="work-item" key={p.id}>
                    <div className="shot" style={{ background: p.bg, color: p.fg }} aria-hidden="true">
                      <span>
                        CH {pad(i + 1)} · {p.kind}
                      </span>
                      <strong>{p.name}</strong>
                    </div>
                    <div className="meta">
                      <span className="mono">{pad(i + 1)}</span>
                      <span className="mono">{p.kind}</span>
                      <span className="mono">{p.year}</span>
                    </div>
                    <h3>{p.name}</h3>
                    <p className="sub">{p.title}</p>
                    <p className="desc">{p.desc}</p>
                    <ul className="tags">
                      {p.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                    {p.url ? (
                      <a className="work-link" href={p.url} target="_blank" rel="noopener noreferrer">
                        Abrir site <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="mono work-status">{p.status}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── bloco sólido: serviços, stack, sobre ── */}
        <div className="solid" data-stage="off">
          <section className="services" id="servicos">
            <p className="mono label">O que faço</p>
            <div className="sec-head">
              <h2 className="sec-title" data-reveal>
                Três frentes, <em>uma pessoa.</em>
              </h2>
            </div>
            {services.map((s) => {
              const Figure = FIGURES[s.figure];
              return (
                <article className="srv" key={s.n} data-reveal>
                  <span className="mono">{s.n}</span>
                  <h3>{s.title}</h3>
                  <div>
                    <p>{s.desc}</p>
                    <ul className="tags">
                      {s.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                  <Figure className="srv-fig" theme="light" play intensity={0.6} aria-label={`Ilustração interativa: ${s.title}`} />
                </article>
              );
            })}
          </section>

          <section className="marquee" aria-label="Tecnologias que uso">
            <div className="marquee-track">
              {[0, 1].map((k) =>
                stack.map((s) => (
                  <span key={`${k}-${s}`} aria-hidden={k === 1}>
                    {s}
                  </span>
                )),
              )}
            </div>
          </section>

          <section className="about" id="sobre">
            <div>
              <p className="mono label">Sobre</p>
              <h2 className="sec-title" data-reveal>
                Entender antes de <em>construir.</em>
              </h2>
              <p className="about-text" data-reveal>
                Trabalho com desenvolvimento web e soluções com IA a partir de Sorocaba, interior de São Paulo. Gosto de
                entender o problema antes de chegar na solução, para entregar algo que faça sentido para o negócio e que a
                equipe use de verdade no dia seguinte.
              </p>
            </div>
            <div className="stats">
              <div className="stat">
                <b data-n="4" data-s="+">
                  4+
                </b>
                <span className="mono">Anos construindo para a web</span>
              </div>
              <div className="stat">
                <b data-n="30" data-s="+">
                  30+
                </b>
                <span className="mono">Projetos entregues</span>
              </div>
            </div>
          </section>
        </div>

        {/* ── contato ── */}
        <section className="contact" id="contato" data-stage="contact">
          <p className="mono label">Contato</p>
          <h2 className="contact-title" data-reveal>
            Tem um projeto? <em>Me chama.</em>
          </h2>
          <ul className="links">
            <li>
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
                <span>WhatsApp</span>
                <span className="mono">{contact.whatsappLabel} ↗</span>
              </a>
            </li>
            <li>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                <span>LinkedIn</span>
                <span className="mono">felipe-cavalieri ↗</span>
              </a>
            </li>
            <li>
              <a href={contact.github} target="_blank" rel="noopener noreferrer">
                <span>GitHub</span>
                <span className="mono">fecavalieridesign ↗</span>
              </a>
            </li>
          </ul>
          <div className="crt-slot" data-crt-slot="contact" aria-hidden="true" />
        </section>
      </main>

      <footer className="foot">
        <span className="mono">© 2026 Felipe Cavalieri</span>
        <span className="mono">three.js · GSAP · Next.js</span>
        <a className="mono" href="#top">
          Voltar ao topo ↑
        </a>
      </footer>
    </div>
  );
}
