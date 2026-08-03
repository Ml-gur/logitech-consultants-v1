'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

const benefits = [
  {
    metric: 'Results in Days',
    description: 'Launch your first useful automation within one week, so you start saving time immediately.',
  },
  {
    metric: 'Never Miss a Lead',
    description: 'Instant replies and smart follow-ups capture every sales opportunity, even after hours.',
  },
  {
    metric: 'Autopilot Operations',
    description: 'Repetitive admin, handoffs, and updates run quietly in the background while you focus on growth.',
  },
  {
    metric: 'Fast Human Support',
    description: 'Get clear answers when you need them, so issues never block your day-to-day operations.',
  },
  {
    metric: 'Scale Without Hiring',
    description: 'Handle more clients, messages, and tasks without adding expensive operational headcount.',
  },
  {
    metric: 'Own It Forever',
    description: 'Your automation is built for your stack, with no monthly platform lock-in holding your business hostage.',
  },
]

export default function Benefits() {
  return (
    <section className="relative">
      <div className="section-panel section-panel-light" style={{ borderRadius: '50px' }}>
        <div className="section-inner">
          <p className="section-label">003/ Benefits</p>

          <h2 className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] mb-6">
            Get Your Time Back.
          </h2>

          <p className="text-base text-[#4f4f4f] max-w-2xl mb-16">
            Practical AI automations that remove repeat work, protect every lead, and keep your business moving without adding headcount.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
            {benefits.map((b, i) => (
              <motion.div
                key={b.metric}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className="group border border-black/[0.06] rounded-[15px] bg-[#f0f0f0] p-[25px] transition-all duration-300 hover:bg-white"
              >
                <div className="w-7 h-0.5 rounded-full bg-[#ff3700] mb-5" />
                <h3 className="font-['Halant'] text-lg font-semibold text-[#0a0a0a] mb-3">
                  {b.metric}
                </h3>
                <p className="text-sm text-[#4f4f4f] leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}