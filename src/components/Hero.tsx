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
 * The backdrop is a dark plate: the one gradient in the system (`.hero-glow`) at
 * low alpha, a dot field (`.hero-dots`) that is empty through the middle where
 * the type sits, and a vignette that pulls the edges back to the canvas. All
 * three are decorative (`aria-hidden`, no pointer events), and the copy is
 * measured against the plate rather than against whatever hue happens to be
 * behind it.
 *
 * The trust row carries no client logos and the band carries no claimed
 * outcomes. The company publishes no named references without a client's written
 * approval, so the marks are the four things a system does and the numbers are
 * facts about how we work: two from `src/lib/brand.ts` (ten stages, six
 * measurement dimensions), the published first-deployment window, and the count
 * of benchmarks we have invented, which is zero.
 */

/**
 * The background loop, when one has been dropped in beside this component.
 *
 * The clip the reference direction opens on is a 14 MB file on a third-party
 * CDN: shipping that URL would need the production CSP widened to an origin we
 * do not control, and 14 MB per visitor to a hero backdrop. The same footage is
 * therefore decoded once, re-framed to the size it is actually used at
 * (1280×720) and shipped as a 338 kB WebM from our own origin, where it is
 * hashed, cached immutably, and covered by `media-src 'self'`. With no file
 * present the hero renders its plate alone, so the backdrop is never broken.
 */
const heroLoop = Object.values(
  import.meta.glob('./hero-loop.{mp4,webm}', {
    query: '?url',
    import: 'default',
    eager: true,
  }) as Record<string, string>,
)[0]

/**
 * The three marks in the trust row, as overlapping rings.
 *
 * The reference direction runs a row of client logos in this position
 * (Microsoft, Amazon, Google) under the line "Trusted by 2000+ Enterprises".
 * That is the one thing on a page like this that must never be borrowed: the
 * company publishes no client it cannot name with permission, so the row says
 * where we build and the marks are what the systems do. The ring treatment is
 * the visual language, adopted; the borrowed proof is not (see the "Evidence
 * over claims" rule in AGENTS.md).
 */
const MARKS = [MessagesSquare, FileCheck, Workflow] as const

/**
 * Attach the loop after first paint, and only when the visitor can afford it.
 *
 * `preload="none"` alone still spends the bytes: the element exists, so the
 * browser will fetch the clip on a phone on 2G just as happily as on fibre. The
 * plate is a complete backdrop on its own, so the video is an enhancement —
 * skipped entirely under `prefers-reduced-motion` and Data Saver, one step
 * down the connection table for slow links, and mounted on idle rather than
 * during load.
 */
function useHeroLoop(enabled: boolean): boolean {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection
    if (connection?.saveData) return
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return

    const requestIdle = window.requestIdleCallback?.bind(window)
    if (requestIdle) {
      const handle = requestIdle(() => setShow(true), { timeout: 2000 })
      return () => window.cancelIdleCallback?.(handle)
    }

    const timer = window.setTimeout(() => setShow(true), 900)
    return () => window.clearTimeout(timer)
  }, [enabled])

  return show
}

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

/**
 * Kept short on purpose. A band of four cells is the most wrap-sensitive thing
 * on the page: a label that only just fits one line in one browser wraps to two
 * in another, which pushes the whole band past the fold and re-flows everything
 * above it. Every label clears its cell by a wide margin at the narrowest width
 * the four-column layout runs at.
 */
const METRICS: Metric[] = [
  { Icon: CalendarClock, value: 4, suffix: '–8 wks', label: 'To production' },
  { Icon: ListOrdered, value: 10, label: 'Discovery to product' },
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
    // reader should hear a definition), the screen reads "mark, value, label" —
    // the same order the reference direction sets its stat row in. Centred at
    // every width: a two-by-two block of left-aligned cells looks broken on a
    // phone, and the band is a footer to the screen rather than a table.
    <div className="flex flex-col-reverse items-center gap-2 px-3 py-4 text-center sm:px-5 sm:py-5">
      <dt className="text-[12.5px] leading-snug text-fog">{label}</dt>
      <dd className="font-mono text-[clamp(19px,2.1vw,26px)] tracking-[-0.025em] text-paper tabular-nums">
        {shown}
        {suffix ? <span className="text-fog">{suffix}</span> : null}
      </dd>
      <Icon className="h-[17px] w-[17px] text-lime" strokeWidth={1.75} aria-hidden />
    </div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const loop = useHeroLoop(Boolean(heroLoop) && !reduce)

  return (
    <section id="hero" className="relative isolate overflow-hidden">
      {/* Decorative backdrop: a dot field, a low light source over the canvas,
          a vignette that returns the edges and the strip under the header to
          the canvas, and a looping video if one has been dropped in. */}
      <div aria-hidden className="hero-backdrop pointer-events-none absolute inset-0">
        {heroLoop && loop ? (
          <video
            className="hero-video"
            src={heroLoop}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
          />
        ) : null}
        {/* Scrim, then the plate's texture and its light source, then the
            vignette: the copy is measured against this stack, never against
            whatever frame the clip happens to be showing. */}
        <div className="hero-scrim absolute inset-0" />
        <div className="hero-dots absolute inset-0" />
        <div className="hero-glow absolute inset-0" />
        <div className="hero-vignette absolute inset-0" />
      </div>

      <motion.div
        className="relative mx-auto flex min-h-[100svh] w-full max-w-[1200px] flex-col px-5 pb-6 pt-[88px] sm:px-8 sm:pb-8 sm:pt-[96px] lg:pt-[104px]"
        variants={reduce ? undefined : container}
        initial={reduce ? false : 'hidden'}
        animate={reduce ? undefined : 'visible'}
      >
        <div className="flex flex-1 flex-col items-center justify-center py-5 text-center sm:py-8">
          {/* Trust row: three overlapping marks, then a pill. The marks are
              decoration for the pill's sentence, so they are hidden from the
              accessibility tree rather than described twice. */}
          <motion.div variants={reduce ? undefined : settle} className="flex items-center">
            {/* Ring, light disc, dark mark — the reference direction's avatar
                row, in tokens: `bg-paper` is near-white in the dark theme and
                near-black in the light one, so the disc always reads as the
                inverse of the ring it sits in. */}
            <ul className="flex items-center" aria-hidden>
              {MARKS.map((Icon, i) => (
                <li
                  key={i}
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-carbon p-[5px] transition-transform duration-300 ease-out hover:-translate-y-0.5',
                    i > 0 && '-ml-[17px]',
                  )}
                >
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-paper">
                    <Icon className="h-[15px] w-[15px] text-ink" strokeWidth={2} />
                  </span>
                </li>
              ))}
            </ul>
            {/* Left padding clears the overlap, so the sentence never sits on
                the last ring. */}
            <p className="glass relative z-10 -ml-4 flex min-h-[42px] items-center rounded-pill pl-6 pr-5 text-[13px] text-ash">
              Applied AI systems, from Nairobi
            </p>
          </motion.div>

          {/* Each line is masked by its own wrapper. The wrapper carries 0.22em
              of bottom padding (descender room, since overflow:hidden clips at
              the padding box) which is cancelled by an equal negative margin, so
              the baseline-to-baseline distance is still exactly the line-height. */}
          <h1 className="mt-7 text-[clamp(34px,6.2vw,78px)] leading-[1.06] tracking-[-0.05em] text-paper">
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

          {/* Two lines at laptop width, three on a phone, with room to spare at
              both: the measure is what keeps this hero from re-flowing. */}
          <motion.p
            variants={reduce ? undefined : settle}
            className="mt-5 max-w-[min(500px,92%)] text-[16px] leading-relaxed text-ash sm:text-[17px]"
          >
            Governed AI systems that answer, retrieve and finish the work inside the systems you run.
          </motion.p>

          {/* One filled action and one quiet text link. The reference
              direction's hero carries exactly one button; a second one of equal
              weight is the thing that makes an opening screen look like a
              template. */}
          <motion.div
            variants={reduce ? undefined : settle}
            className="mt-8 flex w-full max-w-[380px] flex-col items-center gap-4 sm:w-auto sm:max-w-none sm:flex-row sm:gap-6"
          >
            <Link to="/contact" className="btn-primary hero-cta w-full px-8 py-4 text-[15px] sm:w-auto">
              Book a discovery call
            </Link>
            <Link to="/deployment-patterns" className="link-quiet text-[14px]">
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
