'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { PRINCIPLES } from '../lib/brand'

/**
 * Principles band.
 *
 * This replaced a two-row testimonials marquee of invented clients and quotes.
 * The brand is built on evidence over claims, so until there are named
 * references we can stand behind, the honest equivalent is the set of
 * behavioural rules the company actually operates by, the same commitments
 * published in the brand foundation.
 *
 * Layout note: these are meant to be *read*, so they render as a static grid
 * where all seven rules are visible at once. An earlier revision scrolled them
 * through a marquee, which meant a visitor could never see the full set or read
 * a rule at their own pace. The last rule takes the full width as a closing
 * statement so the 3-column grid ends on a deliberate line rather than a gap.
 */

const CLOSING_INDEX = PRINCIPLES.length - 1

function PrincipleCard({ title, index }: { title: string; index: number }) {
  const closing = index === CLOSING_INDEX

  return (
    <figure
      className={`group relative flex h-full flex-col rounded-[30px] bg-[#191919] border border-white/10 p-7 max-md:p-6 transition-colors duration-300 hover:border-signal/40 ${
        closing ? 'lg:flex-row lg:items-center lg:gap-8 lg:py-9' : ''
      }`}
    >
      <p
        className={`font-mono text-xs text-signal tabular-nums ${
          closing ? 'lg:mb-0 mb-5' : 'mb-5'
        }`}
      >
        {String(index + 1).padStart(2, '0')}
      </p>

      <blockquote
        className={`text-ash leading-relaxed ${closing ? 'lg:text-[22px] lg:leading-snug lg:flex-1' : 'text-[15px]'}`}
      >
        {title}
      </blockquote>

      <figcaption
        className={`mt-6 pt-5 border-t border-white/5 text-xs uppercase tracking-[0.14em] text-fog ${
          closing ? 'lg:mt-0 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-8 lg:shrink-0' : ''
        }`}
      >
        Naivolabs principle
      </figcaption>
    </figure>
  )
}

export default function Principles() {
  return (
    <section id="principles" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="section-label"
        >
          How we work
        </motion.p>

        <motion.h2
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.08)}
          className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] max-w-[680px] mb-6"
        >
          Seven rules we do not bend.
        </motion.h2>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.12)}
          className="text-[17px] text-fog max-w-[520px] mb-16"
        >
          When there is a reference customer to name, this is where it will go. Until then, here is what you can
          hold us to.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.title}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(Math.min(i, 5) * 0.06)}
              className={i === CLOSING_INDEX ? 'sm:col-span-2 lg:col-span-3' : ''}
            >
              <PrincipleCard title={p.title} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
