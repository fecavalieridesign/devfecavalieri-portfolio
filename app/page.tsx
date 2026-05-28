"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LanguageProvider } from "@/context/LanguageContext";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Stack from "@/components/Stack";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollBg from "@/components/ScrollBg";
import LoadingScreen from "@/components/LoadingScreen";
import { useIsMobile } from "@/hooks/useIsMobile";

// Heavy components - lazy loaded with loading states
const WorkHorizontal = dynamic(() => import("@/components/WorkHorizontal"), {
  loading: () => (
    <div className="h-screen bg-[#e4e4f0] flex items-center justify-center">
      <div className="animate-pulse text-violet/40 font-mono text-sm">Carregando projetos...</div>
    </div>
  ),
  ssr: false,
});

const InteractiveParticles = dynamic(
  () => import("@/components/effects/Particles").then(mod => ({ default: mod.InteractiveParticles })),
  { ssr: false }
);

// Below-the-fold sections — defer until needed (kills upfront bundle weight)
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const FeaturesGrid = dynamic(
  () => import("@/components/ui/features-grid").then(mod => ({ default: mod.FeaturesGrid })),
  { ssr: false }
);


export default function Home() {
  // Skip the boot-up LoadingScreen on mobile and e2e/lighthouse profiles —
  // the splash adds ~3-4s of mandatory dead time that demolishes LCP/FCP
  // on throttled mobile networks. Desktop keeps the cinematic intro.
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    if (window.innerWidth < 768) return false;
    if (new URLSearchParams(window.location.search).has("e2e")) return false;
    return true;
  });
  const isMobile = useIsMobile();

  return (
    <LanguageProvider>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {/* Global Visual Effects - disable on mobile */}
      {!isLoading && !isMobile && <InteractiveParticles />}
      
      <ScrollBg />
      <Nav />
      
      <main id="main-content" className="lg:ml-[60px]">
        <Hero />

        {/* Work section - lazy loaded */}
        <WorkHorizontal />
        
        {/* Other sections */}
        <div className="relative" style={{ zIndex: 20 }}>
          <Services />
          <Stack />
          <FeaturesGrid />
          <About />
          <Expertise />
          <Testimonials />
          <Contact />
        </div>
      </main>
      
      <Footer />
    </LanguageProvider>
  );
}
