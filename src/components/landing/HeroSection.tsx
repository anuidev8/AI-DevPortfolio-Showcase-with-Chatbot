'use client'
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import Image from 'next/image';
import { 
  heroTextContainer, 
  heroTextChild, 
  heroImageVariant,
  reducedVariants,
  getVariant,
  primaryButtonHover,
  primaryButtonTap 
} from '@/utils/motionVariants';

export const HeroSection = () => {
  const isReduced = useReducedMotion() ?? false;

  const textContainer = getVariant(heroTextContainer, heroTextContainer, isReduced); // Text container is just stagger, no motion
  const textChild = getVariant(heroTextChild, reducedVariants.heroTextChild, isReduced);
  const imageVar = getVariant(heroImageVariant, reducedVariants.heroImageVariant, isReduced);
  const btnHover = getVariant(primaryButtonHover, reducedVariants.primaryButtonHover, isReduced);
  const btnTap = getVariant(primaryButtonTap, reducedVariants.primaryButtonTap, isReduced);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-transparent">
      {/* Background Gradient Animating Orb */}
      <motion.div 
        animate={isReduced ? { opacity: 0.3 } : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, var(--wb-blue-deep) 0%, var(--wb-blue) 40%, var(--wb-teal) 90%, transparent 100%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full z-10 relative">
        <div className="lg:grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Column */}
          <motion.div
            variants={textContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-8"
          >
            <motion.div variants={textChild} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-wb-surface/60 border border-wb-surface shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-wb-teal animate-pulse" />
              <span className="text-[13px] font-medium text-wb-teal font-mono tracking-wide uppercase">Your AI Mentor & Guide</span>
            </motion.div>

            <motion.h1 
              variants={textChild}
              className="font-display text-[52px] lg:text-[60px] leading-[1.1] tracking-tight text-wb-text"
            >
              Discover what’s holding your wellness business back <span className="text-transparent bg-clip-text bg-gradient-to-r from-wb-blue-soft to-wb-teal">— and solve it with AI.</span>
            </motion.h1>
            
            <motion.p 
              variants={textChild}
              className="text-[17px] text-wb-text-muted max-w-2xl leading-[1.55] font-body"
            >
              Stop feeling overwhelmed by technology. As your personal mentor, I'll help you understand and implement AI tools specifically tailored for your wellness practice. Together, we'll uncover your exact needs to reclaim your time and amplify your impact.
            </motion.p>

            <motion.div variants={textChild} className="flex flex-col sm:flex-row items-start lg:items-center gap-4 pt-4">
              <motion.a
                href="#contact"
                whileHover={{ ...btnHover, boxShadow: "var(--tw-shadow-color)" }}
                whileTap={btnTap}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-wb-teal text-wb-bg font-medium text-[16px] transition-shadow shadow-wb-card flex flex-col items-center justify-center text-center"
                style={{ '--tw-shadow-color': 'rgba(74,155,142,0.4)' } as any}
              >
                <span>Book a Strategy Call</span>
                <span className="block text-xs opacity-80 mt-0.5 font-normal">Free 20-min discovery session</span>
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={btnHover}
                whileTap={btnTap}
                className="w-full sm:w-auto px-7 py-3 rounded-full border border-wb-teal text-wb-teal font-medium text-[16px] bg-transparent text-center"
              >
                What would you like to solve?
              </motion.a>
            </motion.div>

            <motion.div 
              variants={textChild}
              className="pt-8 flex flex-col opacity-60"
            >
              <p className="text-[14px] text-wb-text-muted mb-4 tracking-wider uppercase font-mono font-medium">Outcome-driven solutions for wellness operators</p>
            </motion.div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            variants={imageVar}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 mt-16 lg:mt-0 relative hidden md:block"
          >
            <div className="relative w-full max-w-[540px] h-[440px] mx-auto lg:ml-auto">
              {/* Optional: Add a subtle placeholder background until image works */}
              <div className="absolute inset-0 bg-wb-surface/50 rounded-[20px] shadow-wb-card flex items-center justify-center border border-wb-surface">
                {/* Fallback image component */}
                <Image 
                  src="/images/angel-mentor.png" 
                  alt="Angel Arrieta Mentoring"
                  fill
                  className="rounded-[20px] object-cover shadow-wb-card"
                  unoptimized // Disable image optimization for now if file lacks proper configuration
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              
              {/* Trust badges overlay per mock instructions */}
              <div className="absolute -bottom-4 -left-4 bg-wb-surface border border-wb-surface/60 rounded-full px-5 py-2 shadow-wb-card flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-wb-teal animate-pulse" />
                <span className="text-wb-text font-medium text-sm">7+ years</span>
                <span className="text-wb-text-muted text-xs">building AI</span>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-wb-surface border border-wb-surface/60 rounded-full px-5 py-2 shadow-wb-card flex items-center gap-2 backdrop-blur-md">
                <span className="text-wb-teal font-bold text-sm">200+ hrs</span>
                <span className="text-wb-text-muted text-xs">saved for clients</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
