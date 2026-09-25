'use client'

import { Link } from 'react-router-dom'
import type { DeploymentPattern } from '../data/content'
import { cn } from '../utils'

/**
 * One deployment pattern, as a full-width panel.
 *
 * Used inside the scroll-driven stack on the home and listing pages, and as a
 * plain static card on detail pages. The panel shows what we build, the
 * capability actions it spans and the two headline measurement dimensions —
 * never invented client metrics.
 */
export default function DeploymentCard({
  c,
  className,
  asLink = true,
}: {
  c: DeploymentPattern
  className?: string
  asLink?: boolean
}) {
  const measures = c.measures.slice(0, 2)

  const inner = (
    <>
      {/* Image, left half, no zoom on hover */}
      <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[380px] overflow-hidden bg-carbon min-w-0">
        {c.image ? (
          <img
            src={c.image}
            alt={`${c.name} (${c.category}) deployment pattern`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2c2c2c] via-[#1f1f1f] to-[#141414]" />
        )}
        {/* Category chip, top-left on the image */}
        <span className="absolute top-4 left-4 tag-pill px-3 py-1.5 bg-midnight/85 backdrop-blur-sm">
          {c.category}
        </span>
      </div>

      {/* Content, name, capability stack, measures, CTA */}
      <div className="relative p-7 sm:p-9 md:p-12 flex flex-col min-w-0">
        <h3 className="font-display text-2xl md:text-[32px] font-medium text-paper mb-3">{c.name}</h3>
        <p className="text-[15px] text-fog leading-relaxed mb-6 max-w-[62ch]">{c.tagline}</p>

        {/* Capability stack, which of the four actions this spans */}
        <div className="flex flex-wrap gap-2 mb-8">
          {c.stack.map((s) => (
            <span
              key={s}
              className="rounded-[30px] border border-signal/30 text-signal text-[11px] font-medium uppercase tracking-[0.1em] px-3 py-1.5"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <p className="text-[11px] uppercase tracking-[0.14em] text-fog mb-4">What we measure</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-x-10 gap-y-4">
            {measures.map((m) => (
              <div key={m.metric} className="min-w-0 max-w-[260px]">
                <div className="text-[15px] font-medium text-paper mb-1">{m.metric}</div>
                <div className="text-[13px] text-fog leading-snug">{m.detail}</div>
              </div>
            ))}
          </div>

          {asLink && (
            <div className="mt-8 flex items-center gap-1.5 text-sm text-fog group-hover:text-paper transition-colors duration-300">
              See the pattern
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-signal transition-transform duration-300 group-hover:translate-x-1">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </>
  )

  const shell = cn(
    'group block bg-raised rounded-[30px] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white/10 transition-colors duration-300 hover:border-signal/40',
    className
  )

  if (!asLink) return <div className={shell}>{inner}</div>

  return (
    <Link to={`/deployment-patterns/${c.slug}`} className={shell}>
      {inner}
    </Link>
  )
}
