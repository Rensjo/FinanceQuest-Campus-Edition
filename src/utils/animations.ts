/**
 * Centralized animation configuration for better performance
 * Reusable animation variants to reduce inline object creation
 */

import { Variants, Transition } from 'framer-motion';

// Reduce motion for better performance
export const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Optimized transition settings
export const spring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const smoothTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1], // Cubic bezier for smooth animations
};

export const fastTransition: Transition = {
  duration: 0.15,
  ease: [0.4, 0, 0.2, 1],
};

// Common animation variants
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: smoothTransition },
  exit: { opacity: 0, y: 20, transition: fastTransition },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: smoothTransition },
  exit: { opacity: 0, y: -20, transition: fastTransition },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: spring },
  exit: { opacity: 0, scale: 0.9, transition: fastTransition },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0, transition: smoothTransition },
  exit: { opacity: 0, x: 100, transition: fastTransition },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0, transition: smoothTransition },
  exit: { opacity: 0, x: -100, transition: fastTransition },
};

// Stagger children animation
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

// List item animations
export const listItem: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: fastTransition },
  exit: { opacity: 0, x: 20, transition: fastTransition },
};

// Hover and tap animations (reusable)
export const hoverScale = {
  scale: 1.02,
  transition: fastTransition,
};

export const tapScale = {
  scale: 0.98,
  transition: fastTransition,
};

// Modal overlay animations
export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: fastTransition },
  exit: { opacity: 0, transition: fastTransition },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: spring },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: fastTransition },
};

// Card entrance animations with delay
export const cardWithDelay = (delay: number = 0): Variants => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { ...smoothTransition, delay } },
  exit: { opacity: 0, y: 20, transition: fastTransition },
});
