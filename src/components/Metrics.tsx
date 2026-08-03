'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { springReveal } from '../motion'

const metrics = [
  { label: 'Average first-year ROI', value: 3, suffix: 'x' },
  { label: 'Hours saved per month', value: 100, suffix: '+' },
  { label: 'Less manual work across teams', value: 60, suffix: '%' },
  { label: 'Client retention rate', value: 98, suffix: '%' },
]

function CountUp({ value, suffix, started }: { value: number; suffix: string; started: boolean }) {
  const [display, setDisplay] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!started || reduce) {
      if (reduce) setDisplay(value)
      return
    }
    const duration = 1600
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, value, reduce])

  return (
    <span className="font-['Halant'] text-[56px] leading-[1em] font-semibold tracking-[-0.04em] text-[#0a0a0a]">
      {display}
      <span className="text-[#ff3700]">{suffix}</span>
    </span>
  )
}

function MetricCard({ metric, index }: { metric: (typeof metrics)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={springReveal(index * 0.08)}
      className="rounded-[16px] border border-black/[0.06] bg-[#f0f0f0] p-6 max-md:p-5"
    >
      <div className="mb-5">
        <CountUp value={metric.value} suffix={metric.suffix} started={inView} />
      </div>

      {/* Highlighter segments: 1 orange + 3 gray */}
      <div className="flex gap-1.5 mb-5">
        <div className="h-2.5 flex-1 rounded-[13px] bg-[#ff3700]" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-2.5 flex-1 rounded-[13px] bg-black/10" />
        ))}
      </div>

      <p className="text-sm text-[#4f4f4f] leading-snug">{metric.label}</p>
    </motion.div>
  )
}

export default function Metrics() {
  return (
    <section className="relative bg-[#f0f0f0]">
      <div className="max-w-[1400px] mx-auto px-10 max-md:px-4 pt-6 pb-0 max-md:pt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[15px]">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} metric={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}