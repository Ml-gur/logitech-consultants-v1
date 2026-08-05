'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

// The numbered "01/ …" prefix is rendered here (not stored in the data) so
// static fallback and CMS-sourced FAQs render identically.
const numbered = (i: number, q: string) => `${String(i + 1).padStart(2, '0')}/ ${q}`

export default function FAQ() {
  const { faqs } = useCms()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative">
      {/* No panel — FAQ sits directly on the page #f0f0f0, rows are #e5e5e5
          radius-16 cards (measured live on the original, 2026-08-04) */}
      <div className="section-panel">
        <div className="section-inner">
        {/* Two columns: heading left (w≈615), rows right (w≈595), gap 50px */}
        <div className="grid lg:grid-cols-[1fr_595px] gap-[50px] max-lg:gap-12">
          <div className="max-lg:mb-2">
            <p className="section-label">009/ FAQs</p>

            <h2 className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a]">
              Need answers?
            </h2>
          </div>

          {/* Right column — stacked #e5e5e5 radius-16 cards, 10px gap (measured) */}
          <div className="flex flex-col gap-[10px]">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.06)}
                className="rounded-[16px] bg-[#e5e5e5]"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-center justify-between gap-4 px-5 pt-6 pb-5 text-left"
                >
                  <span className="text-[20px] font-semibold text-[#0a0a0a] leading-snug">
                    {numbered(i, faq.q)}
                  </span>
                  {/* Accent plus icon — two 14x2 bars, #ff3700, radius 10 (measured) */}
                  <motion.svg
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[14px] h-[14px] shrink-0 ml-4 text-[#ff3700]"
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
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-label={numbered(i, faq.q)}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-base text-[#4f4f4f] leading-[23.2px] pb-6 px-5">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
