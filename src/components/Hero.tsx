import { Link } from 'react-router-dom'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

const metrics = [
  { icon: '<', target: 120, suffix: 'ms', decimals: 0, label: 'Inference time' },
  { icon: '%', target: 99.99, suffix: '%', decimals: 2, label: 'Platform uptime' },
  { icon: '*', target: 24, suffix: '/7', decimals: 0, label: 'Autonomous runtime' },
  { icon: '#', target: 2.4, suffix: 'M', decimals: 1, label: 'Context windows' },
]

function useCountUp(target: number, decimals: number, delay: number) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setValue(target)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const start = performance.now()
      const duration = 1500
      const tick = (now: number) => {
        const progress = Math.min((now - start - delay) / duration, 1)
        if (progress > 0) setValue(target * (1 - Math.pow(1 - progress, 3)))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      observer.disconnect()
    }, { threshold: 0.25 })
    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, delay])
  return { ref, value: value.toFixed(decimals) }
}

function Stat({ metric, index }: { metric: typeof metrics[number]; index: number }) {
  const counter = useCountUp(metric.target, metric.decimals, 480 + index * 90)
  return (
    <div ref={counter.ref} className="hero-stat" style={{ animationDelay: `${0.5 + index * 0.08}s` }}>
      <span className="hero-stat-icon" aria-hidden="true">{metric.icon}</span>
      <span className="hero-stat-value">{counter.value}<small>{metric.suffix}</small></span>
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
        <video autoPlay muted loop playsInline preload="none">
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
          <Link to="/contact" className="hero-cta">Schedule a consultation</Link>
          <Link to="/deployment-patterns" className="hero-cta hero-cta-secondary">See what we deploy</Link>
        </div>

        <div className="hero-stats" aria-label="Platform metrics">
          {metrics.map((metric, index) => <Stat key={metric.label} metric={metric} index={index} />)}
        </div>
      </div>
    </section>
  )
}

export { metrics }

                         
