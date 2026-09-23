'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import { ListSkeleton } from './Loading'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function Blog() {
  const { blogPosts, cmsEnabled, cmsLoaded } = useCms()
  const posts = blogPosts.slice(0, 3)
  const showSkeleton = cmsEnabled && !cmsLoaded && posts.length === 0

  return (
    <section id="blog" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="section-label"
        >
          Insights
        </motion.p>

        <motion.h2
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.06)}
          className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-6"
        >
          Notes from production AI.
        </motion.h2>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.1)}
          className="text-[17px] text-fog max-w-2xl mb-16"
        >
          What we have learned deploying intelligent systems into real organizations, the parts that are
          harder than the demonstration.
        </motion.p>

        {showSkeleton && <ListSkeleton count={3} />}

        <div className={`grid md:grid-cols-3 gap-5 ${showSkeleton ? 'hidden' : ''}`}>
          {posts.map((post, i) => (
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
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
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
