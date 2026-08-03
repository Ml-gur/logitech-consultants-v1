/**
 * Scroll-reveal config extracted from the original site:
 * hidden state `opacity: 0, translateY(40px)`, spring `bounce: 0.2, duration: 0.7`,
 * triggered once when the element enters the viewport.
 */
export const revealInitial = { opacity: 0, y: 40 }
export const revealWhileInView = { opacity: 1, y: 0 }
export const revealViewport = { once: true, margin: '-50px' }

export const springReveal = (delay = 0) =>
  ({
    delay,
    type: 'spring',
    bounce: 0.2,
    duration: 0.7,
  }) as const
