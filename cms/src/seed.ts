/**
 * Seed script — imports the site's existing content into the CMS.
 *
 * Run from cms/:
 *   DATABASE_URL=file:./cms.db npm run seed
 *
 * Idempotent: existing docs (matched by slug / email / global) are updated,
 * never duplicated. Creates an admin user if one does not exist.
 */
import { getPayload } from 'payload'
import config from './payload.config'
import {
  blogPosts as sitePosts,
  caseStudies as siteCaseStudies,
  contactInfo,
  faqs,
} from '../../src/data/content'

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@logitechconsultants.com'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'LogitechAdmin!2026'

// Payload generates these from the collection config (see src/payload-types.ts).
type PostCategory = 'Guides' | 'AI Strategy' | 'Automation'

async function main() {
  const payload = await getPayload({ config })

  // 1. Admin user -----------------------------------------------------------
  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
  })

  const adminId = existingUsers.docs[0]?.id ?? null
  if (!adminId) {
    await payload.create({
      collection: 'users',
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    })
    console.log(`✓ Created admin user: ${ADMIN_EMAIL}`)
  } else {
    console.log(`✓ Admin user exists: ${ADMIN_EMAIL}`)
  }

  // 2. Blog posts -----------------------------------------------------------
  // NOTE: we match existing posts in memory instead of using a `where` clause
  // on the slug field — the SQLite adapter currently builds a broken query for
  // slug-field filters (`where  = ?`), so slug equality checks are done in JS
  // against the full list. The site itself never filters by slug server-side
  // (it fetches all posts and filters in the browser), so this only affects
  // the seed.
  const { docs: allPosts } = await payload.find({
    collection: 'blog-posts',
    limit: 100,
    overrideAccess: true,
  })

  // Preserve the original site's display order (index 0 = first on the page).
  const postsToSeed = sitePosts.map((post, i) => ({
    ...post,
    order: i + 1,
    category: post.category as PostCategory,
  }))

  for (const post of postsToSeed) {
    const existing = allPosts.find((d) => d.slug === post.slug)

    const data = {
      title: post.title,
      slug: post.slug,
      category: post.category,
      date: post.date,
      author: post.author,
      role: post.role,
      excerpt: post.excerpt,
      paragraphs: post.paragraphs.map((text) => ({ text })),
      order: post.order,
    }

    if (existing) {
      await payload.update({
        collection: 'blog-posts',
        id: existing.id,
        data,
        overrideAccess: true,
      })
      console.log(`  ~ Updated blog post: ${post.slug}`)
    } else {
      await payload.create({
        collection: 'blog-posts',
        data: { ...data, _status: 'published' },
        overrideAccess: true,
      })
      console.log(`  + Created blog post: ${post.slug}`)
    }
  }

  // 2b. Case studies ---------------------------------------------------------
  const { docs: allCaseStudies } = await payload.find({
    collection: 'case-studies',
    limit: 100,
    overrideAccess: true,
  })

  const caseStudiesToSeed = siteCaseStudies.map((cs, i) => ({
    ...cs,
    order: i + 1,
  }))

  for (const cs of caseStudiesToSeed) {
    const existing = allCaseStudies.find((d) => d.slug === cs.slug)

    const data = {
      name: cs.name,
      slug: cs.slug,
      category: cs.category,
      tagline: cs.tagline,
      year: cs.year,
      timeframe: cs.timeframe,
      challenge: cs.challenge,
      build: cs.build,
      outcome: cs.outcome.map((m) => ({ value: m.value, label: m.label })),
      review: cs.review,
      metric: cs.metric,
      order: cs.order,
    }

    if (existing) {
      await payload.update({
        collection: 'case-studies',
        id: existing.id,
        data,
        overrideAccess: true,
      })
      console.log(`  ~ Updated case study: ${cs.slug}`)
    } else {
      await payload.create({
        collection: 'case-studies',
        data: { ...data, _status: 'published' },
        overrideAccess: true,
      })
      console.log(`  + Created case study: ${cs.slug}`)
    }
  }

  // 3. Contact-info global --------------------------------------------------
  await payload.updateGlobal({
    slug: 'contact-info',
    data: {
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address,
    },
    overrideAccess: true,
  })
  console.log('✓ Updated contact-info global')

  // 4. FAQs global ----------------------------------------------------------
  await payload.updateGlobal({
    slug: 'faqs',
    data: {
      items: faqs.map((f) => ({ q: f.q, a: f.a })),
    },
    overrideAccess: true,
  })
  console.log('✓ Updated faqs global')

  console.log('\nSeed complete. Admin panel: /admin')
  console.log(`  Login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
