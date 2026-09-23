import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  CalendarClock,
  FileCheck,
  ListOrdered,
  MessagesSquare,
  Ruler,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import { cn } from '../utils'
import { EASE_OUT } from '../motion'

/**
 * Hero.
 *
 * One full-bleed screen, in three parts: the statement (with the marks that
 * stand for what the systems do), one action, and a band of numbers along the
 * bottom edge. Everything below it on the page is present from first paint; this
 * is the site's single orchestrated load (ADR-004).
 *
 * The backdrop is `.hero-glow` — the one gradient in the system — over a
 * full-viewport vignette, so the first screen reads as lit rather than empty.
 * Both layers are decorative (`aria-hidden`, no pointer events) and the copy is
 * measured against the scrim inside the field, not against whatever hue happens
 * to be behind it.
 *
 * The trust row carries no client logos and the band carries no claimed
 * outcomes. The company publishes no named references without a client's written
 * approval, so the marks are the four things a system does and the numbers are
 * facts about how we work: two from `src/lib/brand.ts` (ten stages, six
 * measurement dimensions), the published first-deployment window, and the count
 * of benchmarks we have invented, which is zero.
 */

/**
 * Optional background loop.
 *
 * The reference for this hero carries a full-bleed video. One is supported here
 * but none is bundled, deliberately: the clip that direction uses lives on a
 * third-party CDN as a ~14 MB file, which would break the 1.5 MB per-route
 * transfer budget in `e2e/performance.spec.ts`, download on every phone, and
 * require widening the production CSP (`media-src`) to an origin we do not
 * control. Drop an optimised loop in this directory as `hero-loop.mp4` or
 * `hero-loop.webm` and it is picked up automatically, hashed and served from our
 * own origin; with no file present the hero renders its lit backdrop alone. The
 * CSS decides where it may run (wide viewports, dark theme, motion allowed).
 */
const heroLoop = Object.values(
  import.meta.glob('./hero-loop.{mp4,webm}', {
    query: '?url',
    import: 'default',
    eager: true,
  }) as Record<string, string>,
)[0]

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
}

/**
 * Headline lines rise out of their own mask. 130% rather than 100% so the line
 * starts fully below the wrapper's bottom padding — at 110% the top of the line
 * box shows through the padding area, which is inside the clip.
 */
const line: Variants = {
  hidden: { y: '130%' },
  visible: { y: 0, transition: { duration: 0.75, ease: EASE_OUT } },
}

const settle: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

/** The marks in the trust row. Decorative: the pill beside them carries the words. */
const MARKS = [MessagesSquare, FileCheck, Workflow] as const

/**
 * The band under the statement. Every number is checkable against the rest of
 * the site: the deployment window is the one the FAQ publishes, the ten stages
 * are `DEPLOYMENT_MODEL`, the six dimensions are `MEASUREMENT_DIMENSIONS`, and
 * the last cell is a statement of the brand rule rather than a metric.
 */
interface Metric {
  Icon: typeof CalendarClock
  value: number
  suffix?: string
  label: string
}

const METRICS: Metric[] = [
  { Icon: CalendarClock, value: 4, suffix: '–8 wks', label: 'To a first production deployment' },
  { Icon: ListOrdered, value: 10, label: 'Stages, discovery to product' },
  { Icon: Ruler, value: 6, label: 'Dimensions we measure' },
  { Icon: ShieldCheck, value: 0, label: 'Benchmarks we invented' },
]

/**
 * Count up to the target once, on load. Not an IntersectionObserver: the band is
 * in the first viewport, so the trigger is mount. Reduced motion skips straight
 * to the final value.
 */
function useCountUp(target: number, delay: number, still: boolean): number {
  const [value, setValue] = useState(still ? target : 0)

  useEffect(() => {
    if (still || target === 0) {
      setValue(target)
      return
    }

    const duration = 1200
    const start = performance.now() + delay
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - start) / duration))
      // easeOutCubic: fast off the line, settled before the next cell starts.
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, delay, still])

  return value
}

function MetricCell({ metric, index, still }: { metric: Metric; index: number; still: boolean }) {
  const { Icon, value, suffix, label } = metric
  const shown = useCountUp(value, 480 + index * 90, still)

  return (
    // flex-col-reverse: the DOM reads "label, value" (which is how a screen
    // reader should hear a definition), the screen reads "value, label".
    <div className="flex flex-col-reverse items-center gap-1.5 px-3 py-4 text-center sm:items-start sm:px-6 sm:py-5 sm:text-left">
      <dt className="text-[12.5px] leading-snug text-fog">{label}</dt>
      <dd className="font-mono text-[clamp(19px,2.1vw,26px)] tracking-[-0.02em] text-paper tabular-nums">
        {shown}
        {suffix ? <span className="text-fog">{suffix}</span> : null}
      </dd>
      <Icon className="h-[18px] w-[18px] text-lime" strokeWidth={1.75} aria-hidden />
    </div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="hero" className="relative isolate overflow-hidden">
      {/* Decorative backdrop: a lit field over the canvas, a vignette that
          returns the edges and the strip under the header to the canvas, and a
          looping video if one has been dropped in. */}
      <div aria-hidden className="hero-backdrop pointer-events-none absolute inset-0">
        {heroLoop ? (
          <video className="hero-video" src={heroLoop} autoPlay muted loop playsInline preload="none" />
        ) : null}
        <div className="hero-glow absolute inset-0" />
        <div className="hero-vignette absolute inset-0" />
      </div>

      <motion.div
        className="relative mx-auto flex min-h-[100svh] w-full max-w-[1200px] flex-col px-5 pb-9 pt-[92px] sm:px-8 sm:pb-12 sm:pt-[104px] lg:pt-[128px]"
        variants={reduce ? undefined : container}
        initial={reduce ? false : 'hidden'}
        animate={reduce ? undefined : 'visible'}
      >
        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center sm:py-10">
          {/* Trust row: three overlapping marks, then a pill. The marks are
              decoration for the pill's sentence, so they are hidden from the
              accessibility tree rather than described twice. */}
          <motion.div variants={reduce ? undefined : settle} className="flex items-center">
            <ul className="flex items-center" aria-hidden>
              {MARKS.map((Icon, i) => (
                <li
                  key={i}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong bg-carbon',
                    i > 0 && '-ml-3',
                  )}
                >
                  <Icon className="h-4 w-4 text-ash" strokeWidth={1.75} />
                </li>
              ))}
            </ul>
            <p className="glass relative z-10 -ml-3 flex min-h-[38px] items-center rounded-pill px-4 text-[13px] text-ash">
              Applied AI systems, built in Nairobi
            </p>
          </motion.div>

          {/* Each line is masked by its own wrapper. The wrapper carries 0.22em
              of bottom padding (descender room, since overflow:hidden clips at
              the padding box) which is cancelled by an equal negative margin, so
              the baseline-to-baseline distance is still exactly the line-height. */}
          <h1 className="mt-8 max-w-[20ch] text-[clamp(40px,7vw,86px)] leading-[1.05] tracking-[-0.04em] text-lime">
            <span className="-mb-[0.22em] block overflow-hidden pb-[0.22em]">
              <motion.span className="block" variants={reduce ? undefined : line}>
                Intelligence that
              </motion.span>
            </span>
            {/* The two masked lines are separate block boxes, so nothing
                separates them in the DOM. Without this explicit space the
                headline reads "Intelligence thatfinishes the work." when
                selected, copied, or parsed by anything that flattens block
                boundaries — and the space is invisible in layout, because
                whitespace between block boxes collapses. */}
            {' '}
            <span className="-mb-[0.22em] block overflow-hidden pb-[0.22em]">
              <motion.span className="block" variants={reduce ? undefined : line}>
                finishes the work.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={reduce ? undefined : settle}
            className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-ash sm:text-[17px]"
          >
            Governed AI systems that answer, retrieve and finish the work inside the systems you already
            run, measured against targets agreed before launch.
          </motion.p>

          <motion.div
            variants={reduce ? undefined : settle}
            className="mt-8 flex w-full max-w-[380px] flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4"
          >
            <Link to="/contact" className="btn-primary px-7 py-4 text-[15px]">
              Book a discovery call
            </Link>
            <Link to="/deployment-patterns" className="btn-ghost px-7 py-4 text-[15px]">
              See what we deploy
            </Link>
          </motion.div>
        </div>

        {/* The band. Four cells, each honest about what it measures. */}
        <motion.dl
          variants={reduce ? undefined : settle}
          className="glass grid grid-cols-2 gap-px overflow-hidden rounded-card sm:grid-cols-4"
        >
          {METRICS.map((metric, i) => (
            <MetricCell key={metric.label} metric={metric} index={i} still={!!reduce} />
          ))}
        </motion.dl>
      </motion.div>
    </section>
  )
}
