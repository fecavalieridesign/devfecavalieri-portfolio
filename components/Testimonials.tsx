"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { E } from "@/lib/easing";
import SectionLabel from "@/components/ui/SectionLabel";
import { Marquee } from "@/components/ui/marquee";

// Simple deterministic initials-avatar in a violet circle.
function InitialAvatar({ name }: { name: string }) {
  const parts = name.replace(/^(Dra?|Sr|Sra)\.\s+/i, "").split(" ");
  const initials = (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
  return (
    <div
      aria-hidden
      className="size-9 rounded-full flex items-center justify-center font-mono text-[11px] font-semibold text-violet shrink-0"
      style={{ background: "rgba(168,85,247,0.18)", border: "1px solid rgba(168,85,247,0.35)" }}
    >
      {initials.toUpperCase()}
    </div>
  );
}

const testimonials = [
  {
    name: "Dra. Yasmin Almeida",
    username: "@yasmin.derm",
    body: "Felipe entregou o site da clínica em tempo recorde. A identidade visual ficou perfeita e os pacientes adoraram o resultado.",
    role: "Médica · Dermatologista",
  },
  {
    name: "Victoria Belli",
    username: "@victoriabelli",
    body: "Trabalhar com o Felipe foi muito tranquilo. Ele entendeu o que eu queria logo de cara e o resultado superou minhas expectativas.",
    role: "Fundadora · Victoria Belli",
  },
  {
    name: "Ana Luíza",
    username: "@analuiza",
    body: "O e-commerce ficou incrível. Minhas vendas aumentaram bastante depois do lançamento. Super recomendo!",
    role: "Empreendedora",
  },
  {
    name: "Rafael Mendes",
    username: "@rafaelmendes",
    body: "Profissional muito competente, cumpriu todos os prazos e ainda sugeriu melhorias que nem tinham passado pela minha cabeça.",
    role: "CEO · AgênciaRM",
  },
  {
    name: "Camila Torres",
    username: "@camilatorres",
    body: "O linkbio que ele criou pra mim é simplesmente lindo. Meus seguidores sempre perguntam onde fiz.",
    role: "Criadora de Conteúdo",
  },
  {
    name: "Bruno Carvalho",
    username: "@brunocarvalho",
    body: "Comunicação excelente do início ao fim. Felipe explica tudo de forma clara e entrega com qualidade.",
    role: "Diretor · StartupBC",
  },
  {
    name: "Júlia Fonseca",
    username: "@juliafoto",
    body: "Nunca tinha visto um site tão rápido e bonito ao mesmo tempo. Felipe sabe exatamente o que está fazendo.",
    role: "Fotógrafa",
  },
  {
    name: "Dr. Pedro Saraiva",
    username: "@pedropsi",
    body: "Contratei para refazer o portfólio e ficou além do que eu esperava. Agendamentos aumentaram em 40%.",
    role: "Psicólogo Clínico",
  },
  {
    name: "Mariana Costa",
    username: "@maricosta",
    body: "Atendimento rápido, preço justo e trabalho impecável. É o tipo de profissional que você quer no seu time.",
    role: "Gerente de Marketing",
  },
];

type Testimonial = (typeof testimonials)[number];

// Card with a cursor-following violet border glow (Aceternity glowing-effect technique).
function GlowCard({ name, username, body, role }: Testimonial) {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <figure ref={ref} onMouseMove={onMouseMove} className="glow-card w-[340px] sm:w-[380px]">
      <div className="glow-card__inner">
        <div className="flex items-center gap-3">
          <InitialAvatar name={name} />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-white leading-tight">{name}</figcaption>
            <p className="text-[11px] font-mono text-white/40">{username}</p>
          </div>
        </div>
        <blockquote className="mt-4 text-sm text-white/65 leading-relaxed">{body}</blockquote>
        <p className="mt-4 text-[10px] font-mono text-violet/55 tracking-[0.1em] uppercase">{role}</p>
      </div>
    </figure>
  );
}

const rowA = testimonials.slice(0, 5);
const rowB = testimonials.slice(4); // overlap 1 so both rows feel full

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-24 md:py-36 overflow-hidden border-t border-white/[0.05]"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        <SectionLabel label="[006_CLIENTS]" />

        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          whileInView={{ clipPath: "inset(0% 0 0 0)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: E }}
          className="mb-14 md:mb-16"
        >
          <h2
            className="font-display font-extrabold uppercase text-white leading-[0.88]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", letterSpacing: "-0.04em" }}
          >
            O que dizem
          </h2>
          <h2
            className="font-display font-extrabold uppercase leading-[0.88]"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              letterSpacing: "-0.04em",
              WebkitTextStroke: "1.5px #a855f7",
              color: "transparent",
            }}
          >
            os clientes
          </h2>
        </motion.div>
      </div>

      {/* Horizontal infinite marquee — 2 rows, opposite directions, full-bleed */}
      <div
        className="relative flex flex-col gap-5"
        style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
      >
        <Marquee pauseOnHover className="[--duration:55s] [--gap:1.25rem]">
          {rowA.map((t) => (
            <GlowCard key={`a-${t.username}`} {...t} />
          ))}
        </Marquee>
        <Marquee pauseOnHover reverse className="[--duration:62s] [--gap:1.25rem]">
          {rowB.map((t) => (
            <GlowCard key={`b-${t.username}`} {...t} />
          ))}
        </Marquee>

        {/* Edge fade overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[12%] sm:w-[15%] bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[12%] sm:w-[15%] bg-gradient-to-l from-black to-transparent z-10" />
      </div>
    </section>
  );
}
