'use client'
import { motion, useReducedMotion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { proofStats } from '@/mocks/landing';
import { getVariant, sectionContainerVariant, sectionCardVariant, reducedVariants } from '@/utils/motionVariants';

const StatCard = ({ stat }: { stat: any }) => {
  const { count, ref } = useCountUp({ target: stat.value, duration: 1500 });

  return (
    <motion.div
      ref={ref}
      variants={getVariant(sectionCardVariant, reducedVariants.sectionCardVariant, false)}
      className="bg-wb-surface border border-wb-teal/15 rounded-card shadow-wb-card p-8 text-center shadow-wb-card flex flex-col items-center justify-center transition-colors hover:border-wb-teal/30 hover:shadow-wb-card-hover"
    >
      <div className="font-display text-[52px] font-bold text-wb-text leading-none tracking-tight">
        <span>{count}</span>
        <span className="text-wb-teal text-[32px] ml-1 tracking-normal">{stat.suffix}</span>
      </div>
      
      <p className="text-wb-text-muted text-[15px] mt-3 font-body">
        {stat.label}
      </p>

      {stat.badge && (
        <span className="bg-wb-teal/15 text-wb-teal text-xs px-3 py-1 rounded-full mt-4 font-medium font-body border border-wb-teal/20">
          {stat.badge}
        </span>
      )}
    </motion.div>
  );
}

export const ProofSection = () => {
  const isReduced = useReducedMotion() ?? false;
  const containerVars = getVariant(sectionContainerVariant, sectionContainerVariant, isReduced);

  return (
    <section className="py-20 bg-wb-bg-alt">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {proofStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
