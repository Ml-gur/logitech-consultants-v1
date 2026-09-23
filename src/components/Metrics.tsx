'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { MEASUREMENT_DIMENSIONS } from '../lib/brand'

export default function Metrics() {
  return (
    <section id="measurement" className="relative">
      {/* Section divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 items-start">

          {/* Left: heading block */}
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
                marginBottom: '20px',
              }}
            >
              We agree what success means{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--color-signal)' }}>
                before
              </em>{' '}
              we build.
            </motion.h2>

            <motion.p
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.1)}
              className="text-[16px] sm:text-[17px] leading-relaxed"
              style={{ color: 'var(--color-fog)' }}
            >
              No invented ROI figures here. Every deployment is instrumented
              against agreed targets before the first user touches the system.
              Where we miss, we say so.
            </motion.p>
          </div>

          {/* Right: metric cards */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {MEASUREMENT_DIMENSIONS.map((m, i) => (
              <motion.div
                key={m.metric}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.05)}
                className="group flex flex-col rounded-[20px] p-6 transition-all duration-300"
                style={{
                  background: 'var(--color-carbon)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,145,255,0.3)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(61,85,240,0.12)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                {/* Accent bar */}
                <div className="flex gap-1 mb-5">
                  <div className="h-1 flex-[2] rounded-full" style={{ background: 'linear-gradient(90deg, var(--color-voltage), var(--color-signal))' }} />
                  <div className="h-1 flex-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="h-1 flex-1 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
                </div>

                <h3
                  className="text-[15px] font-medium mb-2"
                  style={{ color: 'var(--color-paper)' }}
                >
                  {m.metric}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-fog)' }}>
                  {m.detail}
                </p>
              </motion.div>
            ))}
          </div>
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
