'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

const tiers = [
  {
    name: 'Pilot',
    subtitle: 'Start with one high-impact win.',
    price: '1.995',
    period: 'monthly',
    badge: 'Per project',
    featured: false,
    features: [
      'AI readiness audit',
      '90-day roadmap',
      '1 workflow automated or 1 AI build',
      '2–4 week delivery',
      'Handover docs + 1 workshop',
    ],
  },
  {
    name: 'Partner',
    subtitle: 'Your AI team, always building.',
    price: '2.995',
    period: 'monthly',
    badge: 'Most popular',
    featured: true,
    features: [
      'Everything in Pilot',
      'Multiple builds per quarter',
      'Custom agents & integrations',
      'Bi-weekly strategy reviews',
      'Priority support (Slack, 24–48h)',
    ],
  },
  {
    name: 'Scale',
    subtitle: 'Org-wide AI across teams.',
    price: '5.995',
    period: 'monthly',
    badge: 'Per project',
    featured: false,
    features: [
      'Everything in Partner',
      'Multi-team rollout',
      'Security & compliance review',
      'Dedicated PM + on-call support',
      'Training program + playbooks/SOPs',
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="section-label text-center"
        >
          Pricing
        </motion.p>

        <motion.h2
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.06)}
          className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] text-center max-w-[680px] mx-auto mb-4"
        >
          Pricing that scales with you.
        </motion.h2>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.1)}
          className="text-[17px] text-fog text-center max-w-[440px] mx-auto mb-16"
        >
          Start with a focused pilot, grow into an embedded partnership.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-4 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(i * 0.08)}
              className={`rounded-[30px] p-8 flex flex-col ${
                tier.featured
                  ? 'bg-[#191919] border border-signal/40 shadow-[0_0_40px_rgba(112,132,255,0.19)]'
                  : 'bg-[#191919] border border-white/10'
              }`}
            >
              <div className="mb-6 flex items-start justify-between gap-2">
                <h3 className="text-xl font-medium text-paper">{tier.name}</h3>
                <span
                  className={`tag-pill px-3 py-1 ${
                    tier.featured ? 'text-signal border-signal/40' : ''
                  }`}
                >
                  {tier.badge}
                </span>
              </div>
              <p className="text-[15px] text-fog leading-relaxed mb-8">{tier.subtitle}</p>

              <div className="flex items-baseline gap-1 mb-10">
                <span className="font-display text-[40px] leading-none font-medium text-paper tabular-nums">
                  ${tier.price}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-fog">
                  /{tier.period}
                </span>
              </div>

              <ul className="space-y-3.5 mb-10 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 mt-0.5 shrink-0 text-signal"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-[15px] leading-relaxed text-ash">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className={`block text-center py-3.5 rounded-[30px] text-sm font-medium transition-colors duration-200 ${
                  tier.featured
                    ? 'bg-[#405bff] text-white hover:bg-[#3351e6]'
                    : 'border border-signal text-signal hover:bg-signal/10'
                }`}
              >
                Book a call
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
