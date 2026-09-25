'use client'

import { motion } from 'framer-motion'
import { cn } from '../utils'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { PRINCIPLES } from '../lib/brand'
import { BAND_CONTENT, Band, SectionHeader } from './Section'

const CLOSING_INDEX = PRINCIPLES.length - 1

function PrincipleCard({ title, index }: { title: string; index: number }) {
  const closing = index === CLOSING_INDEX

  // The lift lives in CSS, not in `onMouseEnter` handlers that mutate `style`.
  // Handlers only ever fired for a pointer, so the card that carried the band's
  // hover affordance was the one card a keyboard could never light up, and a
  // touch device got no feedback at all.
  return (
    <figure
      className={cn(
        'group relative flex h-full flex-col rounded-[20px] bg-raised border border-white/[0.07] p-6 sm:p-7',
        'transition-[border-color,box-shadow] duration-300',
        'hover:border-signal/[0.28] hover:shadow-[0_0_20px_rgba(61,85,240,0.1)]',
        closing && 'lg:flex-row lg:items-center lg:gap-10 lg:py-10',
      )}
    >
      <p
        className={`font-mono text-[11px] tracking-[0.12em] ${closing ? 'lg:mb-0 mb-5' : 'mb-5'}`}
        style={{ color: 'var(--color-signal)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </p>

      <blockquote
        className={`leading-relaxed ${
          closing
            ? 'lg:flex-1 text-[18px] lg:text-[22px] lg:leading-snug'
            : 'text-[14px] sm:text-[15px]'
        }`}
        style={{
          fontFamily: closing ? 'var(--font-display)' : 'var(--font-sans)',
          fontWeight: closing ? 300 : 400,
          fontStyle: closing ? 'italic' : 'normal',
          color: 'var(--color-ash)',
        }}
      >
        {title}
      </blockquote>

      <figcaption
        className={`mt-5 pt-4 text-[10px] uppercase tracking-[0.16em] ${
          closing
            ? 'lg:mt-0 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-8 lg:shrink-0'
            : ''
        }`}
        style={{
          borderTop: closing ? undefined : '1px solid rgba(255,255,255,0.06)',
          borderLeft: closing ? '1px solid rgba(255,255,255,0.06)' : undefined,
          // `fog`, not `slate`: this label is 10px text on a card, where slate
          // measures 3.5:1 — under the AA floor, and against the rule ADR-008
          // already states ("never slate for small text"). Fog measures 6.3:1.
          color: 'var(--color-fog)',
        }}
      >
        Naivolabs principle
      </figcaption>
    </figure>
  )
}

export default function Principles() {
  // A hairline here, not above Measurement: this is where the page stops
  // showing what we build and starts stating how we work.
  //
  // `loose`: the page's second and biggest register change, and the widest seam
  // on the page. The rule sits inside the interval rather than at its edge.
  return (
    <Band id="principles" rule tone="loose">
        {/* Split header, and the one place on the page where it earns its keep:
            the lede is the band's argument (what will replace this wall of
            principles once there is a customer to name), not a restatement of
            the heading, and bottom-aligning it puts the two halves of one
            thought on the same baseline. Everywhere else the header stacks. */}
        <SectionHeader
          layout="split"
          title={
            <>
              Seven rules we do{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--color-signal)' }}>
                not
              </em>{' '}
              bend.
            </>
          }
          lede="When there is a reference customer to name, this is where it will go. Until then, here is what you can hold us to."
        />

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ${BAND_CONTENT}`}>
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.title}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(Math.min(i, 5) * 0.05)}
              className={i === CLOSING_INDEX ? 'sm:col-span-2 lg:col-span-3' : ''}
            >
              <PrincipleCard title={p.title} index={i} />
            </motion.div>
          ))}
        </div>
    </Band>
  )
}
