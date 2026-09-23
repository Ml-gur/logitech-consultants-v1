'use client'

import Seo, { organizationLd, websiteLd } from '../lib/Seo'
import { CAPABILITIES } from '../lib/brand'
import Hero from '../components/Hero'
import LogoMarquee from '../components/LogoMarquee'
import TabbedFeatures from '../components/TabbedFeatures'
import Metrics from '../components/Metrics'
import DeploymentPatterns from '../components/DeploymentPatterns'
import Principles from '../components/Principles'
import Blog from '../components/Blog'
import FAQ from '../components/FAQ'

/**
 * Home, deliberately minimal.
 *
 * The page answers four questions and stops: what we are (Hero), what we
 * build (capabilities), what we hold ourselves to (measurement, principles),
 * and what a deployment looks like (the pattern stack). Everything else the
 * brand has to say lives one level down, where a reader who wants depth is
 * already going:
 *   - governance + the ten-stage deployment model → /capabilities
 *   - positioning + the company story            → /about
 *   - engagement models (pricing)                → hidden for now (see below)
 *
 * The above-the-fold CTA lives in Hero. Smooth scrolling is mounted once in
 * Layout (src/lib/useLenis), so scroll-driven sections read one scroll source.
 */
export default function HomePage() {
  return (
    <>
      <Seo
        title="Applied AI Systems for Organizations"
        description="An applied AI systems company. Naivolabs designs, builds and deploys governed intelligent systems that work inside real organizations, measured."
        path="/"
        jsonLd={[organizationLd(), websiteLd()]}
      />
      <Hero />
      <LogoMarquee />
      <TabbedFeatures />
      <Metrics />
      <DeploymentPatterns />
      <Principles />
      <Blog />
      <FAQ />
      {/* Capability anchors keep deep links like /#capabilities meaningful */}
      <div className="sr-only" aria-hidden>
        {CAPABILITIES.map((c) => (
          <span key={c.id} id={c.id} />
        ))}
      </div>
    </>
  )
}
