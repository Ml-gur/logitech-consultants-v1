import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { BlogPosts } from './collections/BlogPosts'
import { CaseStudies } from './collections/CaseStudies'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { ContactInfo } from './globals/ContactInfo'
import { Faqs } from './globals/Faqs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isPostgres =
  process.env.DATABASE_URL?.startsWith('postgres://') ||
  process.env.DATABASE_URL?.startsWith('postgresql://')

// Origins allowed to call the public REST API + form POST (the website).
// Comma-separated via env; defaults to the local dev site.
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const secret = process.env.PAYLOAD_SECRET

// Never allow a predictable signing key in production.
if (!secret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('PAYLOAD_SECRET is required in production. Set it in Vercel env vars.')
  }
  console.warn('PAYLOAD_SECRET is not set — using a dev-only fallback. Set it in .env.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Logitech Consultants CMS',
      description: 'Content management for logitechconsultants.com',
    },
  },
  collections: [Users, Media, BlogPosts, CaseStudies, Inquiries],
  globals: [ContactInfo, Faqs],
  editor: lexicalEditor(),
  secret: secret || 'dev-secret-change-me',
  cors: corsOrigins,
  csrf: corsOrigins,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: isPostgres
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URL || '',
        },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || 'file:./cms.db',
        },
      }),
  sharp,
  plugins: [
    // On Vercel (serverless) the filesystem is read-only, so uploads must go
    // to Vercel Blob storage. Locally (SQLite dev), Payload's default local
    // file storage is used and this plugin is skipped.
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
