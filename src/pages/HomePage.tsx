'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import Seo, { siteLd } from '../lib/Seo'
import Hero from '../components/Hero'
import LogoMarquee from '../components/LogoMarquee'
import TabbedFeatures from '../components/TabbedFeatures'
import CodeIntegration from '../components/CodeIntegration'
import Metrics from '../components/Metrics'
import CaseStudies from '../components/CaseStudies'
import Testimonials from '../components/Testimonials'
import WhyUs from '../components/WhyUs'
import Process from '../components/Process'
import ResourceCards from '../components/ResourceCards'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'

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
      <Seo
        title="AI Automation Agency"
        description="AI automation agency: we find where AI creates real value, build the automations and agents to capture it, and keep them working long after handoff."
        path="/"
        jsonLd={[siteLd()]}
      />
      <Hero />
      <LogoMarquee />
      <TabbedFeatures />
      <CodeIntegration />
      <Metrics />
      <CaseStudies />
      <Testimonials />
      <WhyUs />
      <Process />
      <ResourceCards />
      <Pricing />
      <FAQ />
    </>
  )
}
