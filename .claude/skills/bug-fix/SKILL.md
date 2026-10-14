---
name: bug-fix
description: Use when the user reports a bug, broken behavior, a QA issue, a console/Sentry error, "it doesn't work", wrong data on screen, or a regression — before changing any code.
---

# Bug fixing workflow

Goal: find the root cause, then make the smallest correct fix. Don't patch symptoms.

## 1. Pin the symptom

- Restate the bug in one line: page/route, user type (guest, parent, school admin, provider), locale, steps, expected vs actual.
- If any of these is unclear and changes where to look, ask **one** question. Otherwise proceed.

## 2. Locate

- Route → `src/app/[locale]/<path>/page.jsx` → follow imports into `components/features/<domain>`.
- Grep the visible text through `ar.json`/`en.json` to get the key, then Grep the key to find the component.
- API data: find the endpoint constant in `src/constants` (`APIs`/`b2bAPIs`) and its `useFetchData`/`useMutationData` call.
- Check recent history: `git log -p -5 -- <file>`. Regressions often come from the last commit there.

## 3. Common root causes in this repo

- **Auth vs guest branches**: a different component or endpoint for logged-in users (e.g. `AuthSchoolTripBookingForm`). Fix both if both are affected.
- **Locale/RTL**: works in en, broken in ar (missing key, `left/right` class, number parsing).
- **Persisted Redux**: stale rehydrated state from an older shape; not reset on logout.
- **Query cache**: missing `invalidateQueries` after a mutation; wrong `enabled`; query key missing a param.
- **Formik**: field `name` ≠ schema key; `undefined` initial value; `enableReinitialize` resetting the user's input.
- **Server/client boundary**: hooks in a server component; hydration mismatch from `Date`/`window` during render.
- **Permissions**: `hasElement(PERMISSIONS…)` hiding or disabling the feature.
- **CSP**: blocked third-party request (see `third-party-integration`).
- **Optional chaining**: API returns `null`/missing nested fields; crash on `.map` of undefined.

## 4. Fix

- Minimal diff in the right layer (schema bug → schema; payload bug → payload builder).
- If the same bug pattern exists in sibling components (auth/guest, create/edit), fix those too and say so.
- No unrelated refactors; leave commented legacy code alone.

## 5. Verify

- `yarn eslint <changed files>`.
- Explain how to reproduce the fix manually (steps + both locales if UI). Run `yarn build` if you touched server components, config, or middleware.

## 6. Report

- 2–4 lines: root cause → fix → where. Mention any related risk you noticed but didn't touch.
- If notable, store the pattern via Byterover (`byterover-store-knowledge`).
