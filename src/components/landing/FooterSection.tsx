'use client'
import { motion, useReducedMotion } from 'framer-motion';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { getVariant, socialIconHover, primaryButtonHover, primaryButtonTap, reducedVariants } from '@/utils/motionVariants';

export const FooterSection = () => {
  const isReduced = useReducedMotion() ?? false;
  const iconHover = getVariant(socialIconHover, reducedVariants.socialIconHover, isReduced);
  const btnHover = getVariant(primaryButtonHover, reducedVariants.primaryButtonHover, isReduced);
  const btnTap = getVariant(primaryButtonTap, reducedVariants.primaryButtonTap, isReduced);

  return (
    <footer className="bg-wb-bg border-t border-wb-surface/60 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="lg:grid lg:grid-cols-4 lg:gap-10 space-y-12 lg:space-y-0">
          
          {/* Col 1: Logo & Tagline */}
          <div className="col-span-1 flex flex-col items-start">
            <span className="font-display font-bold text-[24px] text-wb-text tracking-tight mb-4">
              Angel Arrieta
            </span>
            <p className="text-wb-text-muted text-[15px] leading-relaxed font-body mb-6 w-full max-w-[250px]">
              Turning your business bottlenecks into custom AI-powered workflows.
            </p>
            <div className="flex items-center gap-4">
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
                whileHover={iconHover}
                className="text-wb-text-muted hover:text-wb-teal transition-colors"
                title="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
                whileHover={iconHover}
                className="text-wb-text-muted hover:text-wb-teal transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                whileHover={iconHover}
                className="text-wb-text-muted hover:text-wb-teal transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Col 2: Services Links */}
          <div className="col-span-1">
            <h4 className="font-display font-semibold text-wb-text text-[16px] mb-5">Services</h4>
            <ul className="space-y-3 font-body text-[15px]">
              <li><Link href="#plans" className="text-wb-text-muted hover:text-wb-text transition-colors duration-150">AI Development</Link></li>
              <li><Link href="#plans" className="text-wb-text-muted hover:text-wb-text transition-colors duration-150">Process Automation</Link></li>
              <li><Link href="#plans" className="text-wb-text-muted hover:text-wb-text transition-colors duration-150">1:1 Mentoring</Link></li>
              <li><Link href="#plans" className="text-wb-text-muted hover:text-wb-text transition-colors duration-150">AI Audits</Link></li>
            </ul>
          </div>

          {/* Col 3: Company Links */}
          <div className="col-span-1">
            <h4 className="font-display font-semibold text-wb-text text-[16px] mb-5">Company</h4>
            <ul className="space-y-3 font-body text-[15px]">
              <li><Link href="#about" className="text-wb-text-muted hover:text-wb-text transition-colors duration-150">About</Link></li>
              <li><Link href="#results" className="text-wb-text-muted hover:text-wb-text transition-colors duration-150">Testimonials</Link></li>
              <li><Link href="#contact" className="text-wb-text-muted hover:text-wb-text transition-colors duration-150">Contact</Link></li>
              <li><Link href="#" className="text-wb-text-muted hover:text-wb-text transition-colors duration-150 flex items-center justify-between">Blog <span className="bg-wb-teal/15 text-wb-teal text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ml-2">New</span></Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="col-span-1">
            <h4 className="font-display font-semibold text-wb-text text-[16px] mb-5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-wb-teal" /> Get AI insights
            </h4>
            <form className="space-y-3 relative" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter" className="sr-only">Email address for newsletter</label>
              <input 
                id="newsletter" 
                type="email" 
                placeholder="Drop your email here" 
                className="w-full bg-wb-surface border border-wb-surface/80 rounded-[10px] px-4 py-2.5 text-wb-text text-[15px] placeholder:text-wb-text-muted/50 focus:outline-none focus:border-wb-blue focus:shadow-wb-input-focus transition-all font-body"
                required
              />
              <motion.button 
                type="submit"
                whileHover={{ ...btnHover, boxShadow: "var(--tw-shadow-color)" }}
                whileTap={btnTap}
                className="w-full rounded-[10px] bg-wb-teal text-wb-bg font-medium text-[15px] py-2.5 shadow-wb-card transition-shadow"
                style={{ '--tw-shadow-color': 'rgba(74,155,142,0.4)' } as any}
              >
                Subscribe
              </motion.button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-wb-surface/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-wb-text-muted/50 text-xs font-body">
            &copy; {new Date().getFullYear()} Angel Arrieta. All rights reserved.
          </p>
          <p className="text-wb-text-muted/50 text-xs font-body">
            Built with Next.js &amp; ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};
