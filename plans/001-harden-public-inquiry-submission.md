# Plan 001 — Harden public inquiry submission

- **Baseline commit:** `59de2fb`
- **Finding:** The marketing site posts contact data directly from the browser to either `VITE_INQUIRY_ENDPOINT` or `${VITE_CMS_URL}/api/inquiries`. The endpoint is selected from build-time public variables and the CMS path has no visible origin, rate-limit, CSRF/origin, or abuse-control enforcement in the site code.
- **Category:** Security/correctness
- **Impact:** A public attacker can automate submissions, causing spam, storage growth, notification abuse, or provider cost. Browser validation is not a security boundary.
- **Effort:** M
- **Fix risk:** Medium. Changing the delivery seam can break production submissions if the existing provider contract is not characterized first.
- **Confidence:** High.
- **Evidence:** `src/lib/cms.ts:239-289`, especially `submitInquiry()` building a direct browser `fetch()` POST with only `Content-Type`; `src/pages/ContactPage.tsx:93-124` calls it after client-only validation. The deployment research explicitly notes no WAF/rate limiting in `docs/research/hetzner-deployment.md` section 6.

## Goal

Make inquiry submission pass through an application-owned server boundary that validates and rate-limits requests, while preserving the existing static fallback and user-facing success/error states.

## In scope

- `src/lib/cms.ts` and the caller path in `src/pages/ContactPage.tsx`.
- The server/API location already used by this repository, if one exists; otherwise inspect `cms/` and add the smallest existing-framework endpoint rather than inventing a second backend.
- Tests for valid, invalid, oversized, repeated, and failed submissions.

## Explicitly out of scope

- Do not put a private provider key in `VITE_*` variables or the static bundle.
- Do not remove the static fallback behavior.
- Do not change CMS collections/schema or deployment topology without stopping and reporting that the current endpoint contract requires it.

## Ordered implementation steps

1. Trace the configured `VITE_INQUIRY_ENDPOINT`, CMS `inquiries` collection, and any existing Payload endpoint/hooks. Record the accepted request shape, response status, and where mail/storage occurs. **Verify:** read-only search shows the exact producer and consumer; stop if no endpoint contract can be identified.
2. Add an application-owned POST boundary using the repository's existing server framework. Validate JSON as an object with bounded UTF-8/string lengths: name, email, budget/interest, and message; reject unknown or oversized input with 400. Normalize whitespace before forwarding. **Verify:** unit/API tests cover malformed JSON, missing fields, invalid email, and over-limit payloads with no downstream call.
3. Add abuse controls appropriate to the current deployment. At minimum enforce an origin/referer policy for browser submissions, a hidden honeypot or equivalent bot signal, and a bounded per-IP rate limit with a 429 response. Do not trust a client-supplied IP header unless the reverse proxy is configured to sanitize it. **Verify:** tests demonstrate accepted same-origin requests, rejected cross-origin requests, honeypot rejection, and rate-limit behavior.
4. Move any private delivery credential to server-only configuration and forward only the validated normalized payload. Preserve `false`/error behavior when delivery is unavailable. **Verify:** production bundle inspection contains no private credential name/value; endpoint tests cover downstream timeout/failure.
5. Update `ContactPage` to submit to the owned boundary and expose 400/429 errors through its existing live-region/error pattern without leaking provider details. **Verify:** Playwright contact-flow test sees accessible error text, no duplicate submission while loading, and success only after a confirmed response.

## Done criteria

- `npm run typecheck` passes.
- `npm run build` passes.
- `npm run test:e2e -- e2e/accessibility.spec.ts` passes.
- New endpoint tests pass and prove validation/rate limiting before downstream delivery.
- No private secret is referenced from `src/` or any `VITE_*` variable.

## Stop conditions

Stop and report if the only available endpoint is a third-party form service that cannot support server-side validation/rate limiting, or if deployment cannot provide a trusted client-IP/origin signal. Do not silently weaken the controls.

## Maintenance note

Any future form field must be added to the server schema and the end-to-end abuse tests together. Review rate-limit storage and trusted-proxy configuration when moving from the single Hetzner node to multiple instances.
