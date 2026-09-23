/**
 * Seed script — imports the site's bundled content into the CMS.
 *
 * Run from cms/ (see README.md).
 *
 * Idempotent: existing documents (matched by slug, email or global) are updated
 * rather than duplicated, so it is safe to rerun to refresh content.
 *
 * The first admin user is created from SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.
 * Both are required when there is no admin yet — there is deliberately no
 * fallback password, because a default committed to a repository is a published
 * credential. Change the password in the admin panel after the first sign-in.
 */
import { getPayload } from 'payload'
import config from './payload.config'
import {
  blogPosts as sitePosts,
  deploymentPatterns as sitePatterns,
  contactInfo,
  faqs,
} from '../../src/data/content'

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@naivolabs.com'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD

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
    if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
      throw new Error(
        'SEED_ADMIN_PASSWORD is missing or shorter than 12 characters.\n' +
          'Set it to a strong value for the first run, then change it in the admin panel.',
      )
    }
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

  // 2b. Deployment patterns --------------------------------------------------
  // The collection slug is `case-studies` (see src/collections/CaseStudies.ts).
  const { docs: allPatterns } = await payload.find({
    collection: 'case-studies',
    limit: 100,
    overrideAccess: true,
  })

  const patternsToSeed = sitePatterns.map((pattern, i) => ({
    ...pattern,
    order: i + 1,
  }))

  for (const cs of patternsToSeed) {
    const existing = allPatterns.find((d) => d.slug === cs.slug)

    // New model fields. `review` is deliberately not seeded: the site does not
    // render testimonials and we do not want invented quotes in the CMS.
    const data = {
      name: cs.name,
      slug: cs.slug,
      category: cs.category,
      tagline: cs.tagline,
      timeframe: cs.timeframe,
      stack: cs.stack.map((item) => ({ item })),
      problem: cs.problem,
      approach: cs.approach,
      integrations: cs.integrations.map((item) => ({ item })),
      measures: cs.measures.map((m) => ({ metric: m.metric, detail: m.detail })),
      governance: cs.governance.map((control) => ({ control })),
      order: cs.order,
    }

    if (existing) {
      await payload.update({
        collection: 'case-studies',
        id: existing.id,
        data,
        overrideAccess: true,
      })
      console.log(`  ~ Updated deployment pattern: ${cs.slug}`)
    } else {
      // `_status: 'published'` is what publishes on create for a collection with
      // `versions.drafts` enabled. Omitting it — or passing `draft: false`, which
      // reads as the published branch of Payload's create options — leaves the
      // `_status` field at its 'draft' default, so the pattern never reaches the
      // site (whose public read filters on `_status = published`). Verified
      // against a real database, not inferred from the types.
      await payload.create({
        collection: 'case-studies',
        data: { ...data, _status: 'published' },
        overrideAccess: true,
      })
      console.log(`  + Created deployment pattern: ${cs.slug}`)
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
