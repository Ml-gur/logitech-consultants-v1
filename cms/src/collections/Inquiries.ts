import type { CollectionConfig } from 'payload'

/**
 * Contact-form submissions from the website. The public contact form
 * POSTs here (create is open); the rest of the collection is admin-only,
 * so submissions are visible in the admin panel but never publicly.
 */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'budget', 'createdAt'],
    group: 'Forms',
  },
  access: {
    // The website's contact form is unauthenticated — anyone may submit.
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'budget',
      type: 'select',
      required: true,
      options: ['Pilot', 'Partner', 'Scale'],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
  ],
}
