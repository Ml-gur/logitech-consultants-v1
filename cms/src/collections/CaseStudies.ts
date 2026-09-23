import type { CollectionConfig } from 'payload'

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Deployment patterns (formerly the case-studies collection).
 *
 * The collection slug stays `case-studies` deliberately: renaming it would
 * create a new database table and orphan the existing rows, and the site's CMS
 * client falls back to `/api/case-studies` when `/api/deployment-patterns` is
 * absent (see src/lib/cms.ts). The panel labels, however, and the fields the
 * editors actually fill in, are the deployment-pattern model.
 *
 * Content standard: patterns describe systems we build and the dimensions we
 * measure — not invented client names, metrics or testimonials. The legacy
 * `outcome` / `review` / `metric` fields are retained only so existing rows keep
 * loading; nothing on the site renders `review` any more.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: {
    singular: 'Deployment pattern',
    plural: 'Deployment patterns',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'timeframe', 'order', 'updatedAt'],
    group: 'Content',
    description:
      'Patterns we deploy. Describe the problem, the approach, what it connects to, what we measure and the governance controls — never invented client results.',
  },
  defaultSort: 'order',
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data) {
          const name = (data.name || '') as string
          const explicit = (data.slug || '') as string
          data.slug = slugify((explicit || name).trim()) || 'untitled'
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Pattern name, e.g. "AI Voice Receptionist".' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL slug. Generated from the name on create; keep as-is to preserve existing links.',
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: { description: 'Primary segment, e.g. Membership organizations, Higher education.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'tagline', type: 'textarea', required: true },
    {
      name: 'timeframe',
      type: 'text',
      required: true,
      admin: { description: 'Typical time to first live deployment, e.g. "4–6 weeks to first live deployment".' },
    },
    {
      name: 'stack',
      type: 'array',
      labels: { singular: 'Capability', plural: 'Capability stack' },
      admin: { description: 'Which capability actions this pattern spans: Converse, Understand, Act, Orchestrate.' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'problem',
      type: 'textarea',
      required: true,
      admin: { description: 'The problem, stated at the operational level.' },
    },
    {
      name: 'approach',
      type: 'textarea',
      required: true,
      admin: { description: 'How the system is built and where it sits in the organization.' },
    },
    {
      name: 'integrations',
      type: 'array',
      labels: { singular: 'Integration', plural: 'Integrations' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'measures',
      type: 'array',
      labels: { singular: 'Measurement dimension', plural: 'Measurement dimensions' },
      admin: { description: 'Agreed with the client before launch. No invented numbers.' },
      fields: [
        { name: 'metric', type: 'text', required: true },
        { name: 'detail', type: 'text', required: true },
      ],
    },
    {
      name: 'governance',
      type: 'array',
      labels: { singular: 'Control', plural: 'Governance controls' },
      fields: [{ name: 'control', type: 'text', required: true }],
    },

    // ---- Legacy fields ----------------------------------------------------
    // Kept optional so pre-existing rows keep loading. The website no longer
    // reads `review`, and `outcome` is only used as a fallback for `measures`.
    {
      name: 'outcome',
      type: 'array',
      labels: { singular: 'Legacy outcome', plural: 'Legacy outcomes' },
      admin: {
        description: 'Deprecated — use "Measurement dimensions" instead. Retained for existing rows.',
      },
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    {
      name: 'review',
      type: 'group',
      admin: {
        description:
          'Deprecated — the website no longer renders testimonials. Do not add invented quotes; named references go live only with the client\u2019s written approval.',
      },
      fields: [
        { name: 'quote', type: 'textarea' },
        { name: 'name', type: 'text' },
        { name: 'role', type: 'text' },
      ],
    },
    {
      name: 'year',
      type: 'text',
      admin: { description: 'Deprecated year label from the case-study schema; the pattern timeframe replaces it.' },
    },
    {
      name: 'challenge',
      type: 'textarea',
      admin: { description: 'Deprecated — superseded by "Problem". Retained for existing rows.' },
    },
    {
      name: 'build',
      type: 'textarea',
      admin: { description: 'Deprecated — superseded by "Approach". Retained for existing rows.' },
    },
    {
      name: 'metric',
      type: 'group',
      admin: { description: 'Deprecated headline metric from the case-study schema.' },
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Display order on the site (ascending; 0 = first).',
      },
    },
  ],
}
