'use client'
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { plans } from '@/mocks/landing';
import { 
  sectionContainerVariant, 
  sectionCardVariant, 
  cardHover, 
  tagPillHover,
  getVariant, 
  reducedVariants,
  primaryButtonHover,
  primaryButtonTap
} from '@/utils/motionVariants';

export const PlansSection = () => {
  const isReduced = useReducedMotion() ?? false;
  const containerVars = getVariant(sectionContainerVariant, sectionContainerVariant, isReduced);
  const cardVars = getVariant(sectionCardVariant, reducedVariants.sectionCardVariant, isReduced);
  const hoverVars = getVariant(cardHover, reducedVariants.cardHover, isReduced);
  const pillHoverVars = getVariant(tagPillHover, reducedVariants.tagPillHover, isReduced);
  const btnHover = getVariant(primaryButtonHover, reducedVariants.primaryButtonHover, isReduced);
  const btnTap = getVariant(primaryButtonTap, reducedVariants.primaryButtonTap, isReduced);

  return (
    <section id="plans" className="py-24 bg-wb-bg-alt">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[32px] lg:text-[40px] leading-[1.15] font-display font-semibold text-wb-text mb-6">
            Mentoring & implementation plans
          </h2>
          <p className="text-[17px] text-wb-text-muted max-w-2xl mx-auto font-body">
            Choose the level of support that fits your current goals and technical readiness.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {plans.map((plan, i) => {
            // First two cards use blue accent, last two use teal
            const borderAccent = i < 2 ? 'border-t-2 border-t-wb-blue/50' : 'border-t-2 border-t-wb-teal/50';

            return (
              <motion.div
                key={plan.id}
                variants={cardVars}
                whileHover={hoverVars}
                className={`bg-wb-surface rounded-card shadow-wb-card border border-wb-surface/30 p-7 flex flex-col ${borderAccent}
                            hover:border-wb-surface/50 hover:shadow-wb-card-hover transition-colors duration-200`}
              >
                <div className="mb-4">
                  <motion.span 
                    whileHover={pillHoverVars}
                    className="inline-block bg-wb-teal/15 text-wb-teal text-xs font-medium px-3 py-1 rounded-full cursor-default"
                  >
                    {plan.label}
                  </motion.span>
                </div>
                
                <h3 className="font-display font-semibold text-xl text-wb-text mb-2">
                  {plan.name}
                </h3>
                <p className="text-wb-text-muted text-[15px] mb-6 flex-1">
                  {plan.shortDescription}
                </p>

                <div className="text-wb-teal font-semibold text-2xl mb-8">
                  {plan.investment}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-wb-teal shrink-0 mt-0.5" />
                      <span className="text-wb-text-muted text-[15px] leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href="#contact"
                  whileHover={{ ...btnHover, boxShadow: "var(--tw-shadow-color)" }}
                  whileTap={btnTap}
                  className="w-full py-3 rounded-full bg-wb-blue text-wb-text font-medium text-[16px] transition-shadow shadow-wb-card text-center mt-auto"
                  style={{ '--tw-shadow-color': 'rgba(28,88,188,0.4)' } as any}
                >
                  {plan.primaryCTA || 'Book a call'}
                </motion.a>
                
                {plan.secondaryCTA && (
                  <p className="text-center text-wb-text-muted/60 text-xs mt-4">
                    {plan.secondaryCTA}
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
        
        <div className="mt-16 text-center border-t border-wb-surface/40 pt-10 max-w-3xl mx-auto">
          <p className="text-wb-text-muted text-[15px] font-body">
            Not sure which plan is right for you? Let's figure it out together on a free strategy call.
          </p>
        </div>
      </div>
    </section>
  );
};
