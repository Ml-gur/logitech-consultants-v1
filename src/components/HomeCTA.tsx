'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function HomeCTA() {
  return (
    <section className="relative">
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div
          className="relative rounded-[32px] overflow-hidden p-10 sm:p-16 lg:p-20"
          style={{
            background: 'linear-gradient(135deg, rgba(61,85,240,0.18) 0%, rgba(124,145,255,0.08) 50%, rgba(8,8,16,0.8) 100%)',
            border: '1px solid rgba(124,145,255,0.2)',
          }}
        >
          {/* Background radial */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 80% at 20% 50%, rgba(61,85,240,0.2) 0%, transparent 65%)',
            }}
            aria-hidden
          />

          <div className="relative grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <motion.p
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal()}
                className="section-label"
              >
                Ready to deploy
              </motion.p>

              <motion.h2
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(0.06)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: 'clamp(32px, 5vw, 64px)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-paper)',
                  marginBottom: '16px',
                }}
              >
                Start with a real problem,
                <br />
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--color-signal)' }}>
                  not a demo.
                </em>
              </motion.h2>

              <motion.p
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(0.1)}
                className="text-[16px] max-w-[520px] leading-relaxed"
                style={{ color: 'var(--color-fog)' }}
              >
                A discovery call costs an hour. We scope the work honestly: what we can build, what we'll measure, and what it will cost to get to production.
              </motion.p>
            </div>

            <motion.div
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.14)}
              className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0"
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-medium rounded-full text-white transition-all duration-200 whitespace-nowrap"
                style={{ background: 'var(--color-voltage)', minHeight: '52px' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-voltage-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-voltage)')}
              >
                Book a discovery call
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-medium rounded-full transition-all duration-200 whitespace-nowrap"
                style={{ border: '1px solid rgba(124,145,255,0.3)', color: 'var(--color-signal)', minHeight: '52px' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,145,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(124,145,255,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(124,145,255,0.3)' }}
              >
                Read our insights
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
