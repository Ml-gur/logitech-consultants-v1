'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'

/**
 * App-wide smooth scrolling.
 *
 * Lenis was previously instantiated inside HomePage, so only the home page
 * scrolled smoothly, the deployment-pattern stack and every inner page jumped.
 * Mounting it once in Layout gives the whole site the same scroll feel and lets
 * scroll-driven transforms read a single, consistent scroll source.
 *
 * Behaviour notes
 * ---------------
 * - Respects `prefers-reduced-motion`: with the preference set, no Lenis
 *   instance is created at all and the browser scrolls natively.
 * - `smoothWheel` only, touch scrolling stays native (mobile browsers already
 *   do momentum well, and hijacking it feels broken).
 * - Programmatic `window.scrollTo` still works, which is what the E2E suite and
 *   the route-change scroll reset rely on.
 */
export function useLenis() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    let raf = 0
    function frame(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reducedMotion])
}
