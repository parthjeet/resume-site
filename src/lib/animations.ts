import { Variants, Easing } from "framer-motion";

const easeOut: Easing = [0, 0, 0.2, 1];

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: easeOut }
  }
};

export const timelineVariants: Variants = {
  hidden: { scaleY: 0 },
  show: {
    scaleY: 1,
    transition: { duration: 0.6, ease: easeOut, delay: 0.2 }
  }
};

export const dotVariants: Variants = {
  hidden: { scale: 0 },
  show: { 
    scale: 1,
    transition: { duration: 0.3, type: "spring", stiffness: 500, damping: 15 }
  }
};

export const rowVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.3, ease: easeOut }
  }
};
