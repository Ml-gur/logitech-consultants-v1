'use client'

import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { blogPosts } = useCms()
  const post = blogPosts.find((p) => p.slug === slug)
  const others = blogPosts.filter((p) => p.slug !== slug)

  if (!post) {
    return (
      <section className="relative pt-[76px]">
        <div className="section-panel section-panel-light rounded-[50px]">
          <div className="section-inner text-center py-24">
            <h1 className="font-['Halant'] text-4xl font-semibold text-[#0a0a0a] mb-4">Article not found</h1>
            <Link to="/blog" className="text-sm text-[#4f4f4f] hover:text-[#0a0a0a] transition-colors">
              ← Back to blog
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative pt-[76px]">
      <div className="section-panel section-panel-light rounded-[50px]">
        <div className="section-inner">
          <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[#4f4f4f] hover:text-[#0a0a0a] transition-colors mb-8">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3l-5 5 5 5" />
              </svg>
              All articles
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)} className="max-w-[760px] mb-12">
            {/* #666 not #999: passes WCAG AA 4.5:1 on #f0f0f0 (a11y fix 2026-08-05) */}
            <div className="flex items-center gap-3 text-xs text-[#666] mb-6">
              <span className="font-medium text-[#0a0a0a]">{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-[#e5e5e5]" />
              <span>{post.date}</span>
            </div>
            <h1 className="font-['Halant'] text-[clamp(32px,5vw,56px)] font-semibold leading-tight tracking-tight text-[#0a0a0a]">
              {post.title}
            </h1>
          </motion.div>

          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={springReveal(0.1)}
            className="rounded-2xl overflow-hidden mb-12 aspect-[16/9] bg-[#e5e5e5]"
          >
            {post.image ? (
              <img src={post.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#e5e5e5] to-[#f0f0f0]" />
            )}
          </motion.div>

          {/* Body */}
          <motion.article
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.12)}
            className="max-w-[720px]"
          >
            <div className="flex items-center gap-3 mb-10 pb-8 border-b border-[#e5e5e5]">
              <div className="w-10 h-10 rounded-full bg-[#0a0a0a] text-[#f0f0f0] flex items-center justify-center text-sm font-medium">
                {post.author.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-medium text-[#0a0a0a]">{post.author}</div>
                <div className="text-xs text-[#4f4f4f]">{post.role}</div>
              </div>
            </div>

            {post.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`text-[17px] leading-[1.8] text-[#4f4f4f] mb-6 ${
                  i === 0 ? 'text-xl text-[#0a0a0a] font-medium' : ''
                }`}
              >
                {p}
              </p>
            ))}
          </motion.article>

          {/* More articles */}
          <div className="border-t border-[#e5e5e5] pt-16 mt-20">
            <p className="section-label mb-8">More articles</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((o, i) => (
                <motion.div key={o.slug} initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.08)}>
                  <Link to={`/blog/${o.slug}`} className="group block h-full">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#e5e5e5]">
                      {o.image ? (
                        <img src={o.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#e5e5e5] to-[#f0f0f0]" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#666] mb-2">
                      <span className="font-medium text-[#0a0a0a]">{o.category}</span>
                      <span className="w-1 h-1 rounded-full bg-[#e5e5e5]" />
                      <span>{o.date}</span>
                    </div>
                    <h3 className="font-['Halant'] text-lg font-semibold text-[#0a0a0a] group-hover:text-[#4f4f4f] transition-colors">
                      {o.title}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
