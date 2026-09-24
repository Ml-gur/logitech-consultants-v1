'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { aboutValues, team } from '../data/content'
import Seo, { breadcrumbLd } from '../lib/Seo'
import {
  DEFINITIONS,
  MISSION,
  PRINCIPLES,
  PURPOSE,
  SEGMENTS,
  SITE,
  VISION,
} from '../lib/brand'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function AboutPage() {
  return (
    <>
      <section className="reference-page reference-about relative pt-32">
      <Seo
        title="About Naivolabs"
        description="An applied AI systems company. We design, build and deploy governed AI systems that work inside real organizations. Built from Africa, for the world."
        path="/about"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: `About ${SITE.name}`,
            url: `${SITE.url}/about`,
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          },
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Reference-led hero */}
        <div className="about-reference-hero">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            About Naivolabs
          </motion.p>
          <motion.h1
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.08)}
            className="about-reference-title"
          >
            Get to know Naivolabs and intelligent systems that work.
          </motion.h1>
          <motion.p
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)}
            className="about-reference-intro"
          >
            We design, build and deploy governed AI systems that help organizations serve people, use information and operate their workflows in production.
          </motion.p>
          <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.2)} className="flex flex-wrap justify-center gap-3">
            <Link to="/capabilities" className="btn-primary px-7 py-3.5 text-sm">Explore what we build</Link>
            <Link to="/contact" className="btn-ghost px-7 py-3.5 text-sm">Request a consultation</Link>
          </motion.div>
        </div>
        <div className="about-reference-collage" aria-label="Naivolabs team and systems at work">
          <div className="about-collage-card about-collage-card-left"><img src="/images/YA3AGELH6hUZToUz17fZAzd0yo.webp" alt="" /></div>
          <div className="about-collage-card about-collage-card-main"><img src="/images/M5MY3Wk4Y4dsOCa2vifZ9R6pI.webp" alt="" /></div>
          <div className="about-collage-card about-collage-card-right"><img src="/images/Tf9L4582eDStTX4KSFaUOoUP5Ys.webp" alt="" /></div>
        </div>
        <div className="about-reference-stats" aria-label="Naivolabs overview">
          <div><strong>4</strong><span>systems shipped</span></div>
          <div><strong>5+</strong><span>operating environments</span></div>
          <div><strong>100%</strong><span>measured in production</span></div>
        </div>

        {/* The brand tension, three honest contrasts */}
        <div className="grid sm:grid-cols-3 gap-4 mt-20">
          {[
            { k: 'Technical × Human', v: 'Serious technology explained through real human work.' },
            { k: 'African × Global', v: 'Clearly African in origin and capability, without being limited by geography.' },
            { k: 'Ambitious × Restrained', v: 'Large ambition, stated without exaggerated marketing.' },
          ].map((t, i) => (
            <motion.div
              key={t.k}
              initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.08)}
              className="rounded-[24px] bg-[#191919] border border-white/10 p-6"
            >
              <p className="text-[15px] font-medium text-paper mb-2">{t.k}</p>
              <p className="text-sm text-fog leading-relaxed">{t.v}</p>
            </motion.div>
          ))}
        </div>

        {/* Purpose / mission / vision */}
        <div className="pt-24 grid lg:grid-cols-3 gap-4">
          {[
            { label: 'Purpose', body: PURPOSE },
            { label: 'Mission', body: MISSION },
            { label: 'Vision', body: VISION },
          ].map((block, i) => (
            <motion.div
              key={block.label}
              initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.08)}
              className="rounded-[30px] bg-[#191919] border border-white/10 p-7"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-fog mb-5">{block.label}</p>
              <p className="font-display text-[19px] leading-snug text-paper">{block.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Why we exist */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Why we exist
          </motion.p>
          <motion.p
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.08)}
            className="font-display text-[clamp(24px,3.5vw,40px)] font-medium leading-snug tracking-[-0.02em] max-w-[900px]"
          >
            Organizations do not simply need more AI. They need AI connected to the work that matters, the calls
            that go unanswered, the information nobody can find, the requests that get lost between systems, the
            staff time spent repeating what a system could complete.
          </motion.p>
        </div>

        {/* Internal definition, the harder version */}
        <div className="pt-16">
          <motion.div
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}
            className="rounded-[30px] border border-signal/30 bg-[#191919] p-8 sm:p-10 max-w-[900px]"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-fog mb-4">The internal version</p>
            <p className="font-display text-[clamp(20px,2.6vw,30px)] font-medium leading-snug text-paper">
              {DEFINITIONS.internal}
            </p>
            <p className="text-sm text-fog leading-relaxed mt-5">
              It allows us to build toward orchestration and infrastructure without asking a customer to
              understand our architecture to get value from it.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Our values
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-16"
          >
            What we will not trade away.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aboutValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.06)}
                className="card-dark rounded-[24px] p-7"
              >
                <div className="w-8 h-[3px] rounded-full bg-gradient-to-r from-voltage to-signal mb-6" />
                <h3 className="text-lg font-medium mb-3">{v.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Principles */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Brand principles
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] max-w-[680px] mb-14"
          >
            Rules, not aspirations.
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.05)}
                className="flex items-start gap-4 rounded-[20px] bg-[#191919] border border-white/10 p-5"
              >
                <span className="font-mono text-xs text-signal mt-1 tabular-nums shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] text-ash leading-relaxed">{p.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Africa-to-world */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Built from Africa
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] max-w-[760px] mb-8"
          >
            Origin, insight and capability, not a limitation.
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-12 max-w-[1000px]">
            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.1)} className="space-y-5">
              <p className="text-[17px] text-fog leading-relaxed">
                We build from Africa because it gives us an environment where technology has to work across real
                constraints: diverse languages, mobile-first communication, fragmented systems and organizational
                realities that do not match a Silicon Valley demo.
              </p>
              <p className="text-[17px] text-fog leading-relaxed">
                That experience makes us better at building resilient systems. It is why our voice work handles
                accent and language variation that off-the-shelf deployments miss, and why we design for
                infrastructure that is not always ideal.
              </p>
            </motion.div>

            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)} className="space-y-5">
              <p className="text-[17px] text-paper leading-relaxed">
                Our ambition is not &ldquo;AI for Africa&rdquo;. It is technology built from African realities
                that can work anywhere.
              </p>
              <p className="text-[17px] text-fog leading-relaxed">
                Organizations everywhere need better ways to serve people, use information and operate. The
                operating conditions we build under simply make us less forgiving of fragile systems.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Segments */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Who we serve
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-14"
          >
            The environments we go deep in.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEGMENTS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.06)}
                className="rounded-[24px] bg-[#191919] border border-white/10 p-6"
              >
                <h3 className="text-[17px] font-medium mb-3">{s.name}</h3>
                <p className="text-sm text-fog leading-relaxed">{s.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Our team
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="team-heading text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-12"
          >
            Meet the talent behind the transformation.
          </motion.h2>

          <div className="team-reference-grid">
            {team.slice(0, 5).map((member, i) => {
              const portraits = [
                '/images/74bgmTCLhG1vjdwC6jrte1Upppk.webp',
                '/images/Eu8lb04bFCoyCpFuitulq7gxSfM.webp',
                '/images/IMZdofzqqJ3H2GANrvn50i2D9qo.webp',
                '/images/J7KZFcCw0ZrENLKo0wuCy6nASg.webp',
                '/images/segnJi5cGsCMhvZ3MZQnn4lCk5w.webp',
              ]
              return (
                <motion.article
                  key={member.name}
                  initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.08)}
                  className="team-reference-card"
                >
                  <img src={portraits[i]} alt="" />
                  <div className="team-reference-overlay" />
                  <div className="team-reference-copy">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
        </div>
      </section>

    </>
  )
}
