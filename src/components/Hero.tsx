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
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const start = performance.now()
      const duration = 1500
      const tick = (now: number) => {
        const progress = Math.min((now - start - delay) / duration, 1)
        if (progress > 0) setValue(target * (1 - Math.pow(1 - progress, 3)))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      observer.disconnect()
    }, { threshold: 0.25 })
    observer.observe(node)
    return () => observer.disconnect()
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
  return (
    <section id="home" className="hero-stage" aria-labelledby="hero-title">
      <div className="hero-video" aria-hidden="true">
        <video autoPlay muted loop playsInline poster="/og-image.png">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-shade" />
      </div>

      <div className="hero-inner">
        <div className="hero-trust anim" style={{ '--d': '0.05s' } as CSSProperties}>
          <div className="trust-avatars" aria-hidden="true">
            <span><span className="trust-inner">M</span></span>
            <span><span className="trust-inner">A</span></span>
            <span><span className="trust-inner">G</span></span>
          </div>
          <span className="trust-pill">Trusted by 2000+ enterprises</span>
        </div>

        <h1 id="hero-title" className="hero-headline">
          <span>Intelligence</span>
          <span>Designed To Evolve</span>
        </h1>
        <p className="hero-subhead anim" style={{ '--d': '0.28s' } as CSSProperties}>
          Build applications that reason, adapt and collaborate using a modular AI platform designed for production.
        </p>
        <Link to="/contact" className="hero-cta anim" style={{ '--d': '0.4s' } as CSSProperties}>Get started</Link>

        <div className="hero-stats" aria-label="Platform metrics">
          {metrics.map((metric, index) => <Stat key={metric.label} metric={metric} index={index} />)}
        </div>
      </div>
    </section>
  )
}

export { metrics }

                         
