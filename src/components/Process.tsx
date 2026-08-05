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

            {/* Right column — 4 step cards, each a 42px chip strip + 6px gap + content block
                (measured live on the original, 2026-08-05: strip radius 16, block radius 18,
                dark step is 03 "Build & integrate" = index 2, chips are plain uppercase text) */}
            <div className="flex flex-col gap-[6px]">
              {steps.map((step, i) => {
                const dark = i === 2
                return (
                  <div key={step.title} className="flex flex-col gap-[6px]">
                    {/* Chip strip — 42px tall, full-width, same bg as card */}
                    <motion.div
                      initial={revealInitial}
                      whileInView={revealWhileInView}
                      viewport={revealViewport}
                      transition={springReveal(i * 0.08)}
                      className={`flex h-[42px] items-center justify-between rounded-[16px] px-[25px] ${
                        dark ? 'bg-[#151619]' : 'bg-[#e5e5e5]'
                      }`}
                    >
                      <span
                        className={`uppercase text-[11.2px] font-semibold ${
                          dark ? 'text-[#f0f0f0]' : 'text-[#4f4f4f]'
                        }`}
                      >
                        {step.time}
                      </span>
                      {/* Step bars — N thin orange bars, N = step number (measured) */}
                      <span className="flex items-center gap-[5px]" aria-hidden>
                        {Array.from({ length: i + 1 }).map((_, b) => (
                          <span key={b} className="h-[10px] w-[2px] rounded-full bg-[#ff3700]" />
                        ))}
                      </span>
                    </motion.div>

                    {/* Content block — radius 18, pad 25, number on its own line */}
                    <motion.div
                      initial={revealInitial}
                      whileInView={revealWhileInView}
                      viewport={revealViewport}
                      transition={springReveal(i * 0.08 + 0.04)}
                      className={`rounded-[18px] p-[25px] ${
                        dark ? 'bg-[#151619]' : 'bg-[#e5e5e5]'
                      }`}
                    >
                      <span
                        className={`block font-['Halant'] text-2xl font-semibold ${
                          dark ? 'text-[#f0f0f0]' : 'text-[#0a0a0a]'
                        }`}
                      >
                        {step.number}
                      </span>
                      <h3
                        className={`mt-1 font-['Halant'] text-2xl font-semibold leading-snug ${
                          dark ? 'text-[#f0f0f0]' : 'text-[#0a0a0a]'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className={`mt-2 text-base leading-relaxed ${dark ? 'text-[#e5e5e5]' : 'text-[#4f4f4f]'}`}>
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
