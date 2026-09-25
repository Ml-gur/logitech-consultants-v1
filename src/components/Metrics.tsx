'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

const stats = [
  { value: '01', label: 'Completion rate', sub: 'work finished end to end' },
  { value: '02', label: 'Escalation accuracy', sub: 'the right handoff at the right time' },
  { value: '03', label: 'Answer groundedness', sub: 'responses trace to approved sources' },
  { value: '04', label: 'Hours returned', sub: 'time moved back to judgement work' },
]

const dimensions = [
  { metric: 'Completion rate', detail: 'Share of requests the system finishes end to end without a human stepping in.' },
  { metric: 'Escalation accuracy', detail: 'How often the system hands off to a person, and whether it was the right call.' },
  { metric: 'Time to first response', detail: 'From the moment a person makes contact to a useful answer.' },
  { metric: 'Answer groundedness', detail: 'Whether an answer traces back to a source document.' },
  { metric: 'Cost per completed task', detail: 'What the work costs now, against what it cost before.' },
  { metric: 'Hours returned to the team', detail: 'Staff time moved off repetitive handling and back onto judgement work.' },
]

export default function Metrics() {
  return (
    <section id="measurement" className="relative">
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-24 sm:py-32">

        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-end mb-16 sm:mb-20">
          <div>
            <motion.p
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal()}
              className="section-label"
            >
              Measurement
            </motion.p>
            <motion.h2
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.06)}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              We agree what success means{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--color-signal)' }}>
                before
              </em>{' '}
              we build.
            </motion.h2>
          </div>
          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.1)}
            className="text-[16px] leading-relaxed self-end"
            style={{ color: 'var(--color-fog)' }}
          >
            No invented ROI figures. Every deployment is instrumented against agreed targets before the first user touches the system. Where we miss, we say so.
          </motion.p>
        </div>

        {/* Large stat row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-16 overflow-hidden rounded-[24px]" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.08)' }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(i * 0.07)}
              className="flex flex-col justify-between p-6 sm:p-8 transition-colors duration-300"
              style={{ background: 'var(--color-carbon)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1a1a26' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-carbon)' }}
            >
              <div
                className="font-display mb-3"
                style={{
                  fontSize: 'clamp(36px, 5vw, 64px)',
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #8d8d8d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </div>
              <div>
                <div className="text-[13px] font-medium text-paper mb-1">{s.label}</div>
                <div className="text-[12px] text-fog">{s.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dimension list — what we measure */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensions.map((d, i) => (
            <motion.div
              key={d.metric}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(i * 0.05)}
              className="flex gap-4 rounded-[16px] p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="w-1 rounded-full shrink-0 mt-1" style={{ background: 'linear-gradient(to bottom, var(--color-voltage), var(--color-signal))', minHeight: '40px' }} />
              <div>
                <div className="text-[13px] font-medium text-paper mb-1">{d.metric}</div>
                <div className="text-[12px] leading-relaxed text-fog">{d.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.14)}
          className="text-[13px] mt-10 max-w-[560px]"
          style={{ color: 'var(--color-slate)', borderLeft: '2px solid var(--color-graphite)', paddingLeft: '16px' }}
        >
          Where a deployment does not meet its agreed target, we say so and either change the
          approach or stop. Publishing only the wins would make this page worthless.
        </motion.p>
      </div>
    </section>
  )
}
