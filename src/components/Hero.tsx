import { Link } from 'react-router-dom'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Activity, FileCheck, Gauge, Layers, MessagesSquare, ShieldCheck, Users, Workflow } from 'lucide-react'

/**
 * Hero.
 *
 * A single full-bleed panel rather than a two-column layout: the page opens on
 * a lit surface, the statement sits in it, one action sits beside it, and a band
 * of what the systems actually do runs along the bottom edge.
 *
 * The panel carries the one gradient in the system (`src/index.css`,
 * `.hero-glow`). Everything else on the site is flat fills and hairlines; a
 * panel this size reads as a hole without a light source, and the glow is the
 * cheapest way to make a near-black canvas feel lit rather than empty. It is
 * decorative — `aria-hidden`, no interaction — and the copy sits over a scrim in
 * the centre so contrast is measured against the panel, not the colour field.
 *
 * The headline is the one orchestrated animation on the site (ADR-004): two
 * masked lines that rise out of their own wrapper on load. Nothing below the
 * fold moves.
 */

const EASE = [0.16, 1, 0.3, 1] as const

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
  visible: { y: 0, transition: { duration: 0.75, ease: EASE } },
}

const settle: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/**
 * The band under the panel. Each entry is something the systems genuinely do —
 * drawn from the capability descriptions in `src/lib/brand.ts`, not a claim
 * about outcomes. The list is duplicated in the DOM so the track can translate
 * by exactly -50% and loop seamlessly with no gap and no JS measurement.
 */
const BAND = [
  { Icon: MessagesSquare, label: 'Voice and messaging' },
  { Icon: FileCheck, label: 'Answers cited to source' },
  { Icon: Workflow, label: 'Task completion, not chat' },
  { Icon: Users, label: 'Human hand-off when it matters' },
  { Icon: ShieldCheck, label: 'Audit trails and approvals' },
  { Icon: Gauge, label: 'Measured outcomes' },
  { Icon: Activity, label: 'Evaluation sets' },
  { Icon: Layers, label: 'Reusable adapters' },
] as const

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="hero" className="relative px-2 pt-2 sm:px-3 sm:pt-3">
      <motion.div
        className="relative isolate overflow-hidden rounded-panel bg-carbon"
        variants={reduce ? undefined : container}
        initial={reduce ? false : 'hidden'}
        animate={reduce ? undefined : 'visible'}
      >
        {/* Decorative light source. Kept out of the accessibility tree. */}
        <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />

        <div className="relative mx-auto flex min-h-[clamp(440px,74dvh,640px)] max-w-[1200px] flex-col justify-center px-6 pb-14 pt-28 sm:px-10 sm:pb-16 sm:pt-32 lg:px-14 lg:pb-20">
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-14">
            <div>
              <motion.p variants={reduce ? undefined : settle} className="section-label">
                An applied AI systems company
              </motion.p>

              {/* Each line is masked by its own wrapper. The wrapper carries
                  0.22em of bottom padding (descender room, since overflow:hidden
                  clips at the padding box) which is cancelled by an equal
                  negative margin, so the baseline-to-baseline distance is still
                  exactly the line-height. */}
              <h1 className="mt-2 max-w-[17ch] text-[clamp(38px,6.2vw,74px)] leading-[1.05] tracking-[-0.03em] text-lime">
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
                className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-ash sm:text-[18px]"
              >
                We design, build and deploy governed AI systems inside the systems you already run —
                answering, retrieving and completing the task. In production, measured against targets
                agreed before launch.
              </motion.p>
            </div>

            <motion.div
              variants={reduce ? undefined : settle}
              className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-0 lg:shrink-0 lg:pb-2"
            >
              <Link to="/contact" className="btn-primary px-7 py-4 text-[15px]">
                Book a discovery call
              </Link>
              <Link to="/deployment-patterns" className="btn-ghost px-7 py-4 text-[15px]">
                See what we deploy
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* The band. Duplicated once for the seamless loop; the second copy is
          hidden from the accessibility tree so the list is not read twice. */}
      <div className="marquee mt-3 border-t border-hairline pt-4 sm:mt-4 sm:pt-5">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {BAND.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 whitespace-nowrap px-5 text-[13px] text-fog sm:px-7"
                >
                  <Icon className="h-4 w-4 shrink-0 text-lime" strokeWidth={1.75} aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
