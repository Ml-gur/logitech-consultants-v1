'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function HomeCTA() {
  return (
    <section className="home-cta reference-cta relative" aria-labelledby="deploy-title">
      <div className="reference-cta-inner">
        <motion.div
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="reference-cta-feature"
        >
          <div className="reference-cta-copy">
            <p className="section-label">Ready to deploy</p>
            <h2 id="deploy-title">Start with a real problem, not a demo.</h2>
            <Link to="/contact" className="reference-cta-link">Book a discovery call <span aria-hidden>↗</span></Link>
          </div>
        </motion.div>
        <div className="reference-cta-actions">
          <Link to="/contact" className="reference-cta-action"><span className="reference-cta-icon" aria-hidden>✦</span><span><strong>Have a workflow in mind?</strong><small>Talk to our team</small></span><span aria-hidden>›</span></Link>
          <Link to="/blog" className="reference-cta-action"><span className="reference-cta-icon" aria-hidden>✳</span><span><strong>Want to understand the work?</strong><small>Read our insights</small></span><span aria-hidden>›</span></Link>
        </div>
      </div>
    </section>
  )
}
