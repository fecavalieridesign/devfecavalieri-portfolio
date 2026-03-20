export type Lang = "pt" | "en";

const pt = {
  nav: {
    work: "Trabalhos",
    about: "Sobre",
    expertise: "Skills",
    experience: "Carreira",
    contact: "Contato",
  },
  hero: {
    available: "Disponível para projetos",
    line1: "Felipe",
    line2: "Cavalieri",
    role: "Suporte Técnico & Web Developer",
    description:
      "Analista de Suporte com 4+ anos de experiência em Customer Success, infraestrutura e desenvolvimento web.",
    cta: "Ver trabalhos",
    secondary: "Entrar em contato",
  },
  statement: {
    line1: "CÓDIGO QUE",
    line2: "FUNCIONA.",
    sub: "Do suporte técnico ao produto, cada solução construída para durar.",
  },
  services: {
    label: "O que faço",
    cards: [
      {
        id: "FRONTEND_DEV",
        title: "Sites e Aplicações",
        desc: "Cuido de tudo do começo ao fim: design, código, hospedagem. O site sai rápido, bonito e funciona em qualquer tela.",
      },
      {
        id: "SUPORTE_N2",
        title: "Suporte Técnico",
        desc: "Resolução rápida e clara de problemas técnicos. 4+ anos de experiência ajudando pessoas e empresas a aproveitarem melhor a tecnologia.",
      },
      {
        id: "CUSTOMER_SUCCESS",
        title: "Sucesso do Cliente",
        desc: "Onboarding que faz sentido, suporte que não some depois da venda. Quando o usuário entende o produto, ele não vai embora.",
      },
    ],
  },
  work: {
    label: "Projetos Selecionados",
    viewAll: "Ver todos no GitHub",
    loading: "Carregando projetos...",
    error: "Não foi possível carregar os projetos.",
  },
  about: {
    label: "Sobre mim",
    heading1: "Resolvendo problemas",
    heading2: "com precisão.",
    description:
      "Sou Felipe Cavalieri, de Sorocaba, SP. Trabalho com suporte técnico e desenvolvo sites e aplicações. Gosto de entender o problema antes de chegar na solução.",
    stats: [
      { value: "4+", label: "Anos de experiência" },
      { value: "98%", label: "Clientes satisfeitos" },
      { value: "20+", label: "Projetos entregues" },
      { value: "∞", label: "Problemas resolvidos" },
    ],
  },
  expertise: {
    label: "Expertise",
    categories: [
      {
        name: "Suporte & Infra",
        icon: "◈",
        items: ["Windows · Linux · MacOS", "TCP/IP, Redes", "Backup & Servidores", "Troubleshooting avançado"],
      },
      {
        name: "Web Dev",
        icon: "◇",
        items: ["React · Next.js", "TypeScript · Tailwind", "Framer Motion · GSAP", "REST APIs · Figma"],
      },
      {
        name: "Ferramentas & IA",
        icon: "◆",
        items: ["HubSpot CRM · Jira", "Zendesk · FCR/CSAT/NPS", "Claude · ChatGPT", "Automações IA"],
      },
      {
        name: "Outros",
        icon: "◉",
        items: ["Git · Docker · Vercel", "AWS · PostgreSQL", "Pacote Office", "Customer Success"],
      },
    ],
  },
  experience: {
    label: "Carreira",
    jobs: [
      {
        company: "MelhorCDL",
        role: "Analista de Suporte",
        period: "2022 — 2023",
        tasks: [
          "Atendimento técnico para clientes de software de gestão financeira",
          "Configuração e implantação de sistemas em ambientes Windows",
          "Treinamento de usuários e elaboração de materiais didáticos",
        ],
      },
      {
        company: "Projetos Freelance",
        role: "Web Developer",
        period: "2020 — Presente",
        tasks: [
          "Desenvolvimento de sites e aplicações com React e Next.js",
          "Design de interfaces com Figma e implementação com Tailwind CSS",
          "Integrações com APIs e automações com IA",
        ],
      },
    ],
  },
  contact: {
    label: "Contato",
    heading1: "Vamos construir",
    heading2: "algo juntos.",
    available: "Disponível agora",
    phone: "+55 (15) 99776-7724",
    phoneRaw: "5515997767724",
    linkedin: "linkedin.com/in/felipe-cavalieri",
    linkedinHref: "https://www.linkedin.com/in/felipe-cavalieri-241092251",
    github: "github.com/fecavalieridesign",
    githubHref: "https://github.com/fecavalieridesign",
    cta: "Conectar no LinkedIn",
  },
  footer: {
    copy: "Felipe Cavalieri",
  },
  entryToast: "Bem-vindo à experiência imersiva. Role para explorar.",
};

const en: typeof pt = {
  nav: {
    work: "Work",
    about: "About",
    expertise: "Skills",
    experience: "Career",
    contact: "Contact",
  },
  hero: {
    available: "Available for projects",
    line1: "Felipe",
    line2: "Cavalieri",
    role: "Technical Support & Web Developer",
    description:
      "Support Analyst with 4+ years of experience in Customer Success, infrastructure, and web development.",
    cta: "View work",
    secondary: "Get in touch",
  },
  statement: {
    line1: "CODE THAT",
    line2: "WORKS.",
    sub: "From technical support to product — every solution built to last.",
  },
  services: {
    label: "What I do",
    cards: [
      {
        id: "FRONTEND_DEV",
        title: "Websites & Apps",
        desc: "I handle everything from design to deployment. Fast, works on any device, no excuses.",
      },
      {
        id: "SUPORTE_N2",
        title: "Technical Support",
        desc: "Fast and clear resolution of technical issues. 4+ years helping people and businesses make the most of technology.",
      },
      {
        id: "CUSTOMER_SUCCESS",
        title: "Customer Success",
        desc: "Onboarding that makes sense and follow-up that doesn't vanish after the contract. When users get the product, they stay.",
      },
    ],
  },
  work: {
    label: "Selected Work",
    viewAll: "View all on GitHub",
    loading: "Loading projects...",
    error: "Could not load projects.",
  },
  about: {
    label: "About me",
    heading1: "Solving problems",
    heading2: "with precision.",
    description:
      "I'm Felipe Cavalieri, from Sorocaba, SP. I work in technical support and build websites and apps. I'd rather understand the problem than rush to a fix.",
    stats: [
      { value: "4+", label: "Years of experience" },
      { value: "98%", label: "Happy clients" },
      { value: "20+", label: "Projects delivered" },
      { value: "∞", label: "Problems solved" },
    ],
  },
  expertise: {
    label: "Expertise",
    categories: [
      {
        name: "Support & Infra",
        icon: "◈",
        items: ["Windows · Linux · MacOS", "TCP/IP Networks", "Backup & Servers", "Advanced Troubleshooting"],
      },
      {
        name: "Web Dev",
        icon: "◇",
        items: ["React · Next.js", "TypeScript · Tailwind", "Framer Motion · GSAP", "REST APIs · Figma"],
      },
      {
        name: "Tools & AI",
        icon: "◆",
        items: ["HubSpot CRM · Jira", "Zendesk · FCR/CSAT/NPS", "Claude · ChatGPT", "AI Automations"],
      },
      {
        name: "Others",
        icon: "◉",
        items: ["Git · Docker · Vercel", "AWS · PostgreSQL", "Office Suite", "Customer Success"],
      },
    ],
  },
  experience: {
    label: "Career",
    jobs: [
      {
        company: "MelhorCDL",
        role: "Support Analyst",
        period: "2022 — 2023",
        tasks: [
          "Technical support for financial management software clients",
          "System configuration and deployment on Windows environments",
          "User training and educational materials creation",
        ],
      },
      {
        company: "Freelance Projects",
        role: "Web Developer",
        period: "2020 — Present",
        tasks: [
          "Website and application development with React and Next.js",
          "Interface design with Figma and implementation with Tailwind CSS",
          "API integrations and AI automations",
        ],
      },
    ],
  },
  contact: {
    label: "Contact",
    heading1: "Let's build",
    heading2: "something together.",
    available: "Available now",
    phone: "+55 (15) 99776-7724",
    phoneRaw: "5515997767724",
    linkedin: "linkedin.com/in/felipe-cavalieri",
    linkedinHref: "https://www.linkedin.com/in/felipe-cavalieri-241092251",
    github: "github.com/fecavalieridesign",
    githubHref: "https://github.com/fecavalieridesign",
    cta: "Connect on LinkedIn",
  },
  footer: {
    copy: "Felipe Cavalieri",
  },
  entryToast: "Welcome to the immersive experience. Scroll to explore.",
};

export const content = { pt, en };
