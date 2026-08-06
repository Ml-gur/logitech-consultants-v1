# Logitech Consultants CMS

Headless content management for the logitechconsultants.com website, built on
[Payload CMS 3](https://payloadcms.com) (Next.js + SQLite/Postgres).

Manages exactly the content the site syncs live:

| Collection / Global | Purpose | Public API |
|---|---|---|
| `blog-posts` | Blog articles (title, slug, category, date, image, author, excerpt, paragraphs) with draft/publish | `GET /api/blog-posts` (published only) |
| `media` | Uploaded images (Vercel Blob in prod, local files in dev) | `GET /api/media` |
| `inquiries` | Contact-form submissions from the website | `POST /api/inquiries` (public) |
| `contact-info` (global) | Email / phone / address shown on /contact | `GET /api/globals/contact-info` |
| `faqs` (global) | FAQ accordion items on /contact | `GET /api/globals/faqs` |

## Local development

```bash
npm install
npm run dev            # http://localhost:3100/admin (login with the seeded admin)
npm run seed           # import the site's existing content + create the admin user
```

Seeding is idempotent — rerun any time to refresh posts/contact/FAQs from
`../src/data/content.ts`. Credentials: `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` env vars (defaults printed by the seed).

Then point the site at it:

```bash
# from the repo root
VITE_CMS_URL=http://localhost:3100 npm run dev
```

The site fetches live content with a graceful fallback to the bundled static
data, so the CMS can be down without breaking the site.

## Access control

- **Public read** — published blog posts, media, contact-info, faqs.
- **Admin write** — all create/update/delete require a logged-in admin
  (`/admin`, Users collection).
- **Inquiries** — anyone may `POST`; only admins can read/list/delete.

## Vercel deployment

The CMS deploys as its own Vercel project (separate from the site). Next.js
framework preset is auto-detected.

Environment variables (Vercel Project Settings → Environment Variables):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Serverless Postgres connection string, e.g. a [Neon](https://neon.tech) database (`postgres://…`). SQLite is dev-only. |
| `PAYLOAD_SECRET` | Long random string (one-time; keep stable across deploys). |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token — enables media uploads in the admin panel (serverless filesystems are read-only). |
| `CORS_ORIGINS` | Comma-separated site origins, e.g. `https://logitechconsultants.com` (plus `http://localhost:3000` for local testing against the deployed CMS). |

#### Automatic migrations (recommended)

A GitHub Action (`.github/workflows/cms-migrate.yml`) runs `npm run migrate`
against the production database automatically on every push to `main` that
changes `cms/` — the schema is always ready when the CMS deploy starts. Add
these repository secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
|---|---|
| `CMS_DATABASE_URL` | The production `postgres://…` connection string |
| `CMS_PAYLOAD_SECRET` | Must match the Vercel `PAYLOAD_SECRET` above |

Optionally set `VERCEL_CMS_DEPLOY_HOOK_URL` (a Vercel Deploy Hook for the CMS
project) and the workflow will trigger the CMS deploy **after** migrations
succeed — strict migrate-then-deploy ordering. For that strict ordering, also
add an **Ignored Build Step** to the CMS Vercel project that skips git-triggered
builds (deploy via the hook only); otherwise each push triggers both Vercel's
auto-deploy and the hook deploy.

#### Manual migration (first deploy / fallback)

If you prefer to migrate by hand, run the database migration **first** to
create the schema (Payload does not auto-create tables in production — the
committed migrations in `src/migrations/` define it):

```bash
# from cms/
DATABASE_URL=<prod-postgres-url> PAYLOAD_SECRET=<prod-secret> npm run migrate
```

> Note: `npm run migrate` targets the **production Postgres** database. Local
> dev (SQLite) auto-creates the schema via Payload's push-mode, so migrations
> are never run against the dev database.

Then run the seed once against production to load the initial content and admin
user:

```bash
# from cms/
DATABASE_URL=<prod-postgres-url> PAYLOAD_SECRET=<prod-secret> \
SEED_ADMIN_EMAIL=admin@logitechconsultants.com SEED_ADMIN_PASSWORD=<choose-strong-password> \
npm run seed
```

Build the site with `VITE_CMS_URL` pointing at the deployed CMS
(e.g. `https://your-cms-project.vercel.app`) so it syncs live content.
