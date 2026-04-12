import { Variants } from 'framer-motion';

export const primaryButtonHover = { scale: 1.02, transition: { duration: 0.15, ease: 'easeOut' } };
export const primaryButtonTap = { scale: 0.98 };

export const cardHover = { y: -4, transition: { duration: 0.2, ease: 'easeOut' } };
export const tagPillHover = { letterSpacing: "0.02em", transition: { duration: 0.15 } };
export const testimonialHover = { rotate: 1, transition: { duration: 0.2, ease: 'easeOut' } };
export const socialIconHover = { scale: 1.1, transition: { duration: 0.15 } };
export const navLinkUnderline = { scaleX: [0, 1], transition: { duration: 0.15 } };

export const heroTextContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const heroTextChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' }
  }
};

export const heroImageVariant: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
};

export const sectionContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const sectionCardVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
};

export const reducedVariants = {
  primaryButtonHover: { scale: 1, transition: { duration: 0.15 } },
  primaryButtonTap: { scale: 1 },
  cardHover: { y: 0, transition: { duration: 0.15 } },
  tagPillHover: { transition: { duration: 0.15 } },
  testimonialHover: { rotate: 0, transition: { duration: 0.15 } },
  socialIconHover: { scale: 1, transition: { duration: 0.15 } },
  navLinkUnderline: { scaleX: [0, 1], transition: { duration: 0.15 } },
  heroTextChild: { hidden: { opacity: 0, y: 0 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
  heroImageVariant: { hidden: { opacity: 0, scale: 1 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } } },
  sectionCardVariant: { hidden: { opacity: 0, y: 0 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }
};

export const getVariant = (normal: any, reduced: any, isReduced: boolean) => {
  return isReduced ? reduced : normal;
};
