'use client'

import Seo, { organizationLd, websiteLd } from '../lib/Seo'
import Hero from '../components/Hero'
import LogoMarquee from '../components/LogoMarquee'
import TabbedFeatures from '../components/TabbedFeatures'
import Metrics from '../components/Metrics'
import DeploymentPatterns from '../components/DeploymentPatterns'
import Principles from '../components/Principles'
import HomeCTA from '../components/HomeCTA'

/**
 * Eyebrow budget.
 *
 * Seven bands, and at most three of them open with a small uppercase tracked
 * label. The rule exists because a label above every heading turns the page
 * into a metronome: the visitor starts reading the labels and the headings
 * become runner-up text. The three that keep one are the three that name
 * something the heading cannot, the tool strip (which labels an otherwise
 * anonymous wall of logos), Deployment patterns (the nav destination) and the
 * closing ask. Capabilities, Measurement and Principles let the heading lead.
 *
 * The counts, against the source: 1 in LogoMarquee, 2 in DeploymentPatterns,
 * 3 in HomeCTA. `SectionHeader`'s `label` is optional for exactly this reason,
 * and adding a fourth is a deliberate decision rather than a default.
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
      <HomeCTA />
      {/*
       * No trailing anchor block here. It used to render `id="converse"` and
       * friends as zero-height spans after the closing CTA, so /#converse
       * scrolled to the bottom of the page instead of to the capability. The
       * anchors now live on the capabilities band itself (see TabbedFeatures),
       * which is where the reader expects to land.
       */}
    </>
  )
}
