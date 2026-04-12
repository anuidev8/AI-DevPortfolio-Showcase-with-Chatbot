'use client'
import { motion, useReducedMotion } from 'framer-motion';
import { processSteps } from '@/mocks/landing';
import { sectionContainerVariant, sectionCardVariant, getVariant, reducedVariants } from '@/utils/motionVariants';

export const HowItWorksSection = () => {
  const isReduced = useReducedMotion() ?? false;
  // Use slightly staggered timing from motionVariants
  const containerVars = getVariant({ ...sectionContainerVariant, visible: { ...sectionContainerVariant.visible, transition: { staggerChildren: 0.15 } } }, sectionContainerVariant, isReduced);
  const stepVars = getVariant(sectionCardVariant, reducedVariants.sectionCardVariant, isReduced);

  return (
    <section className="py-[100px] bg-wb-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-[32px] lg:text-[40px] leading-[1.15] font-display font-semibold text-wb-text mb-6">
            How we'll work together
          </h2>
          <p className="text-[17px] text-wb-text-muted max-w-2xl mx-auto font-body">
            A clear, transparent process from initial discovery to deployment.
          </p>
        </div>

        <motion.div 
          className="relative lg:flex lg:flex-row justify-between items-start flex flex-col gap-10 lg:gap-0 lg:px-10"
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {/* Connecting line (Desktop only) */}
          <div className="hidden lg:block absolute top-[23px] left-20 right-20 h-[1px] bg-gradient-to-r from-wb-blue via-wb-teal-soft to-transparent z-0 opacity-50" />

          {processSteps.map((step, index) => (
            <motion.div
              key={step.index}
              variants={stepVars}
              className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/4 lg:pr-8"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wb-blue to-wb-teal-soft flex items-center justify-center text-wb-bg font-display font-bold text-lg mb-6 shadow-wb-card">
                {step.index}
              </div>
              <h3 className="font-display font-semibold text-[18px] text-wb-text mb-3">
                {step.title}
              </h3>
              <p className="text-wb-text-muted text-[15px] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
