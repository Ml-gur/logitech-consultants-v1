'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

const faqs = [
  {
    q: '01/ What does AIthor actually do?',
    a: "We're a full-service AI agency. We find where AI creates value, build the automations, agents, and tools to capture it, then train your team to run them.",
  },
  {
    q: '02/ How do I get started?',
    a: 'Book a free discovery call. We\u2019ll discuss your goals, identify where AI can make an impact, and outline a plan\u2014no commitment required.',
  },
  {
    q: '03/ How long until we see results?',
    a: 'Most clients see their first automation live within 2 weeks. Our pilot program is designed to deliver a measurable win in 2\u20134 weeks.',
  },
  {
    q: '04/ What if a pilot doesn\u2019t work out?',
    a: "We build in stages and validate at each step. If a pilot isn't delivering value, we stop and find a better approach. Your investment is focused on what works.",
  },
  {
    q: '05/ Do we need technical staff on our side?',
    a: 'No. We handle the technical build. Your team just needs to know their workflows, and we train them to run the systems we build.',
  },
  {
    q: '06/ Who owns the systems and data?',
    a: 'You own everything. Our builds are fully documented, run on your infrastructure, and never lock you into proprietary tools.',
  },
  {
    q: '07/ What tools and models do you work with?',
    a: 'We work across all major AI platforms, LLMs, and automation tools. We choose the right stack for your specific use case, not a one-size-fits-all solution.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative">
      <div className="section-panel section-panel-dark" style={{ borderRadius: '50px' }}>
        <div className="section-inner">
          <p className="section-label">009/ FAQs</p>

          <h2 className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#f0f0f0] mb-16">
            Need answers?
          </h2>

          <div className="max-w-3xl mx-auto space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.06)}
                className="border-b border-white/5"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-sm font-medium text-[#e5e5e5] group-hover:text-[#f0f0f0] transition-colors">
                    {faq.q}
                  </span>
                  <motion.svg
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 text-[#999] shrink-0 ml-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-[#999] pb-5 leading-relaxed">
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
    </section>
  )
}