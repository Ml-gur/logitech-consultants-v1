'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE } from '../lib/brand'
import { openCookieSettings } from '../lib/cookieConsent'
import Wordmark from './Wordmark'

const pageLinks = [
  { label: 'Home', to: '/' },
  { label: 'Product', to: '/capabilities' },
  { label: 'About', to: '/about' },
  { label: 'Case studies', to: '/deployment-patterns' },
  { label: 'Contact', to: '/contact' },
]

const legalLinks = [
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms & conditions', to: '/terms' },
]

const socialLinks = [
  { label: 'LinkedIn', href: SITE.social.linkedin },
  { label: 'X', href: SITE.social.x },
  { label: 'GitHub', href: SITE.social.github },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setStatus('loading')
    await new Promise((resolve) => setTimeout(resolve, 500))
    setStatus('done')
  }

  return (
    <footer className="reference-footer" aria-label="Footer">
      <div className="reference-footer-panels">
        <section className="reference-footer-panel reference-footer-links">
          <h2>Page links</h2>
          <div className="reference-footer-link-columns">
            <ul>
              {pageLinks.slice(0, 3).map((link) => <li key={link.label}><Link to={link.to}>{link.label}</Link></li>)}
            </ul>
            <ul>
              {pageLinks.slice(3).map((link) => <li key={link.label}><Link to={link.to}>{link.label}</Link></li>)}
              {legalLinks.map((link) => <li key={link.label}><Link to={link.to}>{link.label}</Link></li>)}
              <li><button type="button" onClick={openCookieSettings}>Cookie preferences</button></li>
            </ul>
          </div>
          <div className="reference-footer-socials">
            {socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>{link.label === 'LinkedIn' ? 'in' : link.label === 'X' ? 'x' : 'gh'}</a>)}
          </div>
        </section>

        <section className="reference-footer-panel reference-footer-contact">
          <div className="reference-footer-contact-grid">
            <div>
              <h2>Contact on</h2>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <a href="tel:+1234567890">+123 456 7890</a>
            </div>
            <div>
              <h2>Address</h2>
              <p>Your B2B Consulting Co. 120<br />Business Avenue, NY 10001, USA</p>
            </div>
          </div>
          <form className="reference-footer-subscribe" onSubmit={submit} noValidate>
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <input id="footer-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} placeholder="Enter your email" aria-invalid={!!error} aria-describedby={error ? 'footer-email-error' : undefined} />
            <button type="submit" disabled={status === 'loading'}>{status === 'done' ? 'Subscribed' : 'Subscribe'}</button>
            {error && <span id="footer-email-error" role="alert">{error}</span>}
          </form>
          <div className="reference-footer-brand"><Wordmark as="span" /></div>
        </section>
      </div>
      <p className="reference-footer-credit">Designed by Naivolabs, powered by thoughtful systems</p>
    </footer>
  )
}
