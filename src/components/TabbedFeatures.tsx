'use client'

import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { CAPABILITIES } from '../lib/brand'

/* ---------- White product panels (bright UI on the dark canvas) ---------- */

/** Converse, a live exchange that ends in a completed action. */
function ConversationIllustration() {
  const turns = [
    { who: 'Caller', text: 'Do you have a slot on Thursday?', mine: false },
    { who: 'Naivolabs agent', text: 'Yes, 10:30 or 14:00. Which works?', mine: true },
    { who: 'Caller', text: '14:00 please.', mine: false },
    { who: 'Naivolabs agent', text: 'Booked for Thursday 14:00. Confirmation sent.', mine: true, done: true },
  ]
  return (
    <div className="h-full rounded-[12px] bg-white px-4 py-3 flex flex-col justify-between border border-black/5">
      {turns.map((t) => (
        <div
          key={t.text}
          className={`max-w-[86%] rounded-[10px] px-3 py-2 text-[11px] leading-snug ${
            t.mine ? 'self-end bg-[#eef0ff] text-[#1b1b3a]' : 'self-start bg-[#f4f4f6] text-[#111111]'
          }`}
        >
          <span className="block text-[9px] uppercase tracking-[0.1em] text-[#6d6e71] mb-0.5">{t.who}</span>
          {t.text}
          {/* #256b45, not a brighter green: this sits on the panel's #eef0ff
              tint, where anything lighter than ~4.5:1 raises an axe
              colour-contrast violation at 10px. */}
          {t.done && (
            <span className="mt-1 flex items-center gap-1 text-[10px] font-medium text-[#256b45]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Task completed
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/** Understand, an answer traced back to the document it came from. */
function KnowledgeIllustration() {
  const sources = [
    { name: 'Admissions policy 2026.pdf', page: 'p. 14', score: '0.94' },
    { name: 'Fee schedule (rev. Aug).xlsx', page: 'Sheet 2', score: '0.89' },
  ]
  return (
    <div className="h-full rounded-[12px] bg-white px-4 py-3 flex flex-col border border-black/5">
      <div className="rounded-[10px] bg-[#f4f4f6] border border-black/5 px-3 py-2 mb-3">
        <div className="text-[9px] uppercase tracking-[0.1em] text-[#6d6e71] mb-1">Question</div>
        <div className="text-[11px] text-[#111111]">What is the deadline for late applications?</div>
      </div>
      <div className="rounded-[10px] bg-[#eef0ff] px-3 py-2 mb-3">
        <div className="text-[9px] uppercase tracking-[0.1em] text-[#3b45a0] mb-1">Answer</div>
        <div className="text-[11px] text-[#1b1b3a] leading-snug">
          31 October, and the late fee applies from 1 November.
        </div>
      </div>
      <div className="mt-auto space-y-1.5">
        <div className="text-[9px] uppercase tracking-[0.1em] text-[#6d6e71]">Sources</div>
        {sources.map((s) => (
          <div key={s.name} className="flex items-center gap-2 rounded-[8px] bg-[#f4f4f6] px-2.5 py-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#6d6e71] shrink-0" aria-hidden>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            <span className="text-[10px] text-[#111111] truncate flex-1">{s.name}</span>
            <span className="text-[9px] font-mono text-[#6d6e71] shrink-0">{s.page}</span>
            <span className="text-[9px] font-mono text-[#256b45] shrink-0">{s.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Act, the work progressing through defined steps to completion. */
function ActionIllustration() {
  const rows = [
    { label: 'Request captured', sub: 'Trigger · Voice + messaging', icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
    { label: 'Understood & validated', sub: 'Under 5 sec · Automatic', icon: 'M12 2a4 4 0 014 4c0 2-2 3-2 5v1h-4v-1c0-2-2-3-2-5a4 4 0 014-4zM12 15v4M8 21h8' },
    { label: 'Written to the system of record', sub: '0 manual handoffs', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  ]
  return (
    <div className="h-full rounded-[12px] bg-white px-4 py-3 flex flex-col justify-between border border-black/5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3 rounded-[10px] bg-[#f4f4f6] px-2.5 py-2 border border-black/5">
          <div className="w-10 h-10 rounded-[10px] bg-[#191919] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white" aria-hidden>
              <path d={row.icon} />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[#111111] truncate">{row.label}</div>
            <div className="text-[10px] text-[#6d6e71] truncate">{row.sub}</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#6d6e71] shrink-0" aria-hidden>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      ))}
    </div>
  )
}

/** Orchestrate, systems connected, with the evaluation and audit layer above. */
function OrchestrationIllustration() {
  const nodes = ['CRM', 'Calendar', 'Register', 'Docs', 'Billing']
  return (
    <div className="h-full rounded-[12px] bg-white px-4 py-3 flex flex-col border border-black/5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-[#111111]">Governance layer</div>
        <span className="font-mono text-[10px] text-[#6d6e71]">audit · evals · gates</span>
      </div>
      {/* Orchestrator bar */}
      <div className="rounded-[10px] bg-[#191919] px-3 py-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden />
          <span className="text-[11px] font-medium text-white">Workflow orchestrator</span>
          <span className="ml-auto font-mono text-[10px] text-[#a7a9ac]">4 steps live</span>
        </div>
      </div>
      {/* Connected systems */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {nodes.map((n) => (
          <div key={n} className="rounded-[8px] bg-[#f4f4f6] border border-black/5 px-2 py-2 text-center">
            <div className="text-[10px] font-medium text-[#111111] truncate">{n}</div>
            <div className="mt-1 h-[3px] rounded-full bg-[#d8d9e6]">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {['Approval gate', 'Rollback', 'Escalation path'].map((t) => (
          <span key={t} className="rounded-full bg-[#f4f4f6] border border-black/5 px-2.5 py-1 text-[10px] text-[#111467]">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

const panels: Record<string, React.ReactNode> = {
  converse: <ConversationIllustration />,
  understand: <KnowledgeIllustration />,
  act: <ActionIllustration />,
  orchestrate: <OrchestrationIllustration />,
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          {/* Checkmark, Signal Violet (design.md Feature Checklist Item) */}
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
  const current = CAPABILITIES[0]

  return (
    <MotionConfig reducedMotion="user">
      <section id="capabilities" className="relative">
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal()}
            className="section-label text-center"
          >
            What we build
          </motion.p>

          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.08)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] text-center max-w-[760px] mx-auto mb-4"
          >
            From conversation to completion
          </motion.h2>

          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.14)}
            className="text-[17px] text-fog text-center max-w-[560px] mx-auto mb-14"
          >
Naivo connects intelligence to the work your organization already does.
          </motion.p>

          <motion.div
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.18)}
            className="capability-overview mb-14"
          >
            <div className="capability-overview-grid">
              {CAPABILITIES.map((capability) => (
                <article key={capability.id} className="capability-overview-card">
                  <span className="capability-overview-dot" aria-hidden />
                  <h3>{capability.headline}</h3>
                  <p>{capability.description}</p>
                </article>
              ))}
            </div>
          </motion.div>

          {/* Two-column feature block, checklist left, white product panel right. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              aria-label={`${current.headline} capability details`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            >
              <div className="min-w-0 max-w-[520px]">
                <h3 className="text-[28px] leading-tight mb-4">{current.headline}</h3>
                <p className="text-[17px] text-fog leading-relaxed mb-6">{current.description}</p>

                {/* The concrete systems in this capability family */}
                <div className="flex flex-wrap gap-2 mb-10">
                  {current.systems.map((s) => (
                    <span
                      key={s}
                      className="rounded-[30px] border border-white/12 text-fog text-[12px] px-3 py-1.5"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <Checklist items={current.outcomes} />
              </div>

              {/* White product panel, bright workspace on dark canvas */}
              <div className="relative min-w-0">
                <div
                  className="absolute -inset-6 rounded-[40px] pointer-events-none"
                  style={{ background: 'radial-gradient(60% 60% at 60% 40%, rgba(64,91,255,0.22) 0%, transparent 70%)' }}
                  aria-hidden
                />
                <div className="relative h-[248px] rounded-[20px] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-1.5 mb-2 px-1" aria-hidden>
                    <span className="w-2 h-2 rounded-full bg-[#e2e2e4]" />
                    <span className="w-2 h-2 rounded-full bg-[#e2e2e4]" />
                    <span className="w-2 h-2 rounded-full bg-[#e2e2e4]" />
                    <span className="ml-2 text-[11px] font-mono text-[#6d6e71]">app.naivolabs.com</span>
                  </div>
                  <div className="h-[calc(100%-24px)] overflow-hidden">{panels[current.id]}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </MotionConfig>
  )
}
