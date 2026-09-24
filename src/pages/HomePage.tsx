'use client'

import Seo, { organizationLd, websiteLd } from '../lib/Seo'
import Hero from '../components/Hero'
import LogoMarquee from '../components/LogoMarquee'
import DeploymentPatterns from '../components/DeploymentPatterns'
import Principles from '../components/Principles'
import HomeCTA from '../components/HomeCTA'

export default function HomePage() {
  return (
    <>
      <Seo
        title="Put intelligence to work."
        description="Naivolabs designs, builds and deploys intelligent AI systems that help organizations serve people, use information and operate their workflows — governed, measured, and running in production."
        path="/"
        jsonLd={[organizationLd(), websiteLd()]}
      />
      <Hero />
      <div className="inspiration-shell">
        <LogoMarquee />
        <Principles />
        <DeploymentPatterns />
        <HomeCTA />
      </div>
    </>
  )
}
