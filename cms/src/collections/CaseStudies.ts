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
 * Case studies — the rows and detail pages on the site.
 * Draft/publish workflow like blog-posts; public REST reads published only.
 * Slug is a plain text field + beforeValidate hook (see BlogPosts for why the
 * native slug field type is avoided with the SQLite adapter).
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', '_status', 'order', 'updatedAt'],
    group: 'Content',
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
    { name: 'name', type: 'text', required: true },
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
      admin: { description: 'e.g. E-commerce, Fintech, SaaS' },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'tagline', type: 'textarea', required: true },
    { name: 'year', type: 'text', required: true },
    { name: 'timeframe', type: 'text', required: true },
    { name: 'challenge', type: 'textarea', required: true },
    { name: 'build', type: 'textarea', required: true },
    {
      name: 'outcome',
      type: 'array',
      required: true,
      labels: { singular: 'Outcome metric', plural: 'Outcome metrics' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'review',
      type: 'group',
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
      ],
    },
    {
      name: 'metric',
      type: 'group',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
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
