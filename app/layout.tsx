import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./v4.css";

const display = Geist({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: "italic",
  axes: ["opsz"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://fecavalieri.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Felipe Cavalieri — Web Developer & IA",
    template: "%s | Felipe Cavalieri",
  },
  description:
    "Felipe Cavalieri — desenvolvedor web especializado em React e Next.js. Crio sites, landing pages e soluções com Inteligência Artificial que convertem. 4+ anos de experiência.",
  keywords: [
    "Felipe Cavalieri",
    "Web Developer",
    "Desenvolvedor Web",
    "Frontend Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Inteligência Artificial",
    "Automação",
    "Landing Pages",
    "Chatbots",
  ],
  authors: [{ name: "Felipe Cavalieri Silveira", url: BASE_URL }],
  creator: "Felipe Cavalieri Silveira",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "Felipe Cavalieri",
    title: "Felipe Cavalieri — Web Developer & IA",
    description:
      "Desenvolvedor web especializado em React e Next.js. Sites, landing pages e soluções com IA que convertem. 4+ anos de experiência.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Felipe Cavalieri — Web Developer & IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Felipe Cavalieri — Web Developer & IA",
    description:
      "Desenvolvedor web especializado em React e Next.js. Sites, landing pages e soluções com IA que convertem.",
    images: ["/og-image.png"],
    creator: "@fecavalieri",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#e8e5df",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Felipe Cavalieri Silveira",
  url: BASE_URL,
  jobTitle: "Web Developer & AI Specialist",
  description:
    "Web Developer specializing in React and Next.js, building websites, landing pages and AI-powered solutions.",
  email: "devfecavalieri@gmail.com",
  sameAs: [
    "https://github.com/fecavalieridesign",
    "https://www.linkedin.com/in/felipe-cavalieri-241092251",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Artificial Intelligence",
    "Automation",
    "OpenAI",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e8e5df",
};

// Marca que há JS e movimento permitido antes da primeira pintura,
// para a entrada do hero não piscar.
const boot =
  "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js')";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
