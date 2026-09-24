'use client'

import Seo, { organizationLd, websiteLd } from '../lib/Seo'
import Hero from '../components/Hero'
import LogoMarquee from '../components/LogoMarquee'
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
        <Metrics />
        <DeploymentPatterns />
        <Principles />
        <HomeCTA />
      </main>
    </>
  )
}
