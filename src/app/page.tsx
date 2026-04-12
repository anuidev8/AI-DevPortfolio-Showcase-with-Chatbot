import { AppLayout } from "@/layout/AppLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhoIsItForSection } from "@/components/landing/WhoIsItForSection";
import { WhatWeCanBuildSection } from "@/components/landing/WhatWeCanBuildSection";
import { PlansSection } from "@/components/landing/PlansSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ProofSection } from "@/components/landing/ProofSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { ResourcesSection } from "@/components/landing/ResourcesSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function Home() {
  return (
    <AppLayout>
      <main className="w-full min-h-screen bg-wb-bg text-wb-text selection:bg-wb-teal/30 selection:text-wb-text">
        <HeroSection />
        <WhoIsItForSection />
        
        <div id="services">
          <WhatWeCanBuildSection />
        </div>
        
        <div id="plans">
          <PlansSection />
        </div>
        
        <div id="process">
          <HowItWorksSection />
        </div>
        
        <div id="results">
          <ProofSection />
          <TestimonialsSection />
        </div>

        <ResourcesSection />
        
        <div id="about">
          <AboutSection />
        </div>
        
        <div id="contact">
          <FinalCTASection />
        </div>
        
        <FooterSection />
      </main>
    </AppLayout>
  );
}
