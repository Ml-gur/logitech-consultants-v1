import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import Seo, { breadcrumbLd } from '../lib/Seo'
import { SITE, absUrl } from '../lib/brand'
import { ListSkeleton } from '../components/Loading'

export default function BlogPage() {
  const { blogPosts, cmsEnabled, cmsLoaded } = useCms()
  const showSkeleton = cmsEnabled && !cmsLoaded && blogPosts.length === 0

  return (
    <section className="relative pt-32">
      <Seo
        title="Insights on Production AI"
        description="Notes on getting AI systems into production: data readiness, buy-build-or-wait decisions, governance, measurement and where intelligence earns its keep."
        path="/blog"
        jsonLd={[
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Insights', path: '/blog' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: `${SITE.name} Insights`,
            url: absUrl('/blog'),
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          },
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
        <motion.p className="section-label">
          Insights
        </motion.p>

        <motion.h1
          className="text-[clamp(36px,6vw,72px)] leading-[1.02] tracking-[-0.03em] max-w-[760px] mb-6"
        >
          Notes from <span className="text-lime">production AI.</span>
        </motion.h1>

        <motion.p
          className="text-[18px] text-fog max-w-2xl mb-16"
        >
          Written by the people doing the deployment work, the parts that are harder than the demonstration.
        </motion.p>

        {showSkeleton && <ListSkeleton count={6} />}

        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 ${showSkeleton ? 'hidden' : ''}`}>
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.slug}
            >
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <div className="aspect-[4/5] rounded-panel overflow-hidden mb-4 bg-carbon border border-hairline">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-graphite" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-fog mb-2">
                  <span className="font-medium text-lime">{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-white/15" />
                  <span>{post.date}</span>
                </div>
                <h3 className="font-sans text-lg font-medium text-paper group-hover:text-lime transition-colors">
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
