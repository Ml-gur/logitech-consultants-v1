'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { Band, SectionHeader } from './Section'

export default function HomeCTA() {
  // The second hairline: the argument has ended, and what follows is the one
  // thing the page asks the reader to do.
  //
  // `attached`: the ask hugs the rule above it (the hairline belongs to the band
  // it introduces, not to the one it closes), which leaves the whole wide seam
  // on the other side of the rule.
  return (
    <Band rule tone="attached">
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
            {/* The closing ask holds h1 rank: `size="lg"` is the same token the
                page titles use, so the last thing on the page is as loud as the
                first thing on a page, and nothing in between is louder. */}
            <SectionHeader
              size="lg"
              label="Ready to deploy"
              title={
                <>
                  Start with a real problem,
                  <br />
                  <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--color-signal)' }}>
                    not a demo.
                  </em>
                </>
              }
              lede="A discovery call costs an hour. We scope the work honestly: what we can build, what we'll measure, and what it will cost to get to production."
            />

            <motion.div
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.14)}
              className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0"
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium rounded-full bg-voltage text-white transition-all duration-200 whitespace-nowrap hover:bg-voltage-hover active:scale-[0.98]"
                style={{ minHeight: '52px' }}
              >
                Book a discovery call
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium rounded-full border border-signal/30 text-signal transition-all duration-200 whitespace-nowrap hover:bg-signal/10 hover:border-signal/50 active:scale-[0.98]"
                style={{ minHeight: '52px' }}
              >
                Read our insights
              </Link>
            </motion.div>
          </div>
        </div>
    </Band>
  )
}
