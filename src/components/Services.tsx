'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

function FlowIllustration() {
  return (
    <div className="h-[190px] rounded-[16px] bg-[#151619] p-5 flex flex-col justify-between border border-white/5">
      {[
        { label: 'New lead captured', sub: 'Trigger · Form', icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
        { label: 'AI scores & enriches', sub: 'Under 30 sec · Auto', icon: 'M12 2a4 4 0 014 4c0 2-2 3-2 5v1h-4v-1c0-2-2-3-2-5a4 4 0 014-4zM12 15v4M8 21h8' },
        { label: 'Routed to right rep', sub: '0 manual handoffs', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
      ].map((row, i) => (
        <div key={row.label}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#063630] flex items-center justify-center text-[#f0f0f0] shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={row.icon} />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-[#f0f0f0] truncate">{row.label}</div>
              <div className="text-[10px] text-[#999] truncate">{row.sub}</div>
            </div>
            <span className="text-[10px] text-[#168804]">{i === 0 ? 'Now' : i === 1 ? '~12s' : 'Auto'}</span>
          </div>
          {i < 2 && <div className="w-px h-3 bg-white/10 ml-[13px]" />}
        </div>
      ))}
    </div>
  )
}

function DataIllustration() {
  return (
    <div className="h-[190px] rounded-[16px] bg-[#151619] p-5 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-medium text-[#f0f0f0]">Customer records</div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#168804]/15 text-[#168804]">Synced</span>
      </div>
      <div className="space-y-2">
        {[
          ['Acme Corp', '—', 'High'],
          ['Globex Ltd', '✓', 'High'],
          ['Initech', '—', 'Med'],
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-3 text-[10px]">
            <div className="flex-1 text-[#e5e5e5] truncate">{row[0]}</div>
            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${row[1] === '✓' ? 'bg-[#168804]/20 text-[#168804]' : 'bg-white/10 text-[#4f4f4f]'}`}>
              {row[1] === '✓' ? (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
              ) : (
                <span className="text-[7px]">—</span>
              )}
            </div>
            <span className="w-8 text-right text-[#999]">{row[2]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-[#999]">1,284 records enriched</span>
        <span className="text-[10px] text-[#ff3700]">Live API</span>
      </div>
    </div>
  )
}

function ChartIllustration() {
  const bars = [42, 68, 50, 88, 64]
  return (
    <div className="h-[190px] rounded-[16px] bg-[#151619] p-5 flex flex-col border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-medium text-[#f0f0f0]">Automation ROI</div>
        <span className="text-[10px] text-[#168804]">+340%</span>
      </div>
      <div className="flex-1 flex items-end gap-2">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className={`w-full rounded-t-md ${i === 3 ? 'bg-[#ff3700]' : 'bg-white/15'}`} style={{ height: `${b}px` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        {['Q1', 'Q2', 'Q3', 'Q4', 'Now'].map((l, i) => (
          <div key={l} className={`flex-1 text-center text-[9px] ${i === 3 ? 'text-[#ff3700]' : 'text-[#4f4f4f]'}`}>{l}</div>
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
    illustration: <DataIllustration />,
  },
  {
    number: '03',
    title: 'Business Consulting',
    description: 'We find where AI creates real value, then map the plan to capture it.',
    illustration: <ChartIllustration />,
  },
]

const barData = [
  { label: 'Jan', value: 20 },
  { label: 'Feb', value: 31 },
  { label: 'Mar', value: 42 },
  { label: 'Apr', value: 51 },
]

export default function Services() {
  return (
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
          <div className="grid md:grid-cols-3 gap-[15px] mb-20">
            {services.map((svc, i) => (
              <motion.div
                key={svc.number}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className="group bg-[#f0f0f0] border border-black/[0.06] rounded-[20px] p-[25px] hover:border-black/10 transition-all duration-300"
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

          {/* Bar chart section */}
          <div className="border-t border-black/[0.06] pt-16">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-medium text-[#4f4f4f]">Work automated</p>
              <span className="text-xs text-[#4f4f4f]">0–50%</span>
            </div>

            <div className="flex gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between text-[10px] text-[#4f4f4f] py-1 h-[160px] max-md:hidden">
                <span>50%</span>
                <span>40%</span>
                <span>30%</span>
                <span>20%</span>
                <span>10%</span>
              </div>

              <div className="flex-1 flex items-end gap-6 max-md:gap-4">
                {barData.map((bar, i) => (
                  <motion.div
                    key={bar.label}
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 flex flex-col items-center gap-3"
                  >
                    <span className="text-xs font-medium text-[#0a0a0a]">+{bar.value}%</span>
                    <div
                      className="w-full rounded-t-lg bg-[#0a0a0a] origin-bottom"
                      style={{ height: `${bar.value * 3}px`, minHeight: '40px' }}
                    />
                    <span className="text-xs text-[#4f4f4f]">{bar.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
