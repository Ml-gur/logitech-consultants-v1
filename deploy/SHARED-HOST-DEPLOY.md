# Deployment — shared host (naivolabs.com)

The live site runs on the shared host `77.42.30.150` in `/var/www/naivolabs`,
behind the `naivolabs` nginx vhost. This is the runbook for that host.

The separate, self-contained Docker stack in `deploy/` (Hetzner, Postgres,
Caddy) is **not** what is deployed and is not usable here — see "Why the CMS is
not on this host" below. It remains an option for the CMS if it is hosted
somewhere else.

## What is deployed

The compiled static site. `npm run build` produces `dist/`, and `dist/` is
copied verbatim into the docroot. There is no runtime on the server: no
Node.js, no npm, no PHP. The build happens on the developer machine and only
static files cross the wire.

## Deploying (or redeploying)

```bash
# from the repository root
npm run typecheck && npm run build

rsync -az --delete \
  -e ssh \
  dist/ naivodev@77.42.30.150:/var/www/naivolabs/
```

Then verify against the live origin:

```bash
node scripts/live-smoke.mjs        # boots the site, client routing, mobile overflow
curl -fsS https://naivolabs.com/ | grep -o '<title>[^<]*</title>'
curl -fsSI https://naivolabs.com/robots.txt
```

`--delete` makes the docroot exactly match `dist/`. Nothing else should ever be
placed in `/var/www/naivolabs` — anything added there is removed by the next
deploy. **This server also hosts another production application**; keep every
change inside `/var/www/naivolabs` and the `naivolabs_db` database.

### Rollback

```bash
# before deploying, keep the current build
rsync -az -e ssh naivodev@77.42.30.150:/var/www/naivolabs/ /tmp/naivolabs-prev/

# to roll back
rsync -az --delete -e ssh /tmp/naivolabs-prev/ naivodev@77.42.30.150:/var/www/naivolabs/
```

Because only static files are involved, a rollback is instant and cannot lose
data.

## Server changes required (must be applied by the host operator)

The deploy account has no sudo, so these are **requests, not actions**. Only the
first one is required; the rest are optional hardening.

### 1. Required — SPA fallback, or every deep link 404s

The vhost currently has `try_files $uri $uri/ =404`. The site has real URLs, so
a direct request or refresh on `/about`, `/capabilities`, `/insights`,
`/deployment-patterns` and so on returns nginx's 404 instead of the app. Right
now **every URL in `sitemap.xml` except `/` is a 404 to a crawler**, so this is
also the single biggest search-visibility blocker.

Two files, both verified: `nginx -t` passes and a full run against the real
nginx binary returns 200 for deep links, 301 for `www`, and the right content
types and cache headers (see "How these were verified" below).

```bash
# as root, from the deployed copy of this repo on the server
mkdir -p /etc/nginx/snippets
cp nginx/naivolabs-security-headers.conf /etc/nginx/snippets/naivolabs-security-headers.conf
cp /etc/nginx/sites-available/naivolabs /etc/nginx/sites-available/naivolabs.bak-$(date +%F)
cp nginx/naivolabs.com.conf /etc/nginx/sites-available/naivolabs
nginx -t && systemctl reload nginx
```

The security headers are a separate snippet on purpose: nginx does not inherit
`add_header` into a location that sets its own, and every caching location sets
`Cache-Control`. A single-file version of this config silently served the HTML
document with **no** nosniff/frame/referrer headers — caught by testing it, and
fixed by re-including the snippet in each such location.

The vhost keeps the Certbot-managed `listen 443 ssl` lines and certificate paths
untouched so renewals keep working. Beyond the fallback it adds: a `www` → apex
301 (the site was being served on both hostnames), gzip, long-lived caching for
the hashed `/assets/` and `/fonts/` files, the `application/manifest+json` type
for `site.webmanifest` (currently `application/octet-stream`), correct
`robots.txt` / `sitemap.xml` types, and nosniff/frame/referrer headers.

One caveat, unverifiable from the deploy account: `/etc/letsencrypt` is not
readable, so the renewal method could not be inspected. If renewal uses a
webroot inside `/var/www/naivolabs`, a deploy that lands during a renewal could
remove a challenge file. Certbot retries, so the worst case is one delayed
renewal; avoid deploying while a renewal is in flight if you can.

### 2. Optional — Content-Security-Policy

A CSP is written but commented out in that vhost file. It has **not** been
verified against the third-party voice widget on the live origin, and an
unverified CSP silently breaks the widget. Enable it only after testing the
widget with it on.

### Not needed

DNS already points at this host and the Let's Encrypt certificate for
`naivolabs.com` is already issued and renewing — both verified live
(`https://naivolabs.com/` serves a valid certificate). No firewall, cron or
systemd change is requested.

## Why the CMS is not on this host

Three independent blockers, all verified:

1. **No runtime.** `node`, `npm` and `php` are all absent, and installing them
   is a server-package change that only the operator can make.
2. **No systemd access.** A CMS is a long-running process; the deploy account
   cannot create the service that would supervise it.
3. **The database cannot run it.** Payload 3 has no MySQL/MariaDB adapter
   (`@payloadcms/db-mysql` does not exist on npm; only `db-postgres`,
   `db-sqlite` and `db-mongodb` do). The provisioned `naivolabs_db` is MariaDB,
   so it cannot back the CMS.

The site is therefore built in **static mode**: all content comes from
`src/data/content.ts`, which the design already treats as the fallback for
every CMS fetch. Blog posts, FAQs and contact details render normally.

### Options for the CMS

- **Host it elsewhere** (the `deploy/` Docker stack on a Hetzner box, or Vercel
  with managed Postgres), then rebuild the site with
  `VITE_CMS_URL=https://cms.naivolabs.com` and redeploy. Editable content plus a
  working contact form, at the cost of a second host.
- **Keep static mode** and treat content changes as code changes (edit
  `src/data/content.ts`, rebuild, redeploy).

## Contact form — ready for an email provider

The form is wired to a build-time endpoint, so connecting a provider needs no
code change. Two variables, both inlined by Vite at build time:

| Variable | Purpose |
|---|---|
| `VITE_INQUIRY_ENDPOINT` | URL the JSON body is POSTed to |
| `VITE_INQUIRY_ACCESS_KEY` | Optional **public** form key, sent as `access_key` |

Delivery order is: `VITE_INQUIRY_ENDPOINT` → `VITE_CMS_URL/api/inquiries` →
refuse (the form then shows its email fallback). It never reports success for a
message that went nowhere, and a private API key must never be used here —
everything in this bundle is public.

**Resend, Postmark and similar providers cannot be called from the browser:**
their keys are secrets. The endpoint therefore has to be a small serverless
function (Vercel, Cloudflare Worker) that holds the key and sends the mail:

```js
// e.g. api/contact.js on a serverless host
export default async function handler(req) {
  const { name, email, message, budget } = await req.json()
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'website@naivolabs.com',
      to: 'hello@naivolabs.com',
      reply_to: email,
      subject: `New enquiry from ${name}`,
      text: `${name} <${email}>\nBudget: ${budget}\n\n${message}`,
    }),
  })
  return new Response(null, { status: r.ok ? 200 : 502 })
}
```

Then rebuild and redeploy with `VITE_INQUIRY_ENDPOINT=https://<host>/api/contact`.
Because the value is inlined, changing the provider later is also a rebuild.

Alternatively, a form-endpoint service designed around a public key (Web3Forms,
Formspark) needs only the two variables and no function at all.

Verified: with the variables set, both values are baked into the bundle; with
them unset, that branch is compiled away entirely and the output is byte-for-byte
the previous build, so deploying this did not change behaviour.

## Search and social visibility

What is already correct, verified against the live origin (not assumed):

| Item | State |
|---|---|
| `<title>` / description | unique per route, within the ~60 / ~160 char budgets |
| canonical | absolute and correct per route (`/about` → `https://naivolabs.com/about`) |
| `robots` meta | `index, follow, max-image-preview:large` |
| `robots.txt` | served as `text/plain`, `Disallow` on legacy paths, points at the sitemap |
| `sitemap.xml` | 18 URLs, matching the real route table exactly |
| JSON-LD | Organization + breadcrumbs on every route |
| `og:image` / `twitter:image` | absolute, 1200×630 PNG, 200 with `image/png`, valid PNG bytes |
| `twitter:card` | `summary_large_image` |

Two things that look like problems but are not:

- **Search results still show the old placeholder** ("Naivo Labs server is
  working"). That is a cached snippet from the placeholder page that was in the
  docroot until this deploy, not something still served. It clears on the next
  crawl. Nothing in the deploy account can force it.
- **A share link showing text only** is also a cache: the placeholder page had
  no `og:image`. The card is a real, on-brand 1200×630 image (Signal Violet
  gradient on the dark palette), and it is referenced correctly.

To clear those caches, which needs an account the deploy access does not have:

1. [Search Console](https://search.google.com/search-console) → URL Inspection →
   Request Indexing for `https://naivolabs.com/`. Also submit
   `https://naivolabs.com/sitemap.xml` under Sitemaps.
2. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) →
   paste the URL → *Scrape Again*. (Also refreshes WhatsApp previews.)
3. [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and the
   [X Card Validator](https://cards-dev.twitter.com/validator).

**Do this after the nginx change lands**, not before: while deep links 404, a
crawl sees one page and the sitemap reports 18 errors.

### Optional copy nit

The About route renders `About Naivolabs | Naivolabs`. Harmless, but repeating
the brand in a SERP title reads poorly; renaming the page title to `About us`
(or `About`) would render `About | Naivolabs`.

## How these were verified

- `scripts/live-smoke.mjs` — loads the live domain in Chromium, walks client
  routing, reads the rendered head the way Googlebot would, fetches the share
  image and checks its PNG magic bytes, and measures horizontal overflow at
  390px. Run it after every deploy.
- The proposed vhost was tested against a real nginx binary (`nginx -t` plus a
  container serving the actual build, driven with `Host` headers) rather than
  reasoned about. That is what caught the missing security headers and the
  duplicate `Cache-Control` headers.
- The CMS image fix was confirmed by reproducing the failure first: Docker
  refuses `COPY --from` a path that does not exist.

## Credentials

No credential is stored in this repository. The deploy account uses password
authentication; supply it interactively (`ssh`, `rsync` will prompt) or through
your own secret store. `.gitignore` excludes `.env*` and `deploy/.env`.
