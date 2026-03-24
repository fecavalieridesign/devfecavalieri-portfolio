"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LanguageProvider } from "@/context/LanguageContext";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Stack from "@/components/Stack";
import WorkHorizontal from "@/components/WorkHorizontal";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollBg from "@/components/ScrollBg";
import LoadingScreen from "@/components/LoadingScreen";

// Visual Effects
import { InteractiveParticles } from "@/components/effects/Particles";

// Three.js/R3F — loaded only on the client, excluded from SSR bundle
const ScrollIntoCard = dynamic(() => import("@/components/ScrollIntoCard"), {
  ssr: false,
});



export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has("e2e")) {
      setIsLoading(false);
    }
  }, []);

  return (
    <LanguageProvider>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {/* Global Visual Effects */}
      {!isLoading && <InteractiveParticles />}
      
      <ScrollBg />
      <Nav />
      
      {/* lg:ml-[60px] accounts for the fixed sidebar once desktop layout activates */}
      <main id="main-content" className="lg:ml-[60px]">
        <Hero />
        
        {/* ScrollIntoCard: sticky 3D animation — desktop only, not usable on touch */}
        <div className="hidden lg:block">
          <ScrollIntoCard />
        </div>
        
        {/* Work com scroll horizontal — sticky section */}
        <WorkHorizontal />
        
        {/* z-20 garante que estas seções ficam acima do panel fixed do ScrollIntoCard (z-10)
            — conforme o usuário scrolla, elas cobrem o card naturalmente */}
        <div className="relative" style={{ zIndex: 20 }}>
          <Services />
          <Stack /> {/* NOVO: Deck interativo de habilidades */}
          <About />
          <Expertise />
          <Contact />
        </div>
      </main>
      
      <Footer />
    </LanguageProvider>
  );
}
