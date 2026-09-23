import Seo, { organizationLd, websiteLd } from '../lib/Seo'
import Hero from '../components/Hero'
import Capabilities from '../components/Capabilities'
import DeploymentPatterns from '../components/DeploymentPatterns'
import Approach from '../components/Approach'
import HomeCTA from '../components/HomeCTA'

/**
 * Home page.
 *
 * Five sections, down from seven. What was removed and why:
 *
 *   LogoMarquee   — a scrolling wall of nine third-party vendor marks under
 *                   the line "platforms your organization already trusts". It
 *                   read as a client-logo wall, which the brand explicitly
 *                   refuses to fake, and it was the page's only motion for its
 *                   own sake.
 *   TabbedFeatures — see src/components/Capabilities.tsx.
 *   Metrics       — a stat band of numbers nobody measured; see
 *                   src/components/Approach.tsx.
 *   Principles    — seven cards stamped 01–07 that were not a sequence; folded
 *                   into Approach.
 *
 * The page is now: who we are, what we build, what we deploy, what we promise,
 * and one action.
 */
export default function HomePage() {
  return (
    <>
      <Seo
        title="Applied AI systems for organizations"
        description="Naivolabs designs, builds and deploys governed AI systems that answer, retrieve and act inside the systems you already run, in production and measured."
        path="/"
        jsonLd={[organizationLd(), websiteLd()]}
      />
      <Hero />
      <Capabilities />
      <DeploymentPatterns />
      <Approach />
      <HomeCTA />
    </>
  )
}
