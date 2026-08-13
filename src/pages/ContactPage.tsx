'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import FAQ from '../components/FAQ'
import Seo, { breadcrumbLd } from '../lib/Seo'
import { useCms } from '../lib/CmsProvider'
import { cmsEnabled, submitInquiry } from '../lib/cms'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function ContactPage() {
  const { contactInfo, faqs } = useCms()

  const contactInfoCards = [
    { label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { label: 'Phone', value: contactInfo.phone, href: `tel:${contactInfo.phone}` },
    { label: 'Address', value: contactInfo.address, href: null },
  ]

  // Contact email/phone links need a full 44px tap target on touch devices —
  // the label above already supplies breathing room, so extend the hit area
  // with padded focus space (same technique as the footer links).

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [submitFailed, setSubmitFailed] = useState(false)

  const validate = () => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Please enter your name'
    if (!email.trim()) next.email = 'Please enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address'
    if (!budget) next.budget = 'Please choose a budget'
    if (!message.trim()) next.message = 'Please write a short message'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitFailed(false)
    if (!validate()) return

    if (cmsEnabled) {
      const ok = await submitInquiry({ name, email, budget, message })
      if (!ok) {
        setSubmitFailed(true)
        return
      }
    }
    setSent(true)
  }

  const fieldClasses = (hasError: boolean) =>
    `w-full px-5 py-3.5 rounded-[10px] bg-[#191919] border text-base text-paper placeholder:text-slate focus:outline-none focus:ring-2 transition-colors ${
      hasError
        ? 'border-[#7084ff] focus:ring-[#7084ff]/30'
        : 'border-steel focus:border-signal focus:ring-signal/20'
    }`

  return (
    <section className="relative pt-32">
      <Seo
        title="Contact Us"
        description="Book a free discovery call with Logitech Consultants. We'll identify where AI can make an impact in your business and outline a plan — no commitment required."
        path="/contact"
        jsonLd={[
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]),
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
            name: 'Contact Logitech Consultants',
            url: 'https://logitechconsultants.com/contact',
            email: contactInfo.email,
            telephone: contactInfo.phone,
            address: { '@type': 'PostalAddress', streetAddress: contactInfo.address },
          },
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
          Contact
        </motion.p>

        <motion.h1
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.08)}
          className="text-[clamp(40px,6vw,80px)] leading-[1.02] tracking-[-0.03em] max-w-[640px] mb-6"
        >
          Get in <span className="text-signal">touch.</span>
        </motion.h1>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.14)}
          className="text-[18px] text-fog max-w-[520px] leading-relaxed mb-16"
        >
          Have questions or need support? Our team is here to help you every step of the way.
        </motion.p>

        <div className="grid lg:grid-cols-[1fr_420px] gap-16">
          {/* Form */}
          <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.1)}>
            {sent ? (
              <div className="rounded-[30px] border border-signal/30 bg-[#191919] p-10 text-center shadow-[0_0_40px_rgba(112,132,255,0.12)]">
                <div className="w-12 h-12 rounded-full bg-signal/15 text-signal flex items-center justify-center mx-auto mb-5">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-medium text-paper mb-2">Message sent</h2>
                <p className="text-sm text-fog">Thanks {name.trim() || 'there'}. We&rsquo;ll get back to you within one business day.</p>
                <button
                  onClick={() => {
                    setSent(false)
                    setName('')
                    setEmail('')
                    setBudget('')
                    setMessage('')
                  }}
                  className="btn-ghost mt-8 px-6 py-3 text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ash mb-2">
                      Full name <span className="text-signal" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      aria-invalid={!!errors.name}
                      className={fieldClasses(!!errors.name)}
                    />
                    {errors.name && <p className="text-xs text-signal mt-1.5">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ash mb-2">
                      Your email <span className="text-signal" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      aria-invalid={!!errors.email}
                      className={fieldClasses(!!errors.email)}
                    />
                    {errors.email && <p className="text-xs text-signal mt-1.5">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-ash mb-2">
                    Budget <span className="text-signal" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    aria-invalid={!!errors.budget}
                    className={`${fieldClasses(!!errors.budget)} appearance-none ${budget ? '' : 'text-fog'}`}
                  >
                    <option value="" disabled className="bg-[#191919] text-paper">
                      Select plan
                    </option>
                    {['Pilot', 'Partner', 'Scale'].map((p) => (
                      <option key={p} value={p} className="bg-[#191919] text-paper">
                        {p}
                      </option>
                    ))}
                  </select>
                  {errors.budget && <p className="text-xs text-signal mt-1.5">{errors.budget}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ash mb-2">
                    Message <span className="text-signal" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project..."
                    aria-invalid={!!errors.message}
                    className={`${fieldClasses(!!errors.message)} resize-y`}
                  />
                  {errors.message && <p className="text-xs text-signal mt-1.5">{errors.message}</p>}
                </div>

                {submitFailed && (
                  <p className="text-xs text-signal">
                    Something went wrong sending your message. Please try again, or email{' '}
                    <a href={`mailto:${contactInfo.email}`} className="underline">
                      {contactInfo.email}
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto px-8 py-4 text-sm"
                >
                  Send your message
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact info */}
          <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)} className="space-y-4 h-fit">
            {contactInfoCards.map((info) => (
              <div key={info.label} className="rounded-[24px] bg-[#191919] border border-white/10 p-6">
                <div className="text-xs uppercase tracking-[0.14em] text-fog mb-2">{info.label}</div>
                {info.href ? (
                  <a
                    href={info.href}
                    className="text-base font-medium text-paper hover:text-signal transition-colors break-all block py-3 -my-3"
                  >
                    {info.value}
                  </a>
                ) : (
                  <div className="text-base font-medium text-paper">{info.value}</div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* FAQs */}
        <FAQ />
      </div>
    </section>
  )
}
