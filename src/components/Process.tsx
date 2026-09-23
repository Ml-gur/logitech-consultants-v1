'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { DEPLOYMENT_MODEL, FLYWHEEL_PRINCIPLE } from '../lib/brand'

/**
 * The Naivo deployment model (brand doc §14).
 *
 * Ten stages, grouped into four phases so the sequence stays legible on a
 * phone. This is deliberately the same model the company runs internally, it
 * is part of the identity, not a marketing funnel.
 */
const numbered = DEPLOYMENT_MODEL.map((step, i) => ({ ...step, n: String(i + 1).padStart(2, '0') }))

const phases = [
  {
    phase: 'Phase 01',
    title: 'Understand the work',
    steps: numbered.slice(0, 2),
    note: 'We start with how the work is actually done today, and who owns the outcome.',
  },
  {
    phase: 'Phase 02',
    title: 'Build and integrate',
    steps: numbered.slice(2, 4),
    note: 'The smallest system that can complete the work, wired into your systems of record.',
  },
  {
    phase: 'Phase 03',
    title: 'Deploy and govern',
    steps: numbered.slice(4, 6),
    note: 'Real users, real load, with permissions, approval gates and an audit trail.',
  },
  {
    phase: 'Phase 04',
    title: 'Measure, then productize',
    steps: numbered.slice(6),
    note: 'Every deployment should make the next one better. Measurement is how.',
  },
]

export default function Process() {
  return (
    <section id="process" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <div className="grid lg:grid-cols-[1fr_560px] gap-16 max-lg:gap-12">
          <div className="max-lg:mb-4">
            <motion.p
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal()}
              className="section-label"
            >
              How we deploy
            </motion.p>

            <motion.h2
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.06)}
              className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-6"
            >
              From real work to reusable product.
            </motion.h2>

            <motion.p
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.1)}
              className="text-[17px] text-fog max-w-md leading-relaxed mb-10"
            >
              Ten stages, run the same way every time. Each one is designed so that what we learn is kept, as
              templates, evaluation suites, documentation and integration adapters, instead of leaving with the
              engagement.
            </motion.p>

            {/* Flywheel principle */}
            <motion.div
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.14)}
              className="rounded-[24px] bg-[#191919] border border-signal/30 p-6 max-w-md"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-fog mb-3">Operating principle</p>
              <p className="font-display text-[20px] leading-snug text-paper">{FLYWHEEL_PRINCIPLE}</p>
            </motion.div>
          </div>

          {/* Right column, four phase cards */}
          <div className="flex flex-col gap-4">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.title}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className="card-dark rounded-[24px] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-fog">{phase.phase}</span>
                  {/* Step bars, N violet bars, N = phase number */}
                  <span className="flex items-center gap-1.5" aria-hidden>
                    {Array.from({ length: i + 1 }).map((_, b) => (
                      <span
                        key={b}
                        className="h-3 w-[3px] rounded-full bg-gradient-to-b from-[#7084ff] to-[#405bff]"
                      />
                    ))}
                  </span>
                </div>

                <h3 className="text-xl font-medium mb-4">{phase.title}</h3>

                <ol className="space-y-3">
                  {phase.steps.map((step) => (
                    <li key={step.step} className="flex items-start gap-3">
                      <span className="font-mono text-[11px] text-signal mt-1 tabular-nums shrink-0">
                        {step.n}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-medium text-paper">{step.step}</span>
                        <span className="block text-[13px] text-fog leading-snug">{step.detail}</span>
                      </span>
                    </li>
                  ))}
                </ol>

                <p className="text-[13px] text-fog leading-relaxed mt-5 pt-4 border-t border-white/5">
                  {phase.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
