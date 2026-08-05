import type { GlobalConfig } from 'payload'

/**
 * Singleton holding the FAQ accordion items (shown on the Contact page).
 * The site renders questions with the "01/"…"07/" numbering prefixes
 * automatically, so the q field stores just the question text.
 */
export const Faqs: GlobalConfig = {
  slug: 'faqs',
  admin: {
    group: 'Site',
    description: 'FAQ accordion items shown on the Contact page.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      labels: {
        singular: 'FAQ item',
        plural: 'FAQ items',
      },
      fields: [
        {
          name: 'q',
          type: 'text',
          required: true,
          label: 'Question',
        },
        {
          name: 'a',
          type: 'textarea',
          required: true,
          label: 'Answer',
        },
      ],
    },
  ],
}
