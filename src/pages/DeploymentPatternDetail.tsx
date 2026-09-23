'use client'

import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import Seo, { breadcrumbLd } from '../lib/Seo'
import { SITE, absUrl } from '../lib/brand'
import DeploymentCard from '../components/DeploymentCard'
import NotFoundPage from './NotFoundPage'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function DeploymentPatternDetail() {
  const { slug } = useParams()
  const { caseStudies: patterns, cmsEnabled, cmsLoaded } = useCms()
  const c = patterns.find((cs) => cs.slug === slug)
  const others = patterns.filter((cs) => cs.slug !== slug)

  if (!c && cmsEnabled && !cmsLoaded) return null
  if (!c) return <NotFoundPage />

  return (
    <section className="relative pt-32">
      <Seo
        title={`${c.name} (${c.category})`}
        description={`${c.tagline} ${c.timeframe}.`}
        path={`/deployment-patterns/${c.slug}`}
        image={c.image || undefined}
        type="article"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Deployment patterns', path: '/deployment-patterns' },
            { name: c.name, path: `/deployment-patterns/${c.slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: `${c.name}: ${c.tagline}`,
            description: c.tagline,
            image: c.image || undefined,
            about: c.stack,
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
            mainEntityOfPage: absUrl(`/deployment-patterns/${c.slug}`),
          },
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
          <Link to="/deployment-patterns" className="inline-flex items-center gap-2 text-sm text-fog hover:text-paper transition-colors mb-8">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M10 3l-5 5 5 5" />
            </svg>
            All deployment patterns
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)} className="mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="tag-pill px-3 py-1.5 text-signal border-signal/40">{c.category}</span>
            <span className="text-xs text-fog">{c.timeframe}</span>
          </div>
          <h1 className="text-[clamp(38px,6vw,72px)] leading-[1.03] tracking-[-0.03em] max-w-[820px] mb-6">
            {c.name}
          </h1>
          <p className="text-lg text-fog max-w-[620px] leading-relaxed mb-8">{c.tagline}</p>

          {/* Capability stack */}
          <div className="flex flex-wrap gap-2">
            {c.stack.map((s) => (
              <span
                key={s}
                className="rounded-[30px] border border-signal/30 text-signal text-[11px] font-medium uppercase tracking-[0.1em] px-3 py-1.5"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={springReveal(0.1)}
          className="rounded-[20px] overflow-hidden mb-20 aspect-[16/9] bg-[#191919] border border-white/10"
        >
          {c.image ? (
            <img
              src={c.image}
              alt={`${c.name} (${c.category}) deployment pattern`}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] via-[#1f1f1f] to-[#141414]" />
          )}
        </motion.div>

        {/* Body */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-24 mb-20">
          <div className="space-y-14 max-w-[720px]">
            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
              <p className="section-label">The problem</p>
              <p className="text-[17px] text-fog leading-relaxed">{c.problem}</p>
            </motion.div>

            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
              <p className="section-label">How we build it</p>
              <p className="text-[17px] text-fog leading-relaxed">{c.approach}</p>
            </motion.div>

            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
              <p className="section-label">What we measure</p>
              <div className="space-y-4">
                {c.measures.map((m) => (
                  <div key={m.metric} className="rounded-[20px] border border-white/10 p-5 bg-[#191919]">
                    <div className="text-[16px] font-medium text-paper mb-1.5">{m.metric}</div>
                    <div className="text-sm text-fog leading-relaxed">{m.detail}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
              <p className="section-label">Governance controls</p>
              <ul className="space-y-4">
                {c.governance.map((g) => (
                  <li key={g} className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 shrink-0 text-signal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-[16px] leading-relaxed text-paper">{g}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.1)}
            className="lg:sticky lg:top-28 h-fit space-y-4"
          >
            <div className="rounded-[24px] bg-[#191919] border border-white/10 p-7">
              <p className="text-xs uppercase tracking-[0.14em] text-fog mb-4">Connects to</p>
              <ul className="space-y-3">
                {c.integrations.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ash leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal mt-2 shrink-0" aria-hidden />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[24px] bg-[#191919] border border-signal/30 p-7">
              <p className="text-base font-medium text-paper mb-2">Is this close to your problem?</p>
              <p className="text-sm text-fog leading-relaxed mb-6">
                A 30-minute call is enough for us to tell you whether it is, and roughly what it would take.
              </p>
              <Link to="/contact" className="btn-primary w-full px-6 py-3.5 text-sm">
                Book a discovery call
              </Link>
            </div>
          </motion.div>
        </div>

        {/* More patterns */}
        <div className="border-t border-white/10 pt-16">
          <p className="section-label mb-8">More deployment patterns</p>
          <div className="space-y-5">
            {others.map((cs) => (
              <DeploymentCard key={cs.slug} c={cs} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
