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
    <span className="font-display text-[44px] leading-[1em] font-medium tracking-[-0.04em] text-paper tabular-nums">
      {display}
      <span className="text-signal">{suffix}</span>
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
      className="card-dark rounded-[30px] p-6 max-md:p-5"
    >
      <div className="mb-5">
        <CountUp value={metric.value} suffix={metric.suffix} started={inView} />
      </div>

      {/* Highlighter segments — 1 violet + 3 hairline */}
      <div className="flex gap-1.5 mb-5">
        <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-[#405bff] to-[#7084ff]" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-2 flex-1 rounded-full bg-white/10" />
        ))}
      </div>

      <p className="text-sm text-fog leading-snug">{metric.label}</p>
    </motion.div>
  )
}

export default function Metrics() {
  return (
    <section className="relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} metric={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
