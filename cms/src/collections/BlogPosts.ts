import type { CollectionConfig } from 'payload'

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // strip punctuation
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Blog posts — the single source of truth for the website's blog.
 * Draft/publish workflow (versions.drafts) is enabled so editors can
 * write in the admin panel and only publish when ready. Public REST
 * requests only ever see published posts (see access.read below).
 *
 * NOTE: `slug` is a plain text field with a beforeValidate hook rather than
 * Payload's native `slug` field type — the native type currently builds a
 * broken query with the SQLite adapter (`where  = ?`, no column created),
 * which would break both the seed and slug lookups. A text field + hook is
 * identical in behavior and works on every adapter.
 */
export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'date', 'order', 'updatedAt'],
    group: 'Content',
  },
  // Editors control the display order on the site (ascending); new posts
  // default to 0 so they appear first unless explicitly re-ordered.
  defaultSort: 'order',
  versions: {
    drafts: true,
  },
  access: {
    // Public: published posts only. Authenticated users (admin panel): everything.
    read: ({ req }) => {
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    // Auto-generate the slug from the title when creating, and when the title
    // changes on an edit without an explicit slug override. Mirrors the
    // native slug field type's behavior.
    beforeValidate: [
      ({ data }) => {
        if (data) {
          const title = (data.title || '') as string
          const explicit = (data.slug || '') as string
          const candidate = (explicit || title).trim()
          data.slug = slugify(candidate) || 'untitled'
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL slug. Generated from the title on create; keep as-is to preserve existing links.',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Guides', value: 'Guides' },
        { label: 'AI Strategy', value: 'AI Strategy' },
        { label: 'Automation', value: 'Automation' },
      ],
    },
    {
      name: 'date',
      type: 'text',
      required: true,
      admin: {
        description: 'Display date, e.g. "Jun 24, 2026"',
      },
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
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'paragraphs',
      type: 'array',
      required: true,
      labels: {
        singular: 'Paragraph',
        plural: 'Paragraphs',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
