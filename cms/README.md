# Naivolabs CMS

Content management for naivolabs.com, built on
[Payload CMS 3](https://payloadcms.com) (Next.js + Postgres).

It manages exactly what the site syncs live:

| Collection / global | Purpose | Public access |
|---|---|---|
| `blog-posts` | Articles: title, slug, category, date, image, author, role, excerpt, paragraphs. Draft/publish. | published only |
| `case-studies` | Deployment patterns. Labeled "Deployment patterns" in the admin. | published only |
| `media` | Uploaded images | read |
| `inquiries` | Contact-form submissions | create only |
| `contact-info` (global) | Email, phone, address shown on `/contact` | read |
| `faqs` (global) | Ordered Q/A items | read |

Writes require a signed-in admin user. Everything the site reads is public
content, so the site holds no API key.

> **The deployment-pattern collection is still slugged `case-studies`.**
> Renaming a Payload collection renames its database table and needs a
> migration. The admin labels, the field set and the site's client all use the
> deployment-pattern model; only the slug is historical. See
> [`../docs/decisions/ADR-005-cms.md`](../docs/decisions/ADR-005-cms.md).

## Local development

```bash
npm install
npm run dev        # http://localhost:3100/admin
npm run seed       # import the bundled site content + create the admin user
```

Local dev uses SQLite (`cms.db`, gitignored) and Payload's push-mode, so the
schema is created automatically and migrations are never run against it.

Seeding is idempotent — it updates by slug rather than duplicating, so rerun it
any time to refresh posts, patterns, contact details and FAQs from
`../src/data/content.ts`. The admin credentials come from `SEED_ADMIN_EMAIL` and
`SEED_ADMIN_PASSWORD` (see `.env.example`).

Then point the site at it, from the repository root:

```bash
VITE_CMS_URL=http://localhost:3100 npm run dev
```

The site fetches live content and falls back to its bundled data if the CMS is
unreachable, so the CMS can be down without breaking the site.

## Access control

- **Public read** — published blog posts and deployment patterns, media,
  contact-info, faqs.
- **Admin write** — every create, update and delete requires a signed-in admin
  user (`/admin`, `users` collection).
- **Inquiries** — anyone may `POST`; only admins can read, list or delete.

## Production

The CMS runs as a container in the same Docker Compose stack as the site, on the
same Hetzner server — not on a serverless platform, and not on a separate host.

```
cms.naivolabs.com ──► Caddy ──► cms (Next.js, :3000) ──► db (Postgres 16, internal network)
```

It is on its own hostname rather than a path on the site's origin, so admin
session cookies never share an origin with the marketing site and the site's CSP
stays tight. Media uploads go to the `cms_media` volume rather than an object
store, which is the only reason the earlier serverless plan needed a blob
provider.

The full runbook, including DNS, secrets, first-run admin creation, backups and
rollback, is [`../deploy/README.md`](../deploy/README.md).

### Environment

Set in `deploy/.env` on the server (template: `deploy/.env.production.example`).

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | `postgres://user:password@db:5432/naivolabs` — host is the compose service name |
| `PAYLOAD_SECRET` | long random string; must stay stable across deploys or sessions invalidate |
| `CORS_ORIGINS` | the exact site origin(s), e.g. `https://naivolabs.com` (scheme + host, no trailing slash) |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | the database these credentials belong to |

`CORS_ORIGINS` must match exactly. A missing origin is the usual cause of a
contact form that returns 500 in production while working locally.

### Migrations

Payload does not create tables on its own in production: the schema comes from
the committed files in `src/migrations/`.

Releases handle this automatically — the `cms-migrate` one-shot container runs
`npm run migrate` and the CMS container waits for it to exit successfully
(`depends_on: condition: service_completed_successfully`). After changing a
collection:

```bash
npm run payload -- migrate:create    # generates a dated migration file — COMMIT IT
```

Never edit a migration that has already run in production; add another one.

To migrate by hand against a production database:

```bash
DATABASE_URL=<prod-url> PAYLOAD_SECRET=<prod-secret> npm run migrate
```

### Tests

```bash
npm run test:int     # vitest integration tests
npm run test:e2e     # Playwright, admin + frontend
```
