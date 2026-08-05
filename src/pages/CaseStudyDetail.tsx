'use client'

import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import CaseStudyRow from '../components/CaseStudyRow'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function CaseStudyDetail() {
  const { slug } = useParams()
  const { caseStudies } = useCms()
  const c = caseStudies.find((cs) => cs.slug === slug)
  const others = caseStudies.filter((cs) => cs.slug !== slug)

  if (!c) {
    return (
      <section className="relative pt-[76px]">
        <div className="section-panel section-panel-dark rounded-[50px]">
          <div className="section-inner text-center py-24">
            <h1 className="font-['Halant'] text-4xl font-semibold text-[#0a0a0a] mb-4">Case study not found</h1>
            <Link to="/case-studies" className="text-sm text-[#4f4f4f] hover:text-[#0a0a0a] transition-colors">
              ← Back to case studies
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative pt-[76px]">
      <div className="section-panel section-panel-dark rounded-[50px]">
        <div className="section-inner">
          <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
            <Link to="/case-studies" className="inline-flex items-center gap-2 text-sm text-[#4f4f4f] hover:text-[#0a0a0a] transition-colors mb-8">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3l-5 5 5 5" />
              </svg>
              All case studies
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)} className="mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-xs font-medium text-[#4f4f4f] uppercase tracking-wider">{c.category}</span>
              <span className="w-1 h-1 rounded-full bg-[#4f4f4f]" />
              <span className="text-xs text-[#4f4f4f]">{c.year} · {c.timeframe}</span>
            </div>
            <h1            className="font-['Halant'] text-[clamp(40px,6vw,80px)] font-semibold leading-[1.05] tracking-tight text-[#0a0a0a] max-w-[760px] mb-6">
              {c.name}
            </h1>
            <p className="text-lg text-[#4f4f4f] max-w-[560px] leading-relaxed">{c.tagline}</p>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={springReveal(0.1)}
            className="rounded-2xl overflow-hidden mb-20 aspect-[16/9] bg-[#0a0a0a]"
          >
            {c.image ? (
              <img src={c.image} alt={`${c.name} case study`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#151619] via-[#1d2026] to-[#0a0a0a]" />
            )}
          </motion.div>

          {/* Body */}
          <div className="grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-24 mb-20">
            <div className="space-y-16 max-w-[720px]">
              <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
                <p className="section-label">The Challenge</p>
                <p className="text-base text-[#4f4f4f] leading-relaxed">{c.challenge}</p>
              </motion.div>

              <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
                <p className="section-label">What We Built</p>
                <p className="text-base text-[#4f4f4f] leading-relaxed">{c.build}</p>
              </motion.div>

              <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
                <p className="section-label">The Outcome</p>
                {/* Measured live on the original (2026-08-05): on mobile the outcome
                    cards are FULL-WIDTH, one per row (values ~22.4px); on desktop they
                    sit in a 3-column row (values 24px). The old grid-cols-2 + text-3xl
                    made '99.8%'/'Under 30s'/'Unchanged' overflow their cells. */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {c.outcome.map((m) => (
                    <div key={m.label} className="border border-white/5 rounded-2xl p-6 bg-[#151619] min-w-0">
                      <div className="text-[22px] sm:text-2xl font-semibold text-[#f0f0f0] font-['Halant'] mb-2 break-words">{m.value}</div>
                      <div className="text-xs text-[#999]">{m.label}</div>
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
              className="lg:sticky lg:top-24 h-fit bg-[#151619] border border-white/5 rounded-2xl p-8"
            >
              <svg className="w-6 h-6 text-[#ff3700]/30 mb-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.545 6.068 5.982 8.789 5.982 11H10v10H0z" />
              </svg>
              <p className="text-[15px] text-[#e5e5e5] leading-relaxed mb-6">&ldquo;{c.review.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center text-sm font-medium text-[#f0f0f0]">
                  {c.review.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#f0f0f0]">{c.review.name}</div>
                  <div className="text-xs text-[#999]">{c.review.role}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* More case studies */}
          <div className="border-t border-black/10 pt-16">
            <p className="section-label mb-8">More Case Studies</p>
            <div className="space-y-4">
              {others.map((cs, i) => (
                <CaseStudyRow key={cs.slug} c={cs} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
