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
      '2–4 week pilots with clear metrics',
      'Fully documented, owned by you',
      'Ongoing optimization and support',
    ],
  },
]

export default function WhyUs() {
  return (
    <section id="why-us" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="section-label text-center"
        >
          Why Us
        </motion.p>

        <motion.h2
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.06)}
          className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] text-center max-w-[640px] mx-auto mb-4"
        >
          AI partner, done right.
        </motion.h2>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.1)}
          className="text-[17px] text-fog text-center max-w-[440px] mx-auto mb-16"
        >
          The difference between a quick fix and a system that lasts.
        </motion.p>

        {/* Three comparison cards — the featured column glows violet */}
        <div className="grid md:grid-cols-3 gap-4">
          {columns.map((col, i) => (
            <motion.div
              key={col.title}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(i * 0.08)}
              className={`rounded-[30px] p-7 flex flex-col ${
                col.dark
                  ? 'bg-[#191919] border border-signal/40 shadow-[0_0_32px_rgba(112,132,255,0.19)]'
                  : 'bg-[#121212] border border-white/10'
              }`}
            >
              <h3 className={`text-xl font-medium mb-8 ${col.dark ? 'text-paper' : 'text-ash'}`}>
                {col.title}
              </h3>

              <ul className="space-y-4">
                {col.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className={`w-4 h-4 mt-1 shrink-0 ${
                        col.dark ? 'text-signal' : 'text-slate'
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {col.dark ? (
                        <path d="M20 6L9 17l-5-5" />
                      ) : (
                        <path d="M18 6L6 18M6 6l12 12" />
                      )}
                    </svg>
                    <span
                      className={`text-sm leading-relaxed ${
                        col.dark ? 'text-fog' : 'text-ash'
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
    </section>
  )
}
