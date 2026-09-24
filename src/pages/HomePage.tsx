'use client'

import Seo, { organizationLd, websiteLd } from '../lib/Seo'
import { CAPABILITIES } from '../lib/brand'
import Hero from '../components/Hero'
import LogoMarquee from '../components/LogoMarquee'
import TabbedFeatures from '../components/TabbedFeatures'
import Metrics from '../components/Metrics'
import DeploymentPatterns from '../components/DeploymentPatterns'
import Principles from '../components/Principles'
import HomeCTA from '../components/HomeCTA'

export default function HomePage() {
  return (
    <>
      <Seo
        title="Intelligence Designed To Evolve"
        description="An applied AI systems company. Naivolabs designs, builds and deploys governed intelligent systems that work inside real organizations, measured."
        path="/"
        jsonLd={[organizationLd(), websiteLd()]}
      />
      <Hero />
      <main className="inspiration-shell">
        <LogoMarquee />
        <TabbedFeatures />
        <Metrics />
        <DeploymentPatterns />
        <Principles />
        <HomeCTA />
      </main>
      {/* Capability anchors for deep links like /#capabilities */}
      <div className="sr-only" aria-hidden>
        {CAPABILITIES.map((c) => (
          <span key={c.id} id={c.id} />
        ))}
      </div>
    </>
  )
}
