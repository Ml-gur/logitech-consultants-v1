'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo, { breadcrumbLd } from '../lib/Seo'
import FAQ from '../components/FAQ'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

/**
 * "AI Automation in Nairobi" regional pillar page (deep-research priority #5).
 *
 * Targets the regional query space ("AI automation Nairobi / Kenya") that the
 * competitive landscape (TECHenya, Digital4Africa, SmartBizSystems, etc.)
 * serves with thin content. Regional relevance anchors:
 *   - explicit Nairobi/Kenya/East Africa mentions in copy + headings
 *   - local context (M-Pesa, local tools, data residency, timezone)
 *   - breadcrumb + ProfessionalService areaServed already in siteLd()
 */
const regionalPoints = [
  {
    title: 'Automation that works with your local stack',
    body: 'M-Pesa payments, local ERPs, banking portals, WhatsApp Business, and the tools East African companies actually run on. We build inside your stack — never around it.',
  },
  {
    title: 'Built for Nairobi bandwidth and uptime realities',
    body: 'Automations run reliably on modest infrastructure, with offline-safe queues and sensible retries. We design for the real network, not the demo.',
  },
  {
    title: 'A team in your timezone, on your schedule',
    body: 'We are based in Nairobi. Calls, demos, and support happen during East African working hours — not at 2am from another continent.',
  },
  {
    title: 'Data stays yours, hosted where you choose',
    body: 'Your data lives on your infrastructure or the provider you already trust. We document everything and never lock you into proprietary tools.',
  },
]

const useCases = [
  {
    title: 'Customer support agents',
    body: 'Resolve common questions instantly on WhatsApp and email, route the rest to your team with full context.',
    metric: 'up to 60% fewer tickets',
  },
  {
    title: 'Lead routing & sales ops',
    body: 'Score inbound leads, enrich records, and book qualified prospects straight into your calendar.',
    metric: '38% faster deal closing',
  },
  {
    title: 'Finance & reconciliation',
    body: 'Match M-Pesa transactions to invoices, flag discrepancies, and close the month in hours instead of days.',
    metric: 'hours of manual work saved weekly',
  },
  {
    title: 'Inventory & order operations',
    body: 'Keep stock synced across every channel and catch oversells before they become refunds.',
    metric: '99.8% inventory accuracy',
  },
  {
    title: 'Content & reporting pipelines',
    body: 'Draft, format, and publish recurring content and reports on autopilot — with human approval where it matters.',
    metric: '4× output, same team size',
  },
  {
    title: 'Internal workflows & approvals',
    body: 'Automate the handoffs between your tools: forms to CRM, tickets to engineering, contracts to billing.',
    metric: '100+ hours saved per month',
  },
]

export default function NairobiPillarPage() {
  return (
    <section className="relative pt-32">
      <Seo
        title="AI Automation in Nairobi, Kenya"
        description="AI automation for Nairobi businesses: agents and automations built around M-Pesa and your local stack — supported from Nairobi, in your timezone."
        path="/ai-automation-nairobi"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'AI Automation Nairobi', path: '/ai-automation-nairobi' },
          ]),
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* Hero */}
        <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
          AI automation in Nairobi
        </motion.p>
        <motion.h1
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.08)}
          className="text-[clamp(40px,6vw,80px)] leading-[1.02] tracking-[-0.03em] max-w-[820px] mb-6"
        >
          AI automation for <span className="text-signal">Nairobi&rsquo;s businesses.</span>
        </motion.h1>
        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.14)}
          className="text-[18px] text-fog max-w-[620px] leading-relaxed mb-10"
        >
          We find where AI creates real value for Kenyan companies, build the automations and agents to capture it, and support them from Nairobi &mdash; in your timezone, on your stack.
        </motion.p>
        <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.2)} className="flex flex-wrap gap-4 items-center">
          <Link to="/contact" className="btn-primary px-7 py-3.5 text-sm">
            Book a free discovery call
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
          <Link to="/case-studies" className="btn-ghost px-6 py-3 text-sm">
            See our work
          </Link>
        </motion.div>

        {/* Why Nairobi teams choose us */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Built for East Africa
          </motion.p>
          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-16"
          >
            Why Nairobi teams choose us.
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {regionalPoints.map((p, i) => (
              <motion.div
                key={p.title}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.06)}
                className="card-dark rounded-[30px] p-7"
              >
                <div className="w-8 h-[3px] rounded-full bg-gradient-to-r from-[#405bff] to-[#7084ff] mb-6" />
                <h3 className="text-lg font-medium mb-3">{p.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What we automate */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            What we automate
          </motion.p>
          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-16"
          >
            The workflows Nairobi companies run on autopilot.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((u, i) => (
              <motion.div
                key={u.title}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.06)}
                className="rounded-[30px] bg-[#191919] border border-white/10 p-7 flex flex-col"
              >
                <h3 className="text-lg font-medium mb-3">{u.title}</h3>
                <p className="text-sm text-fog leading-relaxed mb-5 flex-1">{u.body}</p>
                <p className="text-xs font-mono text-signal">{u.metric}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How to start */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Getting started
          </motion.p>
          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] max-w-[720px] mb-16"
          >
            From first call to first win in weeks.
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Discovery call', body: 'We map your workflows, find where AI creates real value, and scope the first pilot — no commitment.' },
              { step: '02', title: 'Pilot in 2–4 weeks', body: 'We build one measurable automation fast, so you see the ROI before committing to anything bigger.' },
              { step: '03', title: 'Scale & support', body: 'We train your team, document everything, and support the systems long after launch.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className="rounded-[30px] bg-[#191919] border border-white/10 p-7"
              >
                <p className="font-mono text-sm text-signal mb-6">{s.step}</p>
                <h3 className="text-lg font-medium mb-3">{s.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.1)}
            className="mt-16 rounded-[30px] border border-white/10 bg-[#191919] p-10 text-center"
          >
            <h3 className="font-display text-[clamp(24px,3.5vw,36px)] font-medium mb-4">
              Ready to automate your Nairobi business?
            </h3>
            <p className="text-fog max-w-[480px] mx-auto mb-8">
              Book a free discovery call. We&rsquo;ll show you exactly where AI pays off in your workflow &mdash; and where it doesn&rsquo;t.
            </p>
            <Link to="/contact" className="btn-primary px-7 py-3.5 text-sm inline-flex">
              Book a free discovery call
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <FAQ />
      </div>
    </section>
  )
}
