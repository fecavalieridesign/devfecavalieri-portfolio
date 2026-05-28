"use client";

import { motion } from "framer-motion";
import { E } from "@/lib/easing";
import SectionLabel from "@/components/ui/SectionLabel";
import { Marquee } from "@/components/ui/marquee";
import { Card, CardContent } from "@/components/ui/card";

// Simple deterministic initials-avatar in a violet circle.
// Replaces the previous pravatar.cc fake AI faces (ethically dishonest +
// 9 external preloads tanking LCP).
function InitialAvatar({ name }: { name: string }) {
  const parts = name.replace(/^(Dra?|Sr|Sra)\.\s+/i, "").split(" ");
  const initials = (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
  return (
    <div
      aria-hidden
      className="size-8 rounded-full flex items-center justify-center font-mono text-[10px] font-semibold text-violet shrink-0"
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

function TestimonialCard({ name, username, body, role }: (typeof testimonials)[number]) {
  return (
    <Card className="w-64">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5">
          <InitialAvatar name={name} />
          <div className="flex flex-col">
            <figcaption className="text-xs font-medium text-white leading-tight">{name}</figcaption>
            <p className="text-[10px] font-mono text-white/40">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-xs text-white/60 leading-relaxed">{body}</blockquote>
        <p className="mt-2 text-[9px] font-mono text-violet/50 tracking-[0.08em]">{role}</p>
      </CardContent>
    </Card>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-24 md:py-36 overflow-hidden border-t border-white/[0.05]"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
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

      {/* 3D Marquee container — viewport-width full bleed */}
      <div
        className="relative overflow-hidden flex flex-row items-center justify-center gap-1.5"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          height: "min(82vh, 800px)",
          perspective: "700px",
        }}
      >
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              "translateX(-80px) translateY(0px) translateZ(-60px) rotateX(16deg) rotateY(-6deg) rotateZ(16deg)",
          }}
        >
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:38s]">
            {testimonials.map((t) => (
              <TestimonialCard key={t.username} {...t} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:45s]">
            {testimonials.map((t) => (
              <TestimonialCard key={t.username} {...t} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:32s]">
            {testimonials.map((t) => (
              <TestimonialCard key={t.username} {...t} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:50s]">
            {testimonials.map((t) => (
              <TestimonialCard key={t.username} {...t} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:42s] hidden lg:flex">
            {testimonials.map((t) => (
              <TestimonialCard key={t.username} {...t} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:55s] hidden xl:flex">
            {testimonials.map((t) => (
              <TestimonialCard key={t.username} {...t} />
            ))}
          </Marquee>

          {/* Gradient overlays */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-black" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-black" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-black" />
        </div>
      </div>
    </section>
  );
}
