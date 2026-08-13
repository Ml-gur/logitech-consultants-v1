'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

const steps = [
  {
    time: 'Weeks 1\u20132',
    number: '01',
    title: 'Find the friction',
    description: 'We map your workflows and pinpoint where your team loses time \u2014 and where AI will pay off.',
  },
  {
    time: 'Weeks 3\u20134',
    number: '02',
    title: 'Shape the plan',
    description: 'We rank the opportunities by ROI and turn the strongest into a clear, sequenced plan.',
  },
  {
    time: 'Weeks 5\u20136',
    number: '03',
    title: 'Build & integrate',
    description: 'We turn the plan into working tools and automations, tested until they run.',
  },
  {
    time: 'Ongoing',
    number: '04',
    title: 'Hand over & scale',
    description: 'We train your team, document the playbooks, and stay on hand to refine as you grow.',
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
              Our Process
            </motion.p>

            <motion.h2
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.06)}
              className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-6"
            >
              From friction to fully live.
            </motion.h2>

            <motion.p
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.1)}
              className="text-[17px] text-fog max-w-md leading-relaxed"
            >
              A simple, proven path from your first call to a team that runs on AI — in weeks, not quarters.
            </motion.p>
          </div>

          {/* Right column — 4 step cards */}
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className="card-dark rounded-[24px] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-fog">
                    {step.time}
                  </span>
                  {/* Step bars — N violet bars, N = step number */}
                  <span className="flex items-center gap-1.5" aria-hidden>
                    {Array.from({ length: i + 1 }).map((_, b) => (
                      <span
                        key={b}
                        className="h-3 w-[3px] rounded-full bg-gradient-to-b from-[#7084ff] to-[#405bff]"
                      />
                    ))}
                  </span>
                </div>
                <span className="block font-display text-2xl font-medium text-signal mb-1">{step.number}</span>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-[15px] text-fog leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
