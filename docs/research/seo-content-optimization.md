# SEO & Content Optimization — Research Notes

Date: 2026-08-13. Skills invoked: `firecrawl-deep-research` (methodology; hosted
run needs `FIRECRAWL_API_KEY`, unset — web search + agent-reach used as
backends), `agent-reach` (health-checked; Exa/web backends), `using-superpowers`,
`seo-specialist` (installed), `content-optimization` (installed).

## Skills installed (locked in skills-lock.json)

| Skill | What it gives you |
|---|---|
| **seo-specialist** (borghei/claude-skills) | Technical SEO audit checklist (crawlability, indexability, CWV), on-page optimization, keyword intent, schema markup |
| **content-optimization** (kostja94/marketing-skills) | On-page content structure: H2 keyword placement, keyword density vs stuffing, headings, featured-snippet structure |

## Findings (from a full crawl of the built site)

Before this pass the site was a client-rendered Vite SPA with a single static
meta set in `index.html` and **no** per-route SEO. Concrete gaps found and fixed:

1. **Per-route title / description / canonical / OG / twitter** — added
   `src/lib/Seo.tsx`, a head manager that sets document.title, meta
   description, canonical, Open Graph, Twitter cards, and JSON-LD on every
   route change (Googlebot renders JS and reads the final DOM). Titles stay
   ≤ 60 chars (brand suffix dropped when it would overflow the SERP limit).
2. **Structured data (JSON-LD)** — Organization (home + static baseline),
   BreadcrumbList (listing + detail routes), BlogPosting with Person author
   (blog posts), Article (case studies), FAQPage (contact FAQs — rich-snippet
   opportunity), ContactPage. Injected per route, cleaned between navigations.
3. **robots.txt + sitemap.xml** — added to `public/` (served before the SPA
   fallback; previously the SPA rewrite returned index.html for these paths,
   which crawlers would have parsed as HTML). Sitemap covers all 12 indexable
   routes with changefreq/priority.
4. **og:image** — generated a branded 1200×630 image (`public/og-image.png`,
   dark + violet on-theme) so shared links render a preview card.
5. **Blog article outline** — added optional `subheads` (H2 sections) to the
   BlogPost data model for the two longest posts; posts without subheads
   render flat (backward compatible with CMS content). Improves scannability,
   topical coverage, and featured-snippet eligibility.
6. **Blog cover image alt text** — descriptive alt (`"{title} — Logitech
   Consultants blog"`) instead of empty alt on content images.

## Verification

- `scripts/probe-seo-audit.mjs` — crawlable, indexable, on-page audit of all
  12 routes: **all checks pass** (title ≤ 60c, description ≤ 165c, canonical,
  OG + image, single H1, JSON-LD present, robots.txt + sitemap.xml real).
- Design audit (`scripts/design-audit.mjs`): ALL CHECKS PASSED.
- Mobile audit (`scripts/probe-mobile-audit.mjs`): all widths/routes pass.
- Full E2E suite: 61/61 green at CI's single-worker config (blog-post golden
  regenerated for the new H2 outline).

## Notes for launch

- `SITE.url` in `src/lib/Seo.tsx` is hardcoded to
  `https://logitechconsultants.com` (used for canonical + OG URLs). Verify the
  real production domain matches; if not, update `SITE.url`, `index.html`
  canonicals, and `sitemap.xml` in one pass.
- Submit `sitemap.xml` in Google Search Console after the first deploy.
- The CMS (Payload) posts don't have `subheads` yet — they render flat, which
  is fine. Add the field to the CMS collection to get H2 outlines on live posts.
