import type { GlobalConfig } from 'payload'

/**
 * Singleton holding the contact details shown on the /contact page
 * (and footer). Publicly readable; only authenticated admins can edit.
 */
export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  admin: {
    group: 'Site',
    description: 'Contact details shown on the Contact page and footer.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      label: 'Email address',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone number',
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      label: 'Address',
    },
  ],
}
