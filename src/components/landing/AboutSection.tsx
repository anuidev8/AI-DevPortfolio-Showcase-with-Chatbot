'use client'
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { aboutContent } from '@/mocks/landing';
import { getVariant, sectionContainerVariant, sectionCardVariant, heroImageVariant, reducedVariants } from '@/utils/motionVariants';

export const AboutSection = () => {
  const isReduced = useReducedMotion() ?? false;
  const containerVars = getVariant(sectionContainerVariant, sectionContainerVariant, isReduced);
  const textVars = getVariant(sectionCardVariant, reducedVariants.sectionCardVariant, isReduced);
  const imageVars = getVariant(heroImageVariant, reducedVariants.heroImageVariant, isReduced);

  return (
    <section className="py-24 bg-wb-bg-alt">
      <div className="max-w-7xl mx-auto px-6">
        <div className="lg:grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Image Column */}
          <motion.div
            variants={imageVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="lg:col-span-5 mb-16 lg:mb-0 relative"
          >
            <div className="relative w-full max-w-[540px] h-[440px] mx-auto lg:mr-auto rounded-[20px] shadow-wb-card overflow-hidden">
              <div className="absolute inset-0 bg-wb-surface/40 flex items-center justify-center border border-wb-surface">
                {/* Fallback image component */}
                <Image 
                  src="/images/angel-headshot.png" 
                  alt="Angel Arrieta – AI consultant and mentor"
                  fill
                  className="rounded-[20px] object-cover object-top"
                  unoptimized
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div
            variants={containerVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="lg:col-span-7 lg:pl-12"
          >
            <motion.h2 
              variants={textVars}
              className="text-[32px] lg:text-[40px] leading-[1.15] font-display font-semibold text-wb-text mb-6"
            >
              Who you'll be working with
            </motion.h2>
            
            <motion.p 
              variants={textVars}
              className="text-wb-text-muted text-[17px] leading-[1.65] font-body mb-8"
            >
              {aboutContent?.bio}
            </motion.p>
            
            <div className="space-y-4">
              {aboutContent?.bullets?.map((bullet, index) => (
                <motion.div 
                  key={index} 
                  variants={textVars}
                  className="flex gap-3 items-start"
                >
                  <CheckCircle className="w-5 h-5 text-wb-teal shrink-0 mt-1" />
                  <span className="text-wb-text-muted text-[16px] leading-relaxed font-body">
                    {bullet}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
