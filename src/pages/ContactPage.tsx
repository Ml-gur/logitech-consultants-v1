'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import FAQ from '../components/FAQ'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

const contactInfo = [
  { label: 'Email', value: 'sales@aithor.com', href: 'mailto:sales@aithor.com' },
  { label: 'Phone', value: '+359-88777980', href: 'tel:+35988777980' },
  { label: 'Address', value: 'Georgi S. Rakovski Street, Sofia, Bulgaria', href: null },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) setSent(true)
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
            className="font-['Halant'] text-[clamp(40px,6vw,80px)] font-semibold leading-[1.05] tracking-tight text-[#f0f0f0] mb-6"
          >
            Get in touch.
          </motion.h1>

          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.14)}
            className="text-base text-[#999] max-w-[520px] leading-relaxed mb-16"
          >
            Have questions or need support? Our team is here to help you every step of the way.
          </motion.p>

          <div className="grid lg:grid-cols-[1fr_420px] gap-16">
            {/* Form */}
            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.1)}>
              {sent ? (
                <div className="rounded-[20px] border border-dashed border-white/15 bg-[#151619] p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#168804]/15 text-[#168804] flex items-center justify-center mx-auto mb-5">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="font-['Halant'] text-2xl font-semibold text-[#f0f0f0] mb-2">Message sent</h2>
                  <p className="text-sm text-[#999]">Thanks {name.trim() || 'there'} — we&rsquo;ll get back to you within one business day.</p>
                  <button
                    onClick={() => {
                      setSent(false)
                      setName('')
                      setEmail('')
                      setBudget('')
                      setMessage('')
                    }}
                    className="mt-8 px-6 py-3 rounded-[50px] bg-[#f0f0f0] text-[#0a0a0a] text-sm font-medium transition-colors duration-200 hover:bg-white"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#f0f0f0] mb-2">
                        Full Name <span className="text-[#ff3700]" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Smith"
                        aria-invalid={!!errors.name}
                        className={`w-full px-5 py-3.5 rounded-[16px] bg-[#151619] border text-sm text-[#f0f0f0] placeholder:text-[#4f4f4f] focus:outline-none focus:ring-2 transition-colors ${
                          errors.name ? 'border-[#ff3700] focus:ring-[#ff3700]/30' : 'border-white/10 focus:ring-white/20'
                        }`}
                      />
                      {errors.name && <p className="text-xs text-[#ff3700] mt-1.5">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#f0f0f0] mb-2">
                        Your Email <span className="text-[#ff3700]" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@company.com"
                        aria-invalid={!!errors.email}
                        className={`w-full px-5 py-3.5 rounded-[16px] bg-[#151619] border text-sm text-[#f0f0f0] placeholder:text-[#4f4f4f] focus:outline-none focus:ring-2 transition-colors ${
                          errors.email ? 'border-[#ff3700] focus:ring-[#ff3700]/30' : 'border-white/10 focus:ring-white/20'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-[#ff3700] mt-1.5">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-[#f0f0f0] mb-2">
                      Budget <span className="text-[#ff3700]" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      aria-invalid={!!errors.budget}
                      className={`w-full px-5 py-3.5 rounded-[16px] bg-[#151619] border text-sm text-[#f0f0f0] focus:outline-none focus:ring-2 transition-colors appearance-none ${
                        errors.budget ? 'border-[#ff3700] focus:ring-[#ff3700]/30' : 'border-white/10 focus:ring-white/20'
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
                    <label htmlFor="message" className="block text-sm font-medium text-[#f0f0f0] mb-2">
                      Message <span className="text-[#ff3700]" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project..."
                      aria-invalid={!!errors.message}
                      className={`w-full px-5 py-3.5 rounded-[16px] bg-[#151619] border text-sm text-[#f0f0f0] placeholder:text-[#4f4f4f] focus:outline-none focus:ring-2 transition-colors resize-y ${
                        errors.message ? 'border-[#ff3700] focus:ring-[#ff3700]/30' : 'border-white/10 focus:ring-white/20'
                      }`}
                    />
                    {errors.message && <p className="text-xs text-[#ff3700] mt-1.5">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 rounded-[50px] bg-[#f0f0f0] text-[#0a0a0a] text-sm font-medium transition-colors duration-200 hover:bg-white"
                  >
                    Send Your Message
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact info */}
            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)} className="space-y-4 h-fit">
              {contactInfo.map((info) => (
                <div key={info.label} className="rounded-[20px] bg-[#151619] border border-white/5 p-6">
                  <div className="text-xs uppercase tracking-wider text-[#4f4f4f] mb-1.5">{info.label}</div>
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
