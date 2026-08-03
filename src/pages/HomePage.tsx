'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import Hero from '../components/Hero'
import LogoMarquee from '../components/LogoMarquee'
import Services from '../components/Services'
import Benefits from '../components/Benefits'
import Process from '../components/Process'
import CaseStudies from '../components/CaseStudies'
import WhyUs from '../components/WhyUs'
import Testimonials from '../components/Testimonials'
import Metrics from '../components/Metrics'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import Blog from '../components/Blog'

export default function HomePage() {
  const lenisRef = useRef<Lenis | null>(null)

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

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [reducedMotion])

  return (
    <>
      <Hero />
      <LogoMarquee />
      <Services />
      <Benefits />
      <Process />
      <CaseStudies />
      <WhyUs />
      <Testimonials />
      <Metrics />
      <Pricing />
      <FAQ />
      <Blog />
    </>
  )
}
