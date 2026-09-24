/**
 * Scroll-reveal config preserves a stable visible baseline so below-fold content never
 * becomes an empty reserved block in screenshots, reduced-motion contexts, or fast scrolls.
 */
export const revealInitial = { opacity: 1, y: 0, scale: 1 }
export const revealWhileInView = { opacity: 1, y: 0, scale: 1 }
export const revealViewport = { once: true, margin: '-12% 0px -8% 0px' }

export const springReveal = (delay = 0) =>
  ({
    delay,
    type: 'spring',
    bounce: 0.12,
    duration: 0.9,
  }) as const
