'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../data/content'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function BlogPage() {
  return (
    <section className="relative pt-[76px]">
      <div className="section-panel section-panel-light rounded-[50px]">
        <div className="section-inner">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            010/ Blog
          </motion.p>

          <motion.h1
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.08)}
            className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] mb-6"
          >
            Guides and playbooks.
          </motion.h1>

          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.14)}
            className="text-base text-[#4f4f4f] max-w-2xl mb-16"
          >
            Everything you need to know about building, managing, and scaling visual automation workflows.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={revealInitial}
                whileInView={revealWhileInView}
                viewport={revealViewport}
                transition={springReveal(i * 0.08)}
              >
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#e5e5e5]">
                    {post.image ? (
                      <img src={post.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#e5e5e5] to-[#f0f0f0]" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#999] mb-2">
                    <span className="font-medium text-[#0a0a0a]">{post.category}</span>
                    <span className="w-1 h-1 rounded-full bg-[#e5e5e5]" />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-['Halant'] text-lg font-semibold text-[#0a0a0a] group-hover:text-[#4f4f4f] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#4f4f4f] mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
