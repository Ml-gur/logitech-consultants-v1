'use client'

import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

const headlineWords = ['We', 'build', 'the', 'AI', 'that', 'runs', 'your', 'business.']

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    // Base delay 0.2s (was 0.5s): the h1 is the LCP element, and a long
    // pre-reveal delay pushed LCP past the 2.5s budget (measured 2616ms,
    // 2026-08-05 performance pass). Same word-by-word effect, earlier paint.
    transition: { delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="home" className="relative pt-[76px]">
      {/* Mobile: outer wrapper + section-panel + inner content previously
          stacked 15+15+15=45px (then 15+10+15=40px) — the original's hero
          content sits at the same 20px gutter as every section (measured
          2026-08-05: h1 L=20/R=370 at 390px). Now 0+10+10=20px. */}
      <div className="relative px-10 max-md:px-0">
        <div className="section-panel">
          {/* Content column */}
          <div className="relative max-w-[1400px] mx-auto px-10 max-md:px-[10px] py-[100px] max-md:py-16">
            {/* Badge — plain dark text, centered (matches the original) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex justify-center mb-10"
            >
              <span className="text-xs font-semibold text-[#0a0a0a]">
                2 slots Available this month
              </span>
            </motion.div>

            {/* Headline — centered, dark, Halant */}
            <h1 className="max-w-[800px] mx-auto text-center mb-8">
              <span className="sr-only">We build the AI that runs your business.</span>
              <span className="flex flex-wrap justify-center">
                {headlineWords.map((word, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate={reduce ? { opacity: 1, y: 0, filter: 'blur(0px)' } : 'visible'}
                    className="font-['Halant'] text-[clamp(48px,7.5vw,80px)] font-semibold leading-[1.05] tracking-tight text-[#0a0a0a] mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Subtitle — centered, muted */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[600px] mx-auto text-center text-[17px] text-[#4f4f4f] mb-12 leading-relaxed"
            >
              Strategy, automations, custom agents, and the support to keep them running, all from one team.
            </motion.p>

            {/* CTA buttons — dark pill + light pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4 items-center justify-center"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-[50px] bg-[#151619] text-[#f0f0f0] text-base font-semibold transition-all duration-200 hover:bg-[#0a0a0a] hover:-translate-y-0.5"
              >
                Book a call
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-[50px] bg-[#e5e5e5] text-[#0a0a0a] text-base font-semibold transition-all duration-200 hover:bg-white hover:-translate-y-0.5"
              >
                Our pricing
              </a>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  )
}
