# DISPATCH.md — Medilex

> Async task protocol for Claude Dispatch. Read CLAUDE.md first.

---

## Pre-Approved Tasks (No Confirmation Needed)

| Task Keyword | Command | Success Criteria | Delegate To |
|-------------|---------|-----------------|-------------|
| `test` | `npm test` | All tests pass | `claude` |
| `lint` | `npm run lint` | Zero lint errors | `claude` |
| `audit` | `pal codereview` on src/ | Report findings, fix MEDIUM+ issues | `gemini-2.5-pro` |
| `clean` | Remove dead code, unused imports | Tests pass, commit | `codestral-latest` |

## Guided Tasks (Plan First, Then Execute)

| Task Keyword | Description |
|-------------|-------------|
| `fix <issue>` | Diagnose and fix a specific bug |
| `refactor <target>` | Refactor a module |

## Requires Confirmation (Never Auto-Execute)

- `deploy`
- `delete`
- `clinical`

## Clinical Safety Gate

**Before committing any change:**
1. Run `npm test` — all must pass
2. Run `npm run lint` — zero errors
3. Run `pal codereview` — no logic regressions

## Opportunistic Lane (Budget Dispatcher)

The Budget Dispatcher may run the following pre-approved tasks autonomously.

**Eligible for autonomous execution:** `test`, `lint`, `audit`, `clean`

**Commit trail:** Opportunistic commits carry prefix `[opportunistic]` and live on `auto/medilex-<task>-<date>` branches.
