'use client'

import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import Seo, { breadcrumbLd } from '../lib/Seo'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { blogPosts } = useCms()
  const post = blogPosts.find((p) => p.slug === slug)
  const others = blogPosts.filter((p) => p.slug !== slug)

  if (!post) {
    return (
      <section className="relative pt-32">
      <Seo title="Article Not Found" description="This article could not be found." path="/blog" />
        <div className="max-w-[1200px] mx-auto px-6 text-center py-24">
          <h1 className="text-4xl font-medium mb-4">Article not found</h1>
          <Link to="/blog" className="text-sm text-fog hover:text-paper transition-colors">
            ← Back to blog
          </Link>
        </div>
      </section>
    )
  }

  const dateIso = (d: string) => {
    const dt = new Date(d + ' UTC')
    return isNaN(dt.getTime()) ? undefined : dt.toISOString().slice(0, 10)
  }

  return (
    <section className="relative pt-32">
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.image || undefined}
        type="article"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.image || undefined,
            datePublished: dateIso(post.date),
            author: { '@type': 'Person', name: post.author, jobTitle: post.role },
            publisher: { '@type': 'Organization', name: 'Logitech Consultants' },
            mainEntityOfPage: `https://logitechconsultants.com/blog/${post.slug}`,
          },
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}>
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-fog hover:text-paper transition-colors mb-8">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3l-5 5 5 5" />
            </svg>
            All articles
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)} className="max-w-[760px] mb-12">
          <div className="flex items-center gap-3 text-xs text-fog mb-6">
            <span className="font-medium text-signal">{post.category}</span>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <span>{post.date}</span>
          </div>
          <h1 className="text-[clamp(32px,5vw,56px)] leading-[1.05] tracking-[-0.02em]">
            {post.title}
          </h1>
        </motion.div>

        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={springReveal(0.1)}
          className="rounded-[20px] overflow-hidden mb-12 aspect-[16/9] bg-[#191919] border border-white/10"
        >
          {post.image ? (
            <img src={post.image} alt={`${post.title} — Logitech Consultants blog`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] to-[#141414]" />
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
          <div className="flex items-center gap-3 mb-10 pb-8 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#405bff] to-[#7084ff] text-white flex items-center justify-center text-sm font-medium">
              {post.author.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="text-sm font-medium text-paper">{post.author}</div>
              <div className="text-xs text-fog">{post.role}</div>
            </div>
          </div>

          {post.subheads && post.subheads.length > 0 ? (
            post.subheads.map((s, si) => (
              <div key={si}>
                <h2 className="font-display text-2xl font-medium tracking-[-0.02em] mb-4 mt-10">
                  {s.heading}
                </h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-[17px] leading-[1.8] text-fog mb-6">
                    {p}
                  </p>
                ))}
              </div>
            ))
          ) : (
            post.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`text-[17px] leading-[1.8] text-fog mb-6 ${
                  i === 0 ? 'text-xl text-paper font-medium' : ''
                }`}
              >
                {p}
              </p>
            ))
          )}
        </motion.article>

        {/* More articles */}
        <div className="border-t border-white/10 pt-16 mt-20">
          <p className="section-label mb-8">More articles</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {others.map((o, i) => (
              <motion.div key={o.slug} initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.08)}>
                <Link to={`/blog/${o.slug}`} className="group block h-full">
                  <div className="aspect-[4/5] rounded-[20px] overflow-hidden mb-4 bg-[#191919] border border-white/10">
                    {o.image ? (
                      <img src={o.image} alt={`${o.title} — Logitech Consultants blog`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] to-[#141414]" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-fog mb-2">
                    <span className="font-medium text-signal">{o.category}</span>
                    <span className="w-1 h-1 rounded-full bg-white/15" />
                    <span>{o.date}</span>
                  </div>
                  <h3 className="font-display text-lg font-medium text-paper group-hover:text-signal transition-colors">
                    {o.title}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
