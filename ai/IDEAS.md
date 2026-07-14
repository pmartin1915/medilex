# IDEAS.md — medilex

Append-only. Deferred ideas: what, why deferred, where it applies. Not `@`-imported —
sweep at session start / into handoffs.

---

## 2026-07-14 — `npm run build:web` broken at HEAD (Metro symlink resolution)

**What:** Metro fails to resolve `@healthcare-apps/core` from `src/utils/encryptedStorage.ts`
even though the `file:` symlink and its `dist/` build are both intact. `metro.config.js` is
the bare default Expo config (`getDefaultConfig(__dirname)`, no `unstable_enableSymlinks` /
`watchFolders` entry for the linked package).

**Why deferred:** Discovered mid dependency-sweep (B.2), confirmed pre-existing (reproduces
on a clean, reverted, freshly-installed baseline — not a sweep regression). Fixing Metro
symlink/workspace resolution around the encryption package touches sensitive-adjacent
plumbing (AES-256 encrypted storage) and Windows + `file:` symlinks + Metro is a known
footgun where a wrong `watchFolders` config can silently resolve a stale/wrong copy. Needs a
deliberate, tested fix session, not a drive-by inside a maintenance sweep.

**Where it applies:** Blocks `npm run test:e2e` (which runs against the `build:web` export
per this project's CLAUDE.md) — E2E is currently non-runnable. Blocks Phase B.2 completion.
Candidate fix directions to investigate next session: `unstable_enableSymlinks: true` in
`metro.config.js`, or an explicit `watchFolders: [path.resolve(__dirname, '../burn-wizard/packages/core')]`,
or switching the `@healthcare-apps/core` dependency from a raw `file:` symlink to an npm
workspace.

**Monitoring gap:** the routine health check (`dev-ops/tasks/health-medilex.md`) only runs
`npm test` (Vitest), which resolves the symlink fine via a different module-resolution path
than Metro. "Healthy" status does not cover the web bundle. Worth adding a lightweight
`build:web` check to the health-check rotation once the fix lands — otherwise this class of
break stays invisible again.

---

## 2026-07-14 — Deferred dependency bumps (Phase B.2 sweep)

**What:** The following updates are within existing semver ranges and were fully staged and
verified against `npm test` (69/69 pass) during the B.2 sweep attempt, but were **reverted**
because the sweep's hard gate (`build:web`) could not be verified (see the entry above — it's
broken independent of these bumps). Safe to re-apply once `build:web` is fixed and can be
used as the real gate again.

Within-range (staged, verified against `npm test`, not yet applied):
- `@expo/metro-config` `^54.0.9` → `~54.0.16` (via `expo install --fix`)
- `expo` `~54.0.0` → `~54.0.35`
- `expo-asset` `^12.0.9` → `~12.0.13`
- `expo-font` `^14.0.9` → `~14.0.12`
- `app.json`: `expo install --fix` added a `"plugins": ["expo-asset", "expo-font"]` entry —
  re-verify this is still needed/correct when re-applying.
- `@react-navigation/bottom-tabs` → `6.6.1` (note: npm flagged this version "no longer
  supported" — re-check for a newer 6.x patch before re-applying)
- `@react-navigation/native` → `6.1.18` (same "no longer supported" flag)
- `@react-navigation/native-stack` → `6.11.0`
- `@types/react` → `19.1.17`
- `eslint` / `@eslint/js` → `9.39.5`
- `babel-preset-expo` → `54.0.11`
- `typescript` → `5.9.3`
- `vite` → `5.4.21`
- `vitest` / `@vitest/*` → `2.1.9`
- `zustand` → `4.5.7`
- `react-native-safe-area-context` → `5.6.2`
- Babel toolchain (`@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`,
  `@babel/plugin-transform-flow-strip-types`) → `7.29.7`
- `typescript-eslint` → `8.64.0`
- `eslint-plugin-react-hooks` → `7.1.1`
- `happy-dom` → `20.10.6`
- `babel-jest` → `30.4.1`
- `@playwright/test` → `1.61.1`
- `react-test-renderer`: pinned exact to `19.1.0` (was `^19.1.0`, Wanted 19.2.7) to match the
  exact-pinned `react: "19.1.0"` — keep this pin when re-applying.

**Also found (pre-existing, unrelated to version — informational):** `expo-doctor` flags
`@expo/metro-config` as "should not be installed directly, use expo/metro-config sub-export
instead." This predates the sweep (it was already a direct dependency at `^54.0.9`). Out of
scope for a version-bump sweep — removing a direct dependency needs its own testing to confirm
nothing imports from it directly. Low priority; note only.

**Scope OUT — major/breaking bumps, deliberately NOT part of any "safe sweep."** These belong
to a dedicated Phase C "dependency modernization burst," each needing its own compat testing:
Expo SDK 57 (`expo`, all `expo-*`, `@expo/metro-config`, `babel-preset-expo`), `react-native`
0.86, `@react-navigation/*` 7.x, `@react-native-async-storage/async-storage` 3.x,
`react-native-gesture-handler` 3.x, `zustand` 5.x, `typescript` 7.x, `vite` 8 / `vitest` 4 /
`@vitejs/plugin-react` 6 / `@vitest/*` 4, `eslint` 10, `jsdom` 29, `lucide-react-native` 1.x,
`@testing-library/react-native` 14.
