'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import Seo, { breadcrumbLd } from '../lib/Seo'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function BlogPage() {
  const { blogPosts } = useCms()

  return (
    <section className="relative pt-32">
      <Seo
        title="Blog — AI Automation Guides"
        description="Guides and playbooks on AI automation: getting your data AI-ready, buy-build-or-wait decisions, and where automation earns its keep."
        path="/blog"
        jsonLd={[
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Logitech Consultants Blog',
            url: 'https://logitechconsultants.com/blog',
            publisher: { '@type': 'Organization', name: 'Logitech Consultants' },
          },
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
          Blog
        </motion.p>

        <motion.h1
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.08)}
          className="text-[clamp(36px,6vw,72px)] leading-[1.02] tracking-[-0.03em] max-w-[760px] mb-6"
        >
          Guides and <span className="text-signal">playbooks.</span>
        </motion.h1>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.14)}
          className="text-[18px] text-fog max-w-2xl mb-16"
        >
          Everything you need to know about building, managing, and scaling visual automation workflows.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(i * 0.08)}
            >
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <div className="aspect-[4/5] rounded-[20px] overflow-hidden mb-4 bg-[#191919] border border-white/10">
                  {post.image ? (
                    <img src={post.image} alt={`${post.title} — Logitech Consultants blog`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] to-[#141414]" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-fog mb-2">
                  <span className="font-medium text-signal">{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-white/15" />
                  <span>{post.date}</span>
                </div>
                <h3 className="font-display text-lg font-medium text-paper group-hover:text-signal transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-fog mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
