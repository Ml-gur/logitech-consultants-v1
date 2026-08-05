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
      <div className="section-panel">
        <div className="section-inner">
          <p className="section-label">008/ Our Pricing</p>

          <h2 className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] text-center max-w-[700px] mx-auto mb-6">
            Pricing that scales with you.
          </h2>

          <p className="text-base text-[#4f4f4f] text-center max-w-[435px] mx-auto mb-16">
            Start with a focused pilot, grow into an embedded partnership.
          </p>

          {/* Light #f0f0f0 cards with dark #151619 top block — matches the measured original */}
          <div className="grid md:grid-cols-3 gap-[15px]">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className="pricing-card rounded-[20px] bg-[#f0f0f0] p-[10px]"
              >
                {/* Inner #e5e5e5 layer wrapping the dark block + CTA (matches original) */}
                <div className="bg-[#e5e5e5] rounded-[16px] p-[10px]">
                  {/* Dark top block: name, subtitle, badge, price */}
                  <div className="bg-[#151619] rounded-[14px] p-[15px]">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="font-['Halant'] text-[20px] font-semibold leading-snug text-[#f0f0f0]">
                        {tier.name}
                      </h3>
                      <span className="text-[11.2px] font-semibold whitespace-nowrap uppercase text-[#f0f0f0]">
                        {tier.badge}
                      </span>
                    </div>
                    <p className="text-[16px] leading-[23.2px] text-[#e5e5e5] mb-[54px]">{tier.subtitle}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[34px] leading-none font-semibold font-['Halant'] text-[#f0f0f0]">
                        ${tier.price}
                      </span>
                      <span className="text-[11.2px] font-semibold uppercase text-[#f0f0f0]">/{tier.period}</span>
                    </div>
                  </div>

                  {/* Dark CTA pill */}
                  <Link
                    to="/contact"
                    className="block text-center py-[15px] mt-[10px] rounded-[50px] bg-[#151619] text-[#f0f0f0] text-[16px] font-semibold transition-colors duration-200 hover:bg-[#0a0a0a]"
                  >
                    Book a call
                  </Link>
                </div>

                {/* Light lower area: included + features in dark text */}
                <div className="pt-[18px]">
                  <h4 className="font-['Halant'] text-[18.4px] font-medium text-[#0a0a0a] mb-3">
                    What&rsquo;s included:
                  </h4>
                  <ul className="space-y-[18px]">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13.6px] font-semibold leading-snug text-[#4f4f4f]">
                        <svg className="w-[22px] h-[22px] mt-[1px] shrink-0 text-[#0a0a0a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
