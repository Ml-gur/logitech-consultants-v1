# ADR-005: Content management — self-hosted Payload, with a static fallback on every fetch

## Status

Accepted

## Date

2026-08-05 (deployment target revised 2026-09-23)

## Context

Blog posts, FAQs and contact details change without a code change: a new post
goes up, a phone number changes, an FAQ is reworded. Making those edits require
an engineer, a rebuild and a deploy is a tax on whoever wants to publish.

Two constraints frame the choice:

1. **The site must never depend on the CMS being up.** A marketing site that
   goes blank because a second service is unhealthy is a worse outcome than a
   stale blog post.
2. **Content should stay ours.** A managed headless CMS is the usual answer, but
   it means a third-party account, an API key in the build, and the company's
   editorial content living in someone else's database.

## Decision

**Self-hosted Payload CMS 3 in `cms/`**, running as a container in the same
Docker Compose stack as the site, with a runtime content service on the site
side that falls back to bundled data.

### Deployment shape

Revisions to the original plan, which assumed two separate managed hosting
projects:

- The CMS is **not** on a serverless platform. It runs as a long-lived container
  next to PostgreSQL on the same Hetzner host as the site (see
  `docs/research/hetzner-deployment.md`). One server, one stack, one bill.
- Media uploads go to a **local volume**, not an object store. Serverless
  filesystems are read-only, which is the only reason the original plan needed a
  blob provider; a container with a mounted volume does not.
- It is served from `cms.` on its own hostname rather than a path on the main
  origin, so admin session cookies never share an origin with the marketing site
  and the site's CSP stays tight.

### Content model

| Collection / global | Purpose | Public access |
|---|---|---|
| `blog-posts` | Articles: title, slug, category, date, image, author, role, excerpt, paragraphs. Draft/publish. | published only |
| `media` | Uploaded images | read |
| `inquiries` | Contact-form submissions | create only |
| `case-studies` | Deployment patterns (see the note below) | published only |
| `contact-info` (global) | Email, phone, address shown on `/contact` | read |
| `faqs` (global) | Ordered Q/A items | read |

Writes require an authenticated admin user. The site never holds an API key —
everything the site reads is public content.

### Site integration

`src/lib/cms.ts` and `src/lib/CmsProvider.tsx`. When `VITE_CMS_URL` is set at
build time the site fetches posts, deployment patterns, contact details and FAQs
on load and swaps them in. **Every fetch is wrapped in a fallback to
`src/data/content.ts`**, with an 8-second timeout, so:

- with no `VITE_CMS_URL`, the site is byte-for-byte static;
- with the CMS down, slow or returning empty, the page renders from bundled data;
- the E2E suite runs in static mode, so the fallback path is the covered path.

The contact form posts to `VITE_INQUIRY_ENDPOINT` if set, otherwise to the CMS at
`/api/inquiries`, otherwise it **refuses the submission and shows the email
fallback**. It never reports success for a message that went nowhere.

### Migrations

Schema changes come from `cms/src/migrations/`, which are committed. Payload does
not create tables on its own in production, so a `cms-migrate` one-shot container
runs `npm run migrate` and the CMS container waits on it exiting successfully
(`depends_on: condition: service_completed_successfully`). Local SQLite dev uses
Payload's push-mode and never runs migrations.

## Notes

- **The deployment-pattern collection keeps the slug `case-studies`.** Renaming
  a Payload collection renames the database table and requires a migration, and
  the admin panel already labels it "Deployment patterns". The site's client
  requests `/api/case-studies` and maps the response to the pattern shape.
  Superseded field names (`challenge`, `build`, `outcome`, `review`, `metric`)
  are still accepted on read so nothing is lost, but nothing renders `review`:
  testimonials are not published without written approval.
- **A `text` slug field with a `beforeValidate` hook is used instead of Payload's
  native `slug` field type**, which builds a broken query on the SQLite dev
  adapter. Behaviour is identical and it works on Postgres.
- **FAQ numbering is rendered by the component**, not stored in the data, so
  static and CMS-sourced FAQs render identically.

## Consequences

- Content edits publish without a site redeploy (the site fetches at runtime).
- One host, one Compose stack, one backup routine for both the database and the
  media volume.
- The CMS is the only piece of the stack that needs attention during a release:
  migrations run before it starts, and `deploy/deploy.sh` fails the release if
  the CMS does not report healthy.
- Full operator guide, including the first-run admin user, is in
  `cms/README.md` and `deploy/README.md`.
