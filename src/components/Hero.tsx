import { Link } from 'react-router-dom'
import { useEffect, useState, type CSSProperties } from 'react'

const metrics = [
  { value: '01', label: 'Completion rate' },
  { value: '02', label: 'Escalation accuracy' },
  { value: '03', label: 'Answer groundedness' },
  { value: '04', label: 'Hours returned' },
]

function Stat({ metric, index }: { metric: typeof metrics[number]; index: number }) {
  return (
    <div className="hero-stat" style={{ animationDelay: `${0.5 + index * 0.08}s` }}>
      <span className="hero-stat-icon" aria-hidden="true">{metric.value}</span>
      <span className="hero-stat-value">Defined</span>
      <span className="hero-stat-label">{metric.label}</span>
    </div>
  )
}

export default function Hero() {
  const [videoEnabled, setVideoEnabled] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrowViewport = window.matchMedia('(max-width: 720px)').matches
    const saveData = 'connection' in navigator && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
    if (reducedMotion || narrowViewport || saveData) return

    const loadVideo = () => setVideoEnabled(true)
    const interactionEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const
    interactionEvents.forEach((event) => window.addEventListener(event, loadVideo, { once: true, passive: true }))
    const timeoutId = globalThis.setTimeout(loadVideo, 8000)
    return () => {
      interactionEvents.forEach((event) => window.removeEventListener(event, loadVideo))
      globalThis.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <section id="home" className="hero-stage" aria-labelledby="hero-title">
      <div className="hero-video" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="none" aria-hidden="true">
          {videoEnabled && <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" />}
        </video>
        <div className="hero-video-shade" />
      </div>

      <div className="hero-inner">
        <h1 id="hero-title" className="hero-headline">
          <span>Put intelligence</span>
          <span>to work.</span>
        </h1>
        <p className="hero-subhead anim" style={{ '--d': '0.28s' } as CSSProperties}>
          Naivolabs designs, builds and deploys intelligent AI systems that help organizations serve people, use information and operate their workflows — governed, measured, and running in production.
        </p>
        <div className="hero-actions anim" style={{ '--d': '0.4s' } as CSSProperties}>
          <Link to="/contact" className="hero-cta">Book a scoping conversation</Link>
          <Link to="/deployment-patterns" className="hero-cta hero-cta-secondary">See how the pilot works</Link>
        </div>

        <div className="hero-stats" aria-label="Platform metrics">
          {metrics.map((metric, index) => <Stat key={metric.label} metric={metric} index={index} />)}
        </div>
      </div>
    </section>
  )
}

export { metrics }

                         
