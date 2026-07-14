# STATE.md — medilex

**Last updated:** 2026-07-14
**Phase:** Maintenance — clean tree (dependency sweep reverted, see below), B.2 blocked pending a build-pipeline fix.

## Last real change

- B.1 confirmed green + marked done (2026-07-14): `npm test` 69/69, tree clean on `main`.
- B.2 dependency sweep attempted, then **reverted and marked `blocked`** (2026-07-14) — see
  "Open loops" below. Working tree is back at the pre-sweep baseline; nothing was committed.
- ci: disable non-dispatcher CI/test/scan workflows to stop Actions drain (2026-06-29)
- fix(medilex): unblock app launch + typecheck (2026-06-26)

## How to resume

Read first: `CLAUDE_CODEWEB_HANDOFF.md`

What it is: React Native/Expo mobile flashcard app for learning medical terminology (swipe
cards, streaks, progress analytics, audio pronunciation). Clinical education content — treat
as clinical per portfolio rules.

## Test command

- `npm test` (previously documented here as `npm run test:run`, which is not a real script —
  corrected 2026-07-14).

## Open loops

- **`npm run build:web` is broken at HEAD — pre-existing, NOT caused by the B.2 dependency
  sweep.** Metro fails to resolve `@healthcare-apps/core`
  (`Unable to resolve module @healthcare-apps/core from src/utils/encryptedStorage.ts`) even
  though the `file:` symlink (`node_modules/@healthcare-apps/core` → `../burn-wizard/packages/core`,
  dated 2026-05-22) and its `dist/` build output are both intact. `metro.config.js` uses the
  bare default Expo Metro config with no `unstable_enableSymlinks`/`watchFolders` entry for the
  symlinked package — that's the likely root cause. **Reproduces identically on a clean,
  reverted, freshly-`npm install`-ed baseline**, so this is not a regression from the sweep.
  **Impact:** `build:web` is what the E2E suite (`npm run test:e2e`) runs against per this
  project's own CLAUDE.md — so E2E is currently non-runnable. The routine health check only
  runs `npm test` (Vitest, which resolves the symlink fine via a different resolution path),
  so this has been a monitoring blind spot, invisible for an unknown period. **Not fixed this
  session** — Metro + Windows + `file:` symlinks is a known footgun (risk of silently resolving
  a stale/wrong copy of the encryption package), and CLAUDE.md flags this area for careful
  handling. Needs a deliberate, tested fix, not a drive-by. See `ai/IDEAS.md`.
- **B.2 (dependency currency sweep) is `blocked`**, not done, pending the above. The safe
  within-range dependency bumps were fully staged and verified against `npm test` (69/69 pass)
  but could not be verified against `build:web` (pre-existing red), so they were reverted
  rather than committed on an unverified gate. See `ai/IDEAS.md` for the full staged bump list
  to re-apply once build:web is fixed.
- Otherwise: none recorded beyond routine health-check monitoring (see
  `dev-ops/tasks/health-medilex.md`) — note its "healthy" status does not cover `build:web`.
