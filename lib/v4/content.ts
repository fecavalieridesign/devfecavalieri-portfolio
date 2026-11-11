export type Project = {
  id: string;
  name: string;
  kind: "Cliente" | "Produto" | "Sistema interno";
  title: string;
  desc: string;
  stack: string[];
  year: string;
  url?: string;
  status?: string;
  /** cores da própria marca do projeto — usadas na tela do CRT */
  bg: string;
  fg: string;
};

export const projects: Project[] = [
  {
    id: "dra-yasmin",
    name: "Dra. Yasmin Soares",
    kind: "Cliente",
    title: "Site institucional para biomédica esteta",
    desc: "Do layout ao deploy: serviços, comparador de antes e depois arrastável, depoimentos em pilha e contato direto no WhatsApp.",
    stack: ["Next.js", "Tailwind", "Framer Motion", "Lenis"],
    year: "2026",
    url: "https://dra-yasmin.vercel.app",
    bg: "#0d261e",
    fg: "#eed8b7",
  },
  {
    id: "icon",
    name: "Icon Assessoria",
    kind: "Cliente",
    title: "Site de agência com hero em WebGL",
    desc: "Rebuild completo do site de uma assessoria de marketing: shader no hero, texto pintado pelo scroll e seções animadas com GSAP.",
    stack: ["Next.js", "three.js", "GSAP", "GLSL"],
    year: "2026",
    url: "https://icon-site.vercel.app",
    bg: "#101012",
    fg: "#f1efe9",
  },
  {
    id: "recepcia",
    name: "Recepcia",
    kind: "Produto",
    title: "Atendimento por WhatsApp para clínicas",
    desc: "Agente com IA que atende, agenda e lembra pacientes no WhatsApp, mais um painel multi-clínica para a equipe acompanhar cada conversa.",
    stack: ["Next.js", "Supabase", "Claude API", "Fly.io"],
    year: "2026",
    url: "https://recepcia-six.vercel.app",
    bg: "#08090a",
    fg: "#f7f8f8",
  },
  {
    id: "mardone",
    name: "Mardone Paz",
    kind: "Cliente",
    title: "Link-in-bio e funil conversacional",
    desc: "Página de links para um palestrante de vendas, com funil em formato de chat que qualifica o contato antes de abrir o WhatsApp.",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
    year: "2026",
    url: "https://mardonepaz-linkbio.vercel.app",
    bg: "#0d1f3c",
    fg: "#e3c26b",
  },
  {
    id: "habitat",
    name: "Habitat",
    kind: "Produto",
    title: "PWA de hábitos e tarefas gamificado",
    desc: "Instala pela tela de início do iPhone. Hábitos, tarefas, treino guiado por séries e sequência de dias, com versão para desktop e tablet.",
    stack: ["Next.js", "Supabase", "PWA"],
    year: "2026",
    url: "https://habitat.devfecavalieri.tech",
    bg: "#f0ebe1",
    fg: "#1b1b1f",
  },
  {
    id: "financas",
    name: "Finanças Família",
    kind: "Produto",
    title: "Controle financeiro com contas isoladas",
    desc: "Cada pessoa da família enxerga só os próprios dados. Importação de extrato, parcelamentos e gráficos por categoria.",
    stack: ["Next.js", "Supabase", "RLS", "Recharts"],
    year: "2026",
    status: "Uso privado",
    bg: "#0a0b0d",
    fg: "#34d399",
  },
  {
    id: "cal-link",
    name: "cal-link",
    kind: "Produto",
    title: "Um link, o calendário certo",
    desc: "Link único de adicionar ao calendário: no iPhone baixa o .ics com lembretes, no Android abre o Google Calendar.",
    stack: ["HTML", "JavaScript"],
    year: "2026",
    bg: "#f5f5f7",
    fg: "#e0362c",
  },
  {
    id: "sped",
    name: "SPED Generator",
    kind: "Produto",
    title: "Gerador de SPED de crédito acumulado",
    desc: "Lê os XMLs de NF-e no navegador e monta o arquivo fiscal no leiaute exigido pela SEFAZ-SP. Sem backend, nada sai da máquina.",
    stack: ["JavaScript", "Cloudflare Pages"],
    year: "2026",
    status: "Ferramenta interna",
    bg: "#0b3a82",
    fg: "#ffffff",
  },
  {
    id: "3c360",
    name: "3C 360",
    kind: "Sistema interno",
    title: "Sistema de gestão de um escritório contábil",
    desc: "Tarefas e obrigações com checklist, CRM, financeiro e relatórios de horas, usado todo dia pela equipe inteira.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "Docker"],
    year: "2026",
    status: "Em produção · acesso restrito",
    bg: "#14171c",
    fg: "#e8e5df",
  },
];

export const services: { n: string; figure: "exploded" | "cabinet" | "relay"; title: string; desc: string; items: string[] }[] = [
  {
    n: "01",
    figure: "exploded",
    title: "Sites e landing pages",
    desc: "Site rápido, responsivo e com movimento na medida. Do layout ao deploy, com SEO e métricas de verdade.",
    items: ["Institucional", "Landing page", "Link-in-bio", "WebGL e animação"],
  },
  {
    n: "02",
    figure: "cabinet",
    title: "Sistemas e web apps",
    desc: "Painéis, CRMs e ferramentas internas feitas para o jeito que a sua equipe trabalha, com banco de dados e login.",
    items: ["Painel administrativo", "PWA", "Integrações", "Relatórios"],
  },
  {
    n: "03",
    figure: "relay",
    title: "Agentes de IA e automação",
    desc: "Agentes que atendem no WhatsApp, agendam e respondem dúvidas, e automações que tiram tarefa repetitiva da frente.",
    items: ["Agente de WhatsApp", "Claude API", "n8n", "Apps Script"],
  },
];

export const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "three.js",
  "GSAP",
  "GLSL",
  "Tailwind",
  "Supabase",
  "PostgreSQL",
  "Claude API",
  "n8n",
  "Node.js",
  "Vercel",
  "Cloudflare",
];

export const contact = {
  whatsapp: "https://wa.me/5515997767724",
  whatsappLabel: "+55 15 99776-7724",
  linkedin: "https://www.linkedin.com/in/felipe-cavalieri-241092251",
  github: "https://github.com/fecavalieridesign",
};

export const manifesto =
  "Não entrego template. Entendo o problema, desenho a solução e coloco para rodar: site, sistema interno ou agente de WhatsApp. Uma pessoa só, do primeiro rascunho ao último deploy.";
