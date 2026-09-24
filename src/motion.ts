/**
 * Scroll-reveal config extracted from the original site:
 * hidden state `opacity: 0, translateY(40px)`, spring `bounce: 0.2, duration: 0.7`,
 * triggered once when the element enters the viewport.
 */
export const revealInitial = { opacity: 0, y: 64, scale: 0.985 }
export const revealWhileInView = { opacity: 1, y: 0, scale: 1 }
export const revealViewport = { once: true, margin: '-12% 0px -8% 0px' }

export const springReveal = (delay = 0) =>
  ({
    delay,
    type: 'spring',
    bounce: 0.12,
    duration: 0.9,
  }) as const
