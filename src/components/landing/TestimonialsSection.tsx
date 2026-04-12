'use client'
import { motion, useReducedMotion } from 'framer-motion';
import { testimonials } from '@/mocks/landing';
import { getVariant, testimonialHover, tagPillHover, reducedVariants } from '@/utils/motionVariants';

export const TestimonialsSection = () => {
  const isReduced = useReducedMotion() ?? false;
  const hoverVars = getVariant(testimonialHover, reducedVariants.testimonialHover, isReduced);
  const pillHoverVars = getVariant(tagPillHover, reducedVariants.tagPillHover, isReduced);

  return (
    <section className="py-24 bg-wb-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[32px] lg:text-[40px] leading-[1.15] font-display font-semibold text-wb-text mb-6">
            Real results from real businesses
          </h2>
          <p className="text-[17px] text-wb-text-muted max-w-2xl mx-auto font-body">
            See how custom AI solutions are driving efficiency and growth for our clients.
          </p>
        </div>

        {/* CSS Fallback for backdrop-filter */}
        <style dangerouslySetInnerHTML={{__html: `
          @supports not (backdrop-filter: blur(1px)) {
            .fallback-bg { background-color: var(--wb-bg-alt); }
          }
        `}} />

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          {testimonials.map((testim, index) => {
            const isPlaceholder = testim.id.startsWith('placeholder');
            
            if (isPlaceholder) {
              return (
                <motion.div
                  key={testim.id}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
                  }}
                  className="border-dashed border border-wb-surface/20 bg-wb-bg-alt/40 rounded-card p-6 flex flex-col justify-center items-center text-center min-h-[220px]"
                >
                  <span className="text-wb-text-muted/40 italic text-[15px] font-body">
                    Coming soon
                  </span>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={testim.id}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
                }}
                whileHover={hoverVars}
                className="fallback-bg bg-wb-bg-alt/80 backdrop-blur-sm border border-wb-surface/30 rounded-card shadow-wb-card p-6 flex flex-col hover:border-wb-teal/60 hover:shadow-wb-card-hover transition-colors duration-200"
              >
                <div className="mb-4">
                  <motion.span 
                    whileHover={pillHoverVars}
                    className="inline-block bg-wb-teal/15 text-wb-teal text-xs px-3 py-1 rounded-full cursor-default font-medium"
                  >
                    {testim.outcomeTag}
                  </motion.span>
                </div>
                <p className="italic text-wb-text-muted text-[15px] leading-relaxed flex-1">
                  "{testim.quote}"
                </p>
                <p className="text-wb-text-muted/60 text-sm font-medium mt-4 pt-4 border-t border-wb-surface/30">
                  {testim.role}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
