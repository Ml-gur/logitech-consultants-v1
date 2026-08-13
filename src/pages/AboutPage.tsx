'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { aboutValues, team } from '../data/content'
import Seo from '../lib/Seo'
import FAQ from '../components/FAQ'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function AboutPage() {
  return (
    <section className="relative pt-32">
      <Seo
        title="About Us"
        description="A small, senior AI team that designs, builds, and ships automation, custom agents, and AI systems for companies that want results — not slideware."
        path="/about"
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* 001/ About us */}
        <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
          About us
        </motion.p>
        <motion.h1
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.08)}
          className="text-[clamp(40px,6vw,80px)] leading-[1.02] tracking-[-0.03em] max-w-[720px] mb-6"
        >
          The people behind <span className="text-signal">your AI.</span>
        </motion.h1>
        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.14)}
          className="text-[18px] text-fog max-w-[560px] leading-relaxed mb-10"
        >
          A small, senior team that designs, builds, and ships AI systems for companies that want results, not slideware.
        </motion.p>
        <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.2)} className="flex flex-wrap gap-4 items-center">
          <Link
            to="/contact"
            className="btn-primary px-7 py-3.5 text-sm"
          >
            Book a call
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
          {[
            { value: '3', suffix: 'x', label: 'Average first-year ROI' },
            { value: '100', suffix: '+', label: 'Hours saved per month' },
            { value: '60', suffix: '%', label: 'Less manual work across teams' },
            { value: '98', suffix: '%', label: 'Client retention rate' },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(i * 0.08)}
              className="rounded-[30px] border border-white/10 bg-[#191919] p-6"
            >
              <div className="font-display text-[40px] leading-[1em] font-medium text-paper tabular-nums mb-4">
                {m.value}
                <span className="text-signal">{m.suffix}</span>
              </div>
              <p className="text-sm text-fog leading-snug">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* 002/ Our mission */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Our mission
          </motion.p>
          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.08)}
            className="font-display text-[clamp(24px,3.5vw,40px)] font-medium leading-snug tracking-[-0.02em] max-w-[860px]"
          >
            We founded Logitech Consultants in 2026 because too many companies were sold AI hype and left with half-finished pilots. Our mission is simple: find where AI actually creates value, build it properly, and make sure it keeps working long after the engagement ends.
          </motion.p>
        </div>

        {/* 003/ Our Values */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Our values
          </motion.p>
          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-16"
          >
            What sets us apart.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aboutValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.06)}
                className="card-dark rounded-[24px] p-7"
              >
                <div className="w-8 h-[3px] rounded-full bg-gradient-to-r from-[#405bff] to-[#7084ff] mb-6" />
                <h3 className="text-lg font-medium mb-3">{v.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 004/ Our Team */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Our team
          </motion.p>
          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-16"
          >
            The people who build it.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className="rounded-[24px] bg-[#191919] border border-white/10 p-7"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#405bff] to-[#7084ff] text-white flex items-center justify-center text-lg font-medium mb-5">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="text-lg font-medium mb-1">{member.name}</h3>
                <p className="text-sm text-fog">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <FAQ />
      </div>
    </section>
  )
}
