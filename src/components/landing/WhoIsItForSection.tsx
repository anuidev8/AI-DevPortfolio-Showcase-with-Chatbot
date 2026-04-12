'use client'
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { whoIsItFor } from '@/mocks/landing';
import { getVariant } from '@/utils/motionVariants';

export const WhoIsItForSection = () => {
  const isReduced = useReducedMotion() ?? false;

  const containerVar = getVariant(
    { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } },
    { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    isReduced
  );

  const bulletVar = getVariant(
    { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } },
    { hidden: { opacity: 0, y: 0 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
    isReduced
  );

  return (
    <section className="py-24 bg-wb-bg">
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-wb-surface/20 pt-2 mb-10" />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
          }}
          className="text-center mb-12"
        >
          <h2 className="text-[32px] lg:text-[40px] leading-[1.15] font-display font-semibold text-wb-text mb-6">
            Is this for you?
          </h2>
          <p className="text-[17px] text-wb-text-muted font-body">
            You might be a perfect fit if any of these resonate with your current business state:
          </p>
        </motion.div>

        <motion.div
          variants={containerVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="space-y-5"
        >
          {whoIsItFor?.map((bullet, index) => (
            <motion.div 
              key={index} 
              variants={bulletVar}
              className="flex gap-3 items-start"
            >
              <CheckCircle className="w-5 h-5 text-wb-teal shrink-0 mt-0.5" />
              <p className="text-wb-text-muted text-[16px] leading-relaxed font-body">
                {bullet}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
