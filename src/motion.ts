/** Scroll-reveal config shared by all animated sections. */
export const revealInitial = { opacity: 0, y: 40 }
export const revealWhileInView = { opacity: 1, y: 0, scale: 1 }
export const revealViewport = { once: true, margin: '-12% 0px -8% 0px' }

export const springReveal = (delay = 0) =>
  ({
    delay,
    type: 'spring',
    bounce: 0.12,
    duration: 0.9,
  }) as const
