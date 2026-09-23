import { useRef } from 'react'
import { MotionConfig, motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { DeploymentPattern } from '../data/content'
import DeploymentCard from './DeploymentCard'

/**
 * Deployment patterns as a scroll-driven stack.
 *
 * Behaviour
 * ---------
 * Each panel pins below the floating nav. As the page scrolls, the panel being
 * covered scales down and lifts slightly, so the next panel visibly slides over
 * it, a physical stack rather than a list. Motion is bound to scroll position
 * (`useScroll` + `useTransform`), so it is reversible and tracks the
 * pointer/finger exactly instead of running on a timer.
 *
 * Responsiveness
 * --------------
 * The stack runs at every width; the panel *pitch* (sticky top offset and how
 * far each layer steps down) is driven by CSS custom properties per breakpoint
 * so layers stay on screen on a phone without the covered panels leaving the
 * viewport:
 *   < 640px   --stack-base 76px, step 12px
 *   640-1023  --stack-base 84px, step 16px
 *   >= 1024   --stack-base 96px, step 24px
 *
 * Reduced motion
 * --------------
 * Wrapped in `MotionConfig reducedMotion="user"`: users who ask for reduced
 * motion get the panels laid out plainly with no transform applied. The sticky
 * pinning remains, that is layout, not animation.
 */

/** Scale floor for the deepest layer (the first panel), tuned per breakpoint. */
const SCALE_FLOOR = 0.94

function StackItem({
  index,
  total,
  progress,
  children,
}: {
  index: number
  total: number
  progress: MotionValue<number>
  children: React.ReactNode
}) {
  // The slice of overall stack progress that belongs to this layer.
  const start = total > 1 ? index / total : 0
  const end = total > 1 ? (index + 1) / total : 1

  // How much further this layer still has to recede before the page ends.
  const remaining = Math.max(0, total - 1 - index)
  const scaleTarget = Math.max(SCALE_FLOOR, 1 - remaining * 0.02)

  const scale = useTransform(progress, [start, end], [1, scaleTarget])
  const y = useTransform(progress, [start, end], [0, -remaining * 3])

  return (
    <div
      className="sticky"
      style={{
        // --stack-base / --stack-step are set per breakpoint on the container.
        top: `calc(var(--stack-base) + ${index} * var(--stack-step))`,
        zIndex: index + 1,
      }}
    >
      <motion.div style={{ scale, y, transformOrigin: 'top center' }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}

export default function DeploymentStack({ patterns }: { patterns: DeploymentPattern[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Overall progress through the stack: 0 when the first panel pins, 1 when the
  // last panel reaches the pin line.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={containerRef}
        className="relative flex flex-col gap-[7vh] [--stack-base:76px] [--stack-step:12px] sm:[--stack-base:84px] sm:[--stack-step:16px] lg:[--stack-base:96px] lg:[--stack-step:24px]"
      >
        {patterns.map((c, i) => (
          <StackItem key={c.slug} index={i} total={patterns.length} progress={scrollYProgress}>
            <DeploymentCard c={c} />
          </StackItem>
        ))}
      </div>

      {/* Screen-reader summary: the visual stack is one ordered list. */}
      <ol className="sr-only">
        {patterns.map((p) => (
          <li key={p.slug}>
            {p.name}: {p.tagline}
          </li>
        ))}
      </ol>
    </MotionConfig>
  )
}
