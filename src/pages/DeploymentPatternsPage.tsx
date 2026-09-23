import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import Seo, { breadcrumbLd } from '../lib/Seo'
import { SITE, absUrl } from '../lib/brand'
import DeploymentStack from '../components/DeploymentStack'
import { ListSkeleton } from '../components/Loading'

export default function DeploymentPatternsPage() {
  const { deploymentPatterns: patterns, cmsEnabled, cmsLoaded } = useCms()
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
        <motion.p className="section-label">
          Deployment patterns
        </motion.p>

        <motion.h1
          className="text-[clamp(36px,6vw,72px)] leading-[1.02] tracking-[-0.03em] max-w-[820px] mb-6"
        >
          Patterns, not promises.
        </motion.h1>

        <motion.p
          className="text-[18px] text-fog max-w-[620px] mb-10"
        >
          A deployment pattern is a class of system we have learned how to build, integrate and govern: the
          problem it exists for, how it is put together, and the measurement dimensions agreed before it goes
          live.
        </motion.p>

        <motion.div
          className="rounded-panel bg-carbon border border-hairline p-6 max-w-[720px] mb-20"
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

        {/* The page ends on the same single ask as every other page in the
            site — a reader who has scrolled the whole stack should not have to
            hunt for what to do next. */}
        <div className="mt-20 rounded-panel border border-hairline bg-carbon p-8 text-center sm:p-10">
          <h2 className="font-sans text-[clamp(24px,3.5vw,36px)] font-medium mb-4">
            Bring us a problem, not a brief.
          </h2>
          <p className="text-fog max-w-[520px] mx-auto mb-8">
            Tell us which workflow keeps breaking. We will tell you whether an intelligent system is the right
            answer, and if it is not, we will say so.
          </p>
          <Link to="/contact" className="btn-primary inline-flex px-7 py-3.5 text-sm">
            Book a discovery call
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
