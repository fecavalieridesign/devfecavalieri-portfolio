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
    role: "Web Dev & IA",
    description:
      "Desenvolvo sites, aplicações web e soluções com Inteligência Artificial. Especialista em criar experiências digitais que convertem.",
    cta: "Ver trabalhos",
    secondary: "Entrar em contato",
  },
  statement: {
    line1: "CÓDIGO COM",
    line2: "INTELIGÊNCIA.",
    sub: "Sites performáticos, linkbios que convertem e automações com IA que economizam tempo.",
  },
  services: {
    label: "O que faço",
    cards: [
      {
        id: "WEBSITES",
        title: "Sites & Landing Pages",
        desc: "Sites rápidos, responsivos e otimizados para SEO. Do design ao deploy, cuido de tudo para você ter presença digital profissional.",
      },
      {
        id: "LINKBIOS",
        title: "LinkBios Personalizados",
        desc: "Páginas de link na bio únicas e personalizadas. Designs exclusivos que representam sua marca e aumentam suas conversões.",
      },
      {
        id: "IA_AUTOMACAO",
        title: "IA & Automações",
        desc: "Integração de IA em seus projetos: chatbots inteligentes, automação de tarefas repetitivas e análise de dados com machine learning.",
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
    heading1: "Transformando ideias",
    heading2: "em código.",
    description:
      "Sou Felipe Cavalieri, de Sorocaba, SP. Trabalho com desenvolvimento web e criação de soluções com IA. Gosto de entender o problema antes de chegar na solução, criando produtos que realmente fazem sentido para o negócio.",
    stats: [
      { value: "4+", label: "Anos de experiência" },
      { value: "30+", label: "Projetos entregues" },
      { value: "100%", label: "Clientes satisfeitos" },
      { value: "24/7", label: "Suporte dedicado" },
    ],
  },
  expertise: {
    label: "Expertise",
    categories: [
      {
        name: "Desenvolvimento",
        icon: "◈",
        items: ["React · Next.js · TypeScript", "Tailwind CSS · Framer Motion", "Sites Responsivos · SEO", "Performance & Acessibilidade"],
      },
      {
        name: "IA & Automação",
        icon: "◇",
        items: ["Claude · ChatGPT · OpenAI", "Chatbots Inteligentes", "Automação de Workflows", "Análise de Dados com IA"],
      },
      {
        name: "Design & UX",
        icon: "◆",
        items: ["Figma · Prototipagem", "LinkBios Personalizados", "Landing Pages de Alta Conversão", "Design Systems"],
      },
      {
        name: "Infra & Deploy",
        icon: "◉",
        items: ["Vercel · Netlify · AWS", "Git · CI/CD", "Otimização de Performance", "Analytics & Tracking"],
      },
    ],
  },
  experience: {
    label: "Carreira",
    jobs: [
      {
        company: "Freelance & Projetos",
        role: "Web Developer & Especialista em IA",
        period: "2020 — Presente",
        tasks: [
          "Desenvolvimento de sites, landing pages e linkbios personalizados com React e Next.js",
          "Criação de soluções com IA: chatbots, automações e integrações com APIs de inteligência artificial",
          "Otimização de performance e SEO para melhorar posicionamento nos buscadores",
        ],
      },
      {
        company: "Projetos Pessoais",
        role: "Desenvolvedor Full Stack",
        period: "2021 — Presente",
        tasks: [
          "Criação de aplicações web completas do zero ao deploy",
          "Integração de múltiplas APIs e serviços de IA",
          "Desenvolvimento de interfaces modernas com foco em UX",
        ],
      },
    ],
  },
  contact: {
    label: "Contato",
    heading1: "Vamos criar",
    heading2: "algo incrível.",
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
    role: "Web Dev & AI",
    description:
      "I develop websites, web applications and AI-powered solutions. Specialist in creating digital experiences that convert.",
    cta: "View work",
    secondary: "Get in touch",
  },
  statement: {
    line1: "CODE WITH",
    line2: "INTELLIGENCE.",
    sub: "High-performance websites, converting linkbios and AI automations that save time.",
  },
  services: {
    label: "What I do",
    cards: [
      {
        id: "WEBSITES",
        title: "Websites & Landing Pages",
        desc: "Fast, responsive and SEO-optimized websites. From design to deployment, I handle everything for you to have a professional digital presence.",
      },
      {
        id: "LINKBIOS",
        title: "Custom LinkBios",
        desc: "Unique and personalized link-in-bio pages. Exclusive designs that represent your brand and increase your conversions.",
      },
      {
        id: "IA_AUTOMACAO",
        title: "AI & Automations",
        desc: "AI integration in your projects: intelligent chatbots, automation of repetitive tasks and data analysis with machine learning.",
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
    heading1: "Turning ideas",
    heading2: "into code.",
    description:
      "I'm Felipe Cavalieri, from Sorocaba, SP. I work with web development and AI-powered solutions. I like to understand the problem before reaching the solution, creating products that really make sense for the business.",
    stats: [
      { value: "4+", label: "Years of experience" },
      { value: "30+", label: "Projects delivered" },
      { value: "100%", label: "Happy clients" },
      { value: "24/7", label: "Dedicated support" },
    ],
  },
  expertise: {
    label: "Expertise",
    categories: [
      {
        name: "Development",
        icon: "◈",
        items: ["React · Next.js · TypeScript", "Tailwind CSS · Framer Motion", "Responsive Websites · SEO", "Performance & Accessibility"],
      },
      {
        name: "AI & Automation",
        icon: "◇",
        items: ["Claude · ChatGPT · OpenAI", "Intelligent Chatbots", "Workflow Automation", "Data Analysis with AI"],
      },
      {
        name: "Design & UX",
        icon: "◆",
        items: ["Figma · Prototyping", "Custom LinkBios", "High-Converting Landing Pages", "Design Systems"],
      },
      {
        name: "Infra & Deploy",
        icon: "◉",
        items: ["Vercel · Netlify · AWS", "Git · CI/CD", "Performance Optimization", "Analytics & Tracking"],
      },
    ],
  },
  experience: {
    label: "Career",
    jobs: [
      {
        company: "Freelance & Projects",
        role: "Web Developer & AI Specialist",
        period: "2020 — Present",
        tasks: [
          "Development of websites, landing pages and custom linkbios with React and Next.js",
          "Creation of AI-powered solutions: chatbots, automations and AI API integrations",
          "Performance and SEO optimization to improve search engine rankings",
        ],
      },
      {
        company: "Personal Projects",
        role: "Full Stack Developer",
        period: "2021 — Present",
        tasks: [
          "Creation of complete web applications from scratch to deployment",
          "Integration of multiple APIs and AI services",
          "Development of modern interfaces with focus on UX",
        ],
      },
    ],
  },
  contact: {
    label: "Contact",
    heading1: "Let's create",
    heading2: "something amazing.",
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
