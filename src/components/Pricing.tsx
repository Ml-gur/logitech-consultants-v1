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
    features: [
      'AI readiness audit',
      '90-day roadmap',
      '1 workflow automated or 1 AI build',
      '2\u20134 week delivery',
      'Handover docs + 1 workshop',
    ],
  },
  {
    name: 'Partner',
    subtitle: 'Your AI team, always building.',
    price: '2.995',
    period: 'monthly',
    badge: 'Per project',
    features: [
      'Everything in Pilot',
      'Multiple builds per quarter',
      'Custom agents & integrations',
      'Bi-weekly strategy reviews',
      'Priority support (Slack, 24\u201348h)',
    ],
  },
  {
    name: 'Scale',
    subtitle: 'Org-wide AI across teams.',
    price: '5.995',
    period: 'monthly',
    badge: 'Per project',
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
      <div className="section-panel rounded-[50px]" style={{ backgroundColor: '#e5e5e5', color: '#0a0a0a' }}>
        <div className="section-inner">
          <p className="section-label">008/ Our Pricing</p>

          <h2 className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] text-center max-w-[700px] mx-auto mb-6">
            Pricing that scales with you.
          </h2>

          <p className="text-base text-[#4f4f4f] text-center max-w-[435px] mx-auto mb-16">
            Start with a focused pilot, grow into an embedded partnership.
          </p>

          {/* All three cards dark #151619, radius 14px — matches the original */}
          <div className="grid md:grid-cols-3 gap-[15px]">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className="rounded-[14px] bg-[#151619] p-[25px] text-[#f0f0f0] flex flex-col transition-colors duration-300 hover:bg-[#0a0a0a]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-['Halant'] text-2xl font-semibold">{tier.name}</h3>
                  <span className="text-xs font-medium text-[#999]">{tier.badge}</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold font-['Halant']">${tier.price}</span>
                    <span className="text-xs text-[#999]">/{tier.period}</span>
                  </div>
                  <p className="text-sm text-[#999] mt-2">{tier.subtitle}</p>
                </div>

                <Link
                  to="/contact"
                  className="block text-center py-3 rounded-[50px] bg-[#f0f0f0] text-[#0a0a0a] text-sm font-semibold transition-all duration-200 hover:bg-white hover:-translate-y-0.5 mb-8"
                >
                  Book a call
                </Link>

                <div className="text-xs uppercase tracking-wider text-[#999] mb-4">
                  What&rsquo;s included:
                </div>

                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#168804]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span className="text-[#e5e5e5]">{f}</span>
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
