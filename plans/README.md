# Naivolabs improvement plans

Audit baseline: commit `59de2fb` (2026-09-24). Scope was standard, focused on correctness, security, performance, accessibility, production build hygiene, and dependency risk. The referenced `audit-playbook.md` and `plan-template.md` were not present in the available repository or read-only context, so these plans use the requested finding fields and explicit verification gates.

## Findings and execution order

| Priority | Plan | Category | Impact | Effort | Risk | Confidence | Status |
|---|---|---|---|---|---|---|---|
| 1 | [Harden public inquiry submission](./001-harden-public-inquiry-submission.md) | Security/correctness | High | M | Medium | High | TODO |
| 2 | [Remove dependency vulnerability](./002-remove-nanoid-vulnerability.md) | Dependencies/security | High | S | Low | High | TODO |
| 3 | [Reduce hero startup cost](./003-reduce-hero-startup-cost.md) | Performance/accessibility | Medium | M | Medium | High | TODO |
| 4 | [Enforce production hygiene checks](./004-enforce-production-hygiene.md) | DX/build/test | Medium | S | Low | High | TODO |

## Dependency graph

- Plan 001 should land before any public form redesign or provider change; it defines the server-side trust boundary.
- Plan 002 is independent and can land first.
- Plan 003 is independent of Plans 001–002, but should be verified with the accessibility suite after animation/media changes.
- Plan 004 should land after Plans 001–003 so the checks characterize the final code, though its compiler/audit configuration can be prepared independently.

## Baseline

- `npm run build` passes at commit `59de2fb`; current client entry is 388.03 kB raw / 123.92 kB gzip.
- `npx tsc --noEmit --noUnusedLocals --noUnusedParameters` passes.
- `npm audit --omit=dev --audit-level=high` fails on transitive `nanoid <3.3.18`, high severity.
- `npm test` is intentionally not a test runner and exits 1; use the repository's Playwright commands instead.
- Full browser accessibility execution was not repeated during this planning pass because browser availability was not established; the repository contains `e2e/accessibility.spec.ts` and the required command is `npm run test:e2e`.

## Considered and rejected

- The existing nginx security header configuration was not treated as a missing-header finding: `deploy/nginx-security-headers.conf` already sets nosniff, frame, referrer, permissions, COOP, and CSP headers.
- The successful production build and strict unused-symbol compiler check do not justify a speculative mass import rewrite. Plan 004 adds enforcement and only removes symbols proven unused by the compiler or lint output.
- Hardcoded public CMS and provider URLs were not called a vulnerability by themselves; the inquiry endpoint is the concrete trust-boundary issue because it accepts browser-originated POSTs without an application-owned abuse-control layer.

## Out of scope

No plan changes CMS schema, marketing copy, deployment architecture, or the existing visual design system unless a listed plan explicitly requires it. No credentials or secret values were reproduced.

## Executor status protocol

The executor should update the relevant plan status only after implementing and running all listed verification gates. If a stop condition is reached, leave status `BLOCKED` and report the exact evidence instead of improvising.
