'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { COMPETITIVE_LANDSCAPE } from '../lib/brand'

/**
 * The position we occupy, stated as a comparison of categories rather than a
 * competitor list (brand doc §10–§11). The left two columns describe the shape
 * of the alternatives; the accent column is where Naivolabs sits, the layer
 * between the platform and the organization's actual work.
 */
export default function WhyUs() {
  return (
    <section id="why-us" className="relative">
      <div className="relative band">
        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="section-label text-center"
        >
          Where we sit
        </motion.p>

        <motion.h2
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.06)}
          className="text-heading-band text-center max-w-[700px] mx-auto mb-4"
        >
          Between the platform and the work.
        </motion.h2>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.1)}
          className="text-lede text-fog text-center max-w-[52ch] mx-auto mb-16"
        >
          Platforms supply capability. Agencies supply bespoke projects. Neither is a governed system running
          inside your operations.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-4">
          {COMPETITIVE_LANDSCAPE.map((col, i) => {
            const accent = col.tone === 'accent'
            return (
              <motion.div
                key={col.title}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                // The two alternative columns sit on `bg-carbon`, the inset
                // surface the system already uses inside a card. They used to
                // be a raw `#121212`, a third near-identical near-black next to
                // `bg-raised` and `bg-carbon` — which is what stopped the three
                // columns reading as one comparison.
                className={`rounded-[30px] p-7 flex flex-col ${
                  accent
                    ? 'bg-raised border border-signal/40 shadow-[0_0_32px_rgba(112,132,255,0.19)]'
                    : 'bg-carbon border border-white/10'
                }`}
              >
                <h3 className={`text-xl font-medium mb-8 ${accent ? 'text-paper' : 'text-ash'}`}>{col.title}</h3>

                <ul className="space-y-4">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg
                        className={`w-4 h-4 mt-1 shrink-0 ${accent ? 'text-signal' : 'text-slate'}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        {accent ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
                      </svg>
                      <span className={`text-sm leading-relaxed ${accent ? 'text-fog' : 'text-ash'}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
