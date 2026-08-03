'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { aboutValues, team, careers } from '../data/content'
import FAQ from '../components/FAQ'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function AboutPage() {
  return (
    <section className="relative pt-[76px]">
      <div className="section-panel section-panel-dark rounded-[50px]">
        <div className="section-inner">
          {/* 001/ About us */}
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            001/ About us
          </motion.p>
          <motion.h1
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.08)}
            className="font-['Halant'] text-[clamp(40px,6vw,80px)] font-semibold leading-[1.05] tracking-tight text-[#f0f0f0] max-w-[700px] mb-6"
          >
            The people behind your AI.
          </motion.h1>
          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.14)}
            className="text-base text-[#999] max-w-[560px] leading-relaxed mb-10"
          >
            A small, senior team that designs, builds, and ships AI systems for companies that want results, not slideware.
          </motion.p>
          <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.2)} className="flex flex-wrap gap-4 items-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[50px] bg-[#f0f0f0] text-[#0a0a0a] text-sm font-medium transition-colors duration-200 hover:bg-white"
            >
              Book a call
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
          </motion.div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[15px] mt-20">
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
                className="rounded-[30px] border border-dashed border-white/15 bg-[#151619] p-6"
              >
                <div className="font-['Halant'] text-[40px] leading-[1em] font-semibold text-[#f0f0f0] mb-4">
                  {m.value}
                  <span className="text-[#ff3700]">{m.suffix}</span>
                </div>
                <p className="text-sm text-[#999] leading-snug">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 002/ Our mission */}
      <div className="section-panel section-panel-light rounded-[50px]">
        <div className="section-inner">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            002/ Our mission
          </motion.p>
          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.08)}
            className="font-['Halant'] text-[clamp(26px,3.5vw,40px)] font-semibold leading-snug tracking-tight text-[#0a0a0a] max-w-[820px]"
          >
            We started AIthor because too many companies were sold AI hype and left with half-finished pilots. Our mission is simple: find where AI actually creates value, build it properly, and make sure it keeps working long after the engagement ends.
          </motion.p>
        </div>
      </div>

      {/* 003/ Our Values */}
      <div className="section-panel section-panel-light rounded-[50px]">
        <div className="section-inner">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            003/ Our Values
          </motion.p>
          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.06)}
            className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] mb-16"
          >
            What Sets Us Apart.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
            {aboutValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.06)}
                className="rounded-[15px] bg-[#f0f0f0] border border-[#e5e5e5] p-[25px] transition-colors duration-300 hover:bg-[#e5e5e5]"
              >
                <div className="w-7 h-0.5 rounded-full bg-[#ff3700] mb-5" />
                <h3 className="font-['Halant'] text-lg font-semibold text-[#0a0a0a] mb-3">{v.title}</h3>
                <p className="text-sm text-[#4f4f4f] leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 004/ Our Team */}
      <div className="section-panel section-panel-light rounded-[50px]">
        <div className="section-inner">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            004/ Our Team
          </motion.p>
          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.06)}
            className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] mb-16"
          >
            Our Expert Team.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[15px]">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
                className="rounded-[20px] bg-[#f0f0f0] border border-[#e5e5e5] p-[25px]"
              >
                <div className="w-14 h-14 rounded-full bg-[#0a0a0a] text-[#f0f0f0] flex items-center justify-center text-lg font-medium font-['Halant'] mb-5">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="font-['Halant'] text-lg font-semibold text-[#0a0a0a] mb-1">{member.name}</h3>
                <p className="text-sm text-[#4f4f4f]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 005/ Careers */}
      <div className="section-panel section-panel-light rounded-[50px]">
        <div className="section-inner">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            005/ Careers
          </motion.p>
          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.06)}
            className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] mb-16"
          >
            Join the Team.
          </motion.h2>

          <div className="space-y-3">
            {careers.map((job, i) => (
              <motion.div
                key={job.title}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.06)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[20px] bg-[#f0f0f0] border border-[#e5e5e5] px-6 py-5 transition-colors duration-300 hover:bg-[#e5e5e5]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h3 className="font-['Halant'] text-lg font-semibold text-[#0a0a0a]">{job.title}</h3>
                  <span className="text-xs uppercase tracking-wider text-[#999]">{job.dept}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#4f4f4f]">
                  <span>{job.type}</span>
                  <span>{job.hours}</span>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[50px] bg-[#0a0a0a] text-[#f0f0f0] font-medium transition-colors duration-200 hover:bg-[#151619]"
                  >
                    Apply
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 006/ FAQs */}
      <FAQ />
    </section>
  )
}
