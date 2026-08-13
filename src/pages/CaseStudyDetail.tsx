'use client'

import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import Seo, { breadcrumbLd } from '../lib/Seo'
import CaseStudyRow from '../components/CaseStudyRow'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function CaseStudyDetail() {
  const { slug } = useParams()
  const { caseStudies } = useCms()
  const c = caseStudies.find((cs) => cs.slug === slug)
  const others = caseStudies.filter((cs) => cs.slug !== slug)

  if (!c) {
    return (
      <section className="relative pt-32">
      <Seo title="Case Study Not Found" description="This case study could not be found." path="/case-studies" />
        <div className="max-w-[1200px] mx-auto px-6 text-center py-24">
          <h1 className="text-4xl font-medium mb-4">Case study not found</h1>
          <Link to="/case-studies" className="text-sm text-fog hover:text-paper transition-colors">
            ← Back to case studies
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="relative pt-32">
      <Seo
        title={`${c.name} — AI Automation Case Study`}
        description={`${c.tagline} ${c.outcome[0].value} ${c.outcome[0].label.toLowerCase()} in ${c.timeframe.toLowerCase()}.`}
        path={`/case-studies/${c.slug}`}
        image={c.image}
        type="article"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Case Studies', path: '/case-studies' },
            { name: c.name, path: `/case-studies/${c.slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${c.name}: ${c.tagline}`,
            image: c.image ? c.image : undefined,
            datePublished: `${c.year}-01-01`,
            publisher: { '@type': 'Organization', name: 'Logitech Consultants' },
            description: c.tagline,
          },
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
          <Link to="/case-studies" className="inline-flex items-center gap-2 text-sm text-fog hover:text-paper transition-colors mb-8">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3l-5 5 5 5" />
            </svg>
            All case studies
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)} className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="tag-pill px-3 py-1.5 text-signal border-signal/40">{c.category}</span>
            <span className="text-xs text-fog">{c.year} · {c.timeframe}</span>
          </div>
          <h1 className="text-[clamp(40px,6vw,80px)] leading-[1.02] tracking-[-0.03em] max-w-[780px] mb-6">
            {c.name}
          </h1>
          <p className="text-lg text-fog max-w-[560px] leading-relaxed">{c.tagline}</p>
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
            <img src={c.image} alt={`${c.name} case study`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] via-[#1f1f1f] to-[#141414]" />
          )}
        </motion.div>

        {/* Body */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-24 mb-20">
          <div className="space-y-16 max-w-[720px]">
            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
              <p className="section-label">The Challenge</p>
              <p className="text-[17px] text-fog leading-relaxed">{c.challenge}</p>
            </motion.div>

            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
              <p className="section-label">What We Built</p>
              <p className="text-[17px] text-fog leading-relaxed">{c.build}</p>
            </motion.div>

            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
              <p className="section-label">The Outcome</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {c.outcome.map((m) => (
                  <div key={m.label} className="rounded-[20px] border border-white/10 p-6 bg-[#191919] min-w-0">
                    <div className="text-2xl font-medium text-signal font-display mb-2 break-words tabular-nums">{m.value}</div>
                    <div className="text-xs text-fog">{m.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Client review */}
          <motion.div
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.1)}
            className="lg:sticky lg:top-28 h-fit rounded-[24px] bg-[#191919] border border-white/10 p-8"
          >
            <svg className="w-6 h-6 text-signal/50 mb-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.545 6.068 5.982 8.789 5.982 11H10v10H0z" />
            </svg>
            <p className="text-[15px] text-ash leading-relaxed mb-6">&ldquo;{c.review.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#405bff] to-[#7084ff] flex items-center justify-center text-sm font-medium text-white">
                {c.review.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-medium text-paper">{c.review.name}</div>
                <div className="text-xs text-fog">{c.review.role}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* More case studies */}
        <div className="border-t border-white/10 pt-16">
          <p className="section-label mb-8">More case studies</p>
          <div className="space-y-5">
            {others.map((cs, i) => (
              <CaseStudyRow key={cs.slug} c={cs} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
