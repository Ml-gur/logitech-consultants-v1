'use client'

import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import Seo, { breadcrumbLd } from '../lib/Seo'
import { SITE, absUrl } from '../lib/brand'
import DeploymentStack from '../components/DeploymentStack'
import { ListSkeleton } from '../components/Loading'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function DeploymentPatternsPage() {
  const { caseStudies: patterns, cmsEnabled, cmsLoaded } = useCms()
  const showSkeleton = cmsEnabled && !cmsLoaded && patterns.length === 0

  return (
    <section className="relative pt-32">
      <Seo
        title="Deployment Patterns"
        description="The classes of intelligent system Naivolabs builds, voice receptionists, knowledge agents, service routing and document intake, with what each has to prove."
        path="/deployment-patterns"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Deployment patterns', path: '/deployment-patterns' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${SITE.name} deployment patterns`,
            url: absUrl('/deployment-patterns'),
            itemListElement: patterns.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.name,
              url: absUrl(`/deployment-patterns/${p.slug}`),
            })),
          },
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
        <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
          Deployment patterns
        </motion.p>

        <motion.h1
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.08)}
          className="text-[clamp(36px,6vw,72px)] leading-[1.02] tracking-[-0.03em] max-w-[820px] mb-6"
        >
          Patterns, not <span className="text-signal">promises.</span>
        </motion.h1>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.14)}
          className="text-[18px] text-fog max-w-[620px] mb-10"
        >
          A deployment pattern is a class of system we have learned how to build, integrate and govern: the
          problem it exists for, how it is put together, and the measurement dimensions agreed before it goes
          live.
        </motion.p>

        <motion.div
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.18)}
          className="rounded-[24px] bg-[#191919] border border-white/10 p-6 max-w-[720px] mb-20"
        >
          <p className="text-sm text-fog leading-relaxed">
            <span className="text-paper font-medium">Why no client logos?</span> Because we do not have
            published references yet, and we will not dress up borrowed ones. Each pattern below describes work
            we are equipped to do and be measured on. Named case studies replace this framing as engagements
            complete, the same standard we apply to every claim we make.
          </p>
        </motion.div>

        {showSkeleton ? (
          <ListSkeleton count={4} variant="pattern" />
        ) : (
          <DeploymentStack patterns={patterns} />
        )}
      </div>
    </section>
  )
}
