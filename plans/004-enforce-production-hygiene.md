# Plan 004 — Enforce production hygiene checks

- **Baseline commit:** `59de2fb`
- **Finding:** The production build passes and a one-off strict compiler check reports no unused locals/parameters, but `tsconfig.json` sets both checks to `false`, package `npm test` is a placeholder that always exits 1, and there is no package script for the repository-required typecheck plus E2E gate. This permits unused imports and regressions to merge despite the documented quality bar.
- **Category:** DX/build/test
- **Impact:** Dead code and accessibility/security regressions can reach production without a stable local/CI command; reviewers receive false confidence from a green default test command.
- **Effort:** S
- **Fix risk:** Low.
- **Confidence:** High.
- **Evidence:** `package.json` scripts: `test` is `echo "Error: no test specified" && exit 1`; `build` runs `tsc -b && vite build`; `typecheck` runs `tsc --noEmit`; `tsconfig.json` sets `noUnusedLocals` and `noUnusedParameters` false; `AGENTS.md` requires `npm run typecheck && npm run test:e2e` before claiming green.

## Ordered implementation steps

1. Confirm the current strict compiler result and enumerate any failures after enabling `noUnusedLocals` and `noUnusedParameters`. **Verify:** record the exact symbol/file list before edits.
2. Remove only symbols proven unused, following the repository rule to remove usage before its import. Do not perform broad formatting or unrelated refactors. **Verify:** `npx tsc --noEmit --noUnusedLocals --noUnusedParameters` exits 0.
3. Enable the two compiler options in `tsconfig.json`, preserving all other options. **Verify:** `npm run typecheck` exits 0 and catches an intentionally introduced unused local in a temporary check that is removed afterward.
4. Replace the placeholder `npm test` script with the repository's documented E2E command, or add a clearly named `test:all` script while preserving compatibility if external tooling depends on `npm test`. Include the accessibility suite in CI if CI configuration exists; do not invent a second test framework. **Verify:** `npm test` runs real tests and no longer succeeds/fails misleadingly due to the placeholder.
5. Add a CI check for `npm run build`, strict typecheck, and `npm run test:e2e`, using the existing lockfile/package manager. **Verify:** the workflow runs on pull requests and reports failures with nonzero exit codes.

## Done criteria

- Unused locals/parameters are enforced by the compiler.
- `npm test` has an intentional, documented meaning.
- Pull requests run build, typecheck, and E2E checks.
- `npm run build` remains green and no generated artifacts or unrelated files are committed.

## Stop conditions

Stop if the repository has no CI provider or if enabling strictness reveals generated/vendor code inside the `src` include. Report the exact boundary and propose a scoped `include`/exclude change rather than disabling the check again.

## Maintenance note

New routes and interactive components must add or update Playwright coverage, especially `e2e/accessibility.spec.ts`; dependency updates must run the production audit from Plan 002.
