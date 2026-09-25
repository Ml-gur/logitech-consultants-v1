'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import DeploymentStack from './DeploymentStack'
import { ListSkeleton } from './Loading'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { BAND_CONTENT, Band, SectionHeader } from './Section'

/**
 * Deployment patterns (formerly the case-studies section).
 *
 * The proof here is the *pattern*, not a client logo: what we build, which
 * capability actions it spans, and the dimensions we instrument. Named
 * references replace this framing as engagements complete.
 */
export default function DeploymentPatterns() {
  const { caseStudies: patterns, cmsEnabled, cmsLoaded } = useCms()

  return (
    // `attached`: the evidence follows the claim without a pause. The stack
    // pins and scrolls over 2,800px, so the band does not need air on top of
    // that — it needs to start.
    <Band id="deployment-patterns" tone="attached">
      <SectionHeader
        label="Deployment patterns"
        title="What we deploy, and what it has to prove."
        lede="Each pattern below is a class of system we build: the problem it exists for, how it is put together, and the measurement dimensions agreed before it goes live."
      />

      <div className={BAND_CONTENT}>
        {/* Skeleton only while a configured CMS is fetching and has no data yet. */}
        {cmsEnabled && !cmsLoaded && patterns.length === 0 ? (
          <ListSkeleton count={3} variant="pattern" />
        ) : (
          <DeploymentStack patterns={patterns} />
        )}

        <motion.div
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.1)}
          className="mt-16 flex flex-wrap items-center gap-4"
        >
          <Link to="/deployment-patterns" className="btn-ghost px-6 py-3 text-sm">
            All deployment patterns
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
          <p className="text-sm text-fog max-w-[46ch]">
            Named references are published as engagements complete. We would rather show you nothing than
            show you something we cannot back up.
          </p>
        </motion.div>
      </div>
    </Band>
  )
}
