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
        className="group block bg-[#e5e5e5] rounded-[20px] overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-colors duration-300"
      >
        {/* Image — left half, no zoom on hover (matches the original) */}
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[420px] overflow-hidden bg-[#e5e5e5] min-w-0">
          {c.image ? (
            <img src={c.image} alt={`${c.name} case study`} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#e5e5e5] via-[#eaeaea] to-[#d8d8d8]" />
          )}
        </div>

        {/* Content — title top-left, category top-right, metrics bottom */}
        <div className="relative p-8 md:p-12 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-['Halant'] text-3xl font-semibold text-[#0a0a0a]">{c.name}</h3>
            <span className="text-xs font-medium text-[#4f4f4f] uppercase tracking-wider pt-2 shrink-0">
              {c.category}
            </span>
          </div>

          {/* Metrics + CTA. Measured fix (2026-08-05): at 320px the fixed
              flex gap-12 row was ~100px wider than the card, so the
              overflow-hidden card clipped the 'View case study' link. Now it
              wraps: metrics stay on one line, the CTA drops to its own line
              when it doesn't fit (matching the original, which clips nothing). */}
          <div className="flex flex-wrap items-end gap-x-10 gap-y-3 sm:gap-x-12 mt-auto pt-10">
            {rowMetrics.map((m) => (
              <div key={m.label} className="min-w-0">
                <div className="text-3xl sm:text-4xl font-semibold text-[#0a0a0a] font-['Halant']">{m.value}</div>
                <div className="text-sm text-[#4f4f4f] mt-1.5">{m.label}</div>
              </div>
            ))}
            <div className="flex items-end gap-1.5 text-sm text-[#4f4f4f] group-hover:text-[#0a0a0a] transition-colors duration-300 whitespace-nowrap">
              View case study
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
