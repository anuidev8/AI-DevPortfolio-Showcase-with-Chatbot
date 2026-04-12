'use client'
import { motion, useReducedMotion } from 'framer-motion';
import { Calculator, FileText, MessageSquare, Mic, Database, LucideIcon } from 'lucide-react';
import { useCases } from '@/mocks/landing';
import { sectionContainerVariant, sectionCardVariant, cardHover, getVariant, reducedVariants } from '@/utils/motionVariants';

const iconMap: Record<string, LucideIcon> = {
  Calculator,
  FileText,
  MessageSquare,
  Mic,
  Database,
};

export const WhatWeCanBuildSection = () => {
  const isReduced = useReducedMotion() ?? false;
  const containerVars = getVariant(sectionContainerVariant, sectionContainerVariant, isReduced);
  const cardVars = getVariant(sectionCardVariant, reducedVariants.sectionCardVariant, isReduced);
  const hoverVars = getVariant(cardHover, reducedVariants.cardHover, isReduced);

  return (
    <section className="py-24 bg-wb-bg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-[32px] lg:text-[40px] leading-[1.15] font-display font-semibold text-wb-text mb-6">
            What we can build together
          </h2>
          <p className="text-[17px] text-wb-text-muted max-w-2xl mx-auto font-body">
            Practical, ROI-driven solutions mapped directly to your operational bottlenecks.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {useCases.map((useCase) => {
            const IconComponent = iconMap[useCase.icon];
            
            return (
              <motion.div
                key={useCase.id}
                variants={cardVars}
                whileHover={hoverVars}
                className="bg-wb-bg-alt border border-wb-surface/30 rounded-card shadow-wb-card p-6 
                           hover:border-wb-teal/60 hover:bg-wb-surface hover:shadow-wb-card-hover 
                           transition-colors duration-200 ease-out"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wb-blue to-wb-teal-soft flex items-center justify-center mb-5">
                  {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                </div>
                <h3 className="text-[18px] font-display font-semibold text-wb-text mb-2">
                  {useCase.title}
                </h3>
                <p className="text-wb-text-muted text-[15px] leading-relaxed font-body">
                  {useCase.benefit}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
        
        <div className="mt-16 text-center">
          <p className="text-wb-text-muted/80 text-[15px] font-medium font-body">
            Looking for something else? We can design a custom architecture tailored to your unique needs.
          </p>
        </div>
      </div>
    </section>
  );
};
