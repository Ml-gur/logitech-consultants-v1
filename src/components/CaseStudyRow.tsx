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
        className="group block bg-[#f0f0f0] border border-black/[0.06] rounded-[20px] overflow-hidden grid md:grid-cols-2 transition-colors duration-300 hover:border-black/10"
      >
        {/* Image — left half, no zoom on hover (matches the original) */}
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[420px] overflow-hidden bg-[#e5e5e5]">
          {c.image ? (
            <img src={c.image} alt={`${c.name} case study`} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#e5e5e5] via-[#eaeaea] to-[#d8d8d8]" />
          )}
        </div>

        {/* Content — title top-left, category top-right, metrics bottom */}
        <div className="relative p-8 md:p-12 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-['Halant'] text-3xl font-semibold text-[#0a0a0a]">{c.name}</h3>
            <span className="text-xs font-medium text-[#4f4f4f] uppercase tracking-wider pt-2 shrink-0">
              {c.category}
            </span>
          </div>

          <div className="flex gap-12 mt-auto pt-10">
            {rowMetrics.map((m) => (
              <div key={m.label}>
                <div className="text-4xl font-semibold text-[#0a0a0a] font-['Halant']">{m.value}</div>
                <div className="text-sm text-[#4f4f4f] mt-1">{m.label}</div>
              </div>
            ))}
            <div className="flex items-end gap-1.5 text-sm text-[#4f4f4f] group-hover:text-[#0a0a0a] transition-colors duration-300">
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
