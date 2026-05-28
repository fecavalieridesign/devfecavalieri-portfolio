"use client";

import { useEffect, useState } from "react";
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
  // SSR-safe: always start as loading. Effect below disables splash on
  // mobile / e2e probes to avoid LCP penalty without creating a hydration
  // mismatch (React error #418).
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onMobile = window.innerWidth < 768;
    const isE2E = new URLSearchParams(window.location.search).has("e2e");
    if (onMobile || isE2E) setIsLoading(false);
  }, []);

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
