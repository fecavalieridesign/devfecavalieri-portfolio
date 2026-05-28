import type { Metadata, Viewport } from "next";
import { Archivo_Black, Onest, Space_Mono } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import Loader from "@/components/Loader";
import { CustomCursor } from "@/components/animations";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
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
    "theme-color": "#000000",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Preload hero poster as LCP candidate — create /public/hero-poster.jpg from a frame of the hero video */}
        <link rel="preload" as="image" href="/hero-poster.jpg" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${archivoBlack.variable} ${onest.variable} ${spaceMono.variable} antialiased`}>
        {/* Skip to main content — WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-violet focus:text-black focus:font-mono focus:text-xs focus:tracking-widest focus:uppercase"
        >
          Skip to main content
        </a>
        <LenisProvider>
          <Loader />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
