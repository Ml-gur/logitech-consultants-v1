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
    <section className="relative">
      <div className="section-panel section-panel-light rounded-[50px]">
        <div className="section-inner">
          {/* Left heading column + right stacked steps (matches the original layout) */}
          <div className="grid lg:grid-cols-[1fr_595px] gap-16 max-lg:gap-12">
            <div className="max-lg:mb-4">
              <p className="section-label">004/ Our Process</p>

              <h2 className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] mb-6">
                From friction to fully live.
              </h2>

              <p className="text-base text-[#4f4f4f] max-w-md leading-relaxed">
                A simple, proven path from your first call to a team that runs on AI \u2014 in weeks, not quarters.
              </p>
            </div>

            {/* Right column — 4 stacked step cards, 3rd is dark (matches the original) */}
            <div className="flex flex-col gap-[15px]">
              {steps.map((step, i) => {
                const dark = i === 2
                return (
                  <motion.div
                    key={step.title}
                    initial={revealInitial}
                    whileInView={revealWhileInView}
                    viewport={revealViewport}
                    transition={springReveal(i * 0.08)}
                    className={`group rounded-[18px] p-6 transition-colors duration-300 ${
                      dark ? 'bg-[#151619]' : 'bg-[#f0f0f0] border border-black/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          dark ? 'bg-white/10 text-[#f0f0f0]' : 'bg-black/5 text-[#4f4f4f]'
                        }`}
                      >
                        <span className="w-1 h-1 rounded-full bg-[#ff3700]" />
                        {step.time}
                      </span>
                      <span
                        className={`font-['Halant'] text-3xl font-semibold transition-colors duration-300 ${
                          dark ? 'text-white/20 group-hover:text-[#ff3700]/60' : 'text-black/10 group-hover:text-[#ff3700]/40'
                        }`}
                      >
                        {step.number}
                      </span>
                    </div>

                    <h3
                      className={`font-['Halant'] text-2xl font-semibold mb-3 transition-colors duration-300 ${
                        dark ? 'text-[#f0f0f0]' : 'text-[#0a0a0a] group-hover:text-[#4f4f4f]'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${dark ? 'text-[#999]' : 'text-[#4f4f4f]'}`}>
                      {step.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
