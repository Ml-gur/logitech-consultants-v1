'use client'

import { useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import IntegrationMarquee from './IntegrationMarquee'

/* ---------- White product panels (bright UI on the dark canvas) ---------- */

function FlowIllustration() {
  const rows = [
    { label: 'New lead captured', sub: 'Trigger · Form + Email', icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
    { label: 'AI enriches & scores it', sub: 'Under 30 sec · Automated', icon: 'M12 2a4 4 0 014 4c0 2-2 3-2 5v1h-4v-1c0-2-2-3-2-5a4 4 0 014-4zM12 15v4M8 21h8' },
    { label: 'Routed to the right rep', sub: '0 Manual handoffs', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  ]
  return (
    <div className="h-full rounded-[12px] bg-white px-4 py-3 flex flex-col justify-between border border-black/5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3 rounded-[10px] bg-[#f4f4f6] px-2.5 py-2 border border-black/5">
          <div className="w-10 h-10 rounded-[10px] bg-[#191919] flex items-center justify-center shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d={row.icon} />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[#111111] truncate">{row.label}</div>
            <div className="text-[10px] text-[#6d6e71] truncate">{row.sub}</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#6d6e71] shrink-0">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      ))}
    </div>
  )
}

function ChartIllustration() {
  // "Work automated" mini bar chart — grows once Jan→Apr, stays (light on white).
  const bars = [
    { label: 'Jan', value: 20, full: 99 },
    { label: 'Feb', value: 31, full: 140 },
    { label: 'Mar', value: 42, full: 178 },
    { label: 'Apr', value: 51, full: 226 },
  ]
  const scale = 0.42
  return (
    <div className="h-full rounded-[12px] bg-white px-4 py-3 flex flex-col border border-black/5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-[#111111]">Work automated</div>
        <span className="font-mono text-[10px] text-[#6d6e71]">0–50%</span>
      </div>
      <div className="flex-1 flex gap-3 items-end">
        {bars.map((b, i) => (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5">
            {/* Animate on mount (the panel only mounts when its tab is active,
                so it's always in view) — a whileInView trigger here is flaky
                when the mount races the tab-switch transition */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: b.full * scale }}
              transition={{ delay: i * 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              data-testid="chart-bar"
              className="w-full rounded-t-[8px] bg-[#e9e9ec] relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-[65%] bg-[#f7f7f8] rounded-t-[5px]" />
            </motion.div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-1.5">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 flex flex-col items-center leading-none">
            <span className="text-[10px] font-medium text-[#111111]">{b.label}</span>
            <span className="text-[10px] text-[#111111]">+{b.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Tab data ---------- */

const tabs = [
  {
    id: 'workflow',
    label: 'Workflow Automations',
    heading: 'Let the repetitive work run itself.',
    description:
      'We connect your tools and let the busywork run itself — triggers, handoffs, and follow-ups handled automatically.',
    features: [
      'First useful automation live within one week',
      'Instant replies and smart follow-ups capture every lead',
      'Repetitive admin runs quietly in the background',
      'Built for your stack — no platform lock-in',
    ],
    panel: <FlowIllustration />,
  },
  {
    id: 'data',
    label: 'Data & Integrations',
    heading: 'Your data, wired and AI-ready.',
    description:
      'We get your data AI-ready and wired into the tools you already use, so every system stays in sync.',
    features: [
      'Real-time sync across every channel',
      'Cleanup in the exact places AI will look',
      'Discrepancies flagged before they become oversells',
      'Your stack, your rules — never locked in',
    ],
    panel: <IntegrationMarquee />,
  },
  {
    id: 'consulting',
    label: 'Business Consulting',
    heading: 'AI that pays for itself.',
    description:
      'We find where AI creates real value, then map the plan to capture it — ranked by ROI, measured by results.',
    features: [
      'ROI-ranked opportunity roadmap',
      '2–4 week pilots with clear metrics',
      'Work automated: +20% in January to +51% by April',
      'Fully documented, owned by you',
    ],
    panel: <ChartIllustration />,
  },
]

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          {/* Checkmark — Signal Violet (design.md Feature Checklist Item) */}
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
          <span className="text-[16px] leading-relaxed text-paper">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function TabbedFeatures() {
  const [active, setActive] = useState(tabs[0].id)
  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <MotionConfig reducedMotion="user">
      <section id="services" className="relative">
        <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal()}
            className="section-label text-center"
          >
            Our Services
          </motion.p>

          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.08)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] text-center max-w-[720px] mx-auto mb-4"
          >
            Everything you need to put AI to work.
          </motion.h2>

          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.14)}
            className="text-[17px] text-fog text-center max-w-[480px] mx-auto mb-14"
          >
            Strategy, automation, custom builds, and the team to run them, all in one place.
          </motion.p>

          {/* Segmented tab control — 30px radius, Carbon fill, active dot */}
          <motion.div
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.18)}
            className="flex justify-center mb-14"
          >
            <div
              role="tablist"
              aria-label="Our services"
              className="inline-flex max-w-full overflow-x-auto rounded-[30px] bg-[#191919] border border-white/10 p-1.5 gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((tab) => {
                const selected = tab.id === active
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => setActive(tab.id)}
                    className={`flex items-center gap-2.5 whitespace-nowrap px-5 py-3 rounded-[30px] text-sm transition-colors duration-200 ${
                      selected ? 'bg-white/5 text-paper' : 'text-ash hover:text-paper'
                    }`}
                  >
                    {/* Small Voltage Blue dot on the active tab */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-opacity duration-200 ${
                        selected ? 'bg-signal opacity-100' : 'bg-transparent opacity-0'
                      }`}
                      aria-hidden
                    />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Two-column feature block — checklist left, white product panel right.
              The whole grid is the tabpanel (design.md Segmented Tab Control) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              role="tabpanel"
              id={`panel-${current.id}`}
              aria-labelledby={`tab-${current.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            >
              <div className="min-w-0 max-w-[520px]">
                <h3 className="text-[28px] leading-tight mb-4">{current.heading}</h3>
                <p className="text-[17px] text-fog leading-relaxed mb-10">{current.description}</p>
                <Checklist items={current.features} />
              </div>

              {/* White product screenshot panel — bright workspace on dark canvas */}
              <div className="relative min-w-0">
                <div
                  className="absolute -inset-6 rounded-[40px] pointer-events-none"
                  style={{ background: 'radial-gradient(60% 60% at 60% 40%, rgba(64,91,255,0.22) 0%, transparent 70%)' }}
                  aria-hidden
                />
                <div className="relative h-[240px] rounded-[20px] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-1.5 mb-2 px-1" aria-hidden>
                    <span className="w-2 h-2 rounded-full bg-[#e2e2e4]" />
                    <span className="w-2 h-2 rounded-full bg-[#e2e2e4]" />
                    <span className="w-2 h-2 rounded-full bg-[#e2e2e4]" />
                    <span className="ml-2 text-[11px] font-mono text-[#6d6e71]">app.logitechconsultants.com</span>
                  </div>
                  <div className="h-[calc(100%-24px)]">{current.panel}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </MotionConfig>
  )
}
