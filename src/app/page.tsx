import { Footer } from "@/components/Header";
import { Hero } from "@/components/home/HeroSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";


import { AppLayout } from "@/layout/AppLayout";
import { fetchNotionProjects } from "@/utils/api";

import { RetroLoader } from "@/components/ui/Loader";
import { TechsSection } from "@/components/home/Techs";
import { ServicesSection } from "@/components/home/ServiceSection";
import { AI } from "./actions";
import { PortfolioChatInterface } from "@/components/EnhancedChatInterface";

export default async function  Home() {
  const projects = await fetchNotionProjects();

  if(!projects){
    return <RetroLoader />
  }

  return (
    <>
 
 <AI>
    < AppLayout >
     <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f]">
      {/* Grid Background */}
      {/* Updated Grid Background with blue effect and glow */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a192f_70%)] opacity-60" />
        <div className="absolute inset-0 grid-glow" />
      </div>
s
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
        <Hero />
        {/* Projects Section */}
        <ProjectsSection  projects={projects}  />
        <ServicesSection />
         <TechsSection />

        
  
   

      </div>
    </div>
    <Footer />
  
    </AppLayout>
    </AI>
    </>
  );
}

