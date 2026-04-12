'use client'
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@/mocks/landing';
import { getVariant, primaryButtonHover, primaryButtonTap, reducedVariants } from '@/utils/motionVariants';

export const FinalCTASection = () => {
  const isReduced = useReducedMotion() ?? false;
  const btnHover = getVariant(primaryButtonHover, reducedVariants.primaryButtonHover, isReduced);
  const btnTap = getVariant(primaryButtonTap, reducedVariants.primaryButtonTap, isReduced);
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First open by default

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-[112px] bg-wb-bg relative overflow-hidden">
      {/* Warm radial gradient overlay behind the CTA */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(28,88,188,0.10) 0%, transparent 65%)' }} 
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
          }}
          className="mb-16"
        >
          <h2 className="text-[40px] lg:text-[52px] leading-[1.1] font-display font-semibold text-wb-text mb-6 tracking-tight">
            Ready to explore what AI can do for your business?
          </h2>
          <p className="text-[17px] text-wb-text-muted max-w-2xl mx-auto font-body leading-relaxed">
            Let's identify the highest-ROI automation opportunities in your workflows. Grab a time on my calendar for a quick, zero-pressure strategy session.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <motion.a
              href="#contact"
              whileHover={{ ...btnHover, boxShadow: "var(--tw-shadow-color)" }}
              whileTap={btnTap}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-wb-teal text-wb-bg font-medium text-[16px] transition-shadow shadow-wb-card"
              style={{ '--tw-shadow-color': 'rgba(74,155,142,0.4)' } as any}
            >
              Book your free 20-minute AI strategy call
            </motion.a>

            <motion.a
              href="#contact"
              whileHover={btnHover}
              whileTap={btnTap}
              className="w-full sm:w-auto px-7 py-3 rounded-full border border-wb-teal text-wb-teal font-medium text-[16px] bg-transparent transition-colors"
            >
              Send me a message
            </motion.a>
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto text-left mt-24">
          <h3 className="text-[24px] font-display font-semibold text-wb-text mb-8">Frequently Asked Questions</h3>
          
          <div className="divide-y divide-wb-surface/30 border-t border-wb-surface/30">
            {faqs?.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="w-full text-left flex justify-between items-center text-[16px] text-wb-text-muted hover:text-wb-teal transition-colors duration-150 font-body outline-none focus-visible:text-wb-teal"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 shrink-0 text-wb-teal"
                    >
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-wb-text-muted text-[15px] leading-relaxed py-4 pr-8 font-body">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
