'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo, { breadcrumbLd } from '../lib/Seo'
import { SITE, absUrl } from '../lib/brand'
import FAQ from '../components/FAQ'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

/**
 * Regional page: Naivolabs in Nairobi.
 *
 * Positioned the way the brand strategy requires, what we do first, then why
 * we understand the operating environment. Africa appears as origin, insight
 * and capability, never as a category limitation, and there are no outcome
 * statistics here that we cannot evidence.
 */
const realities = [
  {
    title: 'Mobile-first, messaging-native',
    body: 'For most people here the primary computer is a phone, and the primary channel is WhatsApp or SMS. We design systems for that reality instead of bolting a messaging adapter onto a web-first product.',
  },
  {
    title: 'Language and accent variation is the norm',
    body: 'Voice systems built on clean, single-accent training data fail in practice. We evaluate on real recorded interactions from your users and treat accent and code-switching as a first-class accuracy problem.',
  },
  {
    title: 'Infrastructure is variable, so the system must be',
    body: 'Bandwidth drops, providers change, and off-the-shelf SaaS assumptions do not always hold. We build queues, retries and degradation paths so the work still completes when a dependency is slow.',
  },
  {
    title: 'Data protection is a design constraint',
    body: 'Kenya\u2019s Data Protection Act sets the baseline for what we can process and where. Residency, retention and access are decided with you at design time, not documented afterwards.',
  },
  {
    title: 'Organizations are federated, not tidy',
    body: 'Work crosses departments, spreadsheets, WhatsApp groups and systems that do not talk to each other. We map how work actually moves before proposing anything.',
  },
  {
    title: 'Support in your working hours',
    body: 'We are based in Nairobi and work East Africa Time. When a deployment needs attention, the people who built it are awake, not three timezones away.',
  },
]

const capabilities = [
  { title: 'Voice reception', body: 'A first point of contact that answers, understands, retrieves and completes, in the languages your callers actually use.', to: '/deployment-patterns/ai-voice-receptionist' },
  { title: 'Institutional knowledge', body: 'Answers drawn from your own documents, cited back to the source, scoped to the role of whoever is asking.', to: '/deployment-patterns/institutional-knowledge-agent' },
  { title: 'Service request routing', body: 'Requests captured, understood and routed into the systems of record, with status visible to the person who asked.', to: '/deployment-patterns/service-request-routing' },
  { title: 'Document intake', body: 'Forms and correspondence read, validated and filed, with anything uncertain flagged for a person instead of guessed at.', to: '/deployment-patterns/document-intake' },
]

export default function NairobiPillarPage() {
  return (
    <section className="relative pt-32">
      <Seo
        title="Applied AI Systems in Nairobi"
        description="Naivolabs builds governed AI systems from Nairobi, designed for mobile-first channels, varied languages, uneven infrastructure and Kenyan data-protection law."
        path="/ai-automation-nairobi"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Nairobi', path: '/ai-automation-nairobi' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Applied AI systems in Nairobi',
            url: absUrl('/ai-automation-nairobi'),
            about: 'Applied AI systems for organizations in Nairobi and East Africa',
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          },
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Hero */}
        <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
          Nairobi, Kenya
        </motion.p>
        <motion.h1
          initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.08)}
          className="text-[clamp(38px,6vw,76px)] leading-[1.02] tracking-[-0.03em] max-w-[860px] mb-6"
        >
          Built in Nairobi. Designed for the <span className="text-signal">real conditions.</span>
        </motion.h1>
        <motion.p
          initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)}
          className="text-[18px] text-fog max-w-[640px] leading-relaxed mb-10"
        >
          Naivolabs is an applied AI systems company based in Nairobi. Understanding the local operating
          environment is not a marketing angle for us. It is the reason our systems hold up here, and
          elsewhere.
        </motion.p>
        <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.2)} className="flex flex-wrap gap-4 items-center">
          <Link to="/contact" className="btn-primary px-7 py-3.5 text-sm">
            Book a discovery call
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
          <Link to="/deployment-patterns" className="btn-ghost px-7 py-3.5 text-sm">
            See what we deploy
          </Link>
        </motion.div>

        {/* Operating realities */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            The operating environment
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] max-w-[760px] mb-16"
          >
            What building from Nairobi actually teaches you.
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {realities.map((p, i) => (
              <motion.div
                key={p.title}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.06)}
                className="card-dark rounded-[30px] p-7"
              >
                <div className="w-8 h-[3px] rounded-full bg-gradient-to-r from-voltage to-signal mb-6" />
                <h3 className="text-lg font-medium mb-3">{p.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What we deploy here */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            What we deploy
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] max-w-[720px] mb-16"
          >
            Systems that complete work, not conversations.
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {capabilities.map((c, i) => (
              <motion.div
                key={c.title}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.06)}
              >
                <Link
                  to={c.to}
                  className="group flex flex-col h-full rounded-[30px] bg-[#191919] border border-white/10 p-7 transition-colors duration-300 hover:border-signal/40"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-paper">{c.title}</h3>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate transition-all duration-300 group-hover:text-signal group-hover:translate-x-1" aria-hidden>
                      <path d="M6 3l5 5-5 5" />
                    </svg>
                  </div>
                  <p className="text-sm text-fog leading-relaxed">{c.body}</p>
                </Link>
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
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] max-w-[720px] mb-16"
          >
            From a real problem to a live system.
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Discovery', body: 'We map how the work is done today and identify where a system would change an outcome. No commitment.' },
              { step: '02', title: 'First deployment', body: 'One system, built and put in front of real users, instrumented against measures agreed before launch.' },
              { step: '03', title: 'Govern, measure, repeat', body: 'Controls configured with your stakeholders, results reported honestly, and what works folded into the next deployment.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.08)}
                className="rounded-[30px] bg-[#191919] border border-white/10 p-7"
              >
                <p className="font-mono text-sm text-signal mb-6">{s.step}</p>
                <h3 className="text-lg font-medium mb-3">{s.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.1)}
            className="mt-16 rounded-[30px] border border-white/10 bg-[#191919] p-10 text-center"
          >
            <h3 className="font-display text-[clamp(24px,3.5vw,36px)] font-medium mb-4">
              Bring us a problem, not a brief.
            </h3>
            <p className="text-fog max-w-[520px] mx-auto mb-8">
              Tell us which workflow keeps breaking. We will tell you whether an intelligent system is the right
              answer, and if it is not, we will say so.
            </p>
            <Link to="/contact" className="btn-primary px-7 py-3.5 text-sm inline-flex">
              Book a discovery call
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
