'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

// The numbered "01/ …" prefix is rendered here (not stored in the data) so
// static fallback and CMS-sourced FAQs render identically.
const numbered = (i: number, q: string) => `${String(i + 1).padStart(2, '0')}/ ${q}`

export default function FAQ() {
  const { faqs } = useCms()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <div className="grid lg:grid-cols-[1fr_560px] gap-12 max-lg:gap-10">
          <div className="max-lg:mb-2">
            <motion.p
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal()}
              className="section-label"
            >
              FAQs
            </motion.p>

            <motion.h2
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.06)}
              className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em]"
            >
              Need answers?
            </motion.h2>
          </div>

          {/* Right column — stacked carbon radius-24 cards */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.06)}
                className="rounded-[24px] bg-[#191919] border border-white/10"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-center justify-between gap-4 px-6 pt-6 pb-5 text-left"
                >
                  <span className="text-[16px] font-medium text-paper leading-snug">
                    {numbered(i, faq.q)}
                  </span>
                  {/* Accent plus icon — Signal Violet, rotates 45deg when open */}
                  <motion.svg
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[14px] h-[14px] shrink-0 ml-4 text-signal"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M7 1v12M1 7h12" />
                  </motion.svg>
                </button>
                {/* Answer — conditional render (the rotating plus provides the
                    motion cue; no JS height tween keeps the toggle cheap for
                    INP) */}
                {openIndex === i && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-label={numbered(i, faq.q)}
                  >
                    <p className="text-[15px] text-fog leading-relaxed pb-6 px-6">
                      {faq.a}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
