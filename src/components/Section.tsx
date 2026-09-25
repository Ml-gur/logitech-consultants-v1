'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

/**
 * Band structure for the whole site.
 *
 * Before this file every band repeated the same four decisions by hand — the
 * content measure (`max-w-[1200px] mx-auto px-5 sm:px-8`), the vertical
 * interval (`py-20 sm:py-28`, `py-24 sm:py-32`, `py-12 sm:py-14` …), the
 * eyebrow/heading/lede triad and its reveal stagger. Because they were copied
 * rather than shared, they drifted: two bands with the same rank rendered
 * different heading sizes and different padding.
 *
 * The rhythm is deliberately two intervals, not one (`--band-y` for a
 * narrative band, `--band-y-tight` for a support band), so tight and generous
 * alternate instead of every group carrying equal weight. Both intervals and
 * the `.shell` measure are declared once in index.css — the same measure the
 * floating nav uses, which is what makes the wordmark line up with the body
 * text. This file only names them; it does not restate their values.
 *
 * Reading order inside a band is fixed: label → heading → lede → content.
 * That order is product priority (what this is, then what it means, then the
 * evidence), and it is why the primitives live together rather than being
 * re-assembled per component.
 */

/** The interval between a band header and the content it introduces. */
export const BAND_CONTENT = 'mt-12 sm:mt-16'

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.p
      initial={revealInitial}
      whileInView={revealWhileInView}
      viewport={revealViewport}
      transition={springReveal()}
      className={cn('section-label', className)}
    >
      {children}
    </motion.p>
  )
}

/**
 * The interval a band takes, named for what the band is doing relative to its
 * neighbours rather than for a size. The three sizes live in `index.css`; this
 * is the vocabulary that decides which one a band gets.
 *
 *   band      stands on its own — equal air on both sides
 *   tight     a support strip that belongs to its neighbour
 *   attached  continues the band above it
 *   loose     opens a movement after a register change
 *
 * The prop used to be a two-value union that nothing ever passed, so every
 * narrative band took the same interval on both sides and every seam on the
 * page came out at 208px. Naming the relationships is what makes the page
 * capable of a rhythm at all.
 */
export type BandTone = 'band' | 'tight' | 'attached' | 'loose'

const TONE_CLASS: Record<BandTone, string> = {
  band: 'band',
  tight: 'band-tight',
  attached: 'band-attached',
  loose: 'band-loose',
}

export function Band({
  id,
  children,
  tone = 'band',
  /**
   * Draw the hairline that separates this band from the one above it.
   *
   * It belongs to the band rather than to the page so a band is one element:
   * the alternative was `<section><Rule /><Band>` everywhere, which is a
   * nested section whose only job was to hold a border.
   */
  rule = false,
  className,
  ariaLabelledBy,
}: {
  id?: string
  children: ReactNode
  tone?: BandTone
  rule?: boolean
  className?: string
  ariaLabelledBy?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn('relative', TONE_CLASS[tone], className)}
    >
      {rule && <Rule />}
      <div className="shell">{children}</div>
    </section>
  )
}

/**
 * The separator between two bands that carry equal weight.
 *
 * A visual pause, not a container: it stays a bare `<hr>` so it never becomes a
 * wrapper that compensates for weak proximity between the groups it divides.
 */
export function Rule({ className }: { className?: string }) {
  return <hr className={cn('rule', className)} />
}

type HeaderLayout =
  /** Heading, then the supporting line beneath it. The default. */
  | 'stack'
  /** Heading left, supporting line right and aligned to its baseline. */
  | 'split'
  /** Both centred: used when the band is a statement, not a section. */
  | 'center'

export function SectionHeader({
  label,
  title,
  lede,
  layout = 'stack',
  /** `lg` is for a page h1 or the closing ask; `band` for an in-page h2. */
  size = 'band',
  className,
  titleClassName,
}: {
  /**
   * Optional on purpose.
   *
   * A `label` renders the small uppercase tracked line above the heading. When
   * every band has one the page acquires a metronome: the visitor learns the
   * label rather than the heading, and the headings read as runner-up text.
   * On the home page three bands carry a label and the rest let the heading
   * speak (see the eyebrow budget note in HomePage.tsx). Pass one when it
   * names something the heading genuinely cannot (a nav destination, a
   * framework) and omit it otherwise.
   */
  label?: string
  title: ReactNode
  lede?: ReactNode
  layout?: HeaderLayout
  size?: 'band' | 'lg'
  className?: string
  titleClassName?: string
}) {
  const headingClass = cn(
    size === 'lg' ? 'text-heading-band-lg' : 'text-heading-band',
    'leading-[1.06] tracking-[-0.02em]',
    titleClassName,
  )

  const heading = (
    <motion.h2
      initial={revealInitial}
      whileInView={revealWhileInView}
      viewport={revealViewport}
      transition={springReveal(0.06)}
      className={headingClass}
    >
      {title}
    </motion.h2>
  )

  const ledeBlock = lede ? (
    <motion.p
      initial={revealInitial}
      whileInView={revealWhileInView}
      viewport={revealViewport}
      transition={springReveal(0.1)}
      className="text-body leading-relaxed text-fog sm:text-lede"
    >
      {lede}
    </motion.p>
  ) : null

  if (layout === 'center') {
    return (
      <div className={cn('text-center', className)}>
        {label && <SectionLabel className="text-center">{label}</SectionLabel>}
        <div className="mx-auto max-w-[760px]">{heading}</div>
        {/* `ch`, not px: the measure is a reading decision (~62 characters),
            and it has to survive a font-size change or a longer translation. */}
        {ledeBlock && <div className="mx-auto mt-5 max-w-[62ch]">{ledeBlock}</div>}
      </div>
    )
  }

  if (layout === 'split') {
    return (
      <div className={cn('grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-end lg:gap-16', className)}>
        <div>
          {label && <SectionLabel>{label}</SectionLabel>}
          {heading}
        </div>
        {ledeBlock && <div className="lg:pb-1.5">{ledeBlock}</div>}
      </div>
    )
  }

  return (
    <div className={className}>
      {label && <SectionLabel>{label}</SectionLabel>}
      {heading}
      {ledeBlock && <div className="mt-5 max-w-[62ch]">{ledeBlock}</div>}
    </div>
  )
}
