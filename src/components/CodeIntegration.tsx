'use client'

import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

/* ---------- Syntax colors (Dracula-inspired, design.md) ----------
   keywords #66d9ef · strings #a6e22e · literals #f92672 · comments #6d6e71 */

const K = (s: string) => <span key={s} className="text-[#66d9ef]">{s}</span>   // keyword
const S = (s: string) => <span key={s} className="text-[#a6e22e]">{s}</span>   // string
const P = (s: string) => <span key={s} className="text-[#f92672]">{s}</span>   // literal
const C = (s: string) => <span key={s} className="text-[#8a8c8e]">{s}</span>   // comment (≥4.5:1 on #191919)

interface Sample {
  lang: string
  lines: ReactNode[][]
  raw: string
}

const samples: Sample[] = [
  {
    lang: 'JavaScript',
    raw: `import { Client } from '@logitech/agents'\n\n// Route every inbound lead in under 30 seconds\nawait client.on('lead.created', async (lead) => {\n  const score = await client.score(lead, 'ideal-profile')\n  const owner = client.route(score, { strategy: 'round-robin' })\n\n  await client.attach(owner, lead, { followUp: 'ai-drafted' })\n})`,
    lines: [
      [K('import '), '{ Client } ', K('from '), S("'@logitech/agents'")],
      [],
      [C('// Route every inbound lead in under 30 seconds')],
      [K('await '), P('client'), '.', P('on'), S("('lead.created', "), K('async'), ' (lead) ', K('=>'), ' {'],
      ['  ', K('const '), 'score = ', K('await '), P('client'), '.', P('score'), '(lead, ', S("'ideal-profile'"), ')'],
      ['  ', K('const '), 'owner = ', P('client'), '.', P('route'), '(score, { strategy: ', S("'round-robin'"), ' })'],
      [],
      ['  ', K('await '), P('client'), '.', P('attach'), '(owner, lead, { followUp: ', S("'ai-drafted'"), ' })'],
      ['}'],
    ],
  },
  {
    lang: 'Python',
    raw: `from logitech import Client\nimport os\n\nclient = Client(api_key=os.environ['API_KEY'])\n\n@client.on('lead.created')\nasync def route_lead(lead):\n    score = await client.score(lead, 'ideal-profile')\n    await client.attach(owner, lead, follow_up='ai-drafted')`,
    lines: [
      [K('from '), 'logitech ', K('import '), 'Client'],
      [K('import '), 'os'],
      [],
      [K('client'), ' = Client(api_key=os.environ[', S("'API_KEY'"), '])'],
      [],
      [K('@client'), '.', K('on'), S("('lead.created')")],
      [K('async '), K('def '), 'route_lead(lead):'],
      ['    score = ', K('await '), P('client'), '.', P('score'), '(lead, ', S("'ideal-profile'"), ')'],
      ['    ', K('await '), P('client'), '.', P('attach'), '(owner, lead, follow_up=', S("'ai-drafted'"), ')'],
    ],
  },
  {
    lang: 'Shell',
    raw: `$ npx @logitech/agents init my-automation\n$ cd my-automation\n$ npx @logitech/agents connect --crm=hubspot\n\n# Deploy your first workflow\n$ npx @logitech/agents deploy --env=production`,
    lines: [
      [S('$'), ' npx ', K('@logitech/agents'), ' init my-automation'],
      [S('$'), ' cd my-automation'],
      [S('$'), ' npx ', K('@logitech/agents'), ' connect --crm=hubspot'],
      [],
      [C('# Deploy your first workflow')],
      [S('$'), ' npx ', K('@logitech/agents'), ' deploy --env=production'],
    ],
  },
]

const features = [
  'Starter templates for n8n, Claude, and Python',
  'Credentials handled securely, secrets never logged',
  'Docs and playbooks included with every build',
]

export default function CodeIntegration() {
  const [lang, setLang] = useState(0)
  const [copied, setCopied] = useState(false)
  const sample = samples[lang]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sample.raw)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="integrations" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy + checklist */}
          <div className="min-w-0">
            <motion.p
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal()}
              className="section-label"
            >
              Get started
            </motion.p>

            <motion.h2
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.06)}
              className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-6"
            >
              Copy, paste, go.
            </motion.h2>

            <motion.p
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.1)}
              className="text-[17px] text-fog leading-relaxed max-w-[480px] mb-10"
            >
              Spin up a production-grade automation with our starter templates — wired to your stack in
              minutes, not months.
            </motion.p>

            <motion.ul
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.14)}
              className="space-y-4 mb-10"
            >
              {features.map((f) => (
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
                  <span className="text-[16px] leading-relaxed text-paper">{f}</span>
                </li>
              ))}
            </motion.ul>

            <motion.a
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.18)}
              href="#pricing"
              className="btn-ghost px-6 py-3 text-sm"
            >
              See pricing
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </motion.a>
          </div>

          {/* Right — code snippet block */}
          <motion.div
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.1)}
            className="relative min-w-0"
          >
            <div
              className="absolute -inset-6 rounded-[40px] pointer-events-none"
              style={{ background: 'radial-gradient(55% 55% at 40% 50%, rgba(64,91,255,0.2) 0%, transparent 70%)' }}
              aria-hidden
            />
            <div className="relative rounded-[16px] bg-[#191919] border border-white/10 overflow-hidden shadow-[0_0_32px_rgba(112,132,255,0.12)]">
              {/* Language tabs + copy button */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/5">
                <div className="flex items-center gap-4">
                  {samples.map((s, i) => (
                    <button
                      key={s.lang}
                      onClick={() => setLang(i)}
                      className={`text-xs transition-colors duration-200 px-2 py-3.5 rounded-full ${
                        i === lang ? 'text-paper' : 'text-ash hover:text-paper'
                      }`}
                    >
                      {s.lang}
                    </button>
                  ))}
                </div>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 text-xs text-fog hover:text-paper transition-colors duration-200 px-3 py-3.5 rounded-full"
                >
                  {copied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a6e22e]">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Code — scrollable, keyboard-focusable (a11y) */}
              <div
                className="overflow-x-auto focus-visible:outline focus-visible:outline-1 focus-visible:outline-signal focus-visible:outline-offset-[-1px]"
                tabIndex={0}
                aria-label={`${sample.lang} code sample`}
              >
                <pre className="px-5 py-4 font-mono text-[13.5px] leading-[1.65] text-[#f8f8f2] min-w-max">
                  <code>
                    {sample.lines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {'\n'}
                      </span>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
