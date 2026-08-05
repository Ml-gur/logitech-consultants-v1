'use client'

import { motion, MotionConfig } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import IntegrationMarquee from './IntegrationMarquee'

function FlowIllustration() {
  // Faithful to the original: light #e5e5e5 panel, #f0f0f0 rows, dark #151619
  // chips. Measured live: each chip icon spins ~180° with spring overshoot,
  // one after another (icon1 → icon2 → icon3), then loops forever.
  const rows = [
    { label: 'New lead captured', sub: 'Trigger · Form + Email', icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
    { label: 'AI enriches & scores it', sub: 'Under 30 sec · Automated', icon: 'M12 2a4 4 0 014 4c0 2-2 3-2 5v1h-4v-1c0-2-2-3-2-5a4 4 0 014-4zM12 15v4M8 21h8' },
    { label: 'Routed to the right rep', sub: '0 Manual handoffs', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  ]
  return (
    <div className="h-[190px] rounded-[16px] bg-[#e5e5e5] px-4 py-3 flex flex-col justify-between border border-black/5">
      {rows.map((row, i) => (
        <div key={row.label} className="flex items-center gap-3 rounded-[10px] bg-[#f0f0f0] px-2.5 py-2">
          <div className="w-11 h-11 rounded-[7px] bg-[#151619] flex items-center justify-center shrink-0">
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#f0f0f0]"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 190, -18, 0] }}
              transition={{
                delay: 0.4 + i * 1.7,
                duration: 1.5,
                times: [0, 0.45, 0.75, 1],
                repeat: Infinity,
                repeatDelay: 3.2,
                ease: 'easeInOut',
              }}
            >
              <path d={row.icon} />
            </motion.svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[#0a0a0a] truncate">{row.label}</div>
            <div className="text-[10px] text-[#4f4f4f] truncate">{row.sub}</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4f4f4f] shrink-0">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      ))}
    </div>
  )
}

function ChartIllustration() {
  // "Work automated" mini bar chart — Jan +20% → Apr +51%. Light theme
  // (#e5e5e5 bars on #e5e5e5 panel, #f0f0f0 cap strip, black labels).
  // OPERATOR CHANGE (2026-08-05): the original's grow-hold-reset-LOOP cycle was
  // replaced — bars now grow ONCE, staggered Jan→Apr, and STAY at their final
  // heights, showing progressive growth that matches the +20% → +51% labels.
  const bars = [
    { label: 'Jan', value: 20, full: 99 },
    { label: 'Feb', value: 31, full: 140 },
    { label: 'Mar', value: 42, full: 178 },
    { label: 'Apr', value: 51, full: 226 },
  ]
  // Scale to the 190px card (bars sit on a light panel with a baseline at the bottom)
  const scale = 0.44
  return (
    <div className="h-[190px] rounded-[16px] bg-[#e5e5e5] px-4 py-3 flex flex-col border border-black/5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-[#0a0a0a]">Work automated</div>
        <span className="text-[10px] text-[#4f4f4f]">0–50%</span>
      </div>
      <div className="flex-1 flex gap-3 items-end">
        {bars.map((b, i) => (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: b.full * scale }}
              viewport={revealViewport}
              transition={{
                delay: i * 0.2,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              data-testid="chart-bar"
              className="w-full rounded-t-[8px] bg-[#e5e5e5] relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-[65%] bg-[#f0f0f0] rounded-t-[5px]" />
            </motion.div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-1.5">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 flex flex-col items-center leading-none">
            <span className="text-[10px] font-medium text-[#0a0a0a]">{b.label}</span>
            <span className="text-[10px] text-[#0a0a0a]">+{b.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const services = [
  {
    number: '01',
    title: 'Workflow Automations',
    description: 'We connect your tools and let the repetitive work run itself.',
    illustration: <FlowIllustration />,
  },
  {
    number: '02',
    title: 'Data & Integrations',
    description: 'We get your data AI-ready and wired into the tools you already use.',
    illustration: <IntegrationMarquee />,
  },
  {
    number: '03',
    title: 'Business Consulting',
    description: 'We find where AI creates real value, then map the plan to capture it.',
    illustration: <ChartIllustration />,
  },
]

export default function Services() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative">
      <div className="section-panel section-panel-light" style={{ borderRadius: '50px' }}>
        <div className="section-inner">
          <p className="section-label">002/ Our Services</p>

          <h2 className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] text-center max-w-[700px] mx-auto mb-6">
            Everything you need to put AI to work.
          </h2>

          <p className="text-base text-[#4f4f4f] text-center max-w-[450px] mx-auto mb-16">
            Strategy, automation, custom builds, and the team to run them, all in one place.
          </p>

          {/* Service cards — illustration above, description below (matches the original) */}
          {/* Responsive grid matches the original: 1 col ≤800px, 2 cols 810–1180px
              with the 3rd card spanning full width, 3 cols ≥1200px (measured) */}
          <div className="grid grid-cols-1 min-[810px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-[15px]">
            {services.map((svc, i) => (
              <motion.div
                key={svc.number}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className={`group bg-[#e5e5e5] rounded-[20px] p-[25px] transition-all duration-300 min-w-0 ${i === 2 ? 'min-[810px]:col-span-2 min-[1200px]:col-span-1' : ''}`}
              >
                <div className="mb-6">{svc.illustration}</div>
                <h3 className="font-['Halant'] text-xl font-semibold text-[#0a0a0a] group-hover:text-[#4f4f4f] transition-colors duration-300 mb-3">
                  {svc.title}
                </h3>
                <p className="text-sm text-[#4f4f4f] leading-relaxed">
                  {svc.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </section>
    </MotionConfig>
  )
}
