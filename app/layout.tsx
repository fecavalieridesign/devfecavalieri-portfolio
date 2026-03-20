import type { Metadata, Viewport } from "next";
import { Archivo_Black, Onest, Space_Mono } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import Loader from "@/components/Loader";
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

const BASE_URL = "https://devfecavalieri.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Felipe Cavalieri — Web Developer & Technical Support",
    template: "%s | Felipe Cavalieri",
  },
  description:
    "Portfolio of Felipe Cavalieri Silveira — Web Developer, Technical Support Analyst and Customer Success with 4+ years of experience building web products with React and Next.js.",
  keywords: [
    "Felipe Cavalieri",
    "Web Developer",
    "Frontend Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Technical Support",
    "Customer Success",
  ],
  authors: [{ name: "Felipe Cavalieri Silveira", url: BASE_URL }],
  creator: "Felipe Cavalieri Silveira",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "Felipe Cavalieri",
    title: "Felipe Cavalieri — Web Developer & Technical Support",
    description:
      "Portfolio of Felipe Cavalieri Silveira — Web Developer, Technical Support and Customer Success with 4+ years of experience.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Felipe Cavalieri — Web Developer & Technical Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Felipe Cavalieri — Web Developer & Technical Support",
    description:
      "Portfolio of Felipe Cavalieri Silveira — Web Developer, Technical Support and Customer Success.",
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
  jobTitle: "Web Developer & Technical Support Analyst",
  description:
    "Web Developer specializing in React and Next.js, with expertise in Technical Support and Customer Success.",
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
    "Technical Support",
    "Customer Success",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
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
