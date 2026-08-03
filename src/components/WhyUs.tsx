'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

const columns = [
  {
    title: 'Freelance',
    dark: false,
    items: [
      'One person, limited capacity',
      'Narrow skill set, gaps in others',
      'Slows down when they get busy',
      'Little process or documentation',
      'Gone the moment it ships',
    ],
  },
  {
    title: 'Other Agencies',
    dark: false,
    items: [
      'Generic, pre-built solutions',
      'Slow, bloated onboarding',
      'Junior team does the real work',
      'Locked into their tools',
      'Handover, then radio silence',
    ],
  },
  {
    title: 'Working with Us',
    dark: true,
    items: [
      'Senior team across the full AI stack',
      'Custom-built around your data',
      '2\u20134 week pilots with clear metrics',
      'Fully documented, owned by you',
      'Ongoing optimisation and support',
    ],
  },
]

export default function WhyUs() {
  return (
    <section className="relative">
      <div className="section-panel section-panel-light rounded-[50px]">
        <div className="section-inner">
          <p className="section-label">006/ Why Us</p>

          <h2 className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] text-center max-w-[700px] mx-auto mb-6">
            AI Partner, Done Right.
          </h2>

          <p className="text-base text-[#4f4f4f] text-center max-w-[410px] mx-auto mb-16">
            The difference between a quick fix and a system that lasts.
          </p>

          {/* Three comparison cards — 2 light + 1 dark (matches the original) */}
          <div className="grid md:grid-cols-3 gap-[15px]">
            {columns.map((col, i) => (
              <motion.div
                key={col.title}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className={`rounded-[16px] p-[25px] flex flex-col ${
                  col.dark
                    ? 'bg-[#151619]'
                    : 'bg-[#f0f0f0] border border-black/[0.06]'
                }`}
              >
                <h3
                  className={`font-['Halant'] text-2xl font-semibold mb-8 ${
                    col.dark ? 'text-[#f0f0f0]' : 'text-[#0a0a0a]'
                  }`}
                >
                  {col.title}
                </h3>

                <ul className="space-y-4">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          col.dark ? 'text-[#ff3700]' : 'text-black/20'
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                      <span
                        className={`text-sm leading-relaxed ${
                          col.dark ? 'text-[#999]' : 'text-[#4f4f4f]'
                        }`}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
