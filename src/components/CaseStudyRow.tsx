'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { CaseStudy } from '../data/content'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function CaseStudyRow({ c, index }: { c: CaseStudy; index: number }) {
  const rowMetrics = c.outcome.slice(0, 2)

  return (
    <motion.div
      initial={revealInitial}
      whileInView={revealWhileInView}
      viewport={{ once: true, margin: '-60px' }}
      transition={springReveal(index * 0.08)}
    >
      <Link
        to={`/case-studies/${c.slug}`}
        className="group block bg-[#191919] rounded-[30px] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white/10 transition-colors duration-300 hover:border-signal/40"
      >
        {/* Image — left half, no zoom on hover */}
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[380px] overflow-hidden bg-[#191919] min-w-0">
          {c.image ? (
            <img src={c.image} alt={`${c.name} case study`} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2c2c2c] via-[#1f1f1f] to-[#141414]" />
          )}
          {/* Category chip — top-left on the image */}
          <span className="absolute top-4 left-4 tag-pill px-3 py-1.5 bg-[#0e0e0e]/80 backdrop-blur-sm">
            {c.category}
          </span>
        </div>

        {/* Content — title, metrics, CTA */}
        <div className="relative p-8 md:p-12 flex flex-col min-w-0">
          <h3 className="font-display text-2xl md:text-3xl font-medium text-paper mb-4">{c.name}</h3>
          <p className="text-[15px] text-fog leading-relaxed mb-8">{c.tagline}</p>

          <div className="flex flex-wrap items-end gap-x-10 gap-y-4 mt-auto">
            {rowMetrics.map((m) => (
              <div key={m.label} className="min-w-0">
                <div className="text-3xl md:text-4xl font-medium text-signal tabular-nums font-display">{m.value}</div>
                <div className="text-sm text-fog mt-1.5">{m.label}</div>
              </div>
            ))}
            <div className="flex items-end gap-1.5 text-sm text-fog group-hover:text-paper transition-colors duration-300 whitespace-nowrap">
              View case study
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-signal">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
