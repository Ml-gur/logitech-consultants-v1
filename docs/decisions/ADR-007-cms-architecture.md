# ADR-007: Content management — Payload CMS with runtime sync + static fallback

## Status
Accepted

## Date
2026-08-05

## Context
The site is a static React + Vite SPA whose content (blog posts, case studies,
contact details, FAQs) lives in `src/data/content.ts` and component files. The
operator asked for an **admin CMS** to manage blog posts and contact-page
details that "fully works and syncs to the live website", with skills for
building a full content management system.

Research (2026-08-05):
- `npx skills find cms` surfaced `payloadcms/payload@payload` (1.8K installs) —
  Payload is a full-featured, self-hosted headless CMS with a built-in admin
  panel, REST/GraphQL APIs, auth, drafts, and media uploads.
- Gravity Index compared managed headless CMS SaaS options (Contentful, Sanity,
  DatoCMS, Prismic) — all require a third-party account + API keys and store
  content outside the repo.

Operator chose, via explicit decision:
1. **Payload CMS (self-hosted)** — open-source, free, admin panel at `/admin`,
   media upload, REST API. No monthly fees, content stays under our control.
2. **Hosting: Vercel** — the CMS deploys as its own Vercel project (Next.js),
   using serverless Postgres (e.g. Neon) for the database and Vercel Blob for
   media (serverless filesystems are read-only).

## Decision
Add a Payload CMS 3 app in `cms/` (scaffolded with `create-payload-app`,
SQLite for local dev) and make the site consume it through a runtime content
service with a bundled static fallback:

- **CMS content model:**
  - `blog-posts` collection — title, slug, category, date, order, image,
    author, role, excerpt, paragraphs; draft/publish workflow
    (`versions.drafts`); public read returns published posts only.
  - `media` collection — image uploads (local files in dev, Vercel Blob in prod).
  - `inquiries` collection — contact-form submissions; public create,
    admin-only read (form submissions land in the admin panel).
  - `contact-info` global (email / phone / address) and `faqs` global
    (ordered q/a array) — public read, admin-only write.
- **Site integration (`src/lib/cms.ts` + `CmsProvider.tsx`):** when
  `VITE_CMS_URL` is set at build time, the site fetches blog posts, contact
  info, and FAQs from the CMS REST API on load and swaps them in. Every fetch
  falls back to the bundled `src/data/content.ts` data on error, and with no
  `VITE_CMS_URL` the site is byte-for-byte the previous static site.
- **Contact form** POSTs to `/api/inquiries` when the CMS is configured;
  otherwise keeps the original client-only behavior.
- **Seed script (`cms/src/seed.ts`)** imports the existing site content
  (posts, contact, FAQs) and creates the admin user; idempotent.

### Notes / deviations
- The native Payload `slug` field type currently builds a broken query with the
  SQLite adapter (`where  = ?`, no column created). `blog-posts` therefore uses
  a plain `text` slug field + `beforeValidate` hook that auto-generates the slug
  from the title — identical behavior, works on SQLite and Postgres.
- FAQ numbering ("01/"…) is rendered by the component (not stored in data) so
  static and CMS-sourced FAQs stay consistent.

## Consequences
- Blog posts, contact details, and FAQs can be edited in the admin panel and
  appear on the live site on the next load — no redeploy of the site needed.
- The site remains fully static-capable; all 60 E2E tests pass unchanged
  (they run in static mode, no `VITE_CMS_URL`).
- Deployment requires a second Vercel project for the CMS with env vars
  `DATABASE_URL` (Neon), `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`,
  `CORS_ORIGINS` — see `cms/README.md`.
- Case studies remain static (out of scope for this request); moving them to
  the CMS later is straightforward (add a `case-studies` collection + fetch).
- The local dev site runs on port 3000 by default, but that port may already
  be occupied on the operator's machine (an unrelated project); the CMS dev
  server uses port 3100 and `CORS_ORIGINS` includes 3000/4175/5173.
