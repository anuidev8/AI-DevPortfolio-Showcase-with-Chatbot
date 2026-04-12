'use client'
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { resourcePosts } from '@/mocks/resources';
import { getVariant, sectionContainerVariant, sectionCardVariant, cardHover, reducedVariants } from '@/utils/motionVariants';

export const ResourcesSection = () => {
  const isReduced = useReducedMotion() ?? false;
  const containerVars = getVariant(sectionContainerVariant, sectionContainerVariant, isReduced);
  const cardVars = getVariant(sectionCardVariant, reducedVariants.sectionCardVariant, isReduced);
  const hoverVars = getVariant(cardHover, reducedVariants.cardHover, isReduced);

  return (
    <section className="py-20 bg-wb-bg">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-[32px] lg:text-[40px] leading-[1.15] font-display font-semibold text-wb-text mb-4">
            Insights & resources
          </h2>
          <p className="text-[17px] text-wb-text-muted font-body">
            Essays and guides on practical AI implementation for modern businesses.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {resourcePosts.map((post) => (
            <Link key={post.id} href={post.href} className="block group">
              <motion.article
                variants={cardVars}
                whileHover={hoverVars}
                className="bg-wb-surface border border-wb-surface/60 rounded-card overflow-hidden shadow-wb-card h-full flex flex-col hover:border-wb-teal/35 hover:shadow-wb-card-hover transition-colors duration-200"
              >
                {/* Image Area */}
                <div className={`h-44 w-full ${post.imagePlaceholderColor} relative border-b border-wb-surface/30`} />
                
                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-3">
                    <span className="inline-block bg-wb-teal/15 text-wb-teal text-xs px-2 py-[2px] rounded-full font-medium tracking-wide">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="font-display font-semibold text-[17px] text-wb-text mt-1 mb-2 leading-snug group-hover:text-wb-teal transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-wb-text-muted text-[14px] leading-relaxed line-clamp-2 md:line-clamp-3 font-body flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-wb-surface/40">
                    <span className="text-wb-text-muted/60 text-xs font-medium font-body">
                      {post.date}
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
