'use client'

import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import FAQ from '../components/FAQ'
import Seo, { breadcrumbLd } from '../lib/Seo'
import { useCms } from '../lib/CmsProvider'
import { cmsEnabled, submitInquiry } from '../lib/cms'
import { SITE } from '../lib/brand'
import { Spinner } from '../components/Loading'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

type Field = 'name' | 'email' | 'organization' | 'interest' | 'message'

const ENGAGEMENTS = ['Pilot deployment', 'Partner (ongoing)', 'Scale programme', 'Not sure yet']

export default function ContactPage() {
  const { contactInfo, faqs } = useCms()

  const contactInfoCards = [
    { label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { label: 'Phone', value: contactInfo.phone, href: `tel:${contactInfo.phone}` },
    { label: 'Address', value: contactInfo.address, href: null },
  ]

  // The hero's email capture hands off to this page with `?email=…` (and the
  // deployment-pattern CTAs can pass `?interest=…`). Prefill rather than drop
  // it, being asked for an address you just typed is the fastest way to lose
  // an enquiry.
  const [searchParams] = useSearchParams()
  const handedOffEmail = (searchParams.get('email') ?? '').trim()
  const handedOffInterest = (searchParams.get('interest') ?? '').trim()
  const prefilledEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(handedOffEmail) ? handedOffEmail : ''
  const prefilledInterest = (ENGAGEMENTS as readonly string[]).includes(handedOffInterest)
    ? handedOffInterest
    : ''
  const [handoffNotice, setHandoffNotice] = useState(!!prefilledEmail)

  const [values, setValues] = useState<Record<Field, string>>({
    name: '',
    email: prefilledEmail,
    organization: '',
    interest: prefilledInterest,
    message: '',
  })

  // Once the visitor starts editing, the "we filled this in" note has done its
  // job and should stop drawing attention.
  useEffect(() => {
    if (!handoffNotice) return
    const t = setTimeout(() => setHandoffNotice(false), 15_000)
    return () => clearTimeout(t)
  }, [handoffNotice])
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [sent, setSent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    // Clear the field's error as soon as the visitor starts fixing it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    if (status === 'error') setStatus('idle')
    if (handoffNotice) setHandoffNotice(false)
  }

  // Field order for the error summary and focus management, the same order the
  // fields are rendered in.
  const FIELD_ORDER: Field[] = ['name', 'email', 'interest', 'message']
  const FIELD_IDS: Record<Field, string> = {
    name: 'name',
    email: 'email',
    organization: 'organization',
    interest: 'interest',
    message: 'message',
  }

  /** Returns the first invalid field, so submit can move focus to it. */
  const validate = (): Field | null => {
    const next: Partial<Record<Field, string>> = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    if (!values.email.trim()) next.email = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = 'Enter a valid email address, for example jane@organization.org.'
    if (!values.interest) next.interest = 'Please choose what you are interested in.'
    if (!values.message.trim()) next.message = 'Please tell us briefly what you are trying to solve.'
    else if (values.message.trim().length < 20)
      next.message = 'A little more detail helps, 20 characters or more.'
    setErrors(next)
    return FIELD_ORDER.find((f) => next[f]) ?? null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const firstInvalid = validate()
    if (firstInvalid) {
      // Move focus to the first invalid field so keyboard and screen-reader
      // users are taken to the problem rather than left at the submit button.
      // Looked up by id rather than by `[aria-invalid="true"]`: the attribute
      // only lands on the DOM after React commits the state update, so a query
      // here would run against the previous render and find nothing.
      document.getElementById(FIELD_IDS[firstInvalid])?.focus()
      return
    }

    setStatus('loading')
    if (cmsEnabled) {
      const ok = await submitInquiry({
        name: values.name,
        email: values.email,
        budget: values.interest,
        message: `${values.organization ? `Organization: ${values.organization}\n\n` : ''}${values.message}`,
      })
      if (!ok) {
        setStatus('error')
        return
      }
    } else {
      // No CMS configured, simulate the round trip so the button state is real.
      await new Promise((r) => setTimeout(r, 500))
    }
    setStatus('idle')
    setSent(true)
  }

  const fieldClasses = (hasError: boolean) =>
    // `placeholder:text-fog`, not slate: a placeholder is 16px text on The
    // Carbon field, where #6d6d7a measures 3.7:1 — below AA, and against the
    // rule ADR-008 already states for small text. Fog measures 6.6:1 and still
    // reads as a hint against the `text-paper` value the visitor types.
    `w-full px-5 py-3.5 rounded-[10px] bg-raised border text-base text-paper placeholder:text-fog focus:outline-none focus:ring-2 transition-colors ${
      hasError
        ? 'border-error focus:ring-error/30'
        : 'border-steel focus:border-signal focus:ring-signal/20'
    }`

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <section className="relative pt-32">
      <Seo
        title="Book a Discovery Call"
        description="Talk to Naivolabs about putting an intelligent system to work in your organization. A 30-minute call, an honest assessment, and a clear next step."
        path="/contact"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: `Contact ${SITE.name}`,
            url: `${SITE.url}/contact`,
            email: contactInfo.email,
            telephone: contactInfo.phone,
            address: { '@type': 'PostalAddress', streetAddress: contactInfo.address },
          },
        ]}
      />
      <div className="relative shell">
        <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
          Contact
        </motion.p>

        <motion.h1
          initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.08)}
          className="text-heading-band-lg leading-[1.02] tracking-[-0.03em] max-w-[700px] mb-6"
        >
          Tell us what is <span className="text-signal">not working.</span>
        </motion.h1>

        <motion.p
          initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)}
          className="text-[18px] text-fog max-w-[560px] leading-relaxed mb-16"
        >
          The best first call is about a specific problem: a queue that never clears, information nobody can
          find, a handoff that keeps breaking. We will tell you honestly whether an intelligent system is the
          answer.
        </motion.p>

        <div className="grid lg:grid-cols-[1fr_420px] gap-16">
          {/* Form */}
          <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.1)}>
            {sent ? (
              <div
                role="status"
                className="rounded-[30px] border border-signal/30 bg-raised p-10 text-center shadow-[0_0_40px_rgba(112,132,255,0.12)]"
              >
                <div className="w-12 h-12 rounded-full bg-signal/15 text-signal flex items-center justify-center mx-auto mb-5">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-medium text-paper mb-2">Message sent</h2>
                <p className="text-sm text-fog">
                  Thanks {values.name.trim() || 'there'}. We&rsquo;ll get back to you within one business day,
                  usually sooner.
                </p>
                <button
                  onClick={() => {
                    setSent(false)
                    setValues({ name: '', email: '', organization: '', interest: '', message: '' })
                    setErrors({})
                  }}
                  className="btn-ghost mt-8 px-6 py-3 text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Error summary, announced once, links to nothing that needs
                    a click because focus already moves to the first field. */}
                <p aria-live="polite" className="sr-only">
                  {errorCount > 0
                    ? `${errorCount} ${errorCount === 1 ? 'field needs' : 'fields need'} attention before sending.`
                    : ''}
                </p>

                {/* Confirms the hero hand-off so the visitor knows why the
                    email field is already filled in. */}
                {handoffNotice && (
                  <p
                    role="status"
                    className="rounded-[16px] border border-signal/30 bg-signal/5 px-4 py-3 text-sm text-fog"
                  >
                    We carried your email across from the last page, add your name and what you are trying to
                    solve, and that is the whole form.
                  </p>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ash mb-2">
                      Full name <span className="text-signal" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={set('name')}
                      placeholder="Jane Smith"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={fieldClasses(!!errors.name)}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-xs text-error mt-1.5" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ash mb-2">
                      Work email <span className="text-signal" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={set('email')}
                      placeholder="jane@organization.org"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={fieldClasses(!!errors.email)}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-error mt-1.5" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-ash mb-2">
                      Organization
                    </label>
                    <input
                      id="organization"
                      type="text"
                      autoComplete="organization"
                      value={values.organization}
                      onChange={set('organization')}
                      placeholder="Optional"
                      className={fieldClasses(false)}
                    />
                  </div>
                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-ash mb-2">
                      Where you are <span className="text-signal" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="interest"
                      value={values.interest}
                      onChange={set('interest')}
                      aria-invalid={!!errors.interest}
                      aria-describedby={errors.interest ? 'interest-error' : undefined}
                      className={`${fieldClasses(!!errors.interest)} appearance-none ${values.interest ? '' : 'text-fog'}`}
                    >
                      <option value="" disabled className="bg-raised text-paper">
                        Select an option
                      </option>
                      {ENGAGEMENTS.map((p) => (
                        <option key={p} value={p} className="bg-raised text-paper">
                          {p}
                        </option>
                      ))}
                    </select>
                    {errors.interest && (
                      <p id="interest-error" className="text-xs text-error mt-1.5" role="alert">
                        {errors.interest}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ash mb-2">
                    What are you trying to solve? <span className="text-signal" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={values.message}
                    onChange={set('message')}
                    placeholder="The workflow, the volume, and what it costs you today."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : 'message-help'}
                    className={`${fieldClasses(!!errors.message)} resize-y`}
                  />
                  {errors.message ? (
                    <p id="message-error" className="text-xs text-error mt-1.5" role="alert">
                      {errors.message}
                    </p>
                  ) : (
                    <p id="message-help" className="text-xs text-fog mt-1.5">
                      No confidential details needed at this stage.
                    </p>
                  )}
                </div>

                {status === 'error' && (
                  <div role="alert" className="rounded-[16px] border border-error/50 bg-error/5 p-4">
                    <p className="text-sm text-error">
                      We couldn&rsquo;t send your message just now. Please try again, or email{' '}
                      <a href={`mailto:${contactInfo.email}`} className="underline">
                        {contactInfo.email}
                      </a>
                      .
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full sm:w-auto px-8 py-4 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Spinner />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send your message
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M6 3l5 5-5 5" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-xs text-fog">
                  We use your details only to reply to this enquiry, see the{' '}
                  <Link to="/privacy" className="underline hover:text-paper">
                    privacy policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </motion.div>

          {/* Contact info */}
          <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)} className="space-y-4 h-fit">
            {contactInfoCards.map((info) => (
              <div key={info.label} className="rounded-[24px] bg-raised border border-white/10 p-6">
                <div className="text-xs uppercase tracking-[0.14em] text-fog mb-2">{info.label}</div>
                {info.href ? (
                  <a href={info.href} className="text-base font-medium text-paper hover:text-signal transition-colors break-all block py-3 -my-3">
                    {info.value}
                  </a>
                ) : (
                  <div className="text-base font-medium text-paper">{info.value}</div>
                )}
              </div>
            ))}

            <div className="rounded-[24px] bg-raised border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.14em] text-fog mb-2">Response time</div>
              <p className="text-sm text-ash leading-relaxed">
                We reply within one business day, East Africa Time (UTC+3). If it is urgent, call the number
                above.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sibling of the page shell, not a child of it: the FAQ band carries its
          own measure, so nesting it would make it narrower than every band
          above it. */}
      <FAQ />
    </section>
  )
}
