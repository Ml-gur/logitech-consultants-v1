import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

/* ---------- Syntax colors ----------
   Deliberately minimal — keywords in lime, strings in the success green,
   everything else in the body greys. A rainbow code theme (the previous
   Dracula palette) turned the one genuinely technical moment on the site into
   a colour clash with everything around it. */

const K = (s: string) => <span key={s} className="text-lime">{s}</span> // keyword
const S = (s: string) => <span key={s} className="text-success">{s}</span> // string
const P = (s: string) => <span key={s} className="text-ash">{s}</span> // literal
const C = (s: string) => <span key={s} className="text-fog">{s}</span> // comment

interface Sample {
  lang: string
  lines: ReactNode[][]
  raw: string
}

/**
 * Governance shown as configuration, because that is what it is.
 *
 * The controls are declared next to the agent definition, scope, confidence
 * thresholds, approval gates, escalation and retention, rather than described
 * in a policy document nobody reads.
 */
const samples: Sample[] = [
  {
    lang: 'Policy',
    raw: `# naivolabs.policy.yaml, reviewed with the client before deploy
agent: voice-receptionist
scope:
  answers_from: [admissions-policy-2026, fee-schedule-rev-aug]
  may_not: [quote_fees, admit_applicant, share_internal_notes]

actions:
  - name: book_appointment
    requires: confidence >= 0.82
    writes_to: calendar
  - name: raise_request
    requires: confidence >= 0.70
    writes_to: crm
  - name: refund_or_charge
    requires: human_approval      # never automatic

escalation:
  on_low_confidence: transfer_to_queue(call-centre)
  on_request: transfer_to_person(captured_context: true)
  after_hours: [log, notify_next_morning]

audit:
  transcripts: retained_90d
  decisions: immutable_log
evaluation:
  suite: admissions-voice-v3
  gate: no_regression_before_release`,
    lines: [
      [C('# naivolabs.policy.yaml, reviewed with the client before deploy')],
      [K('agent'), ': voice-receptionist'],
      [K('scope'), ':'],
      ['  ', K('answers_from'), ': [', S('admissions-policy-2026'), ', ', S('fee-schedule-rev-aug'), ']'],
      ['  ', K('may_not'), ': [', S('quote_fees'), ', ', S('admit_applicant'), ', ', S('share_internal_notes'), ']'],
      [],
      [K('actions'), ':'],
      ['  - ', K('name'), ': book_appointment'],
      ['    ', K('requires'), ': confidence >= ', P('0.82')],
      ['    ', K('writes_to'), ': calendar'],
      ['  - ', K('name'), ': raise_request'],
      ['    ', K('requires'), ': confidence >= ', P('0.70')],
      ['    ', K('writes_to'), ': crm'],
      ['  - ', K('name'), ': refund_or_charge'],
      ['    ', K('requires'), ': human_approval      ', C('# never automatic')],
      [],
      [K('audit'), ':'],
      ['  ', K('decisions'), ': immutable_log'],
    ],
  },
  {
    lang: 'Python',
    raw: `from naivolabs import Agent, Policy

agent = Agent(
    name="voice-receptionist",
    policy=Policy.load("naivolabs.policy.yaml"),
)

# The guard runs before any action, not after it.
@agent.before_action
def guard(action, context):
    if action.name == "refund_or_charge":
        return context.human_approved
    return action.confidence >= action.requires

# Everything the agent decided lands in the audit log.
@agent.after_action
def record(action, result):
    agent.audit.write(action=action, result=result)`,
    lines: [
      [K('from '), 'naivolabs ', K('import '), 'Agent, Policy'],
      [],
      ['agent = Agent('],
      ['    ', K('name'), '=', S('"voice-receptionist"'), ','],
      ['    ', K('policy'), '=Policy.load(', S('"naivolabs.policy.yaml"'), '),'],
      [')'],
      [],
      [C('# The guard runs before any action, not after it.')],
      [K('@agent'), '.', K('before_action')],
      [K('def '), 'guard(action, context):'],
      ['    ', K('if '), 'action.name == ', S('"refund_or_charge"'), ':'],
      ['        ', K('return '), 'context.human_approved'],
      ['    ', K('return '), 'action.confidence >= action.requires'],
      [],
      [C('# Everything the agent decided lands in the audit log.')],
      [K('@agent'), '.', K('after_action')],
      [K('def '), 'record(action, result):'],
      ['    agent.audit.write(action=action, result=result)'],
    ],
  },
  {
    lang: 'CLI',
    raw: `$ naivolabs eval run --suite admissions-voice-v3
  pass 41 / 44   regression 2   blocked 1
$ naivolabs audit export --since 2026-09-01 --format csv
  exported 1,204 decisions
$ naivolabs deploy --env production --require-eval-gate
  eval gate passed, released build 2026.09.18-a`,
    lines: [
      [S('$'), ' naivolabs eval run --suite admissions-voice-v3'],
      ['  pass ', P('41'), ' / 44   regression ', P('2'), '   blocked ', P('1')],
      [S('$'), ' naivolabs audit export --since 2026-09-01 --format csv'],
      ['  exported ', P('1,204'), ' decisions'],
      [S('$'), ' naivolabs deploy --env production --require-eval-gate'],
      ['  eval gate passed, released build ', S('2026.09.18-a')],
    ],
  },
]

const controls = [
  'Role-scoped access: people retrieve only what their role permits',
  'Confidence thresholds decide what the system may do unattended',
  'Approval gates before any financial or contractual action',
  'Immutable audit trail on every automated decision',
  'Evaluation suite runs as a release gate, not a nice-to-have',
]

export default function Governance() {
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
    <section id="governance" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left, copy + controls */}
          <div className="min-w-0">
            <motion.p
              className="section-label"
            >
              Governance
            </motion.p>

            <motion.h2
              className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-6"
            >
              Governance you can read.
            </motion.h2>

            <motion.p
              className="text-[17px] text-fog leading-relaxed max-w-[480px] mb-10"
            >
              The controls that make an AI system deployable belong in the system, declared next to the agent
              and versioned with it. Here is what that looks like in practice.
            </motion.p>

            <motion.ul
              className="space-y-4 mb-10"
            >
              {controls.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 mt-0.5 shrink-0 text-lime"
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
              href="#process"
              className="btn-ghost px-6 py-3 text-sm"
            >
              See the deployment model
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 3l5 5-5 5" />
              </svg>
            </motion.a>
          </div>

          {/* Right, policy / SDK / CLI sample */}
          <motion.div
            className="relative min-w-0"
          >
            <div className="relative rounded-panel bg-carbon border border-hairline overflow-hidden">
              {/* Tabs + copy button */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-hairline">
                <div className="flex items-center gap-4" role="tablist" aria-label="Governance sample">
                  {samples.map((s, i) => (
                    <button
                      key={s.lang}
                      role="tab"
                      aria-selected={i === lang}
                      onClick={() => setLang(i)}
                      className={`text-xs transition-colors duration-200 px-2 py-3.5 min-h-[44px] rounded-full ${
                        i === lang ? 'text-paper' : 'text-ash hover:text-paper'
                      }`}
                    >
                      {s.lang}
                    </button>
                  ))}
                </div>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 text-xs text-fog hover:text-paper transition-colors duration-200 px-3 py-3.5 min-h-[44px] rounded-full"
                >
                  {copied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-success" aria-hidden>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Code, scrollable, keyboard-focusable (a11y) */}
              <div
                className="overflow-x-auto focus-visible:outline focus-visible:outline-1 focus-visible:outline-lime focus-visible:outline-offset-[-1px]"
                tabIndex={0}
                aria-label={`${sample.lang} governance sample`}
              >
                <pre className="px-5 py-4 font-mono text-[13px] leading-[1.65] text-ash min-w-max">
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
            <p className="text-xs text-fog mt-4">
              Illustrative configuration. In a real engagement the policy is written with your risk and
              compliance stakeholders before anything is deployed.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
