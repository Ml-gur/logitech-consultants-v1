'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import FAQ from '../components/FAQ'
import { useCms } from '../lib/CmsProvider'
import { cmsEnabled, submitInquiry } from '../lib/cms'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function ContactPage() {
  const { contactInfo } = useCms()

  const contactInfoCards = [
    { label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { label: 'Phone', value: contactInfo.phone, href: `tel:${contactInfo.phone}` },
    { label: 'Address', value: contactInfo.address, href: null },
  ]

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

    // When the CMS is configured, persist the submission so it lands in the
    // admin panel (Inquiries collection). Without it, keep the original
    // client-only behavior so the site works standalone.
    if (cmsEnabled) {
      const ok = await submitInquiry({ name, email, budget, message })
      if (!ok) {
        setSubmitFailed(true)
        return
      }
    }
    setSent(true)
  }

  return (
    <section className="relative pt-[76px]">
      <div className="section-panel section-panel-dark rounded-[50px]">
        <div className="section-inner">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            001/ Contact
          </motion.p>

          <motion.h1
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.08)}
            className="font-['Halant'] text-[clamp(40px,6vw,80px)] font-semibold leading-[1.05] tracking-tight text-[#0a0a0a] mb-6"
          >
            Get in touch.
          </motion.h1>

          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.14)}
            className="text-base text-[#4f4f4f] max-w-[520px] leading-relaxed mb-16"
          >
            Have questions or need support? Our team is here to help you every step of the way.
          </motion.p>

          <div className="grid lg:grid-cols-[1fr_420px] gap-16">
            {/* Form */}
            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.1)}>
              {sent ? (
                <div className="rounded-[20px] border border-black/[0.06] bg-[#f0f0f0] p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#168804]/15 text-[#168804] flex items-center justify-center mx-auto mb-5">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="font-['Halant'] text-2xl font-semibold text-[#0a0a0a] mb-2">Message sent</h2>
                  <p className="text-sm text-[#4f4f4f]">Thanks {name.trim() || 'there'}. We&rsquo;ll get back to you within one business day.</p>
                  <button
                    onClick={() => {
                      setSent(false)
                      setName('')
                      setEmail('')
                      setBudget('')
                      setMessage('')
                    }}
                    className="mt-8 px-6 py-3 rounded-[50px] bg-[#151619] text-[#f0f0f0] text-sm font-medium transition-colors duration-200 hover:bg-[#0a0a0a]"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                        Full Name <span className="text-[#ff3700]" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Smith"
                        aria-invalid={!!errors.name}
                        className={`w-full px-5 py-3.5 rounded-[8px] bg-transparent border text-sm text-[#0a0a0a] placeholder:text-[#999] focus:outline-none focus:ring-2 transition-colors ${
                          errors.name ? 'border-[#ff3700] focus:ring-[#ff3700]/30' : 'border-[#0a0a0a] focus:ring-black/10'
                        }`}
                      />
                      {errors.name && <p className="text-xs text-[#ff3700] mt-1.5">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                        Your Email <span className="text-[#ff3700]" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@company.com"
                        aria-invalid={!!errors.email}
                        className={`w-full px-5 py-3.5 rounded-[8px] bg-transparent border text-sm text-[#0a0a0a] placeholder:text-[#999] focus:outline-none focus:ring-2 transition-colors ${
                          errors.email ? 'border-[#ff3700] focus:ring-[#ff3700]/30' : 'border-[#0a0a0a] focus:ring-black/10'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-[#ff3700] mt-1.5">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                      Budget <span className="text-[#ff3700]" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      aria-invalid={!!errors.budget}
                      className={`w-full px-5 py-3.5 rounded-[8px] bg-transparent border text-sm text-[#0a0a0a] focus:outline-none focus:ring-2 transition-colors appearance-none ${
                        errors.budget ? 'border-[#ff3700] focus:ring-[#ff3700]/30' : 'border-[#0a0a0a] focus:ring-black/10'
                      } ${budget ? '' : 'text-[#4f4f4f]'}`}
                    >
                      <option value="" disabled>
                        Select plan
                      </option>
                      {['Pilot', 'Partner', 'Scale'].map((p) => (
                        <option key={p} value={p} className="text-[#0a0a0a]">
                          {p}
                        </option>
                      ))}
                    </select>
                    {errors.budget && <p className="text-xs text-[#ff3700] mt-1.5">{errors.budget}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                      Message <span className="text-[#ff3700]" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project..."
                      aria-invalid={!!errors.message}
                      className={`w-full px-5 py-3.5 rounded-[8px] bg-transparent border text-sm text-[#0a0a0a] placeholder:text-[#999] focus:outline-none focus:ring-2 transition-colors resize-y ${
                        errors.message ? 'border-[#ff3700] focus:ring-[#ff3700]/30' : 'border-[#0a0a0a] focus:ring-black/10'
                      }`}
                    />
                    {errors.message && <p className="text-xs text-[#ff3700] mt-1.5">{errors.message}</p>}
                  </div>

                  {submitFailed && (
                    <p className="text-xs text-[#ff3700]">
                      Something went wrong sending your message. Please try again, or email{' '}
                      <a href={`mailto:${contactInfo.email}`} className="underline">
                        {contactInfo.email}
                      </a>
                      .
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 rounded-[50px] bg-[#151619] text-[#f0f0f0] text-sm font-medium transition-colors duration-200 hover:bg-[#0a0a0a]"
                  >
                    Send Your Message
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact info */}
            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)} className="space-y-4 h-fit">
              {contactInfoCards.map((info) => (
                <div key={info.label} className="rounded-[20px] bg-[#151619] border border-white/5 p-6">
                  <div className="text-xs uppercase tracking-wider text-[#999] mb-1.5">{info.label}</div>
                  {info.href ? (
                    <a href={info.href} className="text-base font-medium text-[#f0f0f0] hover:text-[#ff3700] transition-colors break-all">
                      {info.value}
                    </a>
                  ) : (
                    <div className="text-base font-medium text-[#f0f0f0]">{info.value}</div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <FAQ />
    </section>
  )
}
