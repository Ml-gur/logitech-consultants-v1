import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'

// Questions are stored without any numbering prefix. An earlier revision
// stamped each one "01/", "02/", which implied a sequence the list does not
// have. Static and CMS-sourced FAQs render identically because neither is
// numbered.
export default function FAQ() {
  const { faqs } = useCms()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-[1fr_560px] gap-12 max-lg:gap-10">
          <div className="max-lg:mb-2">
            <motion.p
              className="section-label"
            >
              FAQs
            </motion.p>

            <motion.h2
              className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em]"
            >
              Need answers?
            </motion.h2>
          </div>

          {/* Right column, stacked carbon radius-24 cards */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="rounded-panel bg-carbon border border-hairline"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-center justify-between gap-4 px-6 pt-6 pb-5 text-left"
                >
                  <span className="text-[16px] font-medium text-paper leading-snug">
                    {faq.q}
                  </span>
                  {/* Accent plus icon, rotates 45deg when open */}
                  <motion.svg
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[14px] h-[14px] shrink-0 ml-4 text-lime"
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
                {/* Answer, conditional render (the rotating plus provides the
                    motion cue; no JS height tween keeps the toggle cheap for
                    INP) */}
                {openIndex === i && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-label={faq.q}
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
